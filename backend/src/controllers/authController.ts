import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { generateToken } from '../config/jwt';
import { AuthRequest } from '../middleware/auth';
import { generateOTP, storeOTP, verifyOTP, sendOTPEmail } from '../services/otpService';

// Temporary store for pending registrations (email → hashed password)
// Cleared once OTP is verified and account is created
const pendingRegistrations = new Map<string, { passwordHash: string; expires: number }>();

// STEP 1: Validate inputs, send OTP to verify email ownership
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists with this email' });
            return;
        }

        // Hash password and store temporarily until OTP is verified
        const passwordHash = await bcrypt.hash(password, 10);
        pendingRegistrations.set(email.toLowerCase(), {
            passwordHash,
            expires: Date.now() + 10 * 60 * 1000, // 10 minutes
        });

        // Generate and send OTP
        const otp = generateOTP();
        storeOTP(email, otp);

        try {
            await sendOTPEmail(email, otp);
        } catch (emailError) {
            console.error('Failed to send OTP email:', emailError);
            res.status(500).json({ error: 'Failed to send OTP email. Please check Gmail configuration.' });
            return;
        }

        res.status(200).json({
            message: 'OTP sent to your email. Please verify to complete registration.',
            email,
            requiresOTP: true,
        });
    } catch (error: any) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// STEP 2: Verify OTP then create account
export const verifyRegisterOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({ error: 'Email and OTP are required' });
            return;
        }

        // Verify OTP
        const isValid = verifyOTP(email, otp);
        if (!isValid) {
            res.status(400).json({ error: 'Invalid or expired OTP. Please try again.' });
            return;
        }

        // Retrieve pending registration
        const pending = pendingRegistrations.get(email.toLowerCase());
        if (!pending || Date.now() > pending.expires) {
            pendingRegistrations.delete(email.toLowerCase());
            res.status(400).json({ error: 'Registration session expired. Please start again.' });
            return;
        }

        // Check again that user doesn't already exist (race condition guard)
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists with this email' });
            return;
        }

        // Create user with 20 free credits
        const user = await User.create({
            email: email.toLowerCase(),
            passwordHash: pending.passwordHash,
            credits: 20,
            plan: 'Free',
        });

        // Clean up pending registration
        pendingRegistrations.delete(email.toLowerCase());

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                credits: user.credits,
                plan: user.plan,
            },
        });
    } catch (error: any) {
        console.error('Register OTP verify error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// Direct login: validate credentials and issue JWT immediately (no OTP)
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password } = req.body;

        // Find user - case-insensitive search to handle any stored email casing
        const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate JWT token directly
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                credits: user.credits,
                plan: user.plan,
            },
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

// STEP 2 for login OTP (kept for reference but no longer used by login route)
export const verifyLoginOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({ error: 'Email and OTP are required' });
            return;
        }

        const isValid = verifyOTP(email, otp);
        if (!isValid) {
            res.status(400).json({ error: 'Invalid or expired OTP. Please try again.' });
            return;
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                credits: user.credits,
                plan: user.plan,
            },
        });
    } catch (error: any) {
        console.error('OTP verify error:', error);
        res.status(500).json({ error: 'Server error during OTP verification' });
    }
};


export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user?.userId).select('-passwordHash');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({
            id: user._id,
            email: user.email,
            credits: user.credits,
            plan: user.plan,
            createdAt: user.createdAt,
        });
    } catch (error: any) {
        console.error('Get me error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
