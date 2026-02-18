import { Request, Response } from 'express';
import { Feedback } from '../models/Feedback';
import { Resend } from 'resend';

export const submitContact = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            res.status(400).json({ error: 'Name, email, and message are required' });
            return;
        }

        // 1. Save to MongoDB
        await Feedback.create({ name, email, message });

        // 2. Try to email the owner (best-effort — won't fail the request if email fails)
        try {
            const resendKey = process.env.RESEND_API_KEY;
            const ownerEmail = process.env.OWNER_EMAIL || 'mrproducts.pvtltd@gmail.com';

            if (resendKey) {
                const resend = new Resend(resendKey);
                await resend.emails.send({
                    from: 'ImageBulk Feedback <onboarding@resend.dev>',
                    to: ownerEmail,
                    subject: `📬 New Feedback from ${name}`,
                    html: `
                        <div style="font-family:Arial,sans-serif;max-width:500px;margin:0 auto;background:#15151f;border-radius:12px;padding:32px;border:1px solid rgba(0,255,157,0.2);">
                            <h2 style="color:#00ff9d;margin:0 0 20px 0;">📬 New Contact Form Submission</h2>
                            <table style="width:100%;border-collapse:collapse;">
                                <tr><td style="color:#a0aec0;padding:8px 0;width:80px;">Name</td><td style="color:#fff;font-weight:bold;">${name}</td></tr>
                                <tr><td style="color:#a0aec0;padding:8px 0;">Email</td><td style="color:#00d9ff;"><a href="mailto:${email}" style="color:#00d9ff;">${email}</a></td></tr>
                                <tr><td style="color:#a0aec0;padding:8px 0;vertical-align:top;">Message</td><td style="color:#fff;">${message.replace(/\n/g, '<br/>')}</td></tr>
                            </table>
                            <p style="color:#718096;font-size:12px;margin-top:24px;">Sent from ImageBulk contact form</p>
                        </div>
                    `,
                });
            }
        } catch (emailErr) {
            // Log but don't fail — feedback is already saved to DB
            console.error('Failed to email feedback notification:', emailErr);
        }

        res.status(201).json({ message: 'Feedback received. Thank you!' });
    } catch (error: any) {
        console.error('Contact submit error:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
};
