/**
 * Registration Page
 * 
 * This page provides a user registration form using the App Router in Next.js 14.
 * It includes SEO metadata and error handling.
 */

import React from 'react';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Import the RegistrationForm component with error handling
const RegistrationForm = dynamic(
  () => import('../../../components/auth/RegistrationForm'),
  { 
    ssr: true,
    loading: () => (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
);

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

        <RegistrationForm />
      </div>
    </div>
  );
}
