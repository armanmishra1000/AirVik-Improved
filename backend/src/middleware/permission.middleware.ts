import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.utils';

// Import types from contracts
export type UserRole = 'user' | 'staff' | 'admin';

// Permission definitions
export const PERMISSIONS = {
  // User Management
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  UPDATE_USERS: 'update_users',
  DELETE_USERS: 'delete_users',
  ASSIGN_ROLES: 'assign_roles',
  
  // Room Management
  VIEW_ROOMS: 'view_rooms',
  CREATE_ROOMS: 'create_rooms',
  UPDATE_ROOMS: 'update_rooms',
  DELETE_ROOMS: 'delete_rooms',
  MANAGE_ROOM_AVAILABILITY: 'manage_room_availability',
  
  // Booking Management
  VIEW_ALL_BOOKINGS: 'view_all_bookings',
  VIEW_OWN_BOOKINGS: 'view_own_bookings',
  CREATE_BOOKINGS: 'create_bookings',
  UPDATE_BOOKINGS: 'update_bookings',
  DELETE_BOOKINGS: 'delete_bookings',
  CANCEL_BOOKINGS: 'cancel_bookings',
  
  // System Administration
  VIEW_SYSTEM_LOGS: 'view_system_logs',
  MANAGE_SETTINGS: 'manage_settings',
  BACKUP_RESTORE: 'backup_restore',
  
  // Profile Management
  VIEW_OWN_PROFILE: 'view_own_profile',
  UPDATE_OWN_PROFILE: 'update_own_profile'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role-permission mapping
export const ROLE_PERMISSIONS = {
  admin: [
    // Full access to everything
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.UPDATE_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.ASSIGN_ROLES,
    PERMISSIONS.VIEW_ROOMS,
    PERMISSIONS.CREATE_ROOMS,
    PERMISSIONS.UPDATE_ROOMS,
    PERMISSIONS.DELETE_ROOMS,
    PERMISSIONS.MANAGE_ROOM_AVAILABILITY,
    PERMISSIONS.VIEW_ALL_BOOKINGS,
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.UPDATE_BOOKINGS,
    PERMISSIONS.DELETE_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKINGS,
    PERMISSIONS.VIEW_SYSTEM_LOGS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.BACKUP_RESTORE,
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE
  ],
  
  staff: [
    // Limited user management
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.UPDATE_USERS, // Can update user profiles but not create/delete
    
    // Full room management
    PERMISSIONS.VIEW_ROOMS,
    PERMISSIONS.CREATE_ROOMS,
    PERMISSIONS.UPDATE_ROOMS,
    PERMISSIONS.MANAGE_ROOM_AVAILABILITY,
    
    // Full booking management
    PERMISSIONS.VIEW_ALL_BOOKINGS,
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.UPDATE_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKINGS,
    
    // Own profile
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE
  ],
  
  user: [
    // Basic room viewing
    PERMISSIONS.VIEW_ROOMS,
    
    // Own bookings only
    PERMISSIONS.VIEW_OWN_BOOKINGS,
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.CANCEL_BOOKINGS, // Can cancel own bookings
    
    // Own profile
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE
  ]
};

// Error responses
export const PERMISSION_MIDDLEWARE_ERRORS = {
  ROLE_REQUIRED: {
    error: 'Access denied. Required role not found.',
    code: 'ROLE_REQUIRED',
    status: 403
  },
  INSUFFICIENT_ROLE: {
    error: 'Access denied. Insufficient role permissions.',
    code: 'INSUFFICIENT_ROLE',
    status: 403
  },
  PERMISSION_DENIED: {
    error: 'Access denied. Required permission not found.',
    code: 'PERMISSION_DENIED',
    status: 403
  },
  MULTIPLE_ROLES_REQUIRED: {
    error: 'Access denied. Multiple roles are required.',
    code: 'MULTIPLE_ROLES_REQUIRED',
    status: 403
  },
  MULTIPLE_PERMISSIONS_REQUIRED: {
    error: 'Access denied. Multiple permissions are required.',
    code: 'MULTIPLE_PERMISSIONS_REQUIRED',
    status: 403
  },
  USER_ROLE_NOT_FOUND: {
    error: 'User role information not available.',
    code: 'USER_ROLE_NOT_FOUND',
    status: 403
  },
  INTERNAL_ERROR: {
    error: 'Internal server error during permission check.',
    code: 'INTERNAL_ERROR',
    status: 500
  }
} as const;

// Interface for authenticated request with role
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isEmailVerified?: boolean;
    role?: UserRole; // Extended to include role information
  };
}

// Helper functions
const getUserRole = (user: AuthenticatedRequest['user']): UserRole | null => {
  if (!user || !user.role) {
    return null;
  }
  return user.role;
};

const hasRole = (user: AuthenticatedRequest['user'], role: UserRole): boolean => {
  const userRole = getUserRole(user);
  return userRole === role;
};

const hasAnyRole = (user: AuthenticatedRequest['user'], roles: UserRole[]): boolean => {
  const userRole = getUserRole(user);
  return userRole ? roles.includes(userRole) : false;
};

const hasAllRoles = (user: AuthenticatedRequest['user'], roles: UserRole[]): boolean => {
  const userRole = getUserRole(user);
  return userRole ? roles.includes(userRole) : false;
};

