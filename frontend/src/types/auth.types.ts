/**
 * Authentication Type Definitions
 * 
 * This file contains all TypeScript type definitions related to authentication
 * for the Airvik hotel booking platform user registration and email verification.
 */

/**
 * Base User interface representing a user in the system
 * Only includes fields that should be visible on the frontend
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
}

/**
 * Registration form data interface
 */
export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Email verification form data interface
 */
export interface EmailVerificationFormData {
  token: string;
}

/**
 * Resend verification form data interface
 */
export interface ResendVerificationFormData {
  email: string;
}

/**
 * Generic API response interface
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: string[];
}

/**
 * Registration success response data
 */
export interface RegistrationResponseData {
  user: User;
  message: string;
}

/**
 * Email verification success response data
 */
export interface EmailVerificationResponseData {
  message: string;
}

/**
 * Resend verification success response data
 */
export interface ResendVerificationResponseData {
  message: string;
}

/**
 * Error codes enum for authentication errors
 */
export enum AuthErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_TOKEN = 'INVALID_TOKEN',
  ALREADY_VERIFIED = 'ALREADY_VERIFIED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND'
}

/**
 * Registration API request and response types
 */
export type RegistrationRequest = RegistrationFormData;
export type RegistrationResponse = ApiResponse<RegistrationResponseData>;

/**
 * Email verification API request and response types
 */
export type EmailVerificationRequest = EmailVerificationFormData;
export type EmailVerificationResponse = ApiResponse<EmailVerificationResponseData>;

/**
 * Resend verification API request and response types
 */
export type ResendVerificationRequest = ResendVerificationFormData;
export type ResendVerificationResponse = ApiResponse<ResendVerificationResponseData>;

/**
 * Authentication state interface for managing auth state in the frontend
 */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Authentication context interface for React context
 */
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (data: RegistrationFormData) => Promise<RegistrationResponse>;
  verifyEmail: (token: string) => Promise<EmailVerificationResponse>;
  resendVerification: (email: string) => Promise<ResendVerificationResponse>;
  clearErrors: () => void;
}
