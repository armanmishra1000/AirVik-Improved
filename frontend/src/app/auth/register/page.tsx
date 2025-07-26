/**
 * Registration Page
 * 
 * This page provides a user registration form using the App Router in Next.js 14.
 * It includes SEO metadata and error boundary handling.
 */

import React from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

// Import the RegistrationForm component
const RegistrationForm = dynamic(
  () => import('../../../components/auth/RegistrationForm'),
  { ssr: true }
);

/**
 * Error fallback component for the registration page
 */
function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">
        We encountered an error loading the registration form. Please try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Reload Page
      </button>
    </div>
  );
}

/**
 * Metadata for the registration page (SEO)
 */
export const metadata: Metadata = {
  title: 'Register | AirVik Hotel Booking',
  description: 'Create a new account on AirVik to book your perfect hotel stay',
  keywords: 'hotel booking, registration, sign up, create account, AirVik',
};

/**
 * Registration page component
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join AirVik to book your perfect hotel stay
          </p>
        </div>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <RegistrationForm />
        </ErrorBoundary>
      </div>
    </div>
  );
}
