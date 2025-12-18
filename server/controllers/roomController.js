import Hotel from '../models/Hotel.js';
import { v2 as cloudinary}  from "cloudinary";
import Room from '../models/Room.js';

//API to create a new room for a hotel
export const createRoom = async (req, res)=>{
    try {
        const {roomType, pricePerNight, amenities} = req.body;
        const hotel = await Hotel.findOne({owner: req.auth().userId});  
        
        if(!hotel) return res.json({success: false, message: 'Hotel not found for the owner'});
        
        // Validate that files were uploaded
        if(!req.files || req.files.length === 0) {
            return res.json({success: false, message: 'Please upload at least one image'});
        }

        //upload images to cloudinary
        const uploadImages = req.files.map(async (file) =>{
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })
        //wait for all images to be complete
        const image = await Promise.all(uploadImages);               

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images: image,
        })
        res.json({success: true, message: 'Room created successfully'});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message });        
    }
}

//API to get all the rooms
export const getRooms = async (req, res)=>{
    try {
        const rooms = await Room.find({ isAvailable: true}).populate({
            path: 'hotel',
            populate:{
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1});
        res.json({success: true, rooms});
    } catch (error) {
        res.json({success: false, message: error.message });
    }
    
}

//API to get all rooms for a specific hotel
export const getOwnerRooms = async (req, res)=>{
    try{
        const hotelData = await Hotel.findOne({owner: req.auth().userId});
        if(!hotelData) {
            return res.json({success: false, message: 'No hotel found for this owner'});
        }
        const rooms = await Room.find({hotel: hotelData._id}).populate('hotel');
        res.json({success: true, rooms});
        
    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message });
    }
}
//API to toggle room availability
export const toggleRoomAvailability = async (req, res)=>{
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({success: true, message: 'Room availability updated successfully'});
    } catch (error) {
        res.json({success: false, message: error.message });
    }    
}

