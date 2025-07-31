'use client';

import React, { useState, useEffect } from 'react';
import { UserProfile, UpdateProfileRequest, ProfileFormErrors } from '../../types/profile.types';
import { validateProfileForm } from '../../services/profile.service';

interface EditProfileFormProps {
  user?: UserProfile;
  onSubmit: (data: UpdateProfileRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null
}) => {
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when user prop changes
  useEffect(() => {
    if (user) {
      const initialData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };
      setFormData(initialData);
      setIsDirty(false);
      setHasChanges(false);
      setErrors({});
    }
  }, [user]);

  // Check for changes
  useEffect(() => {
    if (user) {
      const hasFormChanges = 
        formData.firstName !== user.firstName ||
        formData.lastName !== user.lastName ||
        formData.email !== user.email;
      setHasChanges(hasFormChanges);
    }
  }, [formData, user]);

  const handleInputChange = (field: keyof UpdateProfileRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const validationErrors = validateProfileForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setIsDirty(false);
      setHasChanges(false);
    } catch (error) {
      // Error handling is done by parent component
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    if (hasChanges && isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?'
      );
      if (!confirmed) {
        return;
      }
    }
    onCancel();
  };

  const handleReset = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
      setErrors({});
      setIsDirty(false);
      setHasChanges(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">👤</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No User Data</h2>
            <p className="text-gray-600 mb-4">Unable to load user information for editing.</p>
            <button
              onClick={onCancel}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
              <p className="text-green-100">Update your personal information</p>
            </div>
            {hasChanges && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Unsaved Changes
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your first name"
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your last name"
                disabled={isLoading}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Email Verification Status */}
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Email Verification</h4>
                  <p className="text-sm text-gray-500">
                    {user.isEmailVerified 
                      ? 'Your email is verified and active' 
                      : 'Please verify your email address'
                    }
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isEmailVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.isEmailVerified ? '✓ Verified' : '⚠ Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isLoading || !hasChanges}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isLoading || !isDirty}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm; 