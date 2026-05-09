import mongoose from 'mongoose';

// Cache the connection across serverless invocations.
// In serverless environments (Vercel), each cold start re-imports modules
// but global/module-level variables persist across WARM invocations.
// This prevents creating a new connection on every single request.
let cached = global._mongooseConnection;

if (!cached) {
    cached = global._mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
    // If we already have a connection, reuse it (warm invocation)
    if (cached.conn) {
        return cached.conn;
    }

    // If a connection is already being established, wait for it
    // (prevents multiple parallel connections during cold start)
    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
        }).then((mongoose) => {
            console.log('MongoDB connected successfully');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        // Reset the promise so next request can retry
        cached.promise = null;
        throw err;
    }

    return cached.conn;
}

export default connectDB;