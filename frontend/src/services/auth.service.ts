/**
 * Authentication Service
 * 
 * This service handles all API calls related to user authentication,
 * including registration, email verification, and resending verification emails.
 * 
 * It follows the API contract defined in API-CONTRACT.md and uses TypeScript
 * types from auth.types.ts.
 */

import axios from 'axios';
import {
  RegistrationFormData,
  RegistrationResponse,
  EmailVerificationFormData,
  EmailVerificationResponse,
  ResendVerificationFormData,
  ResendVerificationResponse,
  AuthErrorCode
} from '../types/auth.types';

// Base API URL - should be from environment variables in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const AUTH_API_URL = `${API_BASE_URL}/api/v1/auth`;

/**
 * Authentication Service class for handling all auth-related API calls
 */
export class AuthService {
  /**
   * Register a new user
   * 
   * @param userData - User registration form data
   * @returns Promise with registration response
   */
  public static async registerUser(userData: RegistrationFormData): Promise<RegistrationResponse> {
    try {
      const response = await axios.post<RegistrationResponse>(
        `${AUTH_API_URL}/register`,
        userData
      );
      return response.data;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  /**
   * Verify user email with verification token
   * 
   * @param verificationData - Email verification form data containing token
   * @returns Promise with verification response
   */
  public static async verifyEmail(verificationData: EmailVerificationFormData): Promise<EmailVerificationResponse> {
    try {
      const response = await axios.post<EmailVerificationResponse>(
        `${AUTH_API_URL}/verify-email`,
        verificationData
      );
      return response.data;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  /**
   * Resend verification email
   * 
   * @param resendData - Resend verification form data containing email
   * @returns Promise with resend verification response
   */
  public static async resendVerification(resendData: ResendVerificationFormData): Promise<ResendVerificationResponse> {
    try {
      const response = await axios.post<ResendVerificationResponse>(
        `${AUTH_API_URL}/resend-verification`,
        resendData
      );
      return response.data;
    } catch (error) {
      return this.handleApiError(error);
    }
  }

  /**
   * Handle API errors and convert them to the standard error response format
   * 
   * @param error - Error from axios request
   * @returns Standardized API error response
   */
  private static handleApiError(error: any): any {
    // If the error has a response from the server, return it as is
    if (error.response && error.response.data) {
      return error.response.data;
    }

    // If it's a network error or other non-response error, create a standard error response
    return {
      success: false,
      error: error.message || 'Network error occurred',
      code: AuthErrorCode.INTERNAL_ERROR
    };
  }
}

// Export default for easier imports
export default AuthService;
