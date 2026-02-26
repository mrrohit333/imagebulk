import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import OTP from '../models/OTP';

// Utility to generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            res.status(400).json({ error: 'Please provide a valid email address.' });
            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Rate Limiting: Check if an OTP was requested in the last 60 seconds
        const existingOTP = await OTP.findOne({ email: normalizedEmail });
        if (existingOTP) {
            const timeSinceLastRequest = new Date().getTime() - existingOTP.updatedAt.getTime();
            if (timeSinceLastRequest < 60000) { // 60 seconds
                const remainingSeconds = Math.ceil((60000 - timeSinceLastRequest) / 1000);
                res.status(429).json({ error: `Please wait ${remainingSeconds} seconds before requesting a new OTP.` });
                return;
            }
        }

        const otp = generateOTP();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

        // Replace old OTP if exists using upsert
        await OTP.findOneAndUpdate(
            { email: normalizedEmail },
            { otpHash, expiresAt },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send Email using Nodemailer with Brevo SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM || '"ImageBulk" <noreply@imagebulk.com>',
            to: normalizedEmail,
            subject: 'Your ImageBulk Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
                    <h2 style="color: #333; text-align: center;">Verify Your Identity</h2>
                    <p style="color: #555; font-size: 16px;">Hello,</p>
                    <p style="color: #555; font-size: 16px;">Here is your One-Time Password (OTP) to proceed. This code is valid for <strong>10 minutes</strong>.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="font-size: 32px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 8px; letter-spacing: 5px; color: #000;">${otp}</span>
                    </div>
                    <p style="color: #777; font-size: 14px; text-align: center;">If you didn't request this, please ignore this email safely.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent successfully to your email.' });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ error: 'Failed to send OTP email. Please try again later.' });
    }
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({ error: 'Email and OTP are required.' });
            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if OTP exists
        const otpRecord = await OTP.findOne({ email: normalizedEmail });

        if (!otpRecord) {
            res.status(404).json({ error: 'OTP request not found or has expired.' });
            return;
        }

        // Check if OTP is expired (secondary check, though DB TTL mostly handles this)
        if (new Date() > otpRecord.expiresAt) {
            await OTP.deleteOne({ email: normalizedEmail });
            res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
            return;
        }

        // Check if OTP matches
        const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

        if (!isValid) {
            res.status(400).json({ error: 'Invalid OTP. Please try again.' });
            return;
        }

        // Valid OTP: Delete record and return success
        await OTP.deleteOne({ email: normalizedEmail });

        res.status(200).json({ message: 'OTP verified successfully.' });

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ error: 'Failed to verify OTP. Please try again later.' });
    }
};
