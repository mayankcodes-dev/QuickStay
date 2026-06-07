import Hotel     from '../models/Hotel.js';
import User      from '../models/User.js';
import cloudinary from '../configs/cloudinary.js';

// ── POST /api/hotels/  (protected) ───────────────────────────
export const registerHotel = async (req, res) => {
    try {
        const { name, address, contact, city } = req.body;
        if (!req.user) return res.json({ success: false, message: 'Authentication required' });

        const owner = req.user._id.toString();
        const existing = await Hotel.findOne({ owner });
        if (existing) return res.json({ success: false, message: 'Hotel already registered' });

        await Hotel.create({ name, address, contact, city, owner });
        await User.findByIdAndUpdate(owner, { role: 'hotelOwner' });

        res.json({ success: true, message: 'Hotel registered successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ── PATCH /api/hotels/  (protected hotelOwner) ───────────────
export const updateHotel = async (req, res) => {
    try {
        const owner = req.user._id.toString();
        const { name, address, contact, city, description } = req.body;
        const updates = {};
        if (name)        updates.name        = name;
        if (address)     updates.address     = address;
        if (contact)     updates.contact     = contact;
        if (city)        updates.city        = city;
        if (description) updates.description = description;

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
        if (!hotel) return res.json({ success: false, message: 'Hotel not found' });

        res.json({ success: true, message: 'Hotel updated', hotel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ── GET /api/hotels/owner  (protected hotelOwner) ─────────────
export const getOwnerHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user._id.toString() });
        if (!hotel) return res.json({ success: false, message: 'No hotel registered' });
        res.json({ success: true, hotel });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};