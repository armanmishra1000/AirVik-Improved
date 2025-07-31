// Role Management API Service
// Frontend service for role assignment and permission checking API calls
// Must follow API-CONTRACT.md exactly

import {
  AssignRoleRequest,
  AssignRoleResponse,
  GetUserRoleResponse,
  UpdateRoleRequest,
  UpdateRoleResponse,
  GetUsersByRoleRequest,
  GetUsersByRoleResponse,
  ValidateAssignmentRequest,
  ValidateAssignmentResponse,
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  UserRole
} from '../types/role.types';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * API configuration from environment variables
 */
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const;

/**
 * API endpoints for role management
 */
const ROLE_ENDPOINTS = {
  assignRole: '/api/v1/roles/assign',
  getUserRole: '/api/v1/roles/user/:userId/role',
  updateRole: '/api/v1/roles/update',
  getUsersByRole: '/api/v1/roles/users-by-role',
  validateAssignment: '/api/v1/roles/validate-assignment'
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a fetch request with proper configuration
 * Handles authentication, token refresh, and request timeouts
 */
async function createApiRequest(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<Response> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;
  
  const headers: Record<string, string> = {
    ...API_CONFIG.headers,
    ...(options.headers as Record<string, string> || {})
  };
  
  // If no access token is provided, try to get it from storage
  if (!accessToken) {
    const tokens = getStoredTokens();
    if (tokens.accessToken) {
      accessToken = tokens.accessToken;
    }
  }
  
  // Add authorization header if access token is available
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers
  };

  // Add timeout using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Handle 401 errors for token refresh
    if (response.status === 401) {
      const refreshResult = await handleTokenRefresh();
      
      if (refreshResult.success && refreshResult.data && refreshResult.data.accessToken) {
        // Retry the original request with new token
        return createApiRequest(
          endpoint,
          options,
          refreshResult.data.accessToken
        );
      } else {
        console.warn('Token refresh failed, redirecting to login');
        
        // If we're in a browser context, redirect to login
        if (typeof window !== 'undefined') {
          // Small delay to allow for any pending operations
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 100);
        }
      }
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Log network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('Network error during API request:', error);
    } else if (error instanceof Error && error.name === 'AbortError') {
      console.error('Request timeout after', API_CONFIG.timeout, 'ms');
    } else {
      console.error('API request error:', error);
    }
    
    throw error;
  }
}

/**
 * Handles API response and converts to typed response
 */
async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    const data = await response.json();
    
    // Validate response structure matches API contract
    if (typeof data.success !== 'boolean') {
      throw new Error('Invalid API response format: missing success field');
    }
    
    // Add HTTP status code to error responses
    if (!data.success) {
      return {
        ...data,
        status: response.status
      } as ApiErrorResponse;
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: 'Invalid response format from server',
        code: 'INVALID_RESPONSE',
        status: response.status
      } as ApiErrorResponse;
    }
    
    throw error;
  }
}

/**
 * Creates a standardized error response for network/timeout errors
 */
function createNetworkErrorResponse(error: unknown): ApiErrorResponse {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      success: false,
      error: 'Network error. Please check your internet connection.',
      code: 'NETWORK_ERROR',
      status: 0 // Standard status code for network errors
    };
  }
  
  if (error instanceof Error && error.name === 'AbortError') {
    return {
      success: false,
      error: 'Request timeout. Please try again.',
      code: 'TIMEOUT_ERROR',
      status: 408 // Request Timeout
    };
  }
  
  return {
    success: false,
    error: 'An unexpected error occurred. Please try again.',
    code: 'UNKNOWN_ERROR',
    status: 500 // Internal Server Error as fallback
  };
}

/**
 * Validates request data before sending to API
 */
function validateRequestData(data: unknown, requiredFields: string[]): void {
  if (!data || typeof data !== 'object') {
    throw new Error('Request data must be an object');
  }
  
  const dataObj = data as Record<string, unknown>;
  
  for (const field of requiredFields) {
    if (!dataObj[field] || typeof dataObj[field] !== 'string') {
      throw new Error(`Missing or invalid required field: ${field}`);
    }
  }
}

/**
 * Validates MongoDB ObjectId format
 */
function validateObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// ============================================================================
// TOKEN MANAGEMENT FUNCTIONS (REUSED FROM AUTH SERVICE)
// ============================================================================

/**
 * Storage keys for tokens
 */
const TOKEN_STORAGE = {
  accessToken: 'airvik_access_token',
  refreshToken: 'airvik_refresh_token'
} as const;

/**
 * Retrieve stored authentication tokens
 */
