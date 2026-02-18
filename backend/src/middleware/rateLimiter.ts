import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiter for authentication routes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per 15 min per IP
    message: { error: 'Too many login attempts. Please wait 15 minutes and try again.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Download rate limiter
export const downloadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 downloads per minute
    message: 'Too many download requests, please slow down.',
    standardHeaders: true,
    legacyHeaders: false,
});
