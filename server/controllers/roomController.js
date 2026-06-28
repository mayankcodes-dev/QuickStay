import Hotel from '../models/Hotel.js';
import Room  from '../models/Room.js';
import { v2 as cloudinary } from 'cloudinary';
import { ok, fail } from '../utils/respond.js';

// ── POST /api/rooms/  (protected hotelOwner) ──────────────────
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities, category } = req.body;
        const hotel = await Hotel.findOne({ owner: req.user._id.toString() });
        if (!hotel) return fail(res, 'No hotel found for this owner', 404);

        if (!req.files?.length) return fail(res, 'Please upload at least one image');

        const images = await Promise.all(
            req.files.map(f => cloudinary.uploader.upload(f.path, { folder: 'yoyo' }).then(r => r.secure_url))
        );

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: typeof amenities === 'string' ? JSON.parse(amenities) : amenities,
            images,
            category: category || 'Budget',
        });

        ok(res, { message: 'Room created successfully' });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── GET /api/rooms/  (public) ─────────────────────────────────
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true, isDeleted: { $ne: true } })
            .populate({ path: 'hotel', populate: { path: 'owner', select: 'image username' } })
            .sort({ createdAt: -1 });
        ok(res, { rooms });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── GET /api/rooms/owner  (protected hotelOwner) ──────────────
export const getOwnerRooms = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user._id.toString() });
        if (!hotel) return fail(res, 'No hotel found for this owner', 404);

        const rooms = await Room.find({ hotel: hotel._id, isDeleted: { $ne: true } }).populate('hotel');
        ok(res, { rooms });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── POST /api/rooms/toggle-availability  (protected hotelOwner) ─
export const toggleRoomAvailability = async (req, res) => {
    try {
        const room = await Room.findById(req.body.roomId);
        if (!room) return fail(res, 'Room not found', 404);
        room.isAvailable = !room.isAvailable;
        await room.save();
        ok(res, { message: 'Availability updated' });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── PATCH /api/rooms/:id  (protected hotelOwner) ──────────────
export const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomType, pricePerNight, amenities, category } = req.body;

        const hotel = await Hotel.findOne({ owner: req.user._id.toString() });
        if (!hotel) return fail(res, 'Hotel not found', 404);

        const room = await Room.findOne({ _id: id, hotel: hotel._id });
        if (!room) return fail(res, 'Room not found or unauthorized', 404);

        if (roomType)      room.roomType      = roomType;
        if (pricePerNight) room.pricePerNight = +pricePerNight;
        if (amenities)     room.amenities     = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        if (category)      room.category      = category;

        if (req.files?.length) {
            const newImages = await Promise.all(
                req.files.map(f => cloudinary.uploader.upload(f.path, { folder: 'yoyo' }).then(r => r.secure_url))
            );
            room.images = [...room.images, ...newImages].slice(0, 4);
        }

        await room.save();
        ok(res, { message: 'Room updated', room });
    } catch (error) {
        fail(res, error.message);
    }
};

// ── DELETE /api/rooms/:id  (protected hotelOwner) ─────────────
export const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel  = await Hotel.findOne({ owner: req.user._id.toString() });
        if (!hotel) return fail(res, 'Hotel not found', 404);

        const room = await Room.findOneAndUpdate(
            { _id: id, hotel: hotel._id },
            { isAvailable: false, isDeleted: true },
            { new: true }
        );
        if (!room) return fail(res, 'Room not found or unauthorized', 404);

        ok(res, { message: 'Room deleted' });
    } catch (error) {
        fail(res, error.message);
    }
};
