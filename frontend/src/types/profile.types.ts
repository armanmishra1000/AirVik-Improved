// User Profile Types
// Matches backend API response structure exactly

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ViewProfileResponse {
  success: boolean;
  data: {
    user: UserProfile;
  };
}

export interface UpdateProfileResponse {
  success: boolean;
  data: {
    user: UserProfile;
    message: string;
  };
}

// Request Types
export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

// Error Response Types
export interface ProfileErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: string[];
}

// Form Validation Types
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProfileFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  general?: string;
}

// Loading State Types
export interface ProfileLoadingState {
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

// Component Props Types
export interface ViewProfileProps {
  user?: UserProfile;
  onEditClick: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export interface EditProfileFormProps {
  user?: UserProfile;
  onSubmit: (data: UpdateProfileRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

// Service Response Types
export interface ProfileServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: string[];
}

// Hook Return Types
export interface UseProfileReturn {
  user: UserProfile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  viewProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  clearError: () => void;
}

// Form State Types
export interface ProfileFormState {
  data: ProfileFormData;
  errors: ProfileFormErrors;
  isDirty: boolean;
  isValid: boolean;
} 