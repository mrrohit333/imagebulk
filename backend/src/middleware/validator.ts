import { body, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
    body('email')
        .isEmail()
        .toLowerCase()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

export const loginValidation: ValidationChain[] = [
    body('email')
        .isEmail()
        .toLowerCase()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

export const downloadValidation: ValidationChain[] = [
    body('keyword')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Keyword must be between 1 and 50 characters'),
    body('count')
        .isInt({ min: 1, max: 100 })
        .withMessage('Count must be between 1 and 100'),
];
