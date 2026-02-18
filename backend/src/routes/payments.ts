import { Router } from 'express';
import { createOrderController, verifyPaymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All payment routes are protected
router.post('/razorpay/create-order', authenticate, createOrderController);
router.post('/razorpay/verify', authenticate, verifyPaymentController);

export default router;
