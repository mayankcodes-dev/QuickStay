import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    checkAvailibilityAPI,
    createBooking,
    getUserBookings,
    getHotelBookings,
    cancelBooking,
    updateBookingStatus,
    stripePayment,
    verifyStripePayment,
    validateCoupon,
} from '../controllers/bookingController.js';

const bookingRouter = express.Router();

// Public
bookingRouter.post('/check-availability', checkAvailibilityAPI);
bookingRouter.post('/validate-coupon',     protect, validateCoupon);

// Booking lifecycle
bookingRouter.post('/book',                protect, createBooking);
bookingRouter.get('/user',                 protect, getUserBookings);
bookingRouter.get('/hotel',                protect, getHotelBookings);
bookingRouter.patch('/:id/cancel',         protect, cancelBooking);
bookingRouter.patch('/:id/status',         protect, updateBookingStatus);

// Payments — Stripe only
bookingRouter.post('/stripe-payment',      protect, stripePayment);
bookingRouter.post('/verify-payment',      protect, verifyStripePayment);

export default bookingRouter;