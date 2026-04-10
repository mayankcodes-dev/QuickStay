## QuickStay

QuickStay is a full-stack hotel booking web app with two primary experiences:

- Traveler flow: search rooms, filter by destination/type/price, check availability, book rooms, and pay with Stripe.
- Hotel owner flow: register a hotel, add room listings with images, toggle room availability, and track bookings/revenue from a dashboard.

The project is split into:

- Frontend: React + Vite + Tailwind CSS + Clerk auth
- Backend: Node.js + Express + MongoDB + Clerk + Stripe + Cloudinary + Nodemailer

## Core Features

- User authentication with Clerk.
- Automatic user creation/sync from Clerk webhook events.
- Room listing and filtering by:
	- Destination (city)
	- Room type
	- Price range
	- Sort order (price low/high, newest)
- Room details page with:
	- Image gallery
	- Amenities
	- Availability check by date range
- Booking creation with nights-based total calculation.
- Booking confirmation email via SMTP.
- My Bookings page with payment status and Stripe checkout.
- Stripe webhook handling for paid bookings.
- Hotel owner panel:
	- Hotel registration
	- Add room (multi-image upload to Cloudinary)
	- Toggle room availability
	- Dashboard metrics (total bookings and total revenue)

## Monorepo Structure

```
hotel_booking/
	client/      # React frontend
	server/      # Express API backend
	package.json # Root scripts (mostly for deployment convenience)
```

## Tech Stack

Frontend:

- React 19
- React Router
- Tailwind CSS v4
- Clerk React SDK
- Axios
- react-hot-toast

Backend:

- Express 5
- Mongoose
- Clerk Express SDK
- Stripe
- Cloudinary
- Multer
- Nodemailer
- Svix (Clerk webhook verification)

## Environment Variables

Create separate env files for client and server.

### Client env (`client/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:3000
VITE_CURRENCY=$
```

### Server env (`server/.env`)

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string

# Clerk
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP (Brevo in current config)
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SENDER_EMAIL=your_sender_email

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Local Development

Install dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

Run backend:

```bash
cd server
npm run server
```

Run frontend (new terminal):

```bash
cd client
npm run dev
```

App URLs (default):

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## API Overview

Base URL: `/api`

Auth note:

- Protected routes require Clerk Bearer token in `Authorization` header.

### User

- `GET /user` - Get current user role and recent searched cities (protected)
- `POST /user/store-recent-search` - Save a recent destination city (protected)

### Hotels

- `POST /hotels` - Register current user as hotel owner and create hotel profile (protected)

### Rooms

- `GET /rooms` - Get all available rooms
- `POST /rooms` - Create room with image upload (protected, owner)
- `GET /rooms/owner` - Get rooms for current owner (protected)
- `POST /rooms/toggle-availability` - Toggle room availability (protected)

### Bookings

- `POST /bookings/check-availability` - Check room availability for date range
- `POST /bookings/book` - Create booking (protected)
- `GET /bookings/user` - Get current user bookings (protected)
- `GET /bookings/hotel` - Get owner dashboard bookings and metrics (protected)
- `POST /bookings/stripe-payment` - Create Stripe checkout session (protected)
- `POST /bookings/verify-payment` - Verify Stripe payment and update booking status

### Webhooks

- `POST /clerk` - Clerk user lifecycle webhook
- `POST /stripe` - Stripe webhook event handler

## Data Models

### User

- `_id` (Clerk user id)
- `username`, `email`, `image`
- `role`: `user` or `hotelOwner`
- `recentSearchedCities` (up to last 3 maintained by API logic)

### Hotel

- `name`, `address`, `contact`, `city`
- `owner` (User ref)

### Room

- `hotel` (Hotel ref)
- `roomType`, `pricePerNight`, `amenities`
- `images[]`
- `isAvailable`

### Booking

- `user`, `room`, `hotel`
- `checkInDate`, `checkOutDate`, `guests`
- `totalPrice`
- `status`: `pending | confirmed | cancelled`
- `paymentMethod`
- `isPaid`

## Booking and Payment Flow

1. User selects room and dates.
2. Frontend calls availability API.
3. If available, frontend creates booking (`pay at hotel` initially).
4. User can open Stripe checkout from My Bookings.
5. Stripe webhook (and optional verify endpoint) updates booking to paid.
6. Owner dashboard reflects updated revenue and payment status.

## Deployment Notes

This repo includes Vercel config files:

- Root `vercel.json` for frontend static build routing
- `client/vercel.json` for SPA rewrite handling
- `server/vercel.json` for Node API deployment

Typical production setup is deploying frontend and backend as separate Vercel projects, then setting `VITE_BACKEND_URL` to the deployed backend URL.

## Current Scripts

Root:

- `npm run start` -> starts backend (`node server/server.js`)

Client:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

Server:

- `npm run server` (nodemon)
- `npm run start`

## Notes

- The frontend currently includes some static marketing sections and dummy asset data for presentation.
- Owner access is role-driven (`hotelOwner`) and assigned after hotel registration.
- Room image uploads are stored in Cloudinary; database stores secure URLs.

