'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditProfileForm from '../../../components/profile/EditProfileForm';
import { UserProfile, UpdateProfileRequest } from '../../../types/profile.types';
import { viewProfile, updateProfile } from '../../../services/profile.service';

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          router.push('/auth/login');
          return;
        }
      }
    };

    checkAuth();
  }, [router]);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await viewProfile();
        
        if (result.success && result.data) {
          setUser(result.data.user);
        } else {
          setError(result.error || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a token
    if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
      fetchProfile();
    }
  }, []);

  const handleSubmit = async (data: UpdateProfileRequest) => {
    try {
      setIsUpdating(true);
      setError(null);
      setSuccessMessage(null);
      
      const result = await updateProfile(data);
      
      if (result.success && result.data) {
        setUser(result.data.user);
        setSuccessMessage(result.data.message || 'Profile updated successfully');
        
        // Show success message for 3 seconds, then redirect
        setTimeout(() => {
          router.push('/profile');
        }, 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Trigger a re-fetch
    window.location.reload();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Profile</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleRetry}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update your personal information and preferences
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/profile')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="max-w-2xl mx-auto mt-6 px-6">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{successMessage}</p>
                <p className="text-sm text-green-700 mt-1">Redirecting to profile page...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="py-8">
        <EditProfileForm
          user={user || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isUpdating}
          error={error}
        />
      </div>
    </div>
  );
};

export default EditProfilePage; 