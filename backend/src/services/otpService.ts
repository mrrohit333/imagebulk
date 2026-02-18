import axios from 'axios';

// In-memory OTP store: email → { otp, expires }
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
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@imagebulk.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'ImageBulk';

    const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
            sender: { name: senderName, email: senderEmail },
            to: [{ email }],
            subject: '🔐 Your ImageBulk Verification OTP',
            htmlContent: `
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
        },
        {
            headers: {
                'api-key': apiKey,
                'Content-Type': 'application/json',
            },
        }
    );

    if (response.status !== 201) {
        throw new Error(`Brevo API error: ${response.statusText}`);
    }
};
