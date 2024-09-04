import express from 'express';
import { login, logout, refreshToken, signup } from '../controllers/auth.controller.js';

const router = express.Router();


router.post('/login',login);
router.post('/logout',logout);
router.post('/signup',signup);
router.post('/refresh-token',refreshToken);




export default router;