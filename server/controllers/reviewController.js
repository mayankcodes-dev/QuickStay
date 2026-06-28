import Review  from '../models/Review.js';
import Booking from '../models/Booking.js';
import { ok, fail } from '../utils/respond.js';

// ── POST /api/reviews  (protected user) ──────────────────────
export const createReview = async (req, res) => {
    try {
        const { hotel, room, rating, comment } = req.body;
        const userId = req.user._id;

        // Must have a completed booking for this hotel
        const booking = await Booking.findOne({
            user:   userId.toString(),
            hotel,
            status: { $in: ['confirmed', 'cancelled'] },
            checkOutDate: { $lte: new Date() },
        });
        if (!booking) return fail(res, 'You can only review hotels you have stayed at');

        // Prevent duplicate
        if (await Review.findOne({ user: userId, hotel }))
            return fail(res, 'You have already reviewed this hotel');

        const review = await Review.create({ user: userId, hotel, room, rating: +rating, comment });
        await review.populate('user', 'username image');
        ok(res, { review });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── GET /api/reviews/hotel/:hotelId  (public) ─────────────────
export const getHotelReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ hotel: req.params.hotelId })
            .populate('user', 'username image')
            .sort({ createdAt: -1 });

        const avgRating = reviews.length
            ? +(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
            : 0;

        const distribution = [5, 4, 3, 2, 1].map(star => ({
            star,
            count: reviews.filter(r => r.rating === star).length,
        }));

        ok(res, { reviews, avgRating, totalReviews: reviews.length, distribution });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── PATCH /api/reviews/:id/response  (protected hotelOwner) ──
export const ownerResponse = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { ownerResponse: req.body.response, ownerResponseAt: new Date() },
            { new: true }
        ).populate('user', 'username image');

        if (!review) return fail(res, 'Review not found', 404);
        ok(res, { review });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── DELETE /api/reviews/:id  (protected admin or own review) ──
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return fail(res, 'Review not found', 404);

        const canDelete = review.user.toString() === req.user._id.toString() || req.user.role === 'admin';
        if (!canDelete) return fail(res, 'Unauthorized', 403);

        await review.deleteOne();
        ok(res, { message: 'Review deleted' });
    } catch (error) {
        fail(res, error.message);
    }
};
