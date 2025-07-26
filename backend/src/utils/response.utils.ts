import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    ...(message && { message })
  };
  
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  code?: string,
  statusCode: number = 400,
  details?: any
): Response => {
  const response: ErrorResponse = {
    success: false,
    error,
    ...(code && { code }),
    ...(details && { details })
  };
  
  return res.status(statusCode).json(response);
};
