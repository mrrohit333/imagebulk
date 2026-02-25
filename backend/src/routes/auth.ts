import { Router } from 'express';
import { register, login, getMe, verifyEmail, resendOTP } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validator';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, registerValidation, register);
router.post('/verify-email', authLimiter, verifyEmail);
router.post('/resend-otp', authLimiter, resendOTP);
router.post('/login', authLimiter, loginValidation, login);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