function getStoredTokens(): { accessToken?: string; refreshToken?: string } {
  try {
    let accessToken: string | null = null;
    let refreshToken: string | null = null;
    
    // Get access token from session storage
    if (typeof sessionStorage !== 'undefined') {
      accessToken = sessionStorage.getItem(TOKEN_STORAGE.accessToken);
    }
    
    // Get refresh token from local storage
    if (typeof localStorage !== 'undefined') {
      refreshToken = localStorage.getItem(TOKEN_STORAGE.refreshToken);
    }
    
    return {
      accessToken: accessToken || undefined,
      refreshToken: refreshToken || undefined
    };
  } catch (error) {
    console.error('Error retrieving authentication tokens:', error);
    return {};
  }
}

/**
 * Store authentication tokens securely
 */
function setStoredTokens(accessToken: string, refreshToken: string): void {
  try {
    // Store access token in memory (session storage)
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(TOKEN_STORAGE.accessToken, accessToken);
    }
    
    // Store refresh token in localStorage for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOKEN_STORAGE.refreshToken, refreshToken);
    }
  } catch (error) {
    console.error('Error storing authentication tokens:', error);
  }
}

/**
 * Clear all stored authentication tokens
 */
function clearStoredTokens(): void {
  try {
    // Clear access token from session storage
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(TOKEN_STORAGE.accessToken);
    }
    
    // Clear refresh token from local storage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE.refreshToken);
    }
  } catch (error) {
    console.error('Error clearing authentication tokens:', error);
  }
}

/**
 * Handle token refresh when access token expires
 */
