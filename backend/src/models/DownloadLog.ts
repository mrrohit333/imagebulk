import mongoose, { Document, Schema } from 'mongoose';

export interface IDownloadLog extends Document {
    userId: mongoose.Types.ObjectId;
    keyword: string;
    count: number;
    timestamp: Date;
}

const DownloadLogSchema = new Schema<IDownloadLog>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    keyword: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export const DownloadLog = mongoose.model<IDownloadLog>('DownloadLog', DownloadLogSchema);
