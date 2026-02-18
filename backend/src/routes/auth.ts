import { Router } from 'express';
import { register, verifyRegisterOTP, login, verifyLoginOTP, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { registerValidation, loginValidation } from '../middleware/validator';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, registerValidation, register);              // Step 1: validate, send OTP
router.post('/verify-register-otp', authLimiter, verifyRegisterOTP);             // Step 2: verify OTP, create account
router.post('/login', authLimiter, loginValidation, login);                       // Step 1: validate creds, send OTP
router.post('/verify-otp', authLimiter, verifyLoginOTP);                          // Step 2: verify OTP, issue JWT

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
