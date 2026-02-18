import { Response } from 'express';
import { validationResult } from 'express-validator';
import path from 'path';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { DownloadLog } from '../models/DownloadLog';
import { downloadImages } from '../services/imageService';
import { createZipFile } from '../services/zipService';

export const downloadImagesController = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { keyword, count } = req.body;
        const userId = req.user?.userId;

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Check if user has enough credits
        if (user.credits < count) {
            res.status(400).json({
                error: 'Insufficient credits',
                required: count,
                available: user.credits,
            });
            return;
        }

        // Download images from Pexels
        const images = await downloadImages(keyword, count);

        if (images.length === 0) {
            res.status(404).json({ error: 'No images found for this keyword' });
            return;
        }

        // Create ZIP file
        const filePaths = images.map((img) => img.filepath);
        const zipPath = await createZipFile(filePaths, keyword);

        // Deduct credits
        user.credits -= count;
        await user.save();

        // Log download
        await DownloadLog.create({
            userId: user._id,
            keyword,
            count,
        });

        // Send ZIP file
        const zipFilename = path.basename(zipPath);
        res.download(zipPath, zipFilename, (err) => {
            if (err) {
                console.error('Error sending file:', err);
            }
            // File will be cleaned up by a cleanup job or manually
        });
    } catch (error: any) {
        console.error('Download error:', error);
        res.status(500).json({ error: error.message || 'Failed to download images' });
    }
};

export const getDownloadHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        const history = await DownloadLog.find({ userId })
            .sort({ timestamp: -1 })
            .limit(50);

        res.json({ history });
    } catch (error: any) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to fetch download history' });
    }
};
