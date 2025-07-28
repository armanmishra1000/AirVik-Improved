import React from 'react';
import { Metadata } from 'next';
import LoginForm from '@/src/components/auth/LoginForm';

/**
 * Metadata for the login page
 */
export const metadata: Metadata = {
  title: 'Login | Airvik Hotel System',
  description: 'Login to access your Airvik Hotel System account',
};

/**
 * Login Page Component
 * 
 * This page renders the login form and handles authentication redirects.
 * It uses the LoginForm component from F3 for the actual form UI.
 */
export default function LoginPage() {
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
            <li className="text-blue-600 font-medium">Login</li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Login to manage your hotel bookings and reservations
          </p>
        </div>

        {/* Login Form Component */}
        <LoginForm />
      </div>
    </div>
  );
}
