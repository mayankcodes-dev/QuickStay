import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import bookingRouter from './routes/bookingRoutes.js';

const app = express();

// Connect cloudinary (doesn't need await)
connectCloudinary();

// CORS configuration
app.use(cors({
    origin: true,
    credentials: true
}));

// Middleware to ensure DB connection on every request (for serverless)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

//API to listen to clerk webhooks (must be before express.json() middleware)
app.post('/api/clerk', express.json({ type: 'application/json' }), clerkWebhooks);

//middelwares
app.use(express.json());
app.use(clerkMiddleware())


app.get('/', (req, res) => {
    res.send('API is working...');
})
app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);



const PORT = process.env.PORT || 3000;

// Only start listening if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`);
    })
}

// Export for Vercel serverless
export default app;