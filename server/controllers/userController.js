import User from '../models/User.js';
import { v2 as cloudinary } from 'cloudinary';
import { ok, fail } from '../utils/respond.js';

// ── GET /api/user/  (protected) ───────────────────────────────
export const getUserData = async (req, res) => {
    try {
        const { role, recentSearchedCities, wishlist, phone, username, email, image } = req.user;
        ok(res, { role, recentSearchedCities, wishlist: wishlist || [], phone: phone || '', username, email, image });
    } catch (err) {
        fail(res, err.message);
    }
};

// ── POST /api/user/store-recent-search  (protected) ──────────
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        const user = req.user;

        if (user.recentSearchedCities.includes(recentSearchedCity))
            return ok(res, { message: 'Already in recent searches' });

        // Keep the last 3 unique cities; shift oldest if full
        user.recentSearchedCities = [...user.recentSearchedCities, recentSearchedCity].slice(-3);
        await user.save();
        ok(res, { message: 'City added' });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── PATCH /api/user/profile  (protected) ─────────────────────
export const updateProfile = async (req, res) => {
    try {
        const { username, phone } = req.body;
        const user = req.user;

        if (username) user.username = username.trim().slice(0, 60);
        if (phone !== undefined) user.phone = phone.trim().slice(0, 15);

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'yoyo/avatars',
                width: 256, height: 256, crop: 'fill', gravity: 'face',
            });
            user.image = result.secure_url;
        }

        await user.save();
        ok(res, {
            message: 'Profile updated',
            user: { _id: user._id, username: user.username, email: user.email, image: user.image, role: user.role, phone: user.phone },
        });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── POST /api/user/wishlist/:roomId  (protected) ──────────────
export const toggleWishlist = async (req, res) => {
    try {
        const { roomId } = req.params;
        const user = await User.findById(req.user._id);

        const idx = user.wishlist.findIndex(id => id.toString() === roomId);
        const added = idx === -1;
        added ? user.wishlist.push(roomId) : user.wishlist.splice(idx, 1);

        await user.save();
        ok(res, { added, wishlist: user.wishlist });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── GET /api/user/wishlist  (protected) ───────────────────────
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({ path: 'wishlist', populate: { path: 'hotel', select: 'name city' } });
        ok(res, { wishlist: user.wishlist });
    } catch (error) {
        fail(res, error.message);
    }
};
