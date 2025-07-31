// AUTO-GENERATED FOR USER PROFILE FEATURES - DO NOT MODIFY
// This contract defines the EXACT API endpoints and formats for user profile features
// ALL future development MUST use these exact endpoints and response formats

/**
 * CRITICAL API NAMING RULES:
 * - MUST use "/api/v1/profile/" prefix for ALL profile endpoints
 * - MUST use "view" (NOT get, show, fetch)
 * - MUST use "update" (NOT edit, modify, change)
 * - MUST use exact property names from user.contract.ts
 */

// ============================================================================
// API ENDPOINTS (FOR USER PROFILE FEATURES)
// ============================================================================

export const USER_PROFILE_API_ENDPOINTS = {
  VIEW_PROFILE: '/api/v1/profile/view',
  UPDATE_PROFILE: '/api/v1/profile/update'
} as const;

// ============================================================================
// HTTP METHODS (FOR USER PROFILE FEATURES)
// ============================================================================

export const USER_PROFILE_API_METHODS = {
  VIEW_PROFILE: 'GET',
  UPDATE_PROFILE: 'PUT'
} as const;

// ============================================================================
// REQUEST BODY SCHEMAS (EXACT FROM user.contract.ts)
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
// VALIDATION RULES (EXACT FROM auth-api.contract.ts PATTERNS)
// ============================================================================

export const PROFILE_VALIDATION_RULES = {
  firstName: {
    minLength: 2,
    maxLength: 50,
    required: true,
    trim: true
  },
  lastName: {
    minLength: 2,
    maxLength: 50,
    required: true,
    trim: true
  },
  email: {
    required: true,
    trim: true,
    lowercase: true,
    format: 'email'
  }
} as const;

// ============================================================================
// VALIDATION ERROR MESSAGES (EXACT FROM auth-api.contract.ts PATTERNS)
// ============================================================================

export const PROFILE_VALIDATION_MESSAGES = {
  firstName: {
    empty: 'First name is required',
    min: 'First name must be at least 2 characters long',
    max: 'First name must not exceed 50 characters'
  },
  lastName: {
    empty: 'Last name is required',
    min: 'Last name must be at least 2 characters long',
    max: 'Last name must not exceed 50 characters'
  },
  email: {
    empty: 'Email is required',
    invalid: 'Email format is invalid'
  }
} as const;

// ============================================================================
// SUCCESS RESPONSE DATA (EXACT FROM user.contract.ts ApiUserResponse)
// ============================================================================

export interface ViewProfileSuccessData {
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

export interface UpdateProfileSuccessData {
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
// ERROR CODES WITH HTTP STATUS (EXACT FROM auth-api.contract.ts PATTERNS)
// ============================================================================

export const PROFILE_ERROR_STATUS_MAPPING = {
  VALIDATION_ERROR: 400,
  EMAIL_EXISTS: 409,
  USER_NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  INVALID_TOKEN: 401,
  SERVER_ERROR: 500,
  RATE_LIMITED: 429
} as const;

// ============================================================================
// SUCCESS HTTP STATUS CODES (EXACT FROM auth-api.contract.ts PATTERNS)
// ============================================================================

export const PROFILE_SUCCESS_STATUS_CODES = {
  VIEW_PROFILE: 200,      // OK
  UPDATE_PROFILE: 200     // OK
} as const;

// ============================================================================
// CONTROLLER FUNCTION SIGNATURES (EXACT FROM auth-api.contract.ts PATTERNS)
// ============================================================================

export interface UserProfileControllerContract {
  viewProfile(req: Request, res: Response): Promise<Response>;
  updateProfile(req: Request, res: Response): Promise<Response>;
}

// ============================================================================
// CONTROLLER EXPORT PATTERN (EXACT FROM auth-api.contract.ts PATTERNS)
// ============================================================================

/**
 * CRITICAL: Controller must be exported as named object with all methods
 * MUST use exact export name: userProfileController
 */
export interface UserProfileControllerExport {
  viewProfile: (req: Request, res: Response) => Promise<Response>;
  updateProfile: (req: Request, res: Response) => Promise<Response>;
}

// ============================================================================
// ROUTE REGISTRATION PATTERN (EXACT FROM auth-api.contract.ts PATTERNS)
// ============================================================================

export const PROFILE_ROUTE_DEFINITIONS = [
  { method: 'GET', path: '/view', handler: 'viewProfile' },
  { method: 'PUT', path: '/update', handler: 'updateProfile' }
] as const;

// ============================================================================
// MIDDLEWARE REQUIREMENTS (AUTHENTICATION REQUIRED FOR ALL)
// ============================================================================

export const PROFILE_MIDDLEWARE_REQUIREMENTS = {
  VIEW_PROFILE: ['authenticateToken'],     // Requires authentication
  UPDATE_PROFILE: ['authenticateToken']    // Requires authentication
} as const;

// ============================================================================
// COMMON MISTAKES TO AVOID
// ============================================================================

/**
 * DO NOT USE THESE - THEY ARE WRONG:
 * - /profile/ (use /api/v1/profile/)
 * - /get-profile (use /view)
 * - /edit-profile (use /update)
 * - POST for viewing (use GET)
 * - PATCH for updating (use PUT)
 * - name field in request (use firstName + lastName)
 * - isActive field in response (use isEmailVerified)
 * - Different validation messages than specified
 * - Different HTTP status codes than specified
 * - Different error codes than specified
 */