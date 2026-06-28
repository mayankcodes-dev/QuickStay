import transporter  from '../configs/nodemailer.js';
import Booking      from '../models/Booking.js';
import Hotel        from '../models/Hotel.js';
import Room         from '../models/Room.js';
import Razorpay     from 'razorpay';
import stripe       from 'stripe';
import crypto       from 'crypto';
import { bookingBus } from '../events/bookingEvents.js';
import { ok, fail } from '../utils/respond.js';

// ─── Coupons ──────────────────────────────────────────────────
const COUPONS = {
    YOYO10:    { type: 'percent', value: 10  },
    YOYO20:    { type: 'percent', value: 20  },
    WELCOME50: { type: 'flat',    value: 50  },
    FLAT500:   { type: 'flat',    value: 500 },
};

// ─── Constants ────────────────────────────────────────────────
const TAX_RATE    = 0.12; // 12% GST
const SERVICE_FEE = 99;   // ₹99 flat

// ─── Helpers ─────────────────────────────────────────────────
const calcBreakdown = (pricePerNight, nights, couponCode = '') => {
    const base     = pricePerNight * nights;
    const coupon   = COUPONS[couponCode?.toUpperCase()];
    const discount = coupon
        ? coupon.type === 'percent'
            ? Math.round(base * coupon.value / 100)
            : Math.min(coupon.value, base)
        : 0;
    const subtotal   = base - discount;
    const taxAmount  = Math.round(subtotal * TAX_RATE);
    const grandTotal = subtotal + taxAmount + SERVICE_FEE;
    return { base, discount, taxAmount, serviceFee: SERVICE_FEE, grandTotal };
};

// Reusable grand-total calc from a saved booking document
const calcGrandTotal = (b) => b.totalPrice + b.taxAmount + b.serviceFee - b.discountAmount;

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            status: { $ne: 'cancelled' },
            checkInDate:  { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate  },
        });
        return bookings.length === 0;
    } catch { return false; }
};

// ── Booking confirmation email ────────────────────────────────
const sendBookingEmail = async (toEmail, username, roomData, booking) => {
    const nights = Math.ceil(
        (new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / 86400000
    );
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f6f6fc;font-family:'Inter',Arial,sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="background:#E8003D;padding:32px 24px;text-align:center">
      <span style="font-family:Arial,sans-serif;font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px">YoYo</span>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">Booking Confirmed 🎉</p>
    </div>
    <div style="padding:32px 24px">
      <p style="font-size:16px;color:#0d0d1a;margin-bottom:4px">Dear <strong>${username}</strong>,</p>
      <p style="font-size:14px;color:#4a4a6a;margin-top:4px">Your booking is confirmed. Here are the details:</p>
      <div style="background:#f6f6fc;border-radius:12px;padding:20px;margin:20px 0">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#8888aa">Hotel</td><td style="padding:8px 0;color:#0d0d1a;font-weight:600;text-align:right">${roomData.hotel.name}</td></tr>
          <tr><td style="padding:8px 0;color:#8888aa">Room</td><td style="padding:8px 0;color:#0d0d1a;text-align:right">${roomData.roomType}</td></tr>
          <tr><td style="padding:8px 0;color:#8888aa">City</td><td style="padding:8px 0;color:#0d0d1a;text-align:right">${roomData.hotel.city}</td></tr>
          <tr><td style="padding:8px 0;color:#8888aa">Check-In</td><td style="padding:8px 0;color:#0d0d1a;text-align:right">${new Date(booking.checkInDate).toDateString()}</td></tr>
          <tr><td style="padding:8px 0;color:#8888aa">Check-Out</td><td style="padding:8px 0;color:#0d0d1a;text-align:right">${new Date(booking.checkOutDate).toDateString()}</td></tr>
          <tr><td style="padding:8px 0;color:#8888aa">Guests</td><td style="padding:8px 0;color:#0d0d1a;text-align:right">${booking.guests}</td></tr>
          <tr><td style="padding:8px 0;color:#8888aa">Nights</td><td style="padding:8px 0;color:#0d0d1a;text-align:right">${nights}</td></tr>
          <tr style="border-top:1px solid #ededf7"><td style="padding:12px 0 8px;color:#0d0d1a;font-weight:700">Total Paid</td><td style="padding:12px 0 8px;color:#E8003D;font-weight:700;text-align:right">₹${calcGrandTotal(booking).toLocaleString('en-IN')}</td></tr>
        </table>
      </div>
      <div style="background:#E8003D;color:#fff;padding:12px 20px;border-radius:8px;font-size:13px;margin-bottom:24px">
        <strong>Booking ID:</strong> ${booking._id}
      </div>
      <p style="color:#8888aa;font-size:12px">Free cancellation up to 48 hours before check-in. For support, reply to this email.</p>
    </div>
    <div style="background:#f6f6fc;padding:16px 24px;text-align:center">
      <p style="color:#8888aa;font-size:12px;margin:0">© 2025 YoYo Rooms. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
    await transporter.sendMail({
        from: `"YoYo Rooms" <${process.env.SENDER_EMAIL}>`,
        to: toEmail,
        subject: `Booking Confirmed — ${roomData.hotel.name} 🎉`,
        html,
    }).catch(err => console.warn('Email failed:', err.message));
};

// ──────────────────────────────────────────────────────────────
// PUBLIC: POST /api/bookings/check-availability
// ──────────────────────────────────────────────────────────────
export const checkAvailibilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
        ok(res, { isAvailable });
    } catch (error) {
        fail(res, error.message);
    }
};

