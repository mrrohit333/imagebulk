import { Router } from 'express';
import { submitContact } from '../controllers/contactController';
import { apiLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', apiLimiter, submitContact);

export default router;
