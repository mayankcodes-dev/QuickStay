import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'yoyo_jwt_secret_change_in_prod';

const protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer '))
            return res.json({ success: false, message: 'Not authenticated' });

        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return res.json({ success: false, message: 'User not found' });

        req.user = user;
        next();
    } catch (err) {
        return res.json({ success: false, message: 'Invalid or expired token' });
    }
};

// Support both: import protect from '...' AND import { protect } from '...'
export { protect };
export default protect;