async function handleTokenRefresh(): Promise<{
  success: boolean;
  data?: { accessToken: string; refreshToken: string };
  error?: string;
  code?: string;
}> {
  try {
    const { refreshToken: storedRefreshToken } = getStoredTokens();
    
    if (!storedRefreshToken) {
      console.warn('Token refresh attempted but no refresh token available');
      clearStoredTokens();
      return {
        success: false,
        error: 'No refresh token available. Please login again.',
        code: 'INVALID_REFRESH_TOKEN'
      };
    }
    
    // Make direct API call to refresh token endpoint
    const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/auth/refresh-token`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ refreshToken: storedRefreshToken })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Token refresh failed:', response.status, errorData);
      clearStoredTokens();
      
      return {
        success: false,
        error: errorData.error || 'Failed to refresh authentication token',
        code: errorData.code || 'REFRESH_TOKEN_FAILED'
      };
    }
    
    const result = await response.json();
    
    if (result.success && result.data && result.data.accessToken && result.data.refreshToken) {
      // Store new tokens
      setStoredTokens(result.data.accessToken, result.data.refreshToken);
      return result;
    } else {
      console.error('Invalid token refresh response format:', result);
      clearStoredTokens();
      return {
        success: false,
        error: 'Invalid response from authentication server',
        code: 'INVALID_RESPONSE_FORMAT'
      };
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    clearStoredTokens();
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refresh authentication',
      code: 'REFRESH_TOKEN_ERROR'
    };
  }
}

// ============================================================================
// ROLE API SERVICE FUNCTIONS
// ============================================================================

/**
 * Assigns a role to a user
 * 
 * @param data - Role assignment request data
 * @returns Promise<AssignRoleResponse> - API response with assignment details or error
 * 
 * @example
 * ```typescript
 * const result = await assignRole({
 *   userId: '507f1f77bcf86cd799439011',
 *   role: UserRole.STAFF,
 *   reason: 'Promoted to staff member'
 * });
 * 
 * if (result.success) {
 *   console.log('Role assigned:', result.data.user);
 * } else {
 *   console.error('Assignment failed:', result.error);
 * }
 * ```
 */
export async function assignRole(
  data: AssignRoleRequest
): Promise<AssignRoleResponse> {
  try {
    // Validate required fields
    if (!data.userId || !validateObjectId(data.userId)) {
      return {
        success: false,
        error: 'Valid user ID is required',
        code: 'VALIDATION_ERROR',
        status: 400
      };
    }
    
    if (!data.role || !Object.values(UserRole).includes(data.role)) {
      return {
        success: false,
        error: 'Valid role is required',
        code: 'VALIDATION_ERROR',
        status: 400
      };
    }
    
    // Make API request
    const response = await createApiRequest(ROLE_ENDPOINTS.assignRole, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    // Handle response
    return await handleApiResponse(response);
    
  } catch (error) {
    console.error('Assign role API error:', error);
    return createNetworkErrorResponse(error);
  }
}

/**
 * Gets the role of a specific user
 * 
 * @param userId - User ID to get role for
 * @returns Promise<GetUserRoleResponse> - API response with user role or error
 * 
 * @example
 * ```typescript
 * const result = await getUserRole('507f1f77bcf86cd799439011');
 * 
 * if (result.success) {
 *   console.log('User role:', result.data.user.role);
 * } else {
 *   console.error('Failed to get user role:', result.error);
 * }
 * ```
 */
export async function getUserRole(
  userId: string
): Promise<GetUserRoleResponse> {
  try {
    // Validate user ID
    if (!userId || !validateObjectId(userId)) {
      return {
        success: false,
        error: 'Valid user ID is required',
        code: 'VALIDATION_ERROR',
        status: 400
      };
    }
    
    // Replace placeholder in endpoint
    const endpoint = ROLE_ENDPOINTS.getUserRole.replace(':userId', userId);
    
    // Make API request
    const response = await createApiRequest(endpoint, {
      method: 'GET'
    });
    
    // Handle response
    return await handleApiResponse(response);
    
  } catch (error) {
    console.error('Get user role API error:', error);
    return createNetworkErrorResponse(error);
  }
}

/**
 * Updates a user's role
 * 
 * @param data - Role update request data
 * @returns Promise<UpdateRoleResponse> - API response with update details or error
 * 
 * @example
 * ```typescript
 * const result = await updateRole({
 *   userId: '507f1f77bcf86cd799439011',
 *   newRole: UserRole.ADMIN,
 *   reason: 'Promoted to administrator'
 * });
 * 
 * if (result.success) {
 *   console.log('Role updated:', result.data.user);
 * } else {
 *   console.error('Update failed:', result.error);
 * }
 * ```
 */
export async function updateRole(
  data: UpdateRoleRequest
): Promise<UpdateRoleResponse> {
  try {
    // Validate required fields
    if (!data.userId || !validateObjectId(data.userId)) {
      return {
        success: false,
        error: 'Valid user ID is required',
        code: 'VALIDATION_ERROR',
        status: 400
      };
    }
    
    if (!data.newRole || !Object.values(UserRole).includes(data.newRole)) {
      return {
        success: false,
        error: 'Valid new role is required',
        code: 'VALIDATION_ERROR',
        status: 400
      };
    }
    
    // Make API request
    const response = await createApiRequest(ROLE_ENDPOINTS.updateRole, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    
    // Handle response
    return await handleApiResponse(response);
    
  } catch (error) {
    console.error('Update role API error:', error);
    return createNetworkErrorResponse(error);
  }
}

/**
 * Gets users filtered by role with pagination
 * 
 * @param params - Query parameters for filtering and pagination
 * @returns Promise<GetUsersByRoleResponse> - API response with users and pagination or error
 * 
 * @example
 * ```typescript
 * const result = await getUsersByRole({
 *   role: UserRole.STAFF,
 *   page: 1,
 *   limit: 10,
 *   sortBy: 'name',
 *   sortOrder: 'asc'
 * });
 * 
 * if (result.success) {
 *   console.log('Users:', result.data.users);
 *   console.log('Pagination:', result.data.pagination);
 * } else {
 *   console.error('Failed to get users:', result.error);
 * }
 * ```
 */
export async function getUsersByRole(
  params: GetUsersByRoleRequest = {}
): Promise<GetUsersByRoleResponse> {
  try {
    // Build query string
    const queryParams = new URLSearchParams();
    
    if (params.role) {
      queryParams.append('role', params.role);
    }
    
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }
    
    // Build endpoint with query parameters
    const endpoint = `${ROLE_ENDPOINTS.getUsersByRole}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    // Make API request
    const response = await createApiRequest(endpoint, {
      method: 'GET'
    });
    
    // Handle response
    return await handleApiResponse(response);
    
  } catch (error) {
    console.error('Get users by role API error:', error);
    return createNetworkErrorResponse(error);
  }
}

/**
 * Validates if a role assignment is allowed
 * 
 * @param data - Validation request data
 * @returns Promise<ValidateAssignmentResponse> - API response with validation result or error
 * 
 * @example
 * ```typescript
 * const result = await validateAssignment({
 *   targetUserId: '507f1f77bcf86cd799439011',
 *   targetRole: UserRole.ADMIN
 * });
 * 
 * if (result.success) {
 *   console.log('Can assign:', result.data.canAssign);
 *   console.log('Validation:', result.data.validation);
 * } else {
 *   console.error('Validation failed:', result.error);
 * }
 * ```
 */
