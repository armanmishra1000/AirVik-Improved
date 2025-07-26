import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import userAuthService from '../../services/auth/user-auth.service';
import { sendSuccess, sendError } from '../../utils/response.utils';

/**
 * Authentication Controller for User Registration and Email Verification
 * Handles HTTP requests and responses for auth endpoints
 */
class UserAuthController {
  /**
   * Register a new user
   * @route POST /api/v1/auth/register
   * @access Public
   */
  registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request body
      await Promise.all(this.registerValidationRules.map(validation => validation.run(req)));
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        sendError(
          res, 
          'Validation failed', 
          'VALIDATION_ERROR', 
          400, 
          errors.array().map(err => err.msg)
        );
        return;
      }

      // Check if passwords match
      const { password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        sendError(
          res,
          'Passwords do not match',
          'VALIDATION_ERROR',
          400,
          ['Passwords do not match']
        );
        return;
      }

      // Register user using service
      const user = await userAuthService.registerUser({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
      });

      // Send success response
      sendSuccess(
        res,
        {
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt
          },
          message: 'Registration successful. Please check your email for verification.'
        },
        undefined,
        201
      );
    } catch (error: any) {
      // Handle specific errors
      if (error.code === 'EMAIL_EXISTS') {
        sendError(res, error.message, error.code, 409);
        return;
      }

      // Pass other errors to global error handler
      next(error);
    }
  };

  /**
   * Verify user email with token
   * @route POST /api/v1/auth/verify-email
   * @access Public
   */
  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request body
      await Promise.all(this.verifyEmailValidationRules.map(validation => validation.run(req)));
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        sendError(
          res, 
          'Validation failed', 
          'VALIDATION_ERROR', 
          400, 
          errors.array().map(err => err.msg)
        );
        return;
      }

      // Verify email using service
      await userAuthService.verifyEmail(req.body.token);

      // Send success response
      sendSuccess(
        res,
        {
          message: 'Email verified successfully'
        }
      );
    } catch (error: any) {
      // Handle specific errors
      if (error.code === 'INVALID_TOKEN' || error.code === 'ALREADY_VERIFIED') {
        sendError(res, error.message, error.code, error.statusCode || 400);
        return;
      }

      if (error.message === 'User not found') {
        sendError(res, error.message, 'USER_NOT_FOUND', 404);
        return;
      }

      // Pass other errors to global error handler
      next(error);
    }
  };

  /**
   * Resend verification email
   * @route POST /api/v1/auth/resend-verification
   * @access Public
   */
  resendVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request body
      await Promise.all(this.resendVerificationValidationRules.map(validation => validation.run(req)));
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        sendError(
          res, 
          'Invalid email format', 
          'VALIDATION_ERROR', 
          400, 
          errors.array().map(err => err.msg)
        );
        return;
      }

      // Resend verification email using service
      await userAuthService.resendVerificationEmail(req.body.email);

      // Send success response
      sendSuccess(
        res,
        {
          message: 'Verification email sent successfully'
        }
      );
    } catch (error: any) {
      // Handle specific errors
      if (error.code === 'EMAIL_NOT_FOUND') {
        sendError(res, error.message, error.code, 404);
        return;
      }

      if (error.code === 'ALREADY_VERIFIED') {
        sendError(res, error.message, error.code, 400);
        return;
      }

      if (error.message === 'Rate limit exceeded') {
        sendError(
          res,
          'Please wait before requesting another verification email',
          'RATE_LIMITED',
          429
        );
        return;
      }

      // Pass other errors to global error handler
      next(error);
    }
  };

  /**
   * Validation rules for user registration
   */
  private registerValidationRules = [
    body('firstName')
      .notEmpty().withMessage('First name is required')
      .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
    
    body('lastName')
      .notEmpty().withMessage('Last name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
    
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    body('confirmPassword')
      .notEmpty().withMessage('Confirm password is required')
  ];

  /**
   * Validation rules for email verification
   */
  private verifyEmailValidationRules = [
    body('token')
      .notEmpty().withMessage('Verification token is required')
      .isString().withMessage('Token must be a string')
  ];

  /**
   * Validation rules for resend verification
   */
  private resendVerificationValidationRules = [
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail()
  ];
}

export default new UserAuthController();
