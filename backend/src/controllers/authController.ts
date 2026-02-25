import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { generateToken } from '../config/jwt';
import { AuthRequest } from '../middleware/auth';
import { sendVerificationEmail } from '../services/emailService';

// Function to generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({ error: 'User already exists with this email' });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const user = await User.create({
            email: email.toLowerCase(),
            passwordHash,
            credits: 20,
            plan: 'Free',
            isVerified: false,
            verificationOTP: otp,
            otpExpires: otpExpires,
        });

        // Send verification email
        try {
            await sendVerificationEmail(user.email, otp);
        } catch (mailError) {
            console.error('Failed to send verification email:', mailError);
            // We still created the user, they can request a resend later
        }

        res.status(201).json({
            message: 'Registration successful. Please check your email for the verification code.',
            email: user.email,
        });
    } catch (error: any) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.isVerified) {
            res.status(400).json({ error: 'Account is already verified' });
            return;
        }

        if (user.verificationOTP !== otp || !user.otpExpires || user.otpExpires < new Date()) {
            res.status(400).json({ error: 'Invalid or expired verification code' });
            return;
        }

        // Mark as verified
        user.isVerified = true;
        user.verificationOTP = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Generate JWT token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email,
        });

        res.json({
            message: 'Email verified successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                credits: user.credits,
                plan: user.plan,
            },
        });
    } catch (error: any) {
        console.error('Verify error:', error);
        res.status(500).json({ error: 'Server error during verification' });
    }
};

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.isVerified) {
            res.status(400).json({ error: 'Account is already verified' });
            return;
        }

        const otp = generateOTP();
        user.verificationOTP = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        await sendVerificationEmail(user.email, otp);

        res.json({ message: 'Verification code resent. Please check your email.' });
    } catch (error: any) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ error: 'Server error during resend' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        if (!user.isVerified) {
            res.status(403).json({
                error: 'Account not verified. Please verify your email first.',
                notVerified: true
            });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            res.status(401).json({ error: 'Invalid credentials' });
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
