import React from 'react';
import { Metadata } from 'next';
import ResetPasswordForm from '@/src/components/auth/ResetPasswordForm';

/**
 * Metadata for the reset password page
 */
export const metadata: Metadata = {
  title: 'Reset Password | Airvik Hotel System',
  description: 'Create a new password for your Airvik Hotel System account',
};

/**
 * Reset Password Page Component
 * 
 * This page renders the reset password form for users to set a new password.
 * It uses the ResetPasswordForm component which handles:
 * - Token extraction from URL query parameters
 * - Form validation and submission
 * - Password strength indicators
 * - Success/error states
 * 
 * The token is passed via URL query parameter: /auth/reset-password?token=xyz
 */
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex text-sm text-gray-500">
            <li className="flex items-center">
              <a href="/" className="hover:text-blue-600">Home</a>
              <svg 
                className="h-5 w-5 text-gray-400 mx-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </li>
            <li className="flex items-center">
              <a href="/auth" className="hover:text-blue-600">Authentication</a>
              <svg 
                className="h-5 w-5 text-gray-400 mx-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </li>
            <li className="text-blue-600 font-medium">Reset Password</li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create a new secure password for your account
          </p>
        </div>

        {/* Reset Password Form Component */}
        <ResetPasswordForm />
      </div>
    </div>
  );
}
