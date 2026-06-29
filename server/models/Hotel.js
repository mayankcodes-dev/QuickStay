import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
    name:        { type: String, required: true },
    address:     { type: String, required: true },
    contact:     { type: String, required: true },
    // Mixed type: supports legacy Clerk string IDs ("user_35Sr3...") AND new ObjectId owners
    owner:       { type: mongoose.Schema.Types.Mixed, required: true, ref: 'User' },
    city:        { type: String, required: true },
    image:       { type: String, default: '' },
    description: { type: String, default: '' },
}, { timestamps: true });

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;