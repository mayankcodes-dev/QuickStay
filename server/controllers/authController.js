import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { ok, fail } from '../utils/respond.js';

const JWT_SECRET       = process.env.JWT_SECRET;
const JWT_EXPIRES      = '7d';
const PEPPER           = process.env.PASSWORD_PEPPER;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// ─── Helpers ──────────────────────────────────────────────────
const signToken      = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
const formatUser     = (u) => ({ _id: u._id, username: u.username, email: u.email, role: u.role, image: u.image });
const pepperPassword = (raw) => raw + PEPPER;

// ─── Google find-or-create ────────────────────────────────────
// If user exists → log them in. If not → create account and log in.
const _findOrCreateGoogleUser = async ({ email, name, picture, googleId }) => {
    const emailLower = email.toLowerCase();

    // Check if user already exists
    let user = await User.findOne({ email: emailLower });

    if (user) {
        // User exists — update googleId/picture if needed and return
        if (!user.googleId) {
            user.googleId = googleId;
            if (!user.image && picture) user.image = picture;
            await user.save();
        }
        return user;
    }

    // User doesn't exist — create a new account
    user = await User.create({
        username: name || emailLower.split('@')[0],
        email:    emailLower,
        password: await bcrypt.hash(`google_oauth_${googleId}_${PEPPER}`, 10),
        image:    picture || '',
        googleId,
    });

    return user;
};

// ─── POST /api/auth/register ──────────────────────────────────
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username?.trim() || !email?.trim() || !password)
            return fail(res, 'All fields required');

        if (password.length < 8)
            return fail(res, 'Password must be at least 8 characters');

        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) return fail(res, 'Email already registered', 409);

        const hashed = await bcrypt.hash(pepperPassword(password), 12);
        const user   = await User.create({
            username: username.trim(),
            email:    email.toLowerCase().trim(),
            password: hashed,
        });

        res.status(201).json({ success: true, token: signToken(user._id), user: formatUser(user) });
    } catch (err) {
        console.error('Register error:', err.message);
        fail(res, 'Registration failed', 500);
    }
};

// ─── POST /api/auth/login ─────────────────────────────────────
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email?.trim() || !password)
            return fail(res, 'Email and password required');

        const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

        if (!user || !user.password)
            return fail(res, 'Invalid email or password', 401);

        const valid = await bcrypt.compare(pepperPassword(password), user.password);
        if (!valid) return fail(res, 'Invalid email or password', 401);

        ok(res, { token: signToken(user._id), user: formatUser(user) });
    } catch (err) {
        console.error('Login error:', err.message);
        fail(res, 'Login failed', 500);
    }
};

// ─── POST /api/auth/google ────────────────────────────────────
// Frontend sends a Google ID token; we verify it and issue our JWT
export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) return fail(res, 'Google credential required');

        const ticket  = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        if (!email) return fail(res, 'Google account has no email');

        const user = await _findOrCreateGoogleUser({ email, name, picture, googleId });
        ok(res, { token: signToken(user._id), user: formatUser(user) });
    } catch (err) {
        console.error('Google auth error:', err.message);
        fail(res, 'Google authentication failed', 401);
    }
};

// ─── POST /api/auth/google/access ────────────────────────────
// Implicit flow: frontend sends Google userinfo (via access token)
export const googleAccess = async (req, res) => {
    try {
        const { googleId, email, name, picture } = req.body;
        if (!email || !googleId) return fail(res, 'Google account data required');

        const user = await _findOrCreateGoogleUser({ email, name, picture, googleId });
        ok(res, { token: signToken(user._id), user: formatUser(user) });
    } catch (err) {
        console.error('Google access error:', err.message);
        fail(res, 'Google sign-in failed', 500);
    }
};

// ─── GET /api/auth/me (protected) ────────────────────────────
export const getMe = async (req, res) => {
    try {
        ok(res, { user: { ...formatUser(req.user), recentSearchedCities: req.user.recentSearchedCities } });
    } catch (err) {
        fail(res, err.message, 500);
    }
};
