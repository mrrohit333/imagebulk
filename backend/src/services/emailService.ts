import nodemailer from 'nodemailer';

// ✅ Create transporter ONCE (not on every request)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false, // helps avoid SSL issues on Render
    },
});

// ✅ Verify connection once on startup
transporter.verify()
    .then(() => console.log("SMTP Ready ✅"))
    .catch((err) => console.error("SMTP Error ❌:", err));

export const sendVerificationEmail = async (email: string, otp: string): Promise<void> => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"ImageBulk" <mrproducts.pvtltd@gmail.com>',
            to: email,
            subject: '🔐 Verify Your ImageBulk Account',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>ImageBulk Email Verification</h2>
                    <p>Your OTP is:</p>
                    <h1 style="letter-spacing: 5px;">${otp}</h1>
                    <p>This OTP is valid for 10 minutes.</p>
                </div>
            `,
        });

        console.log("Email sent ✅:", info.messageId);

    } catch (error) {
        console.error("Email failed ❌:", error);
        throw new Error("Email sending failed");
    }
};