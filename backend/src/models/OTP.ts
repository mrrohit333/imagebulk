import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
    email: string;
    otpHash: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const OTPSchema = new Schema<IOTP>(
    {
        email: {
            type: String,
            required: true,
            unique: true, // Replaces old OTP if exists for the same email
            lowercase: true,
            trim: true
        },
        otpHash: {
            type: String,
            required: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
    },
    { timestamps: true }
);

// TTL index to automatically delete expired OTP documents from MongoDB
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOTP>('OTP', OTPSchema);
