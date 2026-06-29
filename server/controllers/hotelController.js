import Hotel     from '../models/Hotel.js';
import User      from '../models/User.js';
import cloudinary from '../configs/cloudinary.js';
import { ok, fail } from '../utils/respond.js';

// ── POST /api/hotels/  (protected) ───────────────────────────
export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        const owner = req.user._id;

        if (await Hotel.findOne({ owner })) return fail(res, 'Hotel already registered');

        await Hotel.create({ name, address, contact, city, owner });
        await User.findByIdAndUpdate(owner, { role: 'hotelOwner' });

        ok(res, { message: 'Hotel registered successfully' });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── PATCH /api/hotels/  (protected hotelOwner) ───────────────
export const updateHotel = async (req, res) => {
    try {
        const owner   = req.user._id;
        const { name, address, contact, city, description } = req.body;

        // Build update object from only provided fields
        const updates = Object.fromEntries(
            Object.entries({ name, address, contact, city, description }).filter(([, v]) => v != null && v !== '')
        );

        // Handle image upload
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'yoyo/hotels', resource_type: 'image' },
                    (err, res) => err ? reject(err) : resolve(res)
                );
                stream.end(req.file.buffer);
            });
            updates.image = result.secure_url;
        }

        const hotel = await Hotel.findOneAndUpdate({ owner }, updates, { new: true });
        if (!hotel) return fail(res, 'Hotel not found', 404);

        ok(res, { message: 'Hotel updated', hotel });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── GET /api/hotels/owner  (protected hotelOwner) ─────────────
export const getOwnerHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user._id });
        if (!hotel) return fail(res, 'No hotel registered', 404);
        ok(res, { hotel });
    } catch (error) {
        fail(res, error.message);
    }
};