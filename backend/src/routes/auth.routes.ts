import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import userAuthController from '../../src/controllers/auth/user-auth.controller';

/**
 * Authentication Routes for User Registration and Email Verification
 * Handles routing for auth endpoints with rate limiting
 */
const router = Router();

/**
 * Rate limiter for registration
 * Limits to 5 requests per hour from the same IP
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour
  message: {
    success: false,
    error: 'Too many attempts',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter for email verification
 * Limits to 10 requests per hour from the same IP
 */
const verifyEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  message: {
    success: false,
    error: 'Too many verification attempts',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter for resending verification emails
 * Limits to 3 requests per hour from the same IP
 */
const resendVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per hour
  message: {
    success: false,
    error: 'Please wait before requesting another verification email',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerLimiter, userAuthController.registerUser);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify user email with token
 * @access  Public
 */
router.post('/verify-email', verifyEmailLimiter, userAuthController.verifyEmail);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend verification email
 * @access  Public
 */
router.post('/resend-verification', resendVerificationLimiter, userAuthController.resendVerification);

export default router;
