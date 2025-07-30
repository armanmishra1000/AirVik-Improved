'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { registerUser } from '@/src/services/auth.service';
import type { RegistrationFormData, ApiResponse, User } from '@/src/types/auth.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

interface RegisterPageState {
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  registeredEmail: string | null;
}

export default function RegisterPage() {
  const router = useRouter();
  const [state, setState] = useState<RegisterPageState>({
    isLoading: false,
    isSuccess: false,
    error: null,
    registeredEmail: null,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<RegistrationFormData>({
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    // Using react-hook-form's handleSubmit already prevents default form submission
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await registerUser(data);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isSuccess: true,
          registeredEmail: data.email,
        }));
      } else {
        // Handle API error response
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Registration failed',
        }));

        // Handle validation errors
        if (response.code === 'VALIDATION_ERROR' && response.details) {
          response.details.forEach((detail: string) => {
            if (detail.toLowerCase().includes('email')) {
              setError('email', { type: 'manual', message: detail });
            } else if (detail.toLowerCase().includes('password')) {
              setError('password', { type: 'manual', message: detail });
            }
          });
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Network error. Please check your connection and try again.',
      }));
    }
  };

  const handleResendVerification = async () => {
    if (!state.registeredEmail) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const { resendVerification } = await import('@/src/services/auth.service');
      const response = await resendVerification({ email: state.registeredEmail });
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.error || 'Failed to resend verification email',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to resend verification email. Please try again.',
      }));
    }
  };

  if (state.isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-2xl font-bold text-center text-text mb-6">
            Create your account
          </h2>
          <Card className="border border-gray-200 shadow-md rounded-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-text mb-4">
                  Registration Successful!
                </h2>
                <p className="text-sm text-muted mb-6">
                  We've sent a verification email to{' '}
                  <span className="font-medium text-text">{state.registeredEmail}</span>.
                  Please check your inbox and click the verification link to activate your account.
                </p>
                
                <div className="space-y-4">
                  <Button
                    onClick={handleResendVerification}
                    disabled={state.isLoading}
                    variant="outline"
                    className="w-full py-2 px-4 text-sm font-medium transition-all duration-200"
                  >
                    {state.isLoading ? 'Sending...' : 'Resend Verification Email'}
                  </Button>
                  
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md shadow-sm text-sm font-medium transition-all duration-200"
                  >
                    <Link href="/auth/login">
                      Go to Login
                    </Link>
                  </Button>
                </div>

                {state.error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-500 rounded-md">
                    <p className="text-xs text-red-600">{state.error}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-start mb-8">
            <h1 className="text-2xl font-bold text-text">AirVik Hotel System</h1>
          </div>
          
          <Card className="border border-gray-200 shadow-md rounded-lg">
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-text">Create your account</h2>
            <p className="text-sm text-muted mt-2">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-sm font-medium text-primary hover:text-primary/90">
                Sign in
              </Link>
            </p>
          </div>
          
          <form method="post" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {state.error && (
              <div className="p-3 bg-red-50 border border-red-500 rounded-md">
                <p className="text-xs text-red-600">{state.error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-text">
                  First Name
                </label>
                <div>
                  <Input
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: { value: 2, message: 'First name must be at least 2 characters' },
                      maxLength: { value: 50, message: 'First name must be less than 50 characters' },
                    })}
                    type="text"
                    autoComplete="given-name"
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-text">
                  Last Name
                </label>
                <div>
                  <Input
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                      maxLength: { value: 50, message: 'Last name must be less than 50 characters' },
                    })}
                    type="text"
                    autoComplete="family-name"
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-text">
                Email Address
              </label>
              <div>
                <Input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  autoComplete="email"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-text">
                Password
              </label>
              <div>
                <Input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                    },
                  })}
                  type="password"
                  autoComplete="new-password"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text">
                Confirm Password
              </label>
              <div>
                <Input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  type="password"
                  autoComplete="new-password"
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={state.isLoading}
                className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-sm text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isLoading ? (
                  <div className="flex items-center">
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
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-sm text-muted">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </span>
              </div>
            </div>
          </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