export async function validateAssignment(
  data: ValidateAssignmentRequest
): Promise<ValidateAssignmentResponse> {
  try {
    // Validate required fields
    if (!data.targetUserId || !validateObjectId(data.targetUserId)) {
      return {
        success: false,
        error: 'Valid target user ID is required',
        code: 'VALIDATION_ERROR',
        status: 400
      };
    }
    
    if (!data.targetRole || !Object.values(UserRole).includes(data.targetRole)) {
      return {
        success: false,
        error: 'Valid target role is required',
        code: 'VALIDATION_ERROR',
        status: 400
      };
    }
    
    // Make API request
    const response = await createApiRequest(ROLE_ENDPOINTS.validateAssignment, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    // Handle response
    return await handleApiResponse(response);
    
  } catch (error) {
    console.error('Validate assignment API error:', error);
    return createNetworkErrorResponse(error);
  }
}

// ============================================================================
// ROLE SERVICE CLASS (OPTIONAL ALTERNATIVE INTERFACE)
// ============================================================================

/**
 * Role service class providing organized API methods
 * Alternative to individual function exports for better organization
 */
export class RoleService {
  private static instance: RoleService;
  
  /**
   * Singleton pattern for service instance
   */
  public static getInstance(): RoleService {
    if (!RoleService.instance) {
      RoleService.instance = new RoleService();
    }
    return RoleService.instance;
  }
  
  /**
   * Private constructor to enforce singleton pattern
   */
  private constructor() {}
  
  /**
   * Assign a role to a user
   */
  public async assignRole(data: AssignRoleRequest): Promise<AssignRoleResponse> {
    return assignRole(data);
  }
  
  /**
   * Get a user's role
   */
  public async getUserRole(userId: string): Promise<GetUserRoleResponse> {
    return getUserRole(userId);
  }
  
  /**
   * Update a user's role
   */
  public async updateRole(data: UpdateRoleRequest): Promise<UpdateRoleResponse> {
    return updateRole(data);
  }
  
  /**
   * Get users filtered by role
   */
  public async getUsersByRole(params?: GetUsersByRoleRequest): Promise<GetUsersByRoleResponse> {
    return getUsersByRole(params);
  }
  
  /**
   * Validate if role assignment is allowed
   */
  public async validateAssignment(data: ValidateAssignmentRequest): Promise<ValidateAssignmentResponse> {
    return validateAssignment(data);
  }
}

// ============================================================================
// CONVENIENCE EXPORTS
// ============================================================================

/**
 * Default role service instance
 */
export const roleService = RoleService.getInstance();

/**
 * Named exports for all role functions
 */
export const roleApi = {
  assignRole,
  getUserRole,
  updateRole,
  getUsersByRole,
  validateAssignment
} as const;

// ============================================================================
// TYPE GUARDS AND UTILITIES
// ============================================================================

/**
 * Type guard to check if API response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if API response is an error
 */
export function isErrorResponse(
  response: ApiResponse<any>
): response is ApiErrorResponse {
  return response.success === false;
}

/**
 * Extracts error message from API response for display
 */
export function getErrorMessage(response: ApiErrorResponse): string {
  // Return user-friendly error messages based on error codes
  switch (response.code) {
    case 'VALIDATION_ERROR':
      return response.details?.join(', ') || response.error;
    case 'USER_NOT_FOUND':
      return 'User not found. Please check the user ID and try again.';
    case 'ROLE_ASSIGNMENT_DENIED':
      return 'You do not have permission to assign this role.';
    case 'INSUFFICIENT_PERMISSIONS':
      return 'You do not have sufficient permissions to perform this action.';
    case 'INVALID_ROLE':
      return 'Invalid role specified. Please select a valid role.';
    case 'SELF_ROLE_MODIFICATION':
      return 'You cannot modify your own role. Please contact an administrator.';
    case 'ROLE_ALREADY_ASSIGNED':
      return 'User already has the specified role.';
    case 'UNAUTHORIZED':
      return 'Authentication required. Please log in again.';
    case 'NETWORK_ERROR':
      return 'Network connection failed. Please check your internet connection and try again.';
    case 'TIMEOUT_ERROR':
      return 'Request timed out. Please try again.';
    case 'INTERNAL_ERROR':
      return 'A server error occurred. Please try again later.';
    default:
      return response.error || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Extracts success message from API response for display
 */
export function getSuccessMessage<T>(response: ApiSuccessResponse<T>): string {
  if (response.message) {
    return response.message;
  }
  
  // Fallback messages based on data structure
  if (typeof response.data === 'object' && response.data !== null) {
    const data = response.data as any;
    if (data.message) {
      return data.message;
    }
  }
  
  return 'Operation completed successfully.';
}

// ============================================================================
// DEVELOPMENT UTILITIES
// ============================================================================

/**
 * Development helper to test API connectivity
 * Only available in development mode
 */
export async function testRoleApiConnection(): Promise<boolean> {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('testRoleApiConnection is only available in development mode');
    return false;
  }
  
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Development helper to log API configuration
 * Only available in development mode
 */
export function logRoleApiConfig(): void {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('logRoleApiConfig is only available in development mode');
    return;
  }
  
  console.group('Role API Configuration');
  console.log('Base URL:', API_CONFIG.baseUrl);
  console.log('Timeout:', API_CONFIG.timeout, 'ms');
  console.log('Endpoints:', ROLE_ENDPOINTS);
  console.groupEnd();
} 