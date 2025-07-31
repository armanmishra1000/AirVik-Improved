'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ViewProfile from '../../components/profile/ViewProfile';
import { UserProfile } from '../../types/profile.types';
import { viewProfile } from '../../services/profile.service';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('airvik_access_token');
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
    if (typeof window !== 'undefined' && sessionStorage.getItem('airvik_access_token')) {
      fetchProfile();
    }
  }, []);

  const handleEditClick = () => {
    router.push('/profile/edit');
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Trigger a re-fetch by updating the dependency
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account information and preferences
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/profile/edit')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <ViewProfile
          user={user || undefined}
          onEditClick={handleEditClick}
          isLoading={isLoading}
          error={error}
        />
      </div>

      {/* Error Retry Button */}
      {error && !isLoading && (
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center">
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 