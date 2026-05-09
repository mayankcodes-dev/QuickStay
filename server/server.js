import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/db.js';
import mongoose from 'mongoose';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/userRoutes.js';
import hotelRouter from './routes/hotelRoutes.js';
import roomRouter from './routes/roomRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import bookingRouter from './routes/bookingRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();

connectCloudinary();

app.use(cors({ origin: true, credentials: true }));

// Webhook routes (must be before express.json())
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);
app.post('/api/clerk', express.json({ type: 'application/json' }), clerkWebhooks);

// Middlewares
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send('API is working...'));

// Health check endpoint — use this URL in UptimeRobot to keep the server warm
app.get('/api/health', async (req, res) => {
    try {
        const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
        const mongoStatus = dbState[mongoose.connection.readyState] || 'unknown';
        res.json({
            status: 'ok',
            db: mongoStatus,
            uptime: Math.floor(process.uptime()) + 's',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({ status: 'error', message: error.message });
    }
});

app.use('/api/user', userRouter);
app.use('/api/hotels', hotelRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        process.exit(1);
    }
};

startServer();

export default app;