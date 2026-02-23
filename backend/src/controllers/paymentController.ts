import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { createOrder, verifyPaymentSignature } from '../services/razorpayService';

// Pricing plans
const PRICING = {
    Basic: { price: 29, credits: 500 },
    Pro: { price: 49, credits: 1000 },
};

export const createOrderController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { plan } = req.body;
        const userId = req.user?.userId;

        if (!plan || !['Basic', 'Pro'].includes(plan)) {
            res.status(400).json({ error: 'Invalid plan selected' });
            return;
        }

        const planDetails = PRICING[plan as keyof typeof PRICING];

        // Create Razorpay order
        const order = await createOrder(planDetails.price, 'INR');

        // Create transaction record
        await Transaction.create({
            userId,
            razorpayOrderId: order.orderId,
            amount: planDetails.price,
            creditsAdded: planDetails.credits,
            status: 'pending',
        });

        res.json({
            orderId: order.orderId,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error: any) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Failed to create payment order' });
    }
};

export const verifyPaymentController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const userId = req.user?.userId;

        // Verify signature
        const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (!isValid) {
            res.status(400).json({ error: 'Invalid payment signature' });
            return;
        }

        // Find transaction
        const transaction = await Transaction.findOne({ razorpayOrderId });
        if (!transaction) {
            res.status(404).json({ error: 'Transaction not found' });
            return;
        }

        // Update transaction
        transaction.razorpayPaymentId = razorpayPaymentId;
        transaction.status = 'success';
        await transaction.save();

        // Add credits to user
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        user.credits += transaction.creditsAdded;
        await user.save();

        res.json({
            message: 'Payment verified successfully',
            creditsAdded: transaction.creditsAdded,
            totalCredits: user.credits,
        });
    } catch (error: any) {
        console.error('Verify payment error:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
};
