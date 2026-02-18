import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/database';
import { apiLimiter } from './middleware/rateLimiter';

// Import routes
import authRoutes from './routes/auth';
import downloadRoutes from './routes/downloads';
import paymentRoutes from './routes/payments';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (downloads)
app.use('/downloads', express.static(path.join(__dirname, '../downloads')));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/payments', paymentRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Bulk Image Downloader API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            downloads: '/api/downloads',
            payments: '/api/payments',
        },
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start listening
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
