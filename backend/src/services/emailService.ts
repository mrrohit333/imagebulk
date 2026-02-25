import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ''), // Ensure no spaces
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 15000,
});

export const sendVerificationEmail = async (email: string, otp: string) => {
    const mailOptions = {
        from: `"ImageBulk" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: '🔐 Verify Your ImageBulk Account',
        html: `
            <!DOCTYPE html>
            <html>
            <body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
                <div style="max-width:480px;margin:40px auto;background:#15151f;border-radius:16px;border:1px solid rgba(0,255,157,0.2);overflow:hidden;">
                    <div style="background:linear-gradient(135deg,#00ff9d,#00d9ff);padding:24px;text-align:center;">
                        <h1 style="margin:0;color:#0a0a0f;font-size:24px;font-weight:900;">📷 ImageBulk</h1>
                    </div>
                    <div style="padding:40px;text-align:center;">
                        <h2 style="color:#ffffff;margin:0 0 8px 0;font-size:20px;">Verification Code</h2>
                        <p style="color:#a0aec0;margin:0 0 32px 0;">Welcome to ImageBulk! Please use the code below to verify your email address. It will expire in <strong style="color:#00ff9d;">10 minutes</strong>.</p>
                        <div style="background:#0a0a0f;border:2px solid #00ff9d;border-radius:12px;padding:24px;margin-bottom:32px;box-shadow:0 0 30px rgba(0,255,157,0.3);">
                            <span style="font-size:48px;font-weight:900;letter-spacing:16px;color:#00ff9d;">${otp}</span>
                        </div>
                        <p style="color:#718096;font-size:13px;margin:0;">If you didn't create an account, you can safely ignore this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};
