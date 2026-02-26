import axios from 'axios';

export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
    const apiKey = process.env.MAILERSEND_API_KEY;

    if (!apiKey) {
        console.error('[EMAIL] MAILERSEND_API_KEY not set. Skipping email.');
        console.log(`[DEV] OTP for ${email}: ${otp}`);
        return;
    }

    const response = await axios.post(
        'https://api.mailersend.com/v1/email',
        {
            from: {
                email: process.env.EMAIL_FROM_ADDRESS || 'noreply@test-3m5jgroedrzgdpyo.mlsender.net',
                name: process.env.EMAIL_FROM_NAME || 'ImageBulk',
            },
            to: [{ email }],
            subject: '🔐 Verify Your ImageBulk Account',
            html: `
                <div style="font-family:Arial,sans-serif;max-width:480px;margin:40px auto;background:#15151f;border-radius:16px;overflow:hidden;">
                    <div style="background:linear-gradient(135deg,#00ff9d,#00d9ff);padding:24px;text-align:center;">
                        <h1 style="margin:0;color:#0a0a0f;font-size:24px;font-weight:900;">📷 ImageBulk</h1>
                    </div>
                    <div style="padding:40px;text-align:center;">
                        <h2 style="color:#ffffff;margin:0 0 8px 0;">Verification Code</h2>
                        <p style="color:#a0aec0;margin:0 0 32px 0;">Your code expires in <strong style="color:#00ff9d;">10 minutes</strong>.</p>
                        <div style="background:#0a0a0f;border:2px solid #00ff9d;border-radius:12px;padding:24px;margin-bottom:32px;">
                            <span style="font-size:48px;font-weight:900;letter-spacing:16px;color:#00ff9d;">${otp}</span>
                        </div>
                        <p style="color:#718096;font-size:13px;">If you didn't create an account, ignore this email.</p>
                    </div>
                </div>
            `,
        },
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );

    console.log('Email sent ✅ Status:', response.status);
};