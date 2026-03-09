import api from './api';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
export interface CreateOrderPayload {
    plan: string;  // backend expects 'plan' field: 'Basic' | 'Pro'
}

export interface RazorpayOrder {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
}

export interface VerifyPaymentPayload {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export interface VerifyPaymentResponse {
    message: string;
    creditsAdded: number;
    totalCredits: number;
}

// ─────────────────────────────────────────────────────────────
// Payment API service
// ─────────────────────────────────────────────────────────────
export const PaymentService = {
    /**
     * Create a Razorpay order on the backend.
     * The returned order is used to render the Razorpay checkout page.
     */
    createOrder: async (payload: CreateOrderPayload): Promise<RazorpayOrder> => {
        const { data } = await api.post<RazorpayOrder>(
            '/api/payments/razorpay/create-order',
            payload,
        );
        return data;
    },

    /**
     * Verify payment signature after checkout completes.
     * Backend validates the HMAC signature and credits the user.
     */
    verifyPayment: async (
        payload: VerifyPaymentPayload,
    ): Promise<VerifyPaymentResponse> => {
        const { data } = await api.post<VerifyPaymentResponse>(
            '/api/payments/razorpay/verify',
            payload,
        );
        return data;
    },
};
