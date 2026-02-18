import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { generateToken } from '../config/jwt';
import { AuthRequest } from '../middleware/auth';

// Direct registration: validate, create account, issue JWT immediately (no OTP)
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists with this email' });
            return;
        }

        // Hash password and create user with 20 free credits
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: email.toLowerCase(),
            passwordHash,
            credits: 20,
            plan: 'Free',
        });

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
        console.error('Register error:', error);
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
