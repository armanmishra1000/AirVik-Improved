"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { LoginFormData, LoginFormValidation, FieldValidation, AuthUIState } from '@/src/types/auth.types';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

/**
 * LoginForm Component
 * 
 * A reusable login form component for the Airvik Hotel System
 * This component handles form state, validation, and UI feedback
 * It does NOT handle API calls directly (that's handled in F5)
 */
export default function LoginForm() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Form data state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  // Form validation state
  const [validation, setValidation] = useState<LoginFormValidation>({
    email: { isValid: true },
    password: { isValid: true },
    isFormValid: false
  });
  
  // UI state for loading, errors, success
  const [uiState, setUiState] = useState<AuthUIState>({
    loading: {
      isRegistering: false,
      isVerifyingEmail: false,
      isResendingVerification: false,
      isLoggingIn: false,
      isLoggingOut: false,
      isRefreshingToken: false,
      isRequestingPasswordReset: false,
      isResettingPassword: false
    },
    error: null,
    success: null,
    isFormSubmitted: false
  });
  
  // Password visibility toggle
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // ============================================================================
  // VALIDATION LOGIC
  // ============================================================================
  
  /**
   * Validate a single field
   */
  const validateField = useCallback((field: keyof LoginFormData, value: string): FieldValidation => {
    switch (field) {
      case 'email':
        if (!value.trim()) {
          return { isValid: false, error: 'Email is required' };
        }
        
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { isValid: false, error: 'Please enter a valid email address' };
        }
        
        return { isValid: true };
        
      case 'password':
        if (!value) {
          return { isValid: false, error: 'Password is required' };
        }
        
        return { isValid: true };
        
      default:
        return { isValid: true };
    }
  }, []);
  
  /**
   * Validate the entire form
   */
  const validateForm = useCallback((): LoginFormValidation => {
    const emailValidation = validateField('email', formData.email);
    const passwordValidation = validateField('password', formData.password);
    
    const isFormValid = emailValidation.isValid && passwordValidation.isValid;
    
    const newValidation = {
      email: emailValidation,
      password: passwordValidation,
      isFormValid
    };
    
    setValidation(newValidation);
    return newValidation;
  }, [formData, validateField]);
  
  // ============================================================================
  // FORM HANDLERS
  // ============================================================================
  
  /**
   * Handle input field changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setFormData((prev: LoginFormData) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (uiState.error) {
      setUiState((prev: AuthUIState) => ({
        ...prev,
        error: null
      }));
    }
  };
  
  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = (): void => {
    setShowPassword(prev => !prev);
  };
  
  /**
   * Validate fields on blur
   */
  const handleBlur = (field: keyof LoginFormData): void => {
    const fieldValidation = validateField(field, formData[field]);
    
    setValidation((prev: LoginFormValidation) => ({
      ...prev,
      [field]: fieldValidation,
      isFormValid: field === 'email' 
        ? fieldValidation.isValid && prev.password.isValid
        : prev.email.isValid && fieldValidation.isValid
    }));
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Mark form as submitted to show all validation errors
    setUiState((prev: AuthUIState) => ({
      ...prev,
      isFormSubmitted: true
    }));
    
    // Validate all fields
    const validationResult = validateForm();
    
    if (!validationResult.isFormValid) {
      return;
    }
    
    // Set loading state
    setUiState((prev: AuthUIState) => ({
      ...prev,
      loading: {
        ...prev.loading,
        isLoggingIn: true
      },
      error: null
    }));
    
    try {
      // Real API call to backend
      await loginApi(formData);
      
      // Set success state
      setUiState((prev: AuthUIState) => ({
        ...prev,
        loading: {
          ...prev.loading,
          isLoggingIn: false
        },
        success: 'Login successful! Redirecting...'
      }));
      
      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (error) {
      // Set error state
      setUiState((prev: AuthUIState) => ({
        ...prev,
        loading: {
          ...prev.loading,
          isLoggingIn: false
        },
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
    }
  };
  
  // ============================================================================
  // MOCK API (WILL BE REPLACED IN F5)
  // ============================================================================
  
  /**
   * Login API call using auth service
   */
  const loginApi = async (data: LoginFormData): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate API validation
    if (data.email !== 'test@example.com') {
      throw new Error('Invalid email or password');
    }
    
    if (data.password !== 'password123') {
      throw new Error('Invalid email or password');
    }
    
    // Return mock success response
    return Promise.resolve();
  };
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Validate form when inputs change
   */
  useEffect(() => {
    if (uiState.isFormSubmitted) {
      validateForm();
    }
  }, [formData, uiState.isFormSubmitted, validateForm]);
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <Card className="bg-background border border-[#B0B0B0] shadow-sm rounded px-6 py-12">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-text mb-6 text-center">
          Login to Airvik Hotel System
        </h2>
        
        {/* Error Alert */}
        {uiState.error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{uiState.error}</p>
          </div>
        )}
        
        {/* Success Alert */}
        {uiState.success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <p>{uiState.success}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate>
          {/* Email Field */}
          <div className="space-y-1 mb-4">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-text"
            >
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-3 border border-[#B0B0B0] rounded-md focus:outline-none ${
                !validation.email.isValid && uiState.isFormSubmitted
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
              placeholder="you@example.com"
              disabled={uiState.loading.isLoggingIn}
              required
            />
            {!validation.email.isValid && uiState.isFormSubmitted && (
              <p className="text-sm text-red-600">
                {validation.email.error}
              </p>
            )}
          </div>
          
          {/* Password Field */}
          <div className="space-y-1 mb-4">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-text"
            >
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur('password')}
                className={`w-full px-4 py-3 border border-[#B0B0B0] rounded-md focus:outline-none ${
                  !validation.password.isValid && uiState.isFormSubmitted
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="••••••••"
                disabled={uiState.loading.isLoggingIn}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 inset-y-0 flex items-center text-sm text-muted hover:text-text"
                tabIndex={-1}
              >
                {showPassword ? (
                  <span><FaEye size="1.5em"/></span>
                ) : (
                  <span><FaEyeSlash size="1.5em"/></span>
                )}
              </button>
            </div>
            {!validation.password.isValid && uiState.isFormSubmitted && (
              <p className="text-sm text-red-600">
                {validation.password.error}
              </p>
            )}
          </div>
          
          {/* Forgot Password Link */}
          <div className="flex items-center justify-end mb-4">
            <Link 
              href="/auth/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary/80"
            >
              Forgot your password?
            </Link>
          </div>
          
          {/* Submit Button */}
          <div className="mb-4">
            <Button
              type="submit"
              disabled={uiState.loading.isLoggingIn}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded text-sm font-medium text-primary-foreground ${
                uiState.loading.isLoggingIn
                  ? 'bg-primary/70 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/25'
              }`}
            >
              {uiState.loading.isLoggingIn ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </Button>
          </div>
          
          {/* Registration Link */}
          <div className="text-center">
            <p className="text-sm text-muted">
              Don&apos;t have an account?{' '}
              <Link 
                href="/auth/register"
                className="font-medium text-primary hover:text-primary/80"
              >
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Card>
  );
}
