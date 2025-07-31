import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { roleController } from '../controllers/role/role.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole, requireAnyRole } from '../middleware/permission.middleware.js';

const router = Router();

// Rate limiting configurations based on ROLE_API_RATE_LIMITS from contract
const assignRoleLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 role assignments per 15 minutes
  message: {
    success: false,
    error: 'Too many role assignment attempts, please try again later',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const updateRoleLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 role updates per 15 minutes
  message: {
    success: false,
    error: 'Too many role update attempts, please try again later',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const getUsersByRoleLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const validateAssignmentLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 validations per minute
  message: {
    success: false,
    error: 'Too many validation requests, please try again later',
    code: 'RATE_LIMITED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Role assignment routes

/**
 * @route   POST /api/v1/roles/assign
 * @desc    Assign role to user
 * @access  Protected - Admin only
 * @middleware requireAuth(), requireRole("admin")
 */
router.post('/assign', 
  assignRoleLimiter,
  requireAuth(),
  requireRole('admin'),
  roleController.assignRole
);

/**
 * @route   GET /api/v1/roles/user/:userId/role
 * @desc    Get user's role
 * @access  Protected - Admin and Staff
 * @middleware requireAuth(), requireAnyRole(["admin", "staff"])
 */
router.get('/user/:userId/role',
  requireAuth(),
  requireAnyRole(['admin', 'staff']),
  roleController.getUserRole
);

/**
 * @route   PUT /api/v1/roles/update
 * @desc    Update user's role
 * @access  Protected - Admin only
 * @middleware requireAuth(), requireRole("admin")
 */
router.put('/update',
  updateRoleLimiter,
  requireAuth(),
  requireRole('admin'),
  roleController.updateRole
);

/**
 * @route   GET /api/v1/roles/users-by-role
 * @desc    Get users by role with pagination
 * @access  Protected - Admin and Staff
 * @middleware requireAuth(), requireAnyRole(["admin", "staff"])
 */
router.get('/users-by-role',
  getUsersByRoleLimiter,
  requireAuth(),
  requireAnyRole(['admin', 'staff']),
  roleController.getUsersByRole
);

/**
 * @route   POST /api/v1/roles/validate-assignment
 * @desc    Validate if role assignment is allowed
 * @access  Protected - Admin and Staff
 * @middleware requireAuth(), requireAnyRole(["admin", "staff"])
 */
router.post('/validate-assignment',
  validateAssignmentLimiter,
  requireAuth(),
  requireAnyRole(['admin', 'staff']),
  roleController.validateAssignment
);

export default router; 