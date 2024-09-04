import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct } from '../controllers/product.controller.js';
import { adminRoute, protectRoute } from '../../middleware/auth.middleware.js';


const router = express.Router();




export default router;