import jwt from 'jsonwebtoken';

export const JWT_SECRET: string = process.env.JWT_SECRET || '';
export const JWT_EXPIRE: string = process.env.JWT_EXPIRY || '7d';

export interface JWTPayload {
    userId: string;
    email: string;
}

export const generateToken = (payload: JWTPayload): string => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables. Please check your .env file.');
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE } as jwt.SignOptions);
};

export const verifyToken = (token: string): JWTPayload => {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
};
