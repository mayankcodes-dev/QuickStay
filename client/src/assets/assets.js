const CLOUD = "dgqgzmzed";

// ─── Helper: build Cloudinary optimised URL ────────────────────
const cld = (publicId, w = 800) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${w}/${publicId}`;

// ─── SVG icons (tiny — fine to bundle locally) ────────────────
import searchIcon from './searchIcon.svg'
import userIcon from './userIcon.svg'
import calenderIcon from './calenderIcon.svg'
import locationIcon from './locationIcon.svg'
import starIconFilled from './starIconFilled.svg'
import arrowIcon from './arrowIcon.svg'
import starIconOutlined from './starIconOutlined.svg'
import instagramIcon from './instagramIcon.svg'
import facebookIcon from './facebookIcon.svg'
import twitterIcon from './twitterIcon.svg'
import linkendinIcon from './linkendinIcon.svg'
import freeWifiIcon from './freeWifiIcon.svg'
import freeBreakfastIcon from './freeBreakfastIcon.svg'
import roomServiceIcon from './roomServiceIcon.svg'
import mountainIcon from './mountainIcon.svg'
import poolIcon from './poolIcon.svg'
import homeIcon from './homeIcon.svg'
import closeIcon from './closeIcon.svg'
import locationFilledIcon from './locationFilledIcon.svg'
import heartIcon from './heartIcon.svg'
import badgeIcon from './badgeIcon.svg'
import menuIcon from './menuIcon.svg'
import closeMenu from './closeMenu.svg'
import guestsIcon from './guestsIcon.svg'
import addIcon from "./addIcon.svg";
import dashboardIcon from "./dashboardIcon.svg";
import listIcon from "./listIcon.svg";
import uploadArea from "./uploadArea.svg";
import totalBookingIcon from "./totalBookingIcon.svg";
import totalRevenueIcon from "./totalRevenueIcon.svg";

// ─── PNG images → Cloudinary CDN (yoyo/assets/) ────────────────
const heroImage  = cld("yoyo/assets/hero_image",  1920);
const regImage   = cld("yoyo/assets/reg_image",    1200);
const roomImg1   = cld("yoyo/assets/room_img_1",   900);
const roomImg2   = cld("yoyo/assets/room_img_2",   900);
const roomImg3   = cld("yoyo/assets/room_img_3",   900);
const roomImg4   = cld("yoyo/assets/room_img_4",   900);
const offerImg1  = cld("yoyo/assets/offer_1",      600);
const offerImg2  = cld("yoyo/assets/offer_2",      600);
const offerImg3  = cld("yoyo/assets/offer_3",      600);



export const assets = {
    searchIcon,
    userIcon,
    calenderIcon,
    locationIcon,
    starIconFilled,
    arrowIcon,
    starIconOutlined,
    instagramIcon,
    facebookIcon,
    twitterIcon,
    linkendinIcon,
    freeWifiIcon,
    freeBreakfastIcon,
    roomServiceIcon,
    mountainIcon,
    poolIcon,
    closeIcon,
    homeIcon,
    locationFilledIcon,
    heartIcon,
    badgeIcon,
    menuIcon,
    closeMenu,
    guestsIcon,
    heroImage,
    regImage,
    addIcon,
    dashboardIcon,
    listIcon,
    uploadArea,
    totalBookingIcon,
    totalRevenueIcon,
}

export const cities = [
    "Mumbai", "Delhi", "Goa", "Jaipur", "Bengaluru", "Hyderabad",
    "Chennai", "Kolkata", "Manali", "Udaipur", "Agra", "Pune",
    "Kochi", "Ahmedabad", "Varanasi", "Darjeeling", "Rishikesh",
    "Shimla", "Coorg", "Ooty",
];

// Cloudinary cloud name
const cldImg = (id, w = 600) =>
    `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${w}/${id}`;

// Featured Destinations — all images served from Cloudinary CDN
export const featuredDestinations = [
    {
        city: "Goa",
        tagline: "Sun, Sand & Serenity",
        image: cldImg("yoyo/cities/goa"),
        hotels: 1240,
    },
    {
        city: "Jaipur",
        tagline: "The Pink City",
        image: cldImg("yoyo/rooms/jaipur_1", 600),
        hotels: 980,
    },
    {
        city: "Mumbai",
        tagline: "City of Dreams",
        image: cldImg("yoyo/cities/mumbai"),
        hotels: 2100,
    },
    {
        city: "Manali",
        tagline: "Himalayan Escape",
        image: cldImg("yoyo/cities/manali"),
        hotels: 450,
    },
    {
        city: "Udaipur",
        tagline: "City of Lakes",
        image: cldImg("yoyo/cities/udaipur"),
        hotels: 620,
    },
    {
        city: "Delhi",
        tagline: "Heart of India",
        image: cldImg("yoyo/cities/delhi"),
        hotels: 3200,
    },
    {
        city: "Bengaluru",
        tagline: "Garden City",
        image: cldImg("yoyo/cities/bengaluru"),
        hotels: 1850,
    },
    {
        city: "Kochi",
        tagline: "Queen of Arabian Sea",
        image: cldImg("yoyo/cities/kochi"),
        hotels: 730,
    },
];

// Exclusive Offers — using original images uploaded to Cloudinary yoyo/assets/
export const exclusiveOffers = [
    {
        _id: 1,
        title: "Summer Escape Package",
        description: "Enjoy a complimentary night and daily breakfast for two",
        priceOff: 25,
        expiryDate: "Aug 31",
        image: offerImg1,
    },
    {
        _id: 2,
        title: "Romantic Getaway",
        description: "Special couples package including spa treatment and candlelight dinner",
        priceOff: 20,
        expiryDate: "Sep 20",
        image: offerImg2,
    },
    {
        _id: 3,
        title: "Luxury Retreat",
        description: "Book 60 days in advance and save big on luxury properties across India.",
        priceOff: 30,
        expiryDate: "Sep 25",
        image: offerImg3,
    },
];

// Testimonials Dummy Data
export const testimonials = [
    { id: 1,  name: "Priya Sharma",        address: "Delhi, India",     image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200", rating: 5, review: "Booked a hotel in Goa through YoYo and it was absolutely perfect. The prices were unbeatable and check-in was instant. Will definitely use again!" },
    { id: 2,  name: "Rahul Mehta",         address: "Mumbai, India",    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200", rating: 5, review: "YoYo is my go-to for business travel. Found a great hotel in Bengaluru at the last minute. Seamless booking, professional service." },
    { id: 3,  name: "Ananya Singh",        address: "Bangalore, India", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200", rating: 4, review: "Amazing platform! Found beautiful heritage properties in Jaipur that I couldn't find elsewhere. The photos were accurate and the rooms were even better in person." },
    { id: 4,  name: "Vikram Nair",         address: "Kochi, India",     image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200", rating: 5, review: "Stayed at a gorgeous resort in Udaipur booked through YoYo. The pay-at-hotel option gave me flexibility. Highly recommended!" },
    { id: 5,  name: "Sunita Patel",        address: "Ahmedabad, India", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200", rating: 5, review: "Planned a family trip to Manali and YoYo made it so easy! Found a beautiful chalet with mountain views. Kids loved it and the booking process was super smooth." },
    { id: 6,  name: "Arjun Krishnamurthy",address: "Chennai, India",   image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200", rating: 4, review: "Used YoYo for a Varanasi heritage stay. The Ganga view property was stunning. Great value for money compared to other booking sites." },
    { id: 7,  name: "Meera Reddy",         address: "Hyderabad, India", image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200", rating: 5, review: "I travel every month for work and YoYo has the best inventory of business hotels. Instant confirmation, transparent pricing — exactly what a traveller needs!" },
    { id: 8,  name: "Rohit Kapoor",        address: "Jaipur, India",    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200", rating: 5, review: "Booked a luxury suite at a Shimla property via YoYo for our honeymoon. It exceeded all expectations. The platform is beautiful and so easy to use!" },
    { id: 9,  name: "Kavya Iyer",          address: "Pune, India",      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200", rating: 5, review: "YoYo had the best deals in Rishikesh for our yoga retreat. Clean, peaceful rooms right by the Ganges. Customer support was incredibly responsive too." },
    { id: 10, name: "Amit Tiwari",         address: "Lucknow, India",   image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200", rating: 4, review: "Great selection of hotels in Agra near the Taj Mahal. Booked a last-minute room and got a fantastic view. YoYo never disappoints!" },
    { id: 11, name: "Divya Bose",          address: "Kolkata, India",   image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200", rating: 5, review: "Used YoYo for our Andaman trip and it was a dream. The beachside cottage was exactly as shown. Zero hidden charges — so refreshing compared to other platforms." },
    { id: 12, name: "Nikhil Joshi",        address: "Indore, India",    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200", rating: 5, review: "Quick, simple, and affordable. Booked a business hotel in Bhopal in under 2 minutes. The instant confirmation feature is a game-changer for frequent travellers." },
];

// Facility Icon
export const facilityIcons = {
    "Free Wi-Fi": assets.freeWifiIcon,
    "Free Breakfast": assets.freeBreakfastIcon,
    "Room Service": assets.roomServiceIcon,
    "Mountain View": assets.mountainIcon,
    "Pool Access": assets.poolIcon,
};

// For Room Details Page
export const roomCommonData = [
    { icon: assets.homeIcon, title: "Clean & Safe Stay", description: "A well-maintained and hygienic space just for you." },
    { icon: assets.badgeIcon, title: "Enhanced Cleaning", description: "This host follows Staybnb's strict cleaning standards." },
    { icon: assets.locationFilledIcon, title: "Excellent Location", description: "90% of guests rated the location 5 stars." },
    { icon: assets.heartIcon, title: "Smooth Check-In", description: "100% of guests gave check-in a 5-star rating." },
];

// User Dummy Data
export const userDummyData = {
    "_id": "user_2unqyL4diJFP1E3pIBnasc7w8hP",
    "username": "Great Stack",
    "email": "user.greatstack@gmail.com",
    "image": "https://img.clejrk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzJ2N2c5YVpSSEFVYVUxbmVYZ2JkSVVuWnFzWSJ9",
    "role": "hotelOwner",
    "createdAt": "2025-03-25T09:29:16.367Z",
    "updatedAt": "2025-04-10T06:34:48.719Z",
    "__v": 1,
    "recentSearchedCities": [
        "New York"
    ]
}

// Hotel Dummy Data
export const hotelDummyData = {
    "_id": "67f76393197ac559e4089b72",
    "name": "Urbanza Suites",
    "address": "Main Road  123 Street , 23 Colony",
    "contact": "+0123456789",
    "owner": userDummyData,
    "city": "New York",
    "createdAt": "2025-04-10T06:22:11.663Z",
    "updatedAt": "2025-04-10T06:22:11.663Z",
    "__v": 0
}

// Rooms Dummy Data — images from Cloudinary
const cx = (id) => `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_600/${id}`;
export const roomsDummyData = [
    {
        "_id": "67f7647c197ac559e4089b96",
        "hotel": { ...hotelDummyData, name: "Seabreeze Villa Goa", city: "Goa" },
        "roomType": "Double Bed",
        "pricePerNight": 2499,
        "amenities": ["Room Service", "Mountain View", "Pool Access"],
        "images": [cx("yoyo/rooms/goa_1"), cx("yoyo/rooms/goa_2"), cx("yoyo/rooms/goa_villa_1"), cx("yoyo/rooms/goa_villa_2")],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:26:04.013Z",
        "updatedAt": "2025-04-10T06:26:04.013Z",
        "__v": 0
    },
    {
        "_id": "67f76452197ac559e4089b8e",
        "hotel": { ...hotelDummyData, name: "Lake Palace Heritage", city: "Udaipur" },
        "roomType": "Luxury Room",
        "pricePerNight": 4999,
        "amenities": ["Room Service", "Free Breakfast", "Pool Access"],
        "images": [cx("yoyo/rooms/udaipur_1"), cx("yoyo/rooms/udaipur_2"), cx("yoyo/rooms/udaipur_heritage_1"), cx("yoyo/rooms/udaipur_heritage_2")],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:25:22.593Z",
        "updatedAt": "2025-04-10T06:25:22.593Z",
        "__v": 0
    },
    {
        "_id": "67f76406197ac559e4089b82",
        "hotel": { ...hotelDummyData, name: "Marine Drive Inn", city: "Mumbai" },
        "roomType": "Single Bed",
        "pricePerNight": 1299,
        "amenities": ["Free Wi-Fi", "Free Breakfast", "Room Service"],
        "images": [cx("yoyo/rooms/mumbai_1"), cx("yoyo/rooms/mumbai_2"), cx("yoyo/rooms/mumbai_std_1"), cx("yoyo/rooms/mumbai_std_2")],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:24:06.285Z",
        "updatedAt": "2025-04-10T06:24:06.285Z",
        "__v": 0
    },
    {
        "_id": "67f763d8197ac559e4089b7a",
        "hotel": { ...hotelDummyData, name: "Snow Peak Chalet", city: "Manali" },
        "roomType": "Family Suite",
        "pricePerNight": 7499,
        "amenities": ["Free Wi-Fi", "Room Service", "Pool Access"],
        "images": [cx("yoyo/rooms/manali_1"), cx("yoyo/rooms/manali_2"), cx("yoyo/rooms/manali_chalet_1"), cx("yoyo/rooms/manali_chalet_2")],
        "isAvailable": true,
        "createdAt": "2025-04-10T06:23:20.252Z",
        "updatedAt": "2025-04-10T06:23:20.252Z",
        "__v": 0
    },
    {
        "_id": "68a00001197ac559e4089c01",
        "hotel": { ...hotelDummyData, name: "Amber Fort Residency", city: "Jaipur" },
        "roomType": "Luxury Room",
        "pricePerNight": 3799,
        "amenities": ["Free Wi-Fi", "Free Breakfast", "Room Service", "Pool Access"],
        "images": [cx("yoyo/rooms/jaipur_1"), cx("yoyo/rooms/jaipur_2"), cx("yoyo/rooms/jaipur_3"), cx("yoyo/rooms/jaipur_4")],
        "isAvailable": true,
        "createdAt": "2025-05-01T08:00:00.000Z",
        "updatedAt": "2025-05-01T08:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68a00002197ac559e4089c02",
        "hotel": { ...hotelDummyData, name: "Silicon Garden Hotel", city: "Bengaluru" },
        "roomType": "Double Bed",
        "pricePerNight": 2199,
        "amenities": ["Free Wi-Fi", "Room Service", "Free Breakfast"],
        "images": [cx("yoyo/rooms/bengaluru_1"), cx("yoyo/rooms/bengaluru_2"), cx("yoyo/rooms/bengaluru_3"), cx("yoyo/rooms/bengaluru_4")],
        "isAvailable": true,
        "createdAt": "2025-05-02T08:00:00.000Z",
        "updatedAt": "2025-05-02T08:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68a00003197ac559e4089c03",
        "hotel": { ...hotelDummyData, name: "Charminar Grand", city: "Hyderabad" },
        "roomType": "Family Suite",
        "pricePerNight": 5499,
        "amenities": ["Free Wi-Fi", "Free Breakfast", "Pool Access", "Mountain View"],
        "images": [cx("yoyo/rooms/hyderabad_1"), cx("yoyo/rooms/hyderabad_2"), cx("yoyo/rooms/hyderabad_3"), cx("yoyo/rooms/hyderabad_4")],
        "isAvailable": true,
        "createdAt": "2025-05-03T08:00:00.000Z",
        "updatedAt": "2025-05-03T08:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68a00004197ac559e4089c04",
        "hotel": { ...hotelDummyData, name: "Backwater Retreat", city: "Kochi" },
        "roomType": "Single Bed",
        "pricePerNight": 1799,
        "amenities": ["Free Wi-Fi", "Room Service", "Pool Access"],
        "images": [cx("yoyo/rooms/kochi_1"), cx("yoyo/rooms/kochi_2"), cx("yoyo/rooms/kochi_3"), cx("yoyo/rooms/kochi_4")],
        "isAvailable": true,
        "createdAt": "2025-05-04T08:00:00.000Z",
        "updatedAt": "2025-05-04T08:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68a00005197ac559e4089c05",
        "hotel": { ...hotelDummyData, name: "Ganges View Haveli", city: "Varanasi" },
        "roomType": "Double Bed",
        "pricePerNight": 2899,
        "amenities": ["Free Wi-Fi", "Free Breakfast", "Mountain View"],
        "images": [cx("yoyo/rooms/varanasi_1"), cx("yoyo/rooms/varanasi_2"), cx("yoyo/rooms/varanasi_3"), cx("yoyo/rooms/varanasi_4")],
        "isAvailable": true,
        "createdAt": "2025-05-05T08:00:00.000Z",
        "updatedAt": "2025-05-05T08:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68a00006197ac559e4089c06",
        "hotel": { ...hotelDummyData, name: "Taj Corridor Suites", city: "Agra" },
        "roomType": "Luxury Room",
        "pricePerNight": 6299,
        "amenities": ["Free Wi-Fi", "Free Breakfast", "Pool Access", "Room Service"],
        "images": [cx("yoyo/rooms/agra_1"), cx("yoyo/rooms/agra_2"), cx("yoyo/rooms/agra_3"), cx("yoyo/rooms/agra_4")],
        "isAvailable": true,
        "createdAt": "2025-05-06T08:00:00.000Z",
        "updatedAt": "2025-05-06T08:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68a00007197ac559e4089c07",
        "hotel": { ...hotelDummyData, name: "Himalayan Nest Shimla", city: "Shimla" },
        "roomType": "Family Suite",
        "pricePerNight": 4299,
        "amenities": ["Free Wi-Fi", "Free Breakfast", "Mountain View", "Room Service"],
        "images": [cx("yoyo/rooms/shimla_1"), cx("yoyo/rooms/shimla_2"), cx("yoyo/rooms/shimla_3"), cx("yoyo/rooms/shimla_4")],
        "isAvailable": true,
        "createdAt": "2025-05-07T08:00:00.000Z",
        "updatedAt": "2025-05-07T08:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68a00008197ac559e4089c08",
        "hotel": { ...hotelDummyData, name: "Riverside Cottage Rishikesh", city: "Rishikesh" },
        "roomType": "Double Bed",
        "pricePerNight": 1999,
        "amenities": ["Free Wi-Fi", "Free Breakfast", "Mountain View"],
        "images": [cx("yoyo/rooms/rishikesh_1"), cx("yoyo/rooms/rishikesh_2"), cx("yoyo/rooms/rishikesh_3"), cx("yoyo/rooms/rishikesh_4")],
        "isAvailable": true,
        "createdAt": "2025-05-08T08:00:00.000Z",
        "updatedAt": "2025-05-08T08:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68a00009197ac559e4089c09",
        "hotel": { ...hotelDummyData, name: "Cyber City Business Hotel", city: "Delhi" },
        "roomType": "Single Bed",
        "pricePerNight": 999,
        "amenities": ["Free Wi-Fi", "Room Service"],
        "images": [cx("yoyo/rooms/delhi_1"), cx("yoyo/rooms/delhi_2"), cx("yoyo/rooms/delhi_3"), cx("yoyo/rooms/delhi_4")],
        "isAvailable": true,
        "createdAt": "2025-05-09T08:00:00.000Z",
        "updatedAt": "2025-05-09T08:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68a0000a197ac559e4089c0a",
        "hotel": { ...hotelDummyData, name: "Nilgiri Mist Resort", city: "Ooty" },
        "roomType": "Luxury Room",
        "pricePerNight": 5899,
        "amenities": ["Free Wi-Fi", "Free Breakfast", "Pool Access", "Mountain View", "Room Service"],
        "images": [cx("yoyo/rooms/ooty_1"), cx("yoyo/rooms/ooty_2"), cx("yoyo/rooms/ooty_3"), cx("yoyo/rooms/ooty_4")],
        "isAvailable": true,
        "createdAt": "2025-05-10T08:00:00.000Z",
        "updatedAt": "2025-05-10T08:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68a0000b197ac559e4089c0b",
        "hotel": { ...hotelDummyData, name: "Coorg Plantation Stay", city: "Coorg" },
        "roomType": "Family Suite",
        "pricePerNight": 8999,
        "amenities": ["Free Wi-Fi", "Free Breakfast", "Pool Access", "Mountain View"],
        "images": [cx("yoyo/rooms/coorg_1"), cx("yoyo/rooms/coorg_2"), cx("yoyo/rooms/coorg_3"), cx("yoyo/rooms/coorg_4")],
        "isAvailable": true,
        "createdAt": "2025-05-11T08:00:00.000Z",
        "updatedAt": "2025-05-11T08:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68a0000c197ac559e4089c0c",
        "hotel": { ...hotelDummyData, name: "Darjeeling Tea Estate Lodge", city: "Darjeeling" },
        "roomType": "Double Bed",
        "pricePerNight": 3299,
        "amenities": ["Free Wi-Fi", "Free Breakfast", "Mountain View"],
        "images": [cx("yoyo/rooms/darjeeling_1"), cx("yoyo/rooms/darjeeling_2"), cx("yoyo/rooms/darjeeling_3"), cx("yoyo/rooms/darjeeling_4")],
        "isAvailable": true,
        "createdAt": "2025-05-12T08:00:00.000Z",
        "updatedAt": "2025-05-12T08:00:00.000Z",
        "__v": 0
    },
]



// User Bookings Dummy Data
export const userBookingsDummyData = [
    {
        "_id": "67f76839994a731e97d3b8ce",
        "user": userDummyData,
        "room": roomsDummyData[1],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-30T00:00:00.000Z",
        "checkOutDate": "2025-05-01T00:00:00.000Z",
        "totalPrice": 299,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Stripe",
        "isPaid": true,
        "createdAt": "2025-04-10T06:42:01.529Z",
        "updatedAt": "2025-04-10T06:43:54.520Z",
        "__v": 0
    },
    {
        "_id": "67f76829994a731e97d3b8c3",
        "user": userDummyData,
        "room": roomsDummyData[0],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-27T00:00:00.000Z",
        "checkOutDate": "2025-04-28T00:00:00.000Z",
        "totalPrice": 399,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Pay At Hotel",
        "isPaid": false,
        "createdAt": "2025-04-10T06:41:45.873Z",
        "updatedAt": "2025-04-10T06:41:45.873Z",
        "__v": 0
    },
    {
        "_id": "67f76810994a731e97d3b8b4",
        "user": userDummyData,
        "room": roomsDummyData[3],
        "hotel": hotelDummyData,
        "checkInDate": "2025-04-11T00:00:00.000Z",
        "checkOutDate": "2025-04-12T00:00:00.000Z",
        "totalPrice": 199,
        "guests": 1,
        "status": "pending",
        "paymentMethod": "Pay At Hotel",
        "isPaid": false,
        "createdAt": "2025-04-10T06:41:20.501Z",
        "updatedAt": "2025-04-10T06:41:20.501Z",
        "__v": 0
    },
    {
        "_id": "68b00001994a731e97d3b9a1",
        "user": userDummyData,
        "room": roomsDummyData[4],
        "hotel": roomsDummyData[4].hotel,
        "checkInDate": "2025-06-15T00:00:00.000Z",
        "checkOutDate": "2025-06-18T00:00:00.000Z",
        "totalPrice": 11397,
        "guests": 2,
        "status": "confirmed",
        "paymentMethod": "Stripe",
        "isPaid": true,
        "createdAt": "2025-05-20T10:00:00.000Z",
        "updatedAt": "2025-05-20T10:00:00.000Z",
        "__v": 0
    },
    {
        "_id": "68b00002994a731e97d3b9a2",
        "user": userDummyData,
        "room": roomsDummyData[6],
        "hotel": roomsDummyData[6].hotel,
        "checkInDate": "2025-07-04T00:00:00.000Z",
        "checkOutDate": "2025-07-07T00:00:00.000Z",
        "totalPrice": 16497,
        "guests": 3,
        "status": "confirmed",
        "paymentMethod": "Pay At Hotel",
        "isPaid": false,
        "createdAt": "2025-06-01T09:00:00.000Z",
        "updatedAt": "2025-06-01T09:00:00.000Z",
        "__v": 0
    }
]

// Dashboard Dummy Data
export const dashboardDummyData = {
    "totalBookings": 5,
    "totalRevenue": 28789,
    "bookings": userBookingsDummyData
}

// --------- SVG code for Book Icon------
/* 
const BookIcon = ()=>(
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
</svg>
)

*/