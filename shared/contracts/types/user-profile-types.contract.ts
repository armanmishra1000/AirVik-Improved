// AUTO-GENERATED FOR USER PROFILE FEATURES - DO NOT MODIFY
// This contract defines the EXACT TypeScript interfaces for user profile features
// ALL future development MUST use these exact interface names and structures

/**
 * CRITICAL TYPE NAMING RULES:
 * - MUST use "UserProfile" interface (NOT ProfileData, UserProfileData)
 * - MUST use "ViewProfileRequest" (NOT GetProfileRequest, FetchProfileRequest)
 * - MUST use "UpdateProfileRequest" (NOT EditProfileRequest, ModifyProfileRequest)
 * - MUST use "ApiResponse" pattern from auth-types.contract.ts
 * - MUST use "firstName" and "lastName" in API types (NOT first_name, last_name)
 * - MUST use "isEmailVerified" in API types (NOT emailVerified, verified)
 */

// ============================================================================
// USER PROFILE INTERFACE TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Same as User from auth-types but with updatedAt for profile context
export interface UserProfileDocument {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// FORM DATA TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export interface ViewProfileFormData {
  // No form data needed - GET request uses JWT
}

export interface UpdateProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
}

// ============================================================================
// API REQUEST TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export interface ViewProfileRequest {
  // GET request - no body, uses authenticated user ID from JWT
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

// ============================================================================
// BASE API RESPONSE TYPES (EXACT FROM auth-types.contract.ts)
// ============================================================================

export interface BaseApiResponse {
  success: boolean;
}

export interface ApiSuccessResponse<T = any> extends BaseApiResponse {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  error: string;
  code?: string;
  details?: string[];
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================================================
// SPECIFIC API RESPONSE DATA TYPES (EXACT FROM user-profile-api.contract.ts)
// ============================================================================

export interface ViewProfileResponseData {
  user: UserProfile;
}

export interface UpdateProfileResponseData {
  user: UserProfile;
  message: string;
}

// ============================================================================
// COMPLETE API RESPONSE TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export type ViewProfileResponse = ApiResponse<ViewProfileResponseData>;
export type UpdateProfileResponse = ApiResponse<UpdateProfileResponseData>;

// ============================================================================
// ERROR CODE TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export type ProfileApiErrorCode = 
  | 'VALIDATION_ERROR'
  | 'USER_NOT_FOUND'
  | 'EMAIL_EXISTS'
  | 'UNAUTHORIZED'
  | 'INVALID_TOKEN'
  | 'SERVER_ERROR'
  | 'RATE_LIMITED';

export interface ProfileValidationError {
  field: string;
  message: string;
}

export interface TypedProfileApiError extends ApiErrorResponse {
  code: ProfileApiErrorCode;
}

// ============================================================================
// FORM VALIDATION TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export interface FieldValidation {
  isValid: boolean;
  error?: string;
}

export interface UpdateProfileFormValidation {
  firstName: FieldValidation;
  lastName: FieldValidation;
  email: FieldValidation;
  isFormValid: boolean;
}

// ============================================================================
// UI STATE TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export interface ProfileLoadingState {
  isViewingProfile: boolean;
  isUpdatingProfile: boolean;
}

export interface ProfileUIState {
  loading: ProfileLoadingState;
  error: string | null;
  success: string | null;
  isFormSubmitted: boolean;
}

export interface ViewProfilePageState extends ProfileUIState {
  profileData: UserProfile | null;
}

export interface UpdateProfilePageState extends ProfileUIState {
  formData: UpdateProfileFormData;
  validation: UpdateProfileFormValidation;
  originalData: UserProfile | null;
  hasChanges: boolean;
}

// ============================================================================
// HOOK TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export interface UseViewProfileReturn {
  profileData: UserProfile | null;
  uiState: ProfileUIState;
  fetchProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface UseUpdateProfileReturn {
  formData: UpdateProfileFormData;
  validation: UpdateProfileFormValidation;
  uiState: ProfileUIState;
  originalData: UserProfile | null;
  hasChanges: boolean;
  updateField: (field: keyof UpdateProfileFormData, value: string) => void;
  submitForm: () => Promise<void>;
  resetForm: () => void;
  cancelChanges: () => void;
}

// ============================================================================
// SERVICE TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export interface UserProfileService {
  viewProfile: () => Promise<ViewProfileResponse>;
  updateProfile: (data: UpdateProfileRequest) => Promise<UpdateProfileResponse>;
}

export interface ProfileApiClientConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

// ============================================================================
// FIELD NAME TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export type UpdateProfileFieldName = keyof UpdateProfileFormData;

// ============================================================================
// UTILITY TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export type ExtractProfileApiData<T> = T extends ApiSuccessResponse<infer U> ? U : never;
export type PartialProfileFormData<T> = Partial<T>;

// ============================================================================
// CONSTANTS TYPES (EXACT FROM auth-types.contract.ts PATTERNS)
// ============================================================================

export interface ProfileApiEndpoints {
  viewProfile: string;
  updateProfile: string;
}

export interface ProfileValidationRules {
  firstName: {
    minLength: number;
    maxLength: number;
  };
  lastName: {
    minLength: number;
    maxLength: number;
  };
  email: {
    pattern: RegExp;
  };
}

export interface ProfileRateLimitConfig {
  viewProfile: {
    maxAttempts: number;
    windowMinutes: number;
  };
  updateProfile: {
    maxAttempts: number;
    windowMinutes: number;
  };
}

// ============================================================================
// COMPONENT PROP TYPES (ADDITIONAL FOR UI COMPONENTS)
// ============================================================================

export interface ViewProfileComponentProps {
  user: UserProfile;
  loading: boolean;
  error: string | null;
  onRefresh?: () => void;
}

export interface UpdateProfileFormProps {
  initialData: UserProfile;
  onSubmit: (data: UpdateProfileFormData) => Promise<void>;
  onCancel?: () => void;
  loading: boolean;
  error: string | null;
  success: string | null;
}

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - ProfileData, UserProfileData (use UserProfile)
 * - GetProfileRequest, FetchProfileRequest (use ViewProfileRequest)
 * - EditProfileRequest, ModifyProfileRequest (use UpdateProfileRequest)
 * - first_name, last_name (use firstName, lastName)
 * - emailVerified, verified (use isEmailVerified)
 * - name (use firstName + lastName in API types)
 * - isActive (use isEmailVerified in API types)
 * - Different field names than specified
 * - Different interface structures than specified
 * - Missing optional vs required field distinctions
 * - Different hook return type structures
 * - Different form data structures
 * - Missing error handling types
 * - Different API response structures
 */