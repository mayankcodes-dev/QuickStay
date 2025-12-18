import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";




// function to check availibility of rooms for given date range
const checkAvailibility = async ({checkInDate, checkOutDate, room})=>{
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkOutDate},
            checkOutDate: {$gte: checkInDate}
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error(error.message);
    }
}

//api to check room availibility
// POST /api/bookings/check-availibility
export const checkAvailibilityAPI = async (req, res) =>{
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailibility({room, checkInDate, checkOutDate});
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: true, message: error.message });      
    }
}

//api to create booking
// POST /api/bookings/book

export const createBooking = async (req, res)=>{
    try {
        const { room, checkInDate, checkOutDate, guests} = req.body;
        const user = req.user._id;

        // before booking check if room is available 
        const isAvailable = await checkAvailibility({
            room,
            checkInDate,
            checkOutDate
        });
        if(!isAvailable){
            return res.json({success: false, message: 'Room is not available for the selected dates'});
        }

        // get totalPrice
        const roomData = await Room.findById(room).populate('hotel');
        let totalPrice = roomData.pricePerNight;

        //calculate number of nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        totalPrice *= nights;
        // create booking
        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: 'Booking Details',
            html: `
            <h2> Your Booking Details </h2>
            <p>Dear, ${req.user.username},</p>
            <p>Thank you for booking !Here are your details:</p>
            <ul>
                <li><strong>Hotel:</strong> ${roomData.hotel.name}</li>
                <li><strong>Room Type:</strong> ${roomData.roomType}</li>
                <li><strong>Check-In Date:</strong> ${new Date(checkInDate).toLocaleDateString()}</li>
                <li><strong>Check-Out Date:</strong> ${new Date(checkOutDate).toLocaleDateString()}</li>
                <li><strong>Guests:</strong> ${guests}</li>
                <li><strong>Total Price:</strong> $${totalPrice}</li>
            </ul>
            <p>Thank you for choosing our service!</p>
            `,
        }

        await transporter.sendMail(mailOptions)

        res.json({success: true, message: 'Booking created successfully', booking});

    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
};

//api to get all bookings of a user
// GET /api/bookings/user

export const getUserBookings = async (req, res)=>{
    try {
        const user = req.user._id;
        const bookings = await Booking.find({user}).populate('room hotel').sort({createAt: -1});
        res.json({success: true, bookings});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getHotelBookings = async (req, res)=>{
    try {
        const hotel = await Hotel.findOne({owner: req.auth().userId});
        if(!hotel){
            return res.json({ success: false, message: 'No hotel found for this owner' });
        }
        const bookings = await Booking.find({hotel: hotel._id}).populate('room hotel user').sort({createdAt: -1});
        //total bookings
        const totalBookings = bookings.length;
        //total revenue
        const totalRevenue = bookings.reduce((total, booking) => total + booking.totalPrice, 0);

        res.json({ success: true, dashboardData: { bookings, totalBookings, totalRevenue }});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