// ──────────────────────────────────────────────────────────────
// PUBLIC: POST /api/bookings/validate-coupon
// ──────────────────────────────────────────────────────────────
export const validateCoupon = async (req, res) => {
    try {
        const { code, totalPrice } = req.body;
        const coupon = COUPONS[code?.toUpperCase()];
        if (!coupon) return fail(res, 'Invalid coupon code');

        const discount = coupon.type === 'percent'
            ? Math.round(totalPrice * coupon.value / 100)
            : Math.min(coupon.value, totalPrice);

        ok(res, {
            discount,
            message: coupon.type === 'percent'
                ? `${coupon.value}% off applied!`
                : `₹${coupon.value} off applied!`,
        });
    } catch (error) {
        fail(res, error.message);
    }
};

// ──────────────────────────────────────────────────────────────
// PROTECTED: POST /api/bookings/book
// ──────────────────────────────────────────────────────────────
export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests, paymentMethod, couponCode } = req.body;
        const userId = req.user._id.toString();

        const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
        if (!isAvailable) return fail(res, 'Room is not available for the selected dates');

        const roomData = await Room.findById(room).populate('hotel');
        if (!roomData) return fail(res, 'Room not found', 404);

        const nights = Math.ceil(
            (new Date(checkOutDate) - new Date(checkInDate)) / 86400000
        );

        const { base, discount, taxAmount, serviceFee, grandTotal } =
            calcBreakdown(roomData.pricePerNight, nights, couponCode);

        const booking = await Booking.create({
            user:          userId,
            room,
            hotel:         roomData.hotel._id,
            guests:        +guests,
            checkInDate,
            checkOutDate,
            totalPrice:    base,
            taxAmount,
            serviceFee,
            couponCode:    couponCode?.toUpperCase() || '',
            discountAmount:discount,
            paymentMethod: paymentMethod || 'pay at hotel',
        });

        // Non-blocking: send confirmation email
        sendBookingEmail(req.user.email, req.user.username, roomData, booking);

        // Event Bus: notify owner + broadcast availability
        bookingBus.emit('booking:created', {
            booking,
            roomId:  room,
            ownerId: roomData.hotel.owner?.toString(),
        });

        ok(res, { message: 'Booking created successfully', booking, breakdown: { base, discount, taxAmount, serviceFee, grandTotal } });
    } catch (error) {
        fail(res, error.message);
    }
};

// ──────────────────────────────────────────────────────────────
// PROTECTED: GET /api/bookings/user
// ──────────────────────────────────────────────────────────────
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id.toString() })
            .populate('room hotel')
            .sort({ createdAt: -1 });
        ok(res, { bookings });
    } catch (error) {
        fail(res, error.message);
    }
};

// ──────────────────────────────────────────────────────────────
// PROTECTED: GET /api/bookings/hotel  (hotelOwner)
// ──────────────────────────────────────────────────────────────
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user._id.toString() });
        if (!hotel) return fail(res, 'No hotel found for this owner', 404);

        const bookings = await Booking.find({ hotel: hotel._id })
            .populate('room hotel')
            .sort({ createdAt: -1 });

        const totalRevenue = bookings
            .filter(b => b.isPaid)
            .reduce((sum, b) => sum + calcGrandTotal(b), 0);

        // Build daily revenue for last 30 days
        const today = new Date();
        const daily = {};
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today); d.setDate(d.getDate() - i);
            daily[d.toISOString().split('T')[0]] = 0;
        }
        bookings.filter(b => b.isPaid).forEach(b => {
            const key = new Date(b.createdAt).toISOString().split('T')[0];
            if (key in daily) daily[key] += b.totalPrice;
        });
        const revenueData    = Object.entries(daily).map(([date, revenue]) => ({ date, revenue }));
        const occupancyRate  = Math.round((bookings.filter(b => b.status === 'confirmed').length / Math.max(bookings.length, 1)) * 100);

        ok(res, { dashboardData: { bookings, totalBookings: bookings.length, totalRevenue, revenueData, occupancyRate } });
    } catch (error) {
        fail(res, error.message);
    }
};

