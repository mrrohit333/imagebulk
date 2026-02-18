export interface User {
    id: string;
    email: string;
    credits: number;
    plan: 'Free' | 'Basic' | 'Pro';
    createdAt: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface DownloadLog {
    _id: string;
    userId: string;
    keyword: string;
    count: number;
    timestamp: string;
}

export interface Transaction {
    _id: string;
    userId: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    amount: number;
    creditsAdded: number;
    status: 'pending' | 'success' | 'failed';
    createdAt: string;
}

export interface RazorpayOrderResponse {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
}

export interface DownloadResponse {
    message: string;
}

export interface HistoryResponse {
    history: DownloadLog[];
}
