import express from 'express';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import { connecteDB } from './lib/db.js';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT=process.env.PORT || 5000

app.use(express.json());
app.use(cookieParser());

//auth
app.use('/api/auth',authRoutes);
app.use('/api/product',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/coupons',couponRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    connecteDB();
})