import axios, { AxiosResponse } from 'axios';
import {
  ViewProfileResponse,
  UpdateProfileResponse,
  UpdateProfileRequest,
  ProfileErrorResponse,
  ProfileServiceResponse
} from '../types/profile.types';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Get authentication token from sessionStorage (matching auth service)
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('airvik_access_token');
  }
  return null;
};

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('airvik_access_token');
        localStorage.removeItem('airvik_refresh_token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * View user profile
 * @returns Promise with user profile data
 */
export const viewProfile = async (): Promise<ProfileServiceResponse<ViewProfileResponse['data']>> => {
  try {
    const response: AxiosResponse<ViewProfileResponse> = await apiClient.get('/api/v1/profile/view');
    
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        error: 'Failed to fetch profile'
      };
    }
  } catch (error: any) {
    console.error('Error in viewProfile:', error);
    
    if (error.response?.data) {
      const errorData = error.response.data as ProfileErrorResponse;
      return {
        success: false,
        error: errorData.error || 'Failed to fetch profile',
        code: errorData.code,
        details: errorData.details
      };
    }
    
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

/**
 * Update user profile
 * @param data Profile data to update
 * @returns Promise with updated user profile data
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<ProfileServiceResponse<UpdateProfileResponse['data']>> => {
  try {
    const response: AxiosResponse<UpdateProfileResponse> = await apiClient.put('/api/v1/profile/update', data);
    
    if (response.data.success) {
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        error: 'Failed to update profile'
      };
    }
  } catch (error: any) {
    console.error('Error in updateProfile:', error);
    
    if (error.response?.data) {
      const errorData = error.response.data as ProfileErrorResponse;
      return {
        success: false,
        error: errorData.error || 'Failed to update profile',
        code: errorData.code,
        details: errorData.details
      };
    }
    
    return {
      success: false,
      error: error.message || 'Network error occurred'
    };
  }
};

/**
 * Validate profile form data
 * @param data Form data to validate
 * @returns Object with validation errors
 */
export const validateProfileForm = (data: UpdateProfileRequest): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Validate firstName
  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters long';
  } else if (data.firstName.trim().length > 50) {
    errors.firstName = 'First name must not exceed 50 characters';
  }

  // Validate lastName
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters long';
  } else if (data.lastName.trim().length > 50) {
    errors.lastName = 'Last name must not exceed 50 characters';
  }

  // Validate email
  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
  }

  return errors;
};

/**
 * Format profile data for display
 * @param user User profile data
 * @returns Formatted display data
 */
export const formatProfileForDisplay = (user: ViewProfileResponse['data']['user']) => {
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    joinDate: new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    lastUpdated: new Date(user.updatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
};

// Export service object for consistency
export const profileService = {
  viewProfile,
  updateProfile,
  validateProfileForm,
  formatProfileForDisplay
};

export default profileService; 