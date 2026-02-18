import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    amount: number;
    creditsAdded: number;
    status: 'pending' | 'success' | 'failed';
    createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        razorpayOrderId: {
            type: String,
            required: true,
        },
        razorpayPaymentId: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        creditsAdded: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'success', 'failed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
