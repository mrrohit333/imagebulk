import Razorpay from 'razorpay';
import crypto from 'crypto';

// Only initialize Razorpay if real credentials are provided
const hasRazorpayCredentials =
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_ID !== 'rzp_test_placeholder' &&
    process.env.RAZORPAY_KEY_SECRET &&
    process.env.RAZORPAY_KEY_SECRET !== 'placeholder_razorpay_secret';

let razorpay: any = null;

if (hasRazorpayCredentials) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });
    console.log('✅ Razorpay initialized');
} else {
    console.log('⚠️  Razorpay not initialized - using placeholder credentials');
}

export interface OrderData {
    orderId: string;
    amount: number;
    currency: string;
}

export const createOrder = async (amount: number, currency: string = 'INR'): Promise<OrderData> => {
    try {
        if (!razorpay) {
            throw new Error('Razorpay is not configured. Please add valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file');
        }

        const options = {
            amount: amount * 100, // Convert to paise (smallest currency unit)
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options) as any;

        return {
            orderId: order.id as string,
            amount: order.amount as number,
            currency: order.currency as string,
        };
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        throw new Error(error.message || 'Failed to create payment order');
    }
};

export const verifyPaymentSignature = (
    orderId: string,
    paymentId: string,
    signature: string
): boolean => {
    try {
        const body = orderId + '|' + paymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
            .update(body)
            .digest('hex');

        return expectedSignature === signature;
    } catch (error) {
        console.error('Error verifying payment signature:', error);
        return false;
    }
};
