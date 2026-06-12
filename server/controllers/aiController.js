/**
 * aiController.js — "Maya" AI assistant powered by Groq API
 *
 * Endpoints:
 *   POST /api/ai/chat          → Conversational assistant (Maya)
 *   POST /api/ai/parse-search  → NLP → structured filter params
 *   GET  /api/ai/review-summary/:hotelId → AI digest of reviews
 */

import Groq    from 'groq-sdk';
import Booking from '../models/Booking.js';
import Review  from '../models/Review.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── System prompt — Maya's personality & knowledge ───────────────
const MAYA_SYSTEM_PROMPT = `You are Maya, YoYo Rooms' friendly AI assistant — like Air India's Tia but for hotels.
YoYo Rooms is an OYO-inspired hotel booking platform for India.

Your role:
- Answer hotel and booking questions clearly and warmly
- Help users with booking status, cancellation policy, check-in times
- Suggest hotels based on city, budget, and preferences
- Keep responses SHORT (2-4 sentences max) and conversational
- Use emojis sparingly to be friendly (1-2 per message max)
- Always be helpful — if you don't know something, say "Let me connect you with our support team"

Key facts about YoYo Rooms:
- Available across 200+ cities in India
- Price range: Rs 500 to Rs 10,000 per night
- Free cancellation up to 48 hours before check-in
- Payment: Pay at Hotel, Razorpay (UPI/cards), Stripe
- Check-in time: 12:00 PM | Check-out time: 11:00 AM
- Coupon codes: YOYO10 (10% off), YOYO20 (20% off), WELCOME50 (Rs 50 off first booking)
- GST of 12% + Rs 99 service fee added to all bookings
- Support email: support@yoyorooms.com
- For payment issues, users can contact: help@yoyorooms.com

If a user asks about THEIR specific booking (e.g., "where is my booking?"),
tell them to visit the "My Bookings" section in their profile, or ask them to share their Booking ID.

Never make up booking IDs or room availability. If asked for real-time data you don't have,
guide the user to the relevant section of the app.

Respond in English by default. If user writes in Hindi, respond in simple Hinglish.`;

// ── Quick reply chips by context ──────────────────────────────────
const getQuickReplies = (messageText) => {
    const msg = messageText.toLowerCase();
    if (msg.includes('cancel') || msg.includes('refund'))
        return ['How do I cancel?', 'Refund timeline?', 'No-show policy'];
    if (msg.includes('book') || msg.includes('room'))
        return ['How to book a room?', 'Best hotels in Goa', 'Check my booking'];
    if (msg.includes('payment') || msg.includes('pay'))
        return ['Payment methods?', 'Apply coupon', 'Invoice/receipt'];
    if (msg.includes('check') || msg.includes('in') || msg.includes('out'))
        return ['Check-in time?', 'Early check-in?', 'Late check-out?'];
    return ['Track my booking', 'Cancellation policy', 'Best deals today', 'Contact support'];
};

// ── POST /api/ai/chat ─────────────────────────────────────────────
export const aiChat = async (req, res) => {
    try {
        const { message, history = [], userId } = req.body;
        if (!message?.trim()) return res.json({ success: false, message: 'Message is required' });

        const messages = [
            { role: 'system', content: MAYA_SYSTEM_PROMPT },
            ...history.slice(-8).map(h => ({
                role:    h.role === 'maya' ? 'assistant' : 'user',
                content: h.content,
            })),
            { role: 'user', content: message.trim() },
        ];

        // Personalize with user's last booking
        if (userId) {
            try {
                const recentBooking = await Booking.findOne({ user: userId })
                    .sort({ createdAt: -1 }).populate('room hotel').lean();
                if (recentBooking) {
                    messages[0].content += `\n[Context: User's last booking: ${recentBooking._id}, ${recentBooking.room?.roomType} at ${recentBooking.hotel?.name}, status: ${recentBooking.status}]`;
                }
            } catch (_) {}
        }

        const completion = await groq.chat.completions.create({
            model: 'llama3-8b-8192',
            messages,
            max_tokens: 200,
            temperature: 0.7,
        });

        const reply = completion.choices[0]?.message?.content?.trim()
            || "I'm having a moment — please try again!";

        res.json({ success: true, reply, quickReplies: getQuickReplies(message) });

    } catch (error) {
        console.error('[AI] chat error:', error.message);
        res.json({
            success: true,
            reply: "I'm temporarily unavailable. For urgent help, email support@yoyorooms.com",
            quickReplies: ['Email support', 'View my bookings', 'Cancellation policy'],
        });
    }
};

