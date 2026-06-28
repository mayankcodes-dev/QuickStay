import User    from '../models/User.js';
import Hotel   from '../models/Hotel.js';
import Room    from '../models/Room.js';
import Booking from '../models/Booking.js';
import Review  from '../models/Review.js';
import { ok, fail } from '../utils/respond.js';

export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin')
        return res.status(403).json({ success: false, message: 'Admin access required' });
    next();
};

// ── GET /api/admin/stats ──────────────────────────────────────
export const getStats = async (req, res) => {
    try {
        const [users, hotels, rooms, bookings, reviews] = await Promise.all([
            User.countDocuments(),
            Hotel.countDocuments(),
            Room.countDocuments({ isDeleted: { $ne: true } }),
            Booking.countDocuments(),
            Review.countDocuments(),
        ]);
        const revenue = await Booking.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        ok(res, { stats: { users, hotels, rooms, bookings, reviews, totalRevenue: revenue[0]?.total || 0 } });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── GET /api/admin/users ──────────────────────────────────────
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        ok(res, { users });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── PATCH /api/admin/users/:id ────────────────────────────────
export const updateUserRole = async (req, res) => {
    try {
        const { id }   = req.params;
        const { role } = req.body;
        if (!['user', 'hotelOwner', 'admin'].includes(role)) return fail(res, 'Invalid role');

        const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
        if (!user) return fail(res, 'User not found', 404);
        ok(res, { user });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── GET /api/admin/hotels ─────────────────────────────────────
export const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });
        ok(res, { hotels });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── GET /api/admin/bookings ───────────────────────────────────
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('room hotel').sort({ createdAt: -1 }).limit(200);
        ok(res, { bookings });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── GET /api/admin/reviews ────────────────────────────────────
export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'username email')
            .populate('hotel', 'name city')
            .sort({ createdAt: -1 });
        ok(res, { reviews });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── DELETE /api/admin/reviews/:id ────────────────────────────
export const adminDeleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        ok(res, { message: 'Review deleted' });
    } catch (error) {
        fail(res, error.message);
    }
};
