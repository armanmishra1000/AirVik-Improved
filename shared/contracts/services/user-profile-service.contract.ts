// AUTO-GENERATED FOR USER PROFILE FEATURES - DO NOT MODIFY
// This contract defines the EXACT service method signatures for user profile features
// ALL future development MUST use these exact method names and signatures

/**
 * CRITICAL METHOD NAMING RULES:
 * - MUST use "viewUserProfile" (NOT getProfile, fetchProfile, getUserProfile)
 * - MUST use "updateUserProfile" (NOT editProfile, modifyProfile, changeProfile)
 * - MUST use exact property names from user.contract.ts
 * - MUST return ServiceResponse format from auth-service.contract.ts
 */

// ============================================================================
// SERVICE REQUEST INTERFACES (EXACT FROM user.contract.ts)
// ============================================================================

export interface ViewUserProfileData {
  userId: string;  // From JWT token
}

export interface UpdateUserProfileData {
  userId: string;      // From JWT token
  firstName: string;   // Will be combined as "firstName lastName" in model.name
  lastName: string;    // Will be combined as "firstName lastName" in model.name
  email: string;
}

// ============================================================================
// SERVICE RESPONSE INTERFACE (EXACT FROM auth-service.contract.ts)
// ============================================================================

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: string[];
  message?: string;
}

// ============================================================================
// SPECIFIC RESPONSE DATA INTERFACES (EXACT FROM user.contract.ts ApiUserResponse)
// ============================================================================

export interface ViewProfileResponse {
  user: {
    id: string;
    firstName: string;    // Extracted from model.name.split(' ')[0]
    lastName: string;     // Extracted from model.name.split(' ').slice(1).join(' ')
    email: string;
    isEmailVerified: boolean;  // From model.isActive
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdateProfileResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

// ============================================================================
// USER PROFILE SERVICE METHOD SIGNATURES (EXACT PATTERN FROM auth-service.contract.ts)
// ============================================================================

export interface UserProfileServiceContract {
  // MUST use exact method name: viewUserProfile
  viewUserProfile(data: ViewUserProfileData): Promise<ServiceResponse<ViewProfileResponse>>;
  
  // MUST use exact method name: updateUserProfile
  updateUserProfile(data: UpdateUserProfileData): Promise<ServiceResponse<UpdateProfileResponse>>;
}

// ============================================================================
// ERROR CODES (EXACT FROM auth-service.contract.ts PATTERNS)
// ============================================================================

export const PROFILE_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  SERVER_ERROR: 'SERVER_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;

export type ProfileErrorCode = typeof PROFILE_ERROR_CODES[keyof typeof PROFILE_ERROR_CODES];

// ============================================================================
// SERVICE EXPORT PATTERN (EXACT FROM auth-service.contract.ts)
// ============================================================================

/**
 * CRITICAL: Service must be exported as named object with all methods
 * MUST use exact export name: userProfileService
 */
export interface UserProfileServiceExport {
  viewUserProfile: (data: ViewUserProfileData) => Promise<ServiceResponse<ViewProfileResponse>>;
  updateUserProfile: (data: UpdateUserProfileData) => Promise<ServiceResponse<UpdateProfileResponse>>;
}

// ============================================================================
// DATABASE OPERATION PATTERNS (EXACT FROM user.contract.ts)
// ============================================================================

export interface ProfileDatabaseOperations {
  // MUST use model field "name" (NOT firstName/lastName)
  // name field stores: "firstName lastName"
  findUserById: (userId: string) => Promise<any>;
  updateUserById: (userId: string, updateData: {
    name: string;      // CRITICAL: Must store "firstName lastName"
    email: string;
  }) => Promise<any>;
  findUserByEmail: (email: string, excludeUserId?: string) => Promise<any>;
}

// ============================================================================
// NAME TRANSFORMATION UTILITIES (CRITICAL FOR MODEL/API MAPPING)
// ============================================================================

export interface NameTransformationUtils {
  // Convert API firstName + lastName to model name field
  combineNameForModel: (firstName: string, lastName: string) => string;
  
  // Convert model name field to API firstName + lastName
  splitNameForApi: (name: string) => { firstName: string; lastName: string };
}

// ============================================================================
// VALIDATION UTILITIES (EXACT FROM auth-service.contract.ts PATTERNS)
// ============================================================================

export interface ProfileValidationUtils {
  validateUpdateProfileData: (data: UpdateUserProfileData) => {
    isValid: boolean;
    errors: string[];
  };
  
  validateEmail: (email: string) => boolean;
  validateName: (name: string) => boolean;
}

// ============================================================================
// ENVIRONMENT VARIABLES (IF NEEDED)
// ============================================================================

export const PROFILE_REQUIRED_ENV_VARS = {
  // No additional env vars needed beyond existing JWT_SECRET, etc.
} as const;

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - getProfile() (use viewUserProfile)
 * - editProfile() (use updateUserProfile)
 * - getUserProfile() (use viewUserProfile)
 * - modifyProfile() (use updateUserProfile)
 * - changeProfile() (use updateUserProfile)
 * - Storing firstName/lastName separately in model (use name field)
 * - Using isActive in API response (use isEmailVerified)
 * - Different error codes than auth service patterns
 * - Different service response structure than auth service
 * - Missing name transformation between model and API
 */