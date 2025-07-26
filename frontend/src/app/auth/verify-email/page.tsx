/**
 * Email Verification Page
 * 
 * This page handles email verification by extracting the token from URL parameters
 * and calling the verification API. It includes SEO metadata and error handling.
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthService from '../../../services/auth.service';
import { EmailVerificationResponse, AuthErrorCode } from '../../../types/auth.types';



/**
 * Metadata for the verification page (SEO)
 * Note: This is exported as a constant but will be used by Next.js
 * when this component is rendered on the server
 */
export const metadata = {
  title: 'Verify Email | AirVik Hotel Booking',
  description: 'Verify your email address for your AirVik account',
  keywords: 'email verification, verify account, AirVik',
};

/**
 * Email verification result component
 */
function VerificationResult({ 
  isLoading, 
  isSuccess, 
  errorMessage 
}: { 
  isLoading: boolean; 
  isSuccess: boolean; 
  errorMessage: string | null;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Verifying your email address...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified Successfully</h2>
        <p className="text-gray-600 mb-6">Your email has been verified. You can now log in to your account.</p>
        <Link
          href="/auth/login"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
      <p className="text-gray-600 mb-6">{errorMessage || 'An error occurred during email verification.'}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/auth/register"
          className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Registration
        </Link>
        <Link
          href="/auth/resend-verification"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Resend Verification Email
        </Link>
      </div>
    </div>
  );
}

/**
 * Email verification page component
 */
export default function VerifyEmailPage() {
  // State for verification process
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Get the token from URL query parameters
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  // Verify email when component mounts
  useEffect(() => {
    async function verifyEmail() {
      // If no token is provided, show error
      if (!token) {
        setIsLoading(false);
        setErrorMessage('No verification token provided. Please check your email link.');
        return;
      }

      try {
        // Call the verification API
        const response: EmailVerificationResponse = await AuthService.verifyEmail({ token });
        
        setIsLoading(false);
        
        if (response.success) {
          setIsSuccess(true);
        } else {
          // Handle specific error codes
          if (response.code === AuthErrorCode.INVALID_TOKEN) {
            setErrorMessage('The verification link is invalid or has expired. Please request a new one.');
          } else if (response.code === AuthErrorCode.ALREADY_VERIFIED) {
            setIsSuccess(true); // Still show success for already verified emails
          } else if (response.code === AuthErrorCode.USER_NOT_FOUND) {
            setErrorMessage('User account not found. Please register again.');
          } else {
            setErrorMessage(response.error || 'An error occurred during verification.');
          }
        }
      } catch (error) {
        setIsLoading(false);
        setErrorMessage('An unexpected error occurred. Please try again later.');
        console.error('Email verification error:', error);
      }
    }

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Email Verification</h1>
        </div>

        <VerificationResult 
          isLoading={isLoading} 
          isSuccess={isSuccess} 
          errorMessage={errorMessage} 
        />
      </div>
    </div>
  );
}
