/**
 * aiController.js — "Maya" AI assistant powered by Groq API
 *
 * Maya is YoYo Rooms' virtual assistant — inspired by Air India's Tia.
 * She answers hotel queries, booking help, cancellation policy, FAQs,
 * and uses real data from our DB to give personalized answers.
 *
 * POST /api/ai/chat
 * Body: { message, history: [{ role, content }] }
 * Returns: { reply, quickReplies? }
 */

import Groq from 'groq-sdk';
import Booking from '../models/Booking.js';
import Room    from '../models/Room.js';

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
- Price range: ₹500 to ₹10,000 per night
- Free cancellation up to 48 hours before check-in
- Payment: Pay at Hotel, Razorpay (UPI/cards), Stripe
- Check-in time: 12:00 PM | Check-out time: 11:00 AM
- Coupon codes: YOYO10 (10% off), YOYO20 (20% off), WELCOME50 (₹50 off first booking)
- GST of 12% + ₹99 service fee added to all bookings
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

    // Default quick replies
    return ['Track my booking', 'Cancellation policy', 'Best deals today', 'Contact support'];
};

// ── POST /api/ai/chat ─────────────────────────────────────────────
export const aiChat = async (req, res) => {
    try {
        const { message, history = [], userId } = req.body;

        if (!message?.trim())
            return res.json({ success: false, message: 'Message is required' });

        // Build conversation for Groq
        const messages = [
            { role: 'system', content: MAYA_SYSTEM_PROMPT },
            // Keep last 8 messages for context (avoid token overflow)
            ...history.slice(-8).map(h => ({
                role:    h.role === 'maya' ? 'assistant' : 'user',
                content: h.content,
            })),
            { role: 'user', content: message.trim() },
        ];

        // Optionally fetch user's recent booking for personalization
        let contextNote = '';
        if (userId) {
            try {
                const recentBooking = await Booking.findOne({ user: userId })
                    .sort({ createdAt: -1 })
                    .populate('room hotel')
                    .lean();
                if (recentBooking) {
                    contextNote = `[Context: This user's most recent booking is ${recentBooking._id} for ${recentBooking.room?.roomType || 'a room'} at ${recentBooking.hotel?.name || 'a hotel'}, status: ${recentBooking.status}]`;
                    messages[0].content += `\n${contextNote}`;
                }
            } catch (_) { /* non-critical */ }
        }

        // Call Groq — ultra-fast with llama3
        const completion = await groq.chat.completions.create({
            model:       'llama3-8b-8192',   // fast + free tier
            messages,
            max_tokens:  200,
            temperature: 0.7,
        });

        const reply = completion.choices[0]?.message?.content?.trim()
            || "I'm having a moment — please try again! 🙏";

        const quickReplies = getQuickReplies(message);

        res.json({
            success: true,
            reply,
            quickReplies,
            model: 'llama3-8b-8192',
        });

    } catch (error) {
        console.error('[AI] Groq error:', error.message);
        // Graceful fallback — don't crash if Groq is down
        res.json({
            success: true,
            reply: "I'm temporarily unavailable. For urgent help, email support@yoyorooms.com or call our 24/7 helpline. 🙏",
            quickReplies: ['Email support', 'View my bookings', 'Cancellation policy'],
        });
    }
};
