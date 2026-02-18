import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { pipeline } from 'stream';

const streamPipeline = promisify(pipeline);

const PEXELS_API_KEY = process.env.PEXELS_API_KEY as string;
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

export interface ImageResult {
    url: string;
    filepath: string;
}

export const downloadImages = async (keyword: string, count: number): Promise<ImageResult[]> => {
    try {
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Search for images on Pexels
        const response = await axios.get(PEXELS_API_URL, {
            headers: {
                Authorization: PEXELS_API_KEY,
            },
            params: {
                query: keyword,
                per_page: count,
            },
        });

        if (!response.data.photos || response.data.photos.length === 0) {
            throw new Error('No images found for this keyword');
        }

        const downloadedImages: ImageResult[] = [];

        // Download each image
        for (let i = 0; i < Math.min(count, response.data.photos.length); i++) {
            const photo = response.data.photos[i];
            const imageUrl = photo.src.original;
            const filename = `${keyword}_${i + 1}_${Date.now()}.jpg`;
            const filepath = path.join(tempDir, filename);

            // Download image
            const imageResponse = await axios.get(imageUrl, {
                responseType: 'stream',
            });

            await streamPipeline(imageResponse.data, fs.createWriteStream(filepath));

            downloadedImages.push({
                url: imageUrl,
                filepath,
            });
        }

        return downloadedImages;
    } catch (error: any) {
        console.error('Error downloading images:', error.message);
        throw new Error('Failed to download images from Pexels');
    }
};
