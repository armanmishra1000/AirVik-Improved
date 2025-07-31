import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { userProfileController } from '../controllers/profile/user-profile.controller';
import { verifyAccessToken } from '../middleware/auth.middleware';

const router = Router();

// Rate limiting configuration for profile endpoints
const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes per IP
  message: {
    success: false,
    error: 'Too many profile requests. Please try again later.',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const updateProfileLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 10 update requests per 5 minutes per IP
  message: {
    success: false,
    error: 'Too many profile update attempts. Please try again later.',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Profile routes - all require authentication

/**
 * @route   GET /api/v1/profile/view
 * @desc    View user profile information
 * @access  Private (requires authentication)
 */
router.get('/view', 
  profileLimiter,
  verifyAccessToken, 
  userProfileController.viewProfile
);

/**
 * @route   PUT /api/v1/profile/update
 * @desc    Update user profile information
 * @access  Private (requires authentication)
 */
router.put('/update', 
  updateProfileLimiter,
  verifyAccessToken, 
  userProfileController.updateProfile
);

export default router; 