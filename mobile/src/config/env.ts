// ─────────────────────────────────────────────────────────────
// Environment configuration
// ─────────────────────────────────────────────────────────────

const __DEV_MODE__ = __DEV__;

const DEV_API_URL = 'http://10.0.2.2:5000';
const PRODUCTION_API_URL = 'https://imagebulk.onrender.com';

export const Config = {
  API_BASE_URL: __DEV_MODE__ ? DEV_API_URL : PRODUCTION_API_URL,
  // Replace with your live Razorpay Key ID for production payments
  RAZORPAY_KEY_ID: 'rzp_test_xxxxxxxxxx',
  APP_NAME: 'ImageBulk',
  FREE_CREDITS: 20,
};
