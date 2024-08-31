import mongoose from "mongoose";

export const connecteDB=async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);

    } catch (error) {
        console.log('Error in connecting to mongodb',error.message);
        process.exit(1);
    }
}