import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    credits: number;
    plan: 'Free' | 'Basic' | 'Pro';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        credits: {
            type: Number,
            default: 20, // Free credits on signup
        },
        plan: {
            type: String,
            enum: ['Free', 'Basic', 'Pro'],
            default: 'Free',
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model<IUser>('User', UserSchema);