// ──────────────────────────────────────────────────────────────
// PROTECTED: PATCH /api/bookings/:id/cancel  (user)
// ──────────────────────────────────────────────────────────────
export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findOne({ _id: id, user: req.user._id.toString() });
        if (!booking) return fail(res, 'Booking not found', 404);
        if (booking.status === 'cancelled') return fail(res, 'Booking already cancelled');

        const hoursUntilCheckIn = (new Date(booking.checkInDate) - Date.now()) / 3600000;
        const refundEligible    = hoursUntilCheckIn >= 48;

        booking.status       = 'cancelled';
        booking.cancelledAt  = new Date();
        booking.refundStatus = booking.isPaid && refundEligible ? 'pending' : 'none';
        await booking.save();

        ok(res, {
            message: refundEligible
                ? 'Booking cancelled. Refund will be processed in 5-7 business days.'
                : 'Booking cancelled. No refund (within 48h of check-in).',
            refundEligible,
        });

        bookingBus.emit('booking:cancelled', { booking, roomId: booking.room?.toString() });
    } catch (error) {
        fail(res, error.message);
    }
};

// ──────────────────────────────────────────────────────────────
// PROTECTED: PATCH /api/bookings/:id/status  (hotelOwner)
// ──────────────────────────────────────────────────────────────
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'cancelled'].includes(status))
            return fail(res, 'Invalid status');

        const hotel = await Hotel.findOne({ owner: req.user._id.toString() });
        if (!hotel) return fail(res, 'Hotel not found', 404);

        const booking = await Booking.findOneAndUpdate(
            { _id: id, hotel: hotel._id },
            { status },
            { new: true }
        );
        if (!booking) return fail(res, 'Booking not found', 404);

        ok(res, { message: `Booking ${status}`, booking });
    } catch (error) {
        fail(res, error.message);
    }
};

// ──────────────────────────────────────────────────────────────
// PROTECTED: POST /api/bookings/stripe-payment
// ──────────────────────────────────────────────────────────────
export const stripePayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking  = await Booking.findById(bookingId);
        const roomData = await Room.findById(booking.room).populate('hotel');
        const { origin } = req.headers;

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripeInstance.checkout.sessions.create({
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: { name: `${roomData.hotel.name} — ${roomData.roomType}` },
                    unit_amount: calcGrandTotal(booking) * 100, // paisa
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${origin}/loader/my-bookings`,
            cancel_url:  `${origin}/my-bookings`,
            metadata: { bookingId: bookingId.toString() },
        });

        ok(res, { url: session.url });
    } catch (error) {
        fail(res, error.message);
    }
};

// ──────────────────────────────────────────────────────────────
// PROTECTED: POST /api/bookings/verify-payment  (Stripe)
// ──────────────────────────────────────────────────────────────
export const verifyStripePayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) return fail(res, 'Booking ID required');

        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const sessions = await stripeInstance.checkout.sessions.list({ limit: 100 });
        const session  = sessions.data.find(s => s.metadata?.bookingId === bookingId);

        if (session && session.payment_status === 'paid') {
            await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentMethod: 'stripe', status: 'confirmed' });
            return ok(res, { message: 'Payment verified' });
        }
        fail(res, 'Payment not completed');
    } catch (error) {
        fail(res, error.message);
    }
};

// ──────────────────────────────────────────────────────────────
// PROTECTED: POST /api/bookings/razorpay-order
// ──────────────────────────────────────────────────────────────
export const createRazorpayOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        if (!booking) return fail(res, 'Booking not found', 404);

        const razorpay = new Razorpay({
            key_id:     process.env.RAZORPAY_KEY_ID     || 'rzp_test_placeholder',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
        });

        const order = await razorpay.orders.create({
            amount:   calcGrandTotal(booking) * 100, // paise
            currency: 'INR',
            receipt:  `booking_${bookingId}`,
        });

        booking.razorpayOrderId = order.id;
        await booking.save();

        ok(res, {
            orderId:  order.id,
            amount:   order.amount,
            currency: order.currency,
            keyId:    process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        });
    } catch (error) {
        fail(res, error.message);
    }
};

// ──────────────────────────────────────────────────────────────
// PROTECTED: POST /api/bookings/verify-razorpay
// ──────────────────────────────────────────────────────────────
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        const expected = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder')
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expected !== razorpay_signature) return fail(res, 'Payment signature verification failed');

        await Booking.findByIdAndUpdate(bookingId, {
            isPaid:            true,
            paymentMethod:     'razorpay',
            status:            'confirmed',
            razorpayOrderId:   razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
        });

        ok(res, { message: 'Razorpay payment verified' });
    } catch (error) {
        fail(res, error.message);
    }
};