# 🚀 ImageBulk - Bulk Image Downloader SaaS

A production-ready SaaS platform that allows users to search and download high-quality images in bulk from Pexels using a credit-based system with Razorpay payment integration.

## 📋 Features

- ✅ **User Authentication** - JWT-based registration and login
- ✅ **Credit System** - 20 free credits on signup, pay-as-you-go model
- ✅ **Bulk Image Download** - Download 10-100 images at once
- ✅ **Automatic ZIP** - All images compressed into a single ZIP file
- ✅ **Razorpay Integration** - Secure payment processing
- ✅ **Download History** - Track all past downloads
- ✅ **Responsive UI** - Beautiful, modern design with Tailwind CSS
- ✅ **Rate Limiting** - API protection against abuse
- ✅ **Input Validation** - Secure form handling

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **Authentication**: JWT + bcrypt
- **Payment**: Razorpay
- **Image API**: Pexels API
- **Security**: Rate limiting, input validation

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **UI Components**: Custom React components

## 📁 Project Structure

```
SaaS1.0/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── config/            # Database & JWT config
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API endpoints
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, validation, rate limiting
│   │   ├── services/          # Pexels, ZIP, Razorpay
│   │   └── server.ts          # App entry point
│   ├── .env.example           # Environment template
│   └── package.json
│
├── frontend/                   # Next.js application
│   ├── app/                   # Pages & layouts
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── pricing/
│   │   └── layout.tsx
│   ├── components/            # Reusable components
│   ├── lib/                   # API client & utilities
│   ├── types/                 # TypeScript types
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

1. **MongoDB Atlas Account** - [Create free account](https://www.mongodb.com/cloud/atlas)
2. **Pexels API Key** - [Get free API key](https://www.pexels.com/api/)
3. **Razorpay Account** - [Sign up](https://razorpay.com/)
4. **Node.js** - v18 or higher

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=your-super-secret-jwt-key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
PEXELS_API_KEY=your-pexels-api-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Downloads
- `POST /api/downloads` - Download images (protected)
- `GET /api/downloads/history` - Get download history (protected)

### Payments
- `POST /api/payments/razorpay/create-order` - Create payment order (protected)
- `POST /api/payments/razorpay/verify` - Verify payment (protected)

## 💳 Pricing Plans

| Plan | Price | Credits |
|------|-------|---------|
| Free | ₹0 | 20 |
| Basic | ₹199 | 500 |
| Pro | ₹499 | 2000 |

*1 image = 1 credit*

## 🔐 Environment Variables

### Backend
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay key secret
- `PEXELS_API_KEY` - Pexels API key
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

## 🧪 Testing

### Manual Testing Flow

1. **Registration**:
   - Go to `/register`
   - Create account with email and password
   - Verify 20 free credits are assigned

2. **Image Download**:
   - Go to `/dashboard`
   - Enter keyword (e.g., "sunset")
   - Select count (10 images)
   - Click "Download Images"
   - Verify ZIP file downloads
   - Check credits are deducted

3. **Payment Flow**:
   - Go to `/pricing`
   - Click "Buy Now" on Basic plan
   - Complete test payment with Razorpay
   - Verify credits are added

### Test Credentials (Razorpay Test Mode)

Use Razorpay test cards for payment testing:
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

## 🚢 Deployment

### Backend (Render/Railway)

1. Create new web service
2. Connect your repository
3. Set environment variables
4. Deploy

### Frontend (Vercel)

1. Import project to Vercel
2. Set `NEXT_PUBLIC_API_URL` to your backend URL
3. Deploy

### MongoDB Atlas

1. Create cluster
2. Create database user
3. Whitelist IP `0.0.0.0/0` (or specific IPs)
4. Copy connection string to `.env`

## 📊 Database Models

### User
```typescript
{
  email: string;
  passwordHash: string;
  credits: number;
  plan: 'Free' | 'Basic' | 'Pro';
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction
```typescript
{
  userId: ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  creditsAdded: number;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
}
```

### DownloadLog
```typescript
{
  userId: ObjectId;
  keyword: string;
  count: number;
  timestamp: Date;
}
```

## 🔒 Security Features

- ✅ JWT authentication with httpOnly tokens
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on all routes
- ✅ Input validation with express-validator
- ✅ CORS configuration
- ✅ Secure payment signature verification

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Verify all environment variables are set
- Ensure port 5000 is not in use

### Frontend build errors
- Run `npm install` to ensure dependencies are installed
- Check `.env.local` file exists
- Clear `.next` folder and rebuild

### Payment Integration
- Verify Razorpay keys are correct
- Check that you're using test mode keys for development
- Ensure webhook secret matches

### Image Download Fails
- Verify Pexels API key is valid
- Check API rate limits (200 requests/hour free tier)
- Ensure keyword returns results

## 🎯 Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] Subscription plans (recurring payments)
- [ ] Team accounts
- [ ] Admin dashboard
- [ ] Image filters (size, orientation, color)
- [ ] API access for B2B
- [ ] Download queue system
- [ ] CDN integration (AWS S3)
- [ ] Analytics dashboard

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Support

For support, email support@imagebulk.com or open an issue in the repository.

---

Built with ❤️ using Node.js, Express, Next.js, and Razorpay
