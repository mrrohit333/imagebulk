import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
    name: string;
    email: string;
    message: string;
    createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
