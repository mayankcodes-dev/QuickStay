import express    from 'express';
import rateLimit  from 'express-rate-limit';
import { aiChat, parseSearch, reviewSummary } from '../controllers/aiController.js';

// 30 messages/min per IP — prevent Groq credit abuse
const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { success: false, reply: 'Slow down! Too many messages. Please wait a moment.' },
});

// 20 NLP queries/min per IP
const searchLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: { success: false, message: 'Too many search requests.' },
});

const aiRouter = express.Router();

aiRouter.post('/chat',                     chatLimiter,   aiChat);
aiRouter.post('/parse-search',             searchLimiter, parseSearch);
aiRouter.get( '/review-summary/:hotelId',                 reviewSummary);

export default aiRouter;
