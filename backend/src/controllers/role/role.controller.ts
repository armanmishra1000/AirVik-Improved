import { Request, Response } from 'express';
import Joi from 'joi';
import { roleService } from '../../services/role/role.service';
import { sendSuccess, sendError } from '../../utils/response.utils';

// Import types
export type UserRole = 'user' | 'staff' | 'admin';

// Validation schemas
const assignRoleSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'User ID is required',
      'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
    }),
  role: Joi.string()
    .valid('user', 'staff', 'admin')
    .required()
    .messages({
      'string.empty': 'Role is required',
      'any.only': 'Role must be one of: user, staff, admin',
    }),
  reason: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Reason must not exceed 500 characters',
    }),
});

const updateRoleSchema = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'User ID is required',
      'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
    }),
  newRole: Joi.string()
    .valid('user', 'staff', 'admin')
    .required()
    .messages({
      'string.empty': 'New role is required',
      'any.only': 'New role must be one of: user, staff, admin',
    }),
  reason: Joi.string()
    .max(500)
    .optional()
    .messages({
      'string.max': 'Reason must not exceed 500 characters',
    }),
});

const getUsersByRoleSchema = Joi.object({
  role: Joi.string()
    .valid('user', 'staff', 'admin')
    .optional()
    .messages({
      'any.only': 'Role must be one of: user, staff, admin',
    }),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100',
    }),
  sortBy: Joi.string()
    .valid('name', 'email', 'createdAt')
    .default('createdAt')
    .messages({
      'any.only': 'Sort field must be one of: name, email, createdAt',
    }),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc',
    }),
});

const validateAssignmentSchema = Joi.object({
  targetUserId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Target User ID is required',
      'string.pattern.base': 'Target User ID must be a valid MongoDB ObjectId',
    }),
  targetRole: Joi.string()
    .valid('user', 'staff', 'admin')
    .required()
    .messages({
      'string.empty': 'Target role is required',
      'any.only': 'Target role must be one of: user, staff, admin',
    }),
});

// Interface for authenticated request with user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified?: boolean;
    role?: UserRole;
  };
}

/**
 * Assign role to user
 * POST /api/v1/roles/assign
 */
export const assignRole = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    // Validate input
    const { error, value } = assignRoleSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Request validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Check if user is authenticated
    if (!req.user) {
      return sendError(
        res,
        'Authentication required',
        'UNAUTHORIZED',
        401
      );
    }

    // Prepare role data for service
    const roleData = {
      userId: value.userId,
      role: value.role as UserRole,
      assignedBy: req.user.id,
      reason: value.reason,
      ipAddress: req.ip
    };

    // Call service layer
    const result = await roleService.assignUserRole(roleData);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'USER_NOT_FOUND':
          statusCode = 404;
          break;
        case 'ROLE_ASSIGNMENT_DENIED':
        case 'SELF_ROLE_MODIFICATION':
          statusCode = 403;
          break;
        case 'ROLE_ALREADY_ASSIGNED':
          statusCode = 400;
          break;
        case 'INTERNAL_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Role assignment failed',
        result.code || 'INTERNAL_ERROR',
        statusCode
      );
    }

    // Return success response
    return sendSuccess(
      res,
      result.data,
      result.message || 'Role assigned successfully',
      200
    );

  } catch (error) {
    console.error('Role controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * Get user's role
 * GET /api/v1/roles/user/:userId/role
 */
export const getUserRole = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;

    // Validate userId parameter
    const userIdValidation = Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .validate(userId);

    if (userIdValidation.error) {
      return sendError(
        res,
        'User ID must be a valid MongoDB ObjectId',
        'VALIDATION_ERROR',
        400
      );
    }

    // Call service layer
    const result = await roleService.getUserRole(userId);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'USER_NOT_FOUND':
          statusCode = 404;
          break;
        case 'INTERNAL_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Failed to get user role',
        result.code || 'INTERNAL_ERROR',
        statusCode
      );
    }

    // Return success response
    return sendSuccess(
      res,
      result.data,
      'User role retrieved successfully',
      200
    );

  } catch (error) {
    console.error('Role controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * Update user's role
 * PUT /api/v1/roles/update
 */
export const updateRole = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    // Validate input
    const { error, value } = updateRoleSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Request validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Check if user is authenticated
    if (!req.user) {
      return sendError(
        res,
        'Authentication required',
        'UNAUTHORIZED',
        401
      );
    }

    // Get current user role from database (this would need to be implemented)
    // For now, we'll use a placeholder - in real implementation, you'd fetch the current role
    const currentRole = 'user' as UserRole; // This should be fetched from database

    // Prepare role data for service
    const roleData = {
      userId: value.userId,
      currentRole,
      newRole: value.newRole as UserRole,
      updatedBy: req.user.id,
      reason: value.reason,
      ipAddress: req.ip
    };

    // Call service layer
    const result = await roleService.updateUserRole(roleData);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'USER_NOT_FOUND':
          statusCode = 404;
          break;
        case 'ROLE_ASSIGNMENT_DENIED':
        case 'SELF_ROLE_MODIFICATION':
          statusCode = 403;
          break;
        case 'ROLE_ALREADY_ASSIGNED':
          statusCode = 400;
          break;
        case 'INTERNAL_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Role update failed',
        result.code || 'INTERNAL_ERROR',
        statusCode
      );
    }

    // Return success response
    return sendSuccess(
      res,
      result.data,
      result.message || 'Role updated successfully',
      200
    );

  } catch (error) {
    console.error('Role controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * Get users by role with pagination
 * GET /api/v1/roles/users-by-role
 */
export const getUsersByRole = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    // Validate query parameters
    const { error, value } = getUsersByRoleSchema.validate(req.query, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Request validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Prepare query data for service
    const queryData = {
      role: value.role as UserRole | undefined,
      page: value.page,
      limit: value.limit,
      sortBy: value.sortBy,
      sortOrder: value.sortOrder
    };

    // Call service layer
    const result = await roleService.getUsersByRole(queryData);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'INTERNAL_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Failed to get users by role',
        result.code || 'INTERNAL_ERROR',
        statusCode
      );
    }

    // Return success response
    return sendSuccess(
      res,
      result.data,
      'Users retrieved successfully',
      200
    );

  } catch (error) {
    console.error('Role controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * Validate role assignment
 * POST /api/v1/roles/validate-assignment
 */
export const validateAssignment = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    // Validate input
    const { error, value } = validateAssignmentSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Request validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Check if user is authenticated
    if (!req.user) {
      return sendError(
        res,
        'Authentication required',
        'UNAUTHORIZED',
        401
      );
    }

    // Call service layer
    const result = await roleService.validateRoleAssignment(
      req.user.id,
      value.targetRole as UserRole
    );

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'USER_NOT_FOUND':
          statusCode = 404;
          break;
        case 'INTERNAL_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }

      return sendError(
        res,
        result.error || 'Validation failed',
        result.code || 'INTERNAL_ERROR',
        statusCode
      );
    }

    // Return success response
    return sendSuccess(
      res,
      result.data,
      'Validation completed successfully',
      200
    );

  } catch (error) {
    console.error('Role controller error:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

// Export controller functions
export const roleController = {
  assignRole,
  getUserRole,
  updateRole,
  getUsersByRole,
  validateAssignment
};

export default roleController; 