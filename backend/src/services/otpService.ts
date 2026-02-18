import { Resend } from 'resend';

// In-memory OTP store: email → { otp, expires }
// For production, replace with Redis
const otpStore = new Map<string, { otp: string; expires: number }>();

export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOTP = (email: string, otp: string): void => {
    otpStore.set(email.toLowerCase(), {
        otp,
        expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    });
};

export const verifyOTP = (email: string, otp: string): boolean => {
    const stored = otpStore.get(email.toLowerCase());
    if (!stored) return false;
    if (Date.now() > stored.expires) {
        otpStore.delete(email.toLowerCase());
        return false;
    }
    if (stored.otp !== otp.trim()) return false;
    otpStore.delete(email.toLowerCase()); // One-time use
    return true;
};

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
        from: 'ImageBulk <onboarding@resend.dev>',
        to: email,
        subject: '🔐 Your ImageBulk Verification OTP',
        html: `
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
                <div style="max-width:480px;margin:40px auto;background:#15151f;border-radius:16px;border:1px solid rgba(0,255,157,0.2);overflow:hidden;">
                    <div style="background:linear-gradient(135deg,#00ff9d,#00d9ff);padding:24px;text-align:center;">
                        <h1 style="margin:0;color:#0a0a0f;font-size:24px;font-weight:900;">📷 ImageBulk</h1>
                    </div>
                    <div style="padding:40px;text-align:center;">
                        <h2 style="color:#ffffff;margin:0 0 8px 0;font-size:20px;">Your Verification OTP</h2>
                        <p style="color:#a0aec0;margin:0 0 32px 0;">Use this code to complete your action. It expires in <strong style="color:#00ff9d;">5 minutes</strong>.</p>
                        <div style="background:#0a0a0f;border:2px solid #00ff9d;border-radius:12px;padding:24px;margin-bottom:32px;box-shadow:0 0 30px rgba(0,255,157,0.3);">
                            <span style="font-size:48px;font-weight:900;letter-spacing:16px;color:#00ff9d;">${otp}</span>
                        </div>
                        <p style="color:#718096;font-size:13px;margin:0;">If you didn't request this, please ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    });

    if (error) {
        throw new Error(`Resend error: ${error.message}`);
    }
};
