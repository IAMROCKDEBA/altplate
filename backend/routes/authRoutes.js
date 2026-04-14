import express from 'express';
import { wardenLogin, staffLogin, logout, verifyToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/warden/login', loginLimiter, wardenLogin);
router.post('/staff/login', loginLimiter, staffLogin);
router.post('/logout', protect, logout);
router.get('/verify', protect, verifyToken);

export default router;
