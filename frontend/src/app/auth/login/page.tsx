import React from 'react';
import { Metadata } from 'next';
import LoginForm from '../../../components/auth/LoginForm';

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gray-bg">
      <div className="w-full max-w-md">
        {/* Breadcrumbs */}
        {/* <nav className="mb-8">
          <ol className="flex text-sm space-x-1">
            <li className="flex items-center">
              <a href="/" className="text-muted hover:text-primary">Home</a>
              <svg 
                className="h-5 w-5 text-muted mx-1" 
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
              <a href="/auth" className="text-muted hover:text-primary">Authentication</a>
              <svg 
                className="h-5 w-5 text-muted mx-1" 
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
            <li className="text-primary font-medium">Login</li>
          </ol>
        </nav> */}

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Login to manage your hotel bookings and reservations
          </p>
        </div>

        {/* Login Form Component */}
        <LoginForm />
      </div>
    </div>
  );
}
