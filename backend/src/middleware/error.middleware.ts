import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.utils';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return sendError(res, 'Validation failed', 'VALIDATION_ERROR', 400, errors);
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, `${field} already exists`, 'DUPLICATE_ERROR', 409);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', 'INVALID_TOKEN', 401);
  }
  
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired', 'TOKEN_EXPIRED', 401);
  }
  
  // Default error
  return sendError(
    res,
    err.message || 'Internal server error',
    'INTERNAL_ERROR',
    err.statusCode || 500
  );
};
