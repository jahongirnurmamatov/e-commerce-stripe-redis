import express from 'express';
import authRoutes from './routes/auth.route.js';
import { connecteDB } from './lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT=process.env.PORT || 5000

//auth
app.use('/api/auth',authRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connecteDB();
})