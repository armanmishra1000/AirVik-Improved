// Role Management TypeScript Types
// This file contains all type definitions for role assignment and permission checking
// Must match API-CONTRACT.md and role-api.contract.ts exactly

// ============================================================================
// ROLE ENUM
// ============================================================================

export enum UserRole {
  USER = 'user',
  STAFF = 'staff', 
  ADMIN = 'admin'
}

// ============================================================================
// REQUEST TYPES
// ============================================================================

/**
 * Assign role request payload
 */
export interface AssignRoleRequest {
  userId: string;
  role: UserRole;
  reason?: string;
}

/**
 * Update role request payload
 */
export interface UpdateRoleRequest {
  userId: string;
  newRole: UserRole;
  reason?: string;
}

/**
 * Get users by role request parameters
 */
export interface GetUsersByRoleRequest {
  role?: UserRole;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Validate assignment request payload
 */
export interface ValidateAssignmentRequest {
  targetUserId: string;
  targetRole: UserRole;
}

// ============================================================================
// DATA MODEL TYPES
// ============================================================================

/**
 * User object with role information (matches API response format)
 */
export interface UserWithRole {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * User object for assignment/update operations (without role field)
 */
export interface UserBasic {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Role assignment data structure
 */
export interface RoleAssignmentData {
  user: UserWithRole;
  previousRole: UserRole;
  newRole: UserRole;
  assignedBy: UserBasic;
  reason?: string;
  message: string;
}

/**
 * Role update data structure
 */
export interface RoleUpdateData {
  user: UserWithRole;
  previousRole: UserRole;
  newRole: UserRole;
  updatedBy: UserBasic;
  reason?: string;
  message: string;
}

/**
 * Pagination data structure
 */
export interface PaginationData {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Filter data structure
 */
export interface FilterData {
  role?: UserRole;
  sortBy: string;
  sortOrder: string;
}

/**
 * Role validation result structure
 */
export interface RoleValidationResult {
  isValid: boolean;
  requiredRole?: UserRole;
  currentUserRole: UserRole;
  targetRole: UserRole;
  reason?: string;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

/**
 * Assign role success response data
 */
export interface AssignRoleResponseData {
  user: UserWithRole;
  previousRole: UserRole;
  newRole: UserRole;
  assignedBy: UserBasic;
  reason?: string;
  message: string;
}

/**
 * Get user role success response data
 */
export interface GetUserRoleResponseData {
  user: UserWithRole;
}

/**
 * Update role success response data
 */
export interface UpdateRoleResponseData {
  user: UserWithRole;
  previousRole: UserRole;
  newRole: UserRole;
  updatedBy: UserBasic;
  reason?: string;
  message: string;
}

/**
 * Get users by role success response data
 */
export interface GetUsersByRoleResponseData {
  users: UserWithRole[];
  pagination: PaginationData;
  filters: FilterData;
}

/**
 * Validate assignment success response data
 */
export interface ValidateAssignmentResponseData {
  canAssign: boolean;
  validation: RoleValidationResult;
  message: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Role API error codes
 */
export type RoleErrorCode = 
  | 'VALIDATION_ERROR'
  | 'USER_NOT_FOUND'
  | 'ROLE_ASSIGNMENT_DENIED'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'INVALID_ROLE'
  | 'SELF_ROLE_MODIFICATION'
  | 'ROLE_ALREADY_ASSIGNED'
  | 'UNAUTHORIZED'
  | 'INTERNAL_ERROR';

/**
 * Role API error response
 */
export interface RoleApiError {
  success: false;
  error: string;
  code: RoleErrorCode;
}

// ============================================================================
// COMPLETE API RESPONSE TYPES
// ============================================================================

/**
 * Base API response structure (reused from auth.types.ts)
 */
export interface BaseApiResponse {
  success: boolean;
}

/**
 * Success API response structure (reused from auth.types.ts)
 */
export interface ApiSuccessResponse<T = any> extends BaseApiResponse {
  success: true;
  data: T;
  message?: string;
}

/**
 * Error API response structure (reused from auth.types.ts)
 */
export interface ApiErrorResponse extends BaseApiResponse {
  success: false;
  error: string;
  code?: string;
  details?: string[];
  status?: number;
}

/**
 * Union type for all possible API responses (reused from auth.types.ts)
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Assign role API response
 */
export type AssignRoleResponse = ApiResponse<AssignRoleResponseData>;

/**
 * Get user role API response
 */
export type GetUserRoleResponse = ApiResponse<GetUserRoleResponseData>;

/**
 * Update role API response
 */
export type UpdateRoleResponse = ApiResponse<UpdateRoleResponseData>;

/**
 * Get users by role API response
 */
export type GetUsersByRoleResponse = ApiResponse<GetUsersByRoleResponseData>;

/**
 * Validate assignment API response
 */
export type ValidateAssignmentResponse = ApiResponse<ValidateAssignmentResponseData>;

// ============================================================================
// FORM DATA TYPES
// ============================================================================

/**
 * Assign role form data
 */
export interface AssignRoleFormData {
  userId: string;
  role: UserRole;
  reason: string;
}

/**
 * Update role form data
 */
export interface UpdateRoleFormData {
  userId: string;
  newRole: UserRole;
  reason: string;
}

/**
 * Validate assignment form data
 */
export interface ValidateAssignmentFormData {
  targetUserId: string;
  targetRole: UserRole;
}

// ============================================================================
// FORM VALIDATION TYPES
// ============================================================================

/**
 * Form field validation state (reused from auth.types.ts)
 */
export interface FieldValidation {
  isValid: boolean;
  error?: string;
}

/**
 * Assign role form validation state
 */
export interface AssignRoleFormValidation {
  userId: FieldValidation;
  role: FieldValidation;
  reason: FieldValidation;
  isFormValid: boolean;
}

/**
 * Update role form validation state
 */
export interface UpdateRoleFormValidation {
  userId: FieldValidation;
  newRole: FieldValidation;
  reason: FieldValidation;
  isFormValid: boolean;
}

/**
 * Validate assignment form validation state
 */
export interface ValidateAssignmentFormValidation {
  targetUserId: FieldValidation;
  targetRole: FieldValidation;
  isFormValid: boolean;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

/**
 * Loading states for role operations
 */
export interface RoleLoadingState {
  isAssigningRole: boolean;
  isGettingUserRole: boolean;
  isUpdatingRole: boolean;
  isGettingUsersByRole: boolean;
  isValidatingAssignment: boolean;
}

/**
 * Role management UI state
 */
export interface RoleUIState {
  loading: RoleLoadingState;
  error: string | null;
  success: string | null;
  isFormSubmitted: boolean;
}

/**
 * Assign role page state
 */
export interface AssignRolePageState extends RoleUIState {
  formData: AssignRoleFormData;
  validation: AssignRoleFormValidation;
}

/**
 * Update role page state
 */
export interface UpdateRolePageState extends RoleUIState {
  formData: UpdateRoleFormData;
  validation: UpdateRoleFormValidation;
}

/**
 * Validate assignment page state
 */
export interface ValidateAssignmentPageState extends RoleUIState {
  formData: ValidateAssignmentFormData;
  validation: ValidateAssignmentFormValidation;
  validationResult: ValidateAssignmentResponseData | null;
}

// ============================================================================
// SERVICE TYPES
// ============================================================================

/**
 * Role service interface
 */
export interface RoleService {
  assignRole: (data: AssignRoleRequest) => Promise<AssignRoleResponse>;
  getUserRole: (userId: string) => Promise<GetUserRoleResponse>;
  updateRole: (data: UpdateRoleRequest) => Promise<UpdateRoleResponse>;
  getUsersByRole: (params: GetUsersByRoleRequest) => Promise<GetUsersByRoleResponse>;
  validateAssignment: (data: ValidateAssignmentRequest) => Promise<ValidateAssignmentResponse>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract data type from API response (reused from auth.types.ts)
 */
export type ExtractApiData<T> = T extends ApiSuccessResponse<infer U> ? U : never;

/**
 * Make all properties optional for partial updates
 */
export type PartialFormData<T> = Partial<T>;

/**
 * Form field names for assign role
 */
export type AssignRoleFieldName = keyof AssignRoleFormData;

/**
 * Form field names for update role
 */
export type UpdateRoleFieldName = keyof UpdateRoleFormData;

/**
 * Form field names for validate assignment
 */
export type ValidateAssignmentFieldName = keyof ValidateAssignmentFormData;

// ============================================================================
// CONSTANTS TYPES
// ============================================================================

/**
 * Role API endpoints
 */
export interface RoleApiEndpoints {
  assignRole: string;
  getUserRole: string;
  updateRole: string;
  getUsersByRole: string;
  validateAssignment: string;
}

/**
 * Role validation rules
 */
export interface RoleValidationRules {
  userId: {
    minLength: number;
    maxLength: number;
    pattern: RegExp;
  };
  role: {
    enum: UserRole[];
  };
  reason: {
    maxLength: number;
  };
  page: {
    min: number;
    default: number;
  };
  limit: {
    min: number;
    max: number;
    default: number;
  };
  sortBy: {
    enum: string[];
    default: string;
  };
  sortOrder: {
    enum: string[];
    default: string;
  };
}

/**
 * Rate limiting configuration for role operations
 */
export interface RoleRateLimitConfig {
  assignRole: {
    maxAttempts: number;
    windowMinutes: number;
  };
  updateRole: {
    maxAttempts: number;
    windowMinutes: number;
  };
  getUsersByRole: {
    maxAttempts: number;
    windowMinutes: number;
  };
  validateAssignment: {
    maxAttempts: number;
    windowMinutes: number;
  };
} 