// ── POST /api/ai/parse-search ─────────────────────────────────────
// NLP: converts plain English query to structured hotel filter params
// Called from AllRooms when user types in the NLP search bar
export const parseSearch = async (req, res) => {
    try {
        const { query } = req.body;
        if (!query?.trim()) return res.json({ success: false, message: 'Query required' });

        const prompt = `You are a search parser for an Indian hotel booking app.
Extract structured filter params from this user query: "${query}"

Return ONLY valid JSON (no explanation, no markdown) in this exact shape:
{
  "city": "string or null",
  "roomType": "Single Room|Double Room|Suite|Deluxe Room|null",
  "amenities": ["Free Wi-Fi","Pool Access","Air Conditioning","Free Breakfast","Parking","Gym","Spa","Room Service"],
  "maxPrice": number or null,
  "category": "Budget|Standard|Luxury|null"
}

Rules:
- amenities must be from the allowed list only, as an array
- maxPrice is per night in INR as a plain number
- city must be an Indian city name or null
- roomType must exactly match one allowed value or null
- category must exactly match one allowed value or null`;

        const completion = await groq.chat.completions.create({
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 180,
            temperature: 0.1,
        });

        const raw = completion.choices[0]?.message?.content?.trim() || '{}';
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

        res.json({ success: true, filters: parsed });

    } catch (error) {
        console.error('[AI] parse-search error:', error.message);
        res.json({ success: false, message: 'Could not parse query', filters: {} });
    }
};

// ── Simple in-memory cache for review summaries (TTL: 12 hours) ──
const summaryCache = new Map();
const CACHE_TTL    = 12 * 60 * 60 * 1000;

// ── GET /api/ai/review-summary/:hotelId ──────────────────────────
// Fetches latest 30 reviews, generates AI summary, caches result
export const reviewSummary = async (req, res) => {
    try {
        const { hotelId } = req.params;
        if (!hotelId) return res.json({ success: false, message: 'Hotel ID required' });

        // Serve from cache if fresh
        const cached = summaryCache.get(hotelId);
        if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
            return res.json({ success: true, summary: cached.summary, fromCache: true });
        }

        const reviews = await Review.find({ hotel: hotelId })
            .sort({ createdAt: -1 }).limit(30).lean();

        if (reviews.length < 3)
            return res.json({ success: false, message: 'Not enough reviews to summarize' });

        const reviewText = reviews
            .map(r => `Rating: ${r.rating}/5 - "${r.comment}"`)
            .join('\n');

        const prompt = `Summarize these hotel reviews in 2-3 concise sentences.
Mention what guests love most, any common complaint, and overall sentiment.
Be specific, not generic. Flowing prose only, no bullet points.

Reviews:
${reviewText}`;

        const completion = await groq.chat.completions.create({
            model: 'llama3-8b-8192',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
            temperature: 0.4,
        });

        const summary = completion.choices[0]?.message?.content?.trim()
            || 'Guests have had a great experience at this property.';

        summaryCache.set(hotelId, { summary, cachedAt: Date.now() });

        res.json({ success: true, summary, reviewCount: reviews.length });

    } catch (error) {
        console.error('[AI] review-summary error:', error.message);
        res.json({ success: false, message: 'Could not generate summary' });
    }
};
