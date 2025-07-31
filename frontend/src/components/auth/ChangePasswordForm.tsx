'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { changePassword } from '@/src/services/auth.service';
import {
  ChangePasswordFormData,
  ChangePasswordFormValidation,
  FieldValidation,
  AuthUIState,
  AuthLoadingState
} from '@/src/types/auth.types';

// ============================================================================
// INTERFACES
// ============================================================================

interface PasswordStrength {
  score: number; // 0-4 (0: very weak, 4: very strong)
  feedback: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

const ChangePasswordForm: React.FC = () => {
  const router = useRouter();

  // ============================================================================
  // STATE
  // ============================================================================

  // Form data
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Form validation
  const [validation, setValidation] = useState<ChangePasswordFormValidation>({
    currentPassword: { isValid: false },
    newPassword: { isValid: false },
    confirmPassword: { isValid: false },
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
      isResettingPassword: false,
      isChangingPassword: false,
    },
    error: null,
    success: null,
    isFormSubmitted: false
  });

  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Password strength
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: ''
  });

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Validate form whenever form data changes
  useEffect(() => {
    const newValidation = validateForm();
    setValidation(newValidation);
  }, [formData]);

  // ============================================================================
  // FORM HANDLERS
  // ============================================================================

  /**
   * Handle input field changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update password strength when new password changes
    if (name === 'newPassword') {
      updatePasswordStrength(value);
    }
    
    // Clear errors when user starts typing
    if (uiState.error) {
      setUiState(prev => ({
        ...prev,
        error: null
      }));
    }
  };

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = (field: 'currentPassword' | 'newPassword' | 'confirmPassword'): void => {
    switch (field) {
      case 'currentPassword':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'newPassword':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirmPassword':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Validate form before submission
    const formValidation = validateForm();
    if (!formValidation.isFormValid) {
      setValidation(formValidation);
      return;
    }

    // Set loading state
    setUiState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        isChangingPassword: true
      },
      error: null,
      success: null
    }));

    try {
      // Prepare request data (exclude confirmPassword for API)
      const requestData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };
      
      // Call the API using the auth service
      const response = await changePassword(requestData);
      
      if (response.success) {
        // Handle success
        setUiState(prev => ({
          ...prev,
          loading: {
            ...prev.loading,
            isChangingPassword: false
          },
          success: 'Your password has been changed successfully.',
          error: null,
          isFormSubmitted: true
        }));
        
        // Clear form data for security
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Reset password strength
        setPasswordStrength({ score: 0, feedback: '' });
        
        // Redirect to profile page after a short delay
        setTimeout(() => {
          router.push('/profile');
        }, 3000);
        
      } else {
        // Handle API error
        setUiState(prev => ({
          ...prev,
          loading: {
            ...prev.loading,
            isChangingPassword: false
          },
          error: response.error || 'Failed to change password. Please try again.',
          success: null
        }));
      }
      
    } catch (error: any) {
      console.error('Change password error:', error);
      
      // Default error message
      let errorMessage = 'Failed to change password. Please try again.';
      
      // Handle structured API errors
      if (error && typeof error === 'object') {
        // Handle standardized API error format
        if ('success' in error && error.success === false) {
          errorMessage = error.error || errorMessage;
          
          // Process specific error codes if available
          if (error.code) {
            switch(error.code) {
              case 'INVALID_CURRENT_PASSWORD':
                errorMessage = 'Current password is incorrect. Please try again.';
                break;
              case 'VALIDATION_ERROR':
                if (error.details && Array.isArray(error.details)) {
                  errorMessage = error.details.join(', ');
                } else {
                  errorMessage = 'Password must be at least 8 characters and include uppercase, lowercase, and numbers.';
                }
                break;
              case 'AUTHENTICATION_REQUIRED':
                errorMessage = 'Please log in again to change your password.';
                // Redirect to login
                setTimeout(() => {
                  router.push('/auth/login');
                }, 2000);
                break;
            }
          }
        } else if (error.status === 400) {
          // Handle 400 Bad Request errors
          errorMessage = 'Invalid request. Please check your password format.';
        } else if (error.message) {
          // Standard error object
          errorMessage = error.message;
        }
      }
      
      // Set error state
      setUiState(prev => ({
        ...prev,
        loading: {
          ...prev.loading,
          isChangingPassword: false
        },
        error: errorMessage
      }));
    }
  };

  // ============================================================================
  // VALIDATION LOGIC
  // ============================================================================

  /**
   * Update password strength indicator
   */
  const updatePasswordStrength = (password: string): void => {
    // Simple password strength algorithm
    let score = 0;
    let feedback = '';
    
    if (!password) {
      setPasswordStrength({ score: 0, feedback: '' });
      return;
    }
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) score += 0.5;
    if (/[a-z]/.test(password)) score += 0.5;
    if (/[0-9]/.test(password)) score += 0.5;
    if (/[^A-Za-z0-9]/.test(password)) score += 0.5;
    
    // Generate feedback
    if (score < 2) {
      feedback = 'Very weak';
    } else if (score < 3) {
      feedback = 'Weak';
    } else if (score < 4) {
      feedback = 'Fair';
    } else if (score < 5) {
      feedback = 'Good';
    } else {
      feedback = 'Strong';
    }
    
    setPasswordStrength({ score, feedback });
  };

  /**
   * Validate individual field
   */
  const validateField = (field: keyof ChangePasswordFormData, value: string): FieldValidation => {
    switch (field) {
      case 'currentPassword':
        if (!value.trim()) {
          return { isValid: false, error: 'Current password is required' };
        }
        if (value.length < 1) {
          return { isValid: false, error: 'Current password is required' };
        }
        return { isValid: true };
        
      case 'newPassword':
        if (!value.trim()) {
          return { isValid: false, error: 'New password is required' };
        }
        if (value.length < 8) {
          return { isValid: false, error: 'Password must be at least 8 characters long' };
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return { isValid: false, error: 'Password must contain uppercase, lowercase, and numbers' };
        }
        return { isValid: true };
        
      case 'confirmPassword':
        if (!value.trim()) {
          return { isValid: false, error: 'Please confirm your new password' };
        }
        if (value !== formData.newPassword) {
          return { isValid: false, error: 'Passwords do not match' };
        }
        return { isValid: true };
        
      default:
        return { isValid: true };
    }
  };

  /**
   * Validate entire form
   */
  const validateForm = (): ChangePasswordFormValidation => {
    const currentPasswordValidation = validateField('currentPassword', formData.currentPassword);
    const newPasswordValidation = validateField('newPassword', formData.newPassword);
    const confirmPasswordValidation = validateField('confirmPassword', formData.confirmPassword);
    
    const isFormValid = currentPasswordValidation.isValid && 
                       newPasswordValidation.isValid && 
                       confirmPasswordValidation.isValid;
    
    return {
      currentPassword: currentPasswordValidation,
      newPassword: newPasswordValidation,
      confirmPassword: confirmPasswordValidation,
      isFormValid
    };
  };

  /**
   * Handle field blur for validation
   */
  const handleBlur = (field: keyof ChangePasswordFormData): void => {
    const value = formData[field];
    const fieldValidation = validateField(field, value);
    
    setValidation(prev => ({
      ...prev,
      [field]: fieldValidation
    }));
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  const getPasswordStrengthColor = (score: number): string => {
    if (score < 2) return 'text-red-500';
    if (score < 3) return 'text-orange-500';
    if (score < 4) return 'text-yellow-500';
    if (score < 5) return 'text-blue-500';
    return 'text-green-500';
  };

  const getPasswordStrengthWidth = (score: number): string => {
    const percentage = Math.min((score / 5) * 100, 100);
    return `${percentage}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Change Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your current password and choose a new one
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Current Password */}
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('currentPassword')}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    validation.currentPassword.error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your current password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('currentPassword')}
                >
                  {showCurrentPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validation.currentPassword.error && (
                <p className="mt-2 text-sm text-red-600">{validation.currentPassword.error}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('newPassword')}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    validation.newPassword.error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('newPassword')}
                >
                  {showNewPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validation.newPassword.error && (
                <p className="mt-2 text-sm text-red-600">{validation.newPassword.error}</p>
              )}
              
              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={getPasswordStrengthColor(passwordStrength.score)}>
                      {passwordStrength.feedback}
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score < 2 ? 'bg-red-500' :
                        passwordStrength.score < 3 ? 'bg-orange-500' :
                        passwordStrength.score < 4 ? 'bg-yellow-500' :
                        passwordStrength.score < 5 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: getPasswordStrengthWidth(passwordStrength.score) }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    validation.confirmPassword.error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {validation.confirmPassword.error && (
                <p className="mt-2 text-sm text-red-600">{validation.confirmPassword.error}</p>
              )}
            </div>

            {/* Error Message */}
            {uiState.error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {uiState.error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            {uiState.success && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      {uiState.success}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!validation.isFormValid || uiState.loading.isChangingPassword}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  !validation.isFormValid || uiState.loading.isChangingPassword
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {uiState.loading.isChangingPassword ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Changing Password...
                  </div>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>

            {/* Back to Profile Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Back to Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm; 