const getRolePermissions = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

const hasPermission = (user: AuthenticatedRequest['user'], permission: Permission): boolean => {
  const userRole = getUserRole(user);
  if (!userRole) {
    return false;
  }
  
  const rolePermissions = getRolePermissions(userRole);
  return rolePermissions.includes(permission);
};

const hasAnyPermission = (user: AuthenticatedRequest['user'], permissions: Permission[]): boolean => {
  const userRole = getUserRole(user);
  if (!userRole) {
    return false;
  }
  
  const rolePermissions = getRolePermissions(userRole);
  return permissions.some(permission => rolePermissions.includes(permission));
};

const hasAllPermissions = (user: AuthenticatedRequest['user'], permissions: Permission[]): boolean => {
  const userRole = getUserRole(user);
  if (!userRole) {
    return false;
  }
  
  const rolePermissions = getRolePermissions(userRole);
  return permissions.every(permission => rolePermissions.includes(permission));
};

// Main middleware functions
export const requireRole = (
  role: UserRole
): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void> => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      // Check if user exists
      if (!req.user) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.error,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.code,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.status
        );
      }

      // Check if user has the required role
      if (!hasRole(req.user, role)) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.ROLE_REQUIRED.error,
          PERMISSION_MIDDLEWARE_ERRORS.ROLE_REQUIRED.code,
          PERMISSION_MIDDLEWARE_ERRORS.ROLE_REQUIRED.status
        );
      }

      // Continue to next middleware or route handler
      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return sendError(
        res,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.error,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.code,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.status
      );
    }
  };
};

export const requireAnyRole = (
  roles: UserRole[]
): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void> => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      // Check if user exists
      if (!req.user) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.error,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.code,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.status
        );
      }

      // Check if user has any of the required roles
      if (!hasAnyRole(req.user, roles)) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.INSUFFICIENT_ROLE.error,
          PERMISSION_MIDDLEWARE_ERRORS.INSUFFICIENT_ROLE.code,
          PERMISSION_MIDDLEWARE_ERRORS.INSUFFICIENT_ROLE.status
        );
      }

      // Continue to next middleware or route handler
      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return sendError(
        res,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.error,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.code,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.status
      );
    }
  };
};

export const requireAllRoles = (
  roles: UserRole[]
): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void> => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      // Check if user exists
      if (!req.user) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.error,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.code,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.status
        );
      }

      // Check if user has all of the required roles
      if (!hasAllRoles(req.user, roles)) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.MULTIPLE_ROLES_REQUIRED.error,
          PERMISSION_MIDDLEWARE_ERRORS.MULTIPLE_ROLES_REQUIRED.code,
          PERMISSION_MIDDLEWARE_ERRORS.MULTIPLE_ROLES_REQUIRED.status
        );
      }

      // Continue to next middleware or route handler
      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return sendError(
        res,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.error,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.code,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.status
      );
    }
  };
};

export const requirePermission = (
  permission: Permission
): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void> => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      // Check if user exists
      if (!req.user) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.error,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.code,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.status
        );
      }

      // Check if user has the required permission
      if (!hasPermission(req.user, permission)) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.PERMISSION_DENIED.error,
          PERMISSION_MIDDLEWARE_ERRORS.PERMISSION_DENIED.code,
          PERMISSION_MIDDLEWARE_ERRORS.PERMISSION_DENIED.status
        );
      }

      // Continue to next middleware or route handler
      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return sendError(
        res,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.error,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.code,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.status
      );
    }
  };
};

export const requireAnyPermission = (
  permissions: Permission[]
): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void> => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      // Check if user exists
      if (!req.user) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.error,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.code,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.status
        );
      }

      // Check if user has any of the required permissions
      if (!hasAnyPermission(req.user, permissions)) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.PERMISSION_DENIED.error,
          PERMISSION_MIDDLEWARE_ERRORS.PERMISSION_DENIED.code,
          PERMISSION_MIDDLEWARE_ERRORS.PERMISSION_DENIED.status
        );
      }

      // Continue to next middleware or route handler
      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return sendError(
        res,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.error,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.code,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.status
      );
    }
  };
};

export const requireAllPermissions = (
  permissions: Permission[]
): (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response | void> => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      // Check if user exists
      if (!req.user) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.error,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.code,
          PERMISSION_MIDDLEWARE_ERRORS.USER_ROLE_NOT_FOUND.status
        );
      }

      // Check if user has all of the required permissions
      if (!hasAllPermissions(req.user, permissions)) {
        return sendError(
          res,
          PERMISSION_MIDDLEWARE_ERRORS.MULTIPLE_PERMISSIONS_REQUIRED.error,
          PERMISSION_MIDDLEWARE_ERRORS.MULTIPLE_PERMISSIONS_REQUIRED.code,
          PERMISSION_MIDDLEWARE_ERRORS.MULTIPLE_PERMISSIONS_REQUIRED.status
        );
      }

      // Continue to next middleware or route handler
      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return sendError(
        res,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.error,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.code,
        PERMISSION_MIDDLEWARE_ERRORS.INTERNAL_ERROR.status
      );
    }
  };
};

// Export middleware functions
export const permissionMiddleware = {
  requireRole,
  requireAnyRole,
  requireAllRoles,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions
};

export default permissionMiddleware; 