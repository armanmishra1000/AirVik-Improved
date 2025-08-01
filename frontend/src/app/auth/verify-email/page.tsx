'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { verifyEmail, resendVerification } from '@/src/services/auth.service';
import { CircleCheckBig, CircleX, TriangleAlert } from 'lucide-react';
import { FaCheck, FaExclamation } from 'react-icons/fa';
import { Input } from '@/components/ui/input';

interface VerifyEmailState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  isTokenMissing: boolean;
  canResend: boolean;
  resendEmail: string;
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerifyEmailState>({
    isLoading: false,
    isSuccess: false,
    error: null,
    isTokenMissing: false,
    canResend: false,
    resendEmail: '',
  });

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token) {
      setState(prev => ({
        ...prev,
        isTokenMissing: true,
        canResend: !!email,
        resendEmail: email || '',
      }));
      return;
    }

    // Set loading state first
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    // Add a small delay before verification to ensure loading state is shown
    const verificationTimer = setTimeout(() => {
      // Auto-verify if token is present
      handleVerification(token);
    }, 1000);

    return () => clearTimeout(verificationTimer);
  }, [searchParams]);

  const showErrorToast = (message: string, isError = true) => {
    toast(
      <div className="flex items-start p-4">
        <div className="flex-shrink-0">
          <div className={`flex items-center justify-center size-12 rounded-full ${isError ? 'bg-red-500' : 'bg-green-500'}`}>
            {isError ? (
              <FaExclamation className="text-lg text-white" />
            ) : (
              <FaCheck className="text-lg text-white" />
            )}
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-900">
            {isError ? 'Verification Failed' : 'Success'}
          </h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
      </div>,
      {
        duration: 5000,
        className: 'p-4 bg-white',
        style: {
          padding: 0,
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        },
        icon: null
      }
    );
  };

  const handleVerification = async (token: string) => {
    // Loading state is already set in useEffect

    try {
      const response = await verifyEmail({ token });

      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
        }));

        // Show success toast
        showErrorToast('Your email has been verified successfully!', false);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?verified=true');
        }, 3000);
      } else {
        let errorMessage = response.error || 'Email verification failed';
        let canResend = false;

        // Handle specific error codes
        switch (response.code) {
          case 'INVALID_TOKEN':
            errorMessage = 'The verification link is invalid or has expired. Please request a new verification email.';
            canResend = true;
            break;
          case 'ALREADY_VERIFIED':
            errorMessage = 'Your email is already verified. You can now sign in to your account.';
            break;
          case 'USER_NOT_FOUND':
            errorMessage = 'User account not found. Please register again.';
            break;
          case 'RATE_LIMITED':
            errorMessage = 'Too many verification attempts. Please try again later.';
            break;
          default:
            canResend = true;
        }

        // Show error toast
        showErrorToast(errorMessage);

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage, // Keep error in state for reference
          canResend,
        }));
      }
    } catch (error) {
      const errorMessage = 'Network error. Please check your connection and try again.';
      showErrorToast(errorMessage);

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage, // Keep error in state for reference
        canResend: true,
      }));
    }
  };

  const handleResendVerification = async () => {
    if (!state.resendEmail) {
      showErrorToast('Email address is required to resend verification.');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await resendVerification({ email: state.resendEmail });

      if (response.success) {
        // Show success toast with checkmark
        showErrorToast('Verification email has been resent successfully!', false);

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
      } else {
        let errorMessage = response.error || 'Failed to resend verification email';

        switch (response.code) {
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'Email address not found. Please check your email or register again.';
            break;
          case 'ALREADY_VERIFIED':
            errorMessage = 'Your email is already verified. You can now sign in to your account.';
            break;
          case 'RATE_LIMITED':
            errorMessage = 'Please wait before requesting another verification email.';
            break;
        }

        // Show error toast
        showErrorToast(errorMessage);

        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage, // Keep error in state for reference
        }));
      }
    } catch (error) {
      const errorMessage = 'Failed to resend verification email. Please try again.';
      showErrorToast(errorMessage);

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage, // Keep error in state for reference
      }));
    }
  };

  const handleEmailChange = (email: string) => {
    setState(prev => ({
      ...prev,
      resendEmail: email,
      error: null,
    }));
  };

  // Success state
  if (state.isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center lg:py-10 py-5">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4">
            <div className="text-center space-y-5">
              <div className="mx-auto flex items-center justify-center flex-shrink-0">
                <CircleCheckBig className="size-12 text-primary" />
              </div>
              <h2 className="lg:text-2xl text-xl font-bold">
                Email Verified Successfully!
              </h2>
              <p className="text-gray-500">
                Your email has been verified. You can now sign in to your AirVik account.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login page in 3 seconds...
              </p>

              <Link
                href="/auth/login"
                className="w-full flex justify-center py-2.5 px-6 border border-transparent rounded-md text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground focus:outline-none transition-all duration-75 ease-linear"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // We'll handle the loading state in the main return

  // Error or token missing state
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center lg:py-10 py-5">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold">Email Verification</h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4">
          <div className="text-center">
            {state.isTokenMissing ? (
              <>
                <div className="mx-auto flex items-center justify-center size-12 rounded-full bg-yellow-200 mb-4">
                  <TriangleAlert className='size-6 text-yellow-600' />
                </div>
                <h3 className="text-lg font-medium mb-4">
                  Verification Link Required
                </h3>
                <p className="text-gray-500 mb-6">
                  Please click the verification link in your email, or enter your email below to resend the verification email.
                </p>
              </>
            ) : state.error ? (
              <>
                {/* verification failed */}
                <div className="mx-auto flex items-center justify-center rounded-full mb-4">
                  <CircleX className="size-12 text-red-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">
                  Verification Failed
                </h3>
                <p className="text-gray-500 mb-6">{state.error}</p>
              </>
            ) : (
              <>
                {/* Processing Verification */}
                <div className="mx-auto flex items-center justify-center size-12 rounded-full bg-blue-100 mb-4">
                  <svg
                    className="animate-spin h-6 w-6 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-4">
                  Processing Verification
                </h3>
                <p className="text-gray-500 mb-6">
                  Please wait while we verify your email address...
                </p>
              </>
            )}


            {/* Resend Verification Email */}
            {(state.canResend || state.isTokenMissing) && (
              <div className="space-y-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text text-left mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    value={state.resendEmail}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="Enter your email address"
                    className="px-4 py-3 border rounded-md focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleResendVerification}
                  disabled={state.isLoading || !state.resendEmail}
                  className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md text-sm font-medium transition-all duration-75 ease-linear disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
              </div>
            )}

            {/* Create New Account */}
            <div className="mt-6 space-y-3">
              <Link
                href="/auth/register"
                className="w-full flex justify-center py-3 px-6 border rounded-md text-sm font-medium text-gray-700 bg-white focus:outline-none"
              >
                Create New Account
              </Link>

              <Link
                href="/auth/login"
                className="w-full flex justify-center py-3 px-6 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none transition-all duration-75 ease-linear"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
