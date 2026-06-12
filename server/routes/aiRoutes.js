import express from 'express';
import { aiChat } from '../controllers/aiController.js';
import rateLimit from 'express-rate-limit';

// Rate limit AI chat — 30 messages per minute per IP (prevent abuse)
const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { success: false, reply: "Slow down! Too many messages. Please wait a moment. 😊" },
});

const aiRouter = express.Router();

aiRouter.post('/chat', chatLimiter, aiChat);

export default aiRouter;
