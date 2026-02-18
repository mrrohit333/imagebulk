import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

export const createZipFile = async (filePaths: string[], keyword: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            // Create downloads directory if it doesn't exist
            const downloadsDir = path.join(__dirname, '../../downloads');
            if (!fs.existsSync(downloadsDir)) {
                fs.mkdirSync(downloadsDir, { recursive: true });
            }

            const zipFilename = `${keyword}_${Date.now()}.zip`;
            const zipPath = path.join(downloadsDir, zipFilename);
            const output = fs.createWriteStream(zipPath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                // Clean up temp files
                filePaths.forEach((filePath) => {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                });
                resolve(zipPath);
            });

            archive.on('error', (err) => {
                reject(err);
            });

            archive.pipe(output);

            // Add files to archive
            filePaths.forEach((filePath) => {
                const filename = path.basename(filePath);
                archive.file(filePath, { name: filename });
            });

            archive.finalize();
        } catch (error) {
            reject(error);
        }
    });
};

export const cleanupFile = (filePath: string): void => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error('Error cleaning up file:', error);
    }
};
