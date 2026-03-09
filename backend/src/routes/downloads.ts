import { Router } from 'express';
import { downloadImagesController, getDownloadHistory, deleteDownloadHistory } from '../controllers/downloadController';
import { authenticate } from '../middleware/auth';
import { downloadValidation } from '../middleware/validator';
import { downloadLimiter } from '../middleware/rateLimiter';

const router = Router();

// All download routes are protected
router.post('/', authenticate, downloadLimiter, downloadValidation, downloadImagesController);
router.get('/history', authenticate, getDownloadHistory);
router.delete('/history/:id', authenticate, deleteDownloadHistory);

export default router;
