import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Using existing MongoDB connection');
        return;
    }
    
    try{
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
            isConnected = true;
        });
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err.message);
            isConnected = false;
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            isConnected = false;
        });
        
        // Important settings for serverless environments like Vercel
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            bufferCommands: false, // Disable mongoose buffering
        });
        
        isConnected = true;
    }catch(err){
        console.error('Error connecting to database:', err.message);
        console.error('Full error:', err);
        isConnected = false;
        throw err; // Re-throw to handle in calling code
    }
}

export default connectDB;