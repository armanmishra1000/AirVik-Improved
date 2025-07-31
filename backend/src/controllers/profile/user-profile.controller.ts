import { Request, Response } from 'express';
import Joi from 'joi';
import { userProfileService } from '../../services/profile/user-profile.service';
import { sendSuccess, sendError } from '../../utils/response.utils';

// Interface to extend Express Request with user information
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified?: boolean;
    role?: string;
  };
}

// Validation schemas
const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 50 characters',
    }),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 50 characters',
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Email format is invalid',
    }),
});

/**
 * View user profile
 * GET /api/v1/profile/view
 */
export const viewProfile = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    // User ID is available from auth middleware
    const userId = req.user?.id;
    
    if (!userId) {
      return sendError(
        res,
        'Unauthorized access',
        'UNAUTHORIZED',
        401
      );
    }

    // Call service layer
    const result = await userProfileService.viewUserProfile(userId);

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
        result.error || 'An error occurred',
        result.code,
        statusCode,
        result.details
      );
    }

    // Return success response
    return sendSuccess(
      res,
      result.data,
      undefined,
      200
    );
  } catch (error) {
    console.error('Error in viewProfile controller:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

/**
 * Update user profile
 * PUT /api/v1/profile/update
 */
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    // User ID is available from auth middleware
    const userId = req.user?.id;
    
    if (!userId) {
      return sendError(
        res,
        'Unauthorized access',
        'UNAUTHORIZED',
        401
      );
    }

    // Validate input
    const { error, value } = updateProfileSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const validationErrors = error.details.map(detail => detail.message);
      return sendError(
        res,
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        validationErrors
      );
    }

    // Call service layer
    const result = await userProfileService.updateUserProfile(userId, value);

    if (!result.success) {
      // Handle specific error codes with appropriate HTTP status
      let statusCode = 400;
      
      switch (result.code) {
        case 'USER_NOT_FOUND':
          statusCode = 404;
          break;
        case 'EMAIL_EXISTS':
          statusCode = 409;
          break;
        case 'INTERNAL_ERROR':
          statusCode = 500;
          break;
        default:
          statusCode = 400;
      }
      
      return sendError(
        res,
        result.error || 'An error occurred',
        result.code,
        statusCode,
        result.details
      );
    }

    // Return success response
    return sendSuccess(
      res,
      result.data,
      result.data?.message,
      200
    );
  } catch (error) {
    console.error('Error in updateProfile controller:', error);
    return sendError(
      res,
      'Internal server error',
      'INTERNAL_ERROR',
      500
    );
  }
};

// Export controller object for consistency with existing patterns
export const userProfileController = {
  viewProfile,
  updateProfile
};

export default userProfileController; 