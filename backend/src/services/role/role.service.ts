import User, { IUserDocument } from '../../models/user.model.js';
import RoleAuditLog, { IRoleAuditLogDocument, CreateAuditLogData } from '../../models/role-audit-log.model.js';

// Import types from contracts
export type UserRole = 'user' | 'staff' | 'admin';

// Service request interfaces
export interface AssignRoleData {
  userId: string;
  role: UserRole;
  assignedBy: string;
  reason?: string;
  ipAddress?: string;
}

export interface UpdateRoleData {
  userId: string;
  currentRole: UserRole;
  newRole: UserRole;
  updatedBy: string;
  reason?: string;
  ipAddress?: string;
}

export interface RoleQueryData {
  role?: UserRole;
  limit?: number;
  page?: number;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Service response interfaces
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: string[];
  message?: string;
}

export interface UserRoleInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssignRoleResponse {
  user: UserRoleInfo;
  previousRole: UserRole;
  newRole: UserRole;
  assignedBy: string;
  message: string;
}

export interface UpdateRoleResponse {
  user: UserRoleInfo;
  previousRole: UserRole;
  newRole: UserRole;
  updatedBy: string;
  message: string;
}

export interface GetUserRoleResponse {
  user: UserRoleInfo;
}

export interface GetUsersByRoleResponse {
  users: UserRoleInfo[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface RoleValidationResponse {
  isValid: boolean;
  canAssign: boolean;
  reason?: string;
}

// Role hierarchy definitions
export const ROLE_HIERARCHY = {
  ADMIN: {
    level: 3,
    permissions: ['all'],
    canManage: ['user', 'staff', 'admin']
  },
  STAFF: {
    level: 2,
    permissions: ['read_users', 'manage_bookings', 'manage_rooms'],
    canManage: ['user']
  },
  USER: {
    level: 1,
    permissions: ['read_own_profile', 'create_bookings', 'view_rooms'],
    canManage: []
  }
} as const;

// Error codes
export const ROLE_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ROLE_ASSIGNMENT_DENIED: 'ROLE_ASSIGNMENT_DENIED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  INVALID_ROLE: 'INVALID_ROLE',
  SELF_ROLE_MODIFICATION: 'SELF_ROLE_MODIFICATION',
  ROLE_ALREADY_ASSIGNED: 'ROLE_ALREADY_ASSIGNED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED'
} as const;

// Helper function to convert user document to UserRoleInfo
const convertUserToRoleInfo = (user: IUserDocument): UserRoleInfo => {
  const nameParts = user.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  return {
    id: (user._id as any).toString(),
    firstName,
    lastName,
    email: user.email,
    role: user.role as UserRole,
    isEmailVerified: user.isActive,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
};

// Helper function to validate role assignment permissions
const validateRoleAssignmentPermission = async (
  assignerId: string,
  targetRole: UserRole
): Promise<{ canAssign: boolean; reason?: string }> => {
  try {
    const assigner = await User.findById(assignerId);
    if (!assigner) {
      return { canAssign: false, reason: 'Assigner not found' };
    }

    const assignerRole = assigner.role as UserRole;
    
    // Check role hierarchy
    switch (targetRole) {
      case 'admin':
        if (assignerRole !== 'admin') {
          return { canAssign: false, reason: 'Only admins can assign admin role' };
        }
        break;
      case 'staff':
        if (assignerRole !== 'admin') {
          return { canAssign: false, reason: 'Only admins can assign staff role' };
        }
        break;
      case 'user':
        if (assignerRole === 'user') {
          return { canAssign: false, reason: 'Users cannot assign any roles' };
        }
        break;
    }
    
    return { canAssign: true };
  } catch (error) {
    return { canAssign: false, reason: 'Error validating permissions' };
  }
};

// Helper function to create audit log
const createAuditLog = async (auditData: CreateAuditLogData): Promise<void> => {
  try {
    const auditLog = new RoleAuditLog(auditData);
    await auditLog.save();
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
};

// Main service methods
export const assignUserRole = async (
  roleData: AssignRoleData
): Promise<ServiceResponse<AssignRoleResponse>> => {
  try {
    const { userId, role, assignedBy, reason, ipAddress } = roleData;

    // Validate input
    if (!userId || !role || !assignedBy) {
      return {
        success: false,
        error: 'Missing required fields',
        code: ROLE_ERROR_CODES.VALIDATION_ERROR
      };
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: ROLE_ERROR_CODES.USER_NOT_FOUND
      };
    }

    // Check if assigner exists
    const assigner = await User.findById(assignedBy);
    if (!assigner) {
      return {
        success: false,
        error: 'Assigner not found',
        code: ROLE_ERROR_CODES.USER_NOT_FOUND
      };
    }

    // Prevent self-modification
    if (userId === assignedBy) {
      return {
        success: false,
        error: 'Cannot modify your own role',
        code: ROLE_ERROR_CODES.SELF_ROLE_MODIFICATION
      };
    }

    // Check if user already has the target role
    if (user.role === role) {
      return {
        success: false,
        error: 'User already has this role',
        code: ROLE_ERROR_CODES.ROLE_ALREADY_ASSIGNED
      };
    }

    // Validate assignment permissions
    const permissionCheck = await validateRoleAssignmentPermission(assignedBy, role);
    if (!permissionCheck.canAssign) {
      return {
        success: false,
        error: permissionCheck.reason || 'Role assignment denied',
        code: ROLE_ERROR_CODES.ROLE_ASSIGNMENT_DENIED
      };
    }

    // Store previous role
    const previousRole = user.role as UserRole;

    // Update user role
    user.role = role;
    await user.save();

    // Create audit log
    await createAuditLog({
      userId,
      previousRole,
      newRole: role,
      changedBy: assignedBy,
      reason,
      ipAddress
    });

    // Prepare response
    const userInfo = convertUserToRoleInfo(user);
    const assignerName = assigner.name.split(' ')[0] || assigner.email;

    return {
      success: true,
      data: {
        user: userInfo,
        previousRole,
        newRole: role,
        assignedBy: assignerName,
        message: `Role assigned successfully to ${userInfo.firstName} ${userInfo.lastName}`
      }
    };

  } catch (error) {
    console.error('Error in assignUserRole:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: ROLE_ERROR_CODES.INTERNAL_ERROR
    };
  }
};

export const getUserRole = async (
  userId: string
): Promise<ServiceResponse<GetUserRoleResponse>> => {
  try {
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required',
        code: ROLE_ERROR_CODES.VALIDATION_ERROR
      };
    }

    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: ROLE_ERROR_CODES.USER_NOT_FOUND
      };
    }

    const userInfo = convertUserToRoleInfo(user);

    return {
      success: true,
      data: {
        user: userInfo
      }
    };

  } catch (error) {
    console.error('Error in getUserRole:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: ROLE_ERROR_CODES.INTERNAL_ERROR
    };
  }
};

export const updateUserRole = async (
  roleData: UpdateRoleData
): Promise<ServiceResponse<UpdateRoleResponse>> => {
  try {
    const { userId, currentRole, newRole, updatedBy, reason, ipAddress } = roleData;

    // Validate input
    if (!userId || !currentRole || !newRole || !updatedBy) {
      return {
        success: false,
        error: 'Missing required fields',
        code: ROLE_ERROR_CODES.VALIDATION_ERROR
      };
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return {
        success: false,
        error: 'User not found',
        code: ROLE_ERROR_CODES.USER_NOT_FOUND
      };
    }

    // Check if updater exists
    const updater = await User.findById(updatedBy);
    if (!updater) {
      return {
        success: false,
        error: 'Updater not found',
        code: ROLE_ERROR_CODES.USER_NOT_FOUND
      };
    }

    // Prevent self-modification
    if (userId === updatedBy) {
      return {
        success: false,
        error: 'Cannot modify your own role',
        code: ROLE_ERROR_CODES.SELF_ROLE_MODIFICATION
      };
    }

    // Verify current role matches
    if (user.role !== currentRole) {
      return {
        success: false,
        error: 'Current role does not match',
        code: ROLE_ERROR_CODES.VALIDATION_ERROR
      };
    }

    // Check if role is actually changing
    if (currentRole === newRole) {
      return {
        success: false,
        error: 'New role is same as current role',
        code: ROLE_ERROR_CODES.ROLE_ALREADY_ASSIGNED
      };
    }

    // Validate update permissions
    const permissionCheck = await validateRoleAssignmentPermission(updatedBy, newRole);
    if (!permissionCheck.canAssign) {
      return {
        success: false,
        error: permissionCheck.reason || 'Role update denied',
        code: ROLE_ERROR_CODES.ROLE_ASSIGNMENT_DENIED
      };
    }

    // Update user role
    user.role = newRole;
    await user.save();

    // Create audit log
    await createAuditLog({
      userId,
      previousRole: currentRole,
      newRole,
      changedBy: updatedBy,
      reason,
      ipAddress
    });

    // Prepare response
    const userInfo = convertUserToRoleInfo(user);
    const updaterName = updater.name.split(' ')[0] || updater.email;

    return {
      success: true,
      data: {
        user: userInfo,
        previousRole: currentRole,
        newRole,
        updatedBy: updaterName,
        message: `Role updated successfully for ${userInfo.firstName} ${userInfo.lastName}`
      }
    };

  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: ROLE_ERROR_CODES.INTERNAL_ERROR
    };
  }
};

export const getUsersByRole = async (
  queryData: RoleQueryData
): Promise<ServiceResponse<GetUsersByRoleResponse>> => {
  try {
    const { role, limit = 10, page = 1, sortBy = 'name', sortOrder = 'asc' } = queryData;

    // Validate pagination
    if (limit < 1 || limit > 100) {
      return {
        success: false,
        error: 'Limit must be between 1 and 100',
        code: ROLE_ERROR_CODES.VALIDATION_ERROR
      };
    }

    if (page < 1) {
      return {
        success: false,
        error: 'Page must be greater than 0',
        code: ROLE_ERROR_CODES.VALIDATION_ERROR
      };
    }

    // Build query
    const query: any = {};
    if (role) {
      query.role = role;
    }

    // Build sort
    let sort: any = {};
    switch (sortBy) {
      case 'name':
        sort.name = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'email':
        sort.email = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'createdAt':
        sort.createdAt = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sort.name = 1;
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Execute queries
    const [users, totalCount] = await Promise.all([
      User.find(query).sort(sort).skip(skip).limit(limit),
      User.countDocuments(query)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Convert users to UserRoleInfo
    const userInfos = users.map(convertUserToRoleInfo);

    return {
      success: true,
      data: {
        users: userInfos,
        totalCount,
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPreviousPage
      }
    };

  } catch (error) {
    console.error('Error in getUsersByRole:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: ROLE_ERROR_CODES.INTERNAL_ERROR
    };
  }
};

export const validateRoleAssignment = async (
  assignerId: string,
  targetRole: UserRole
): Promise<ServiceResponse<RoleValidationResponse>> => {
  try {
    if (!assignerId || !targetRole) {
      return {
        success: false,
        error: 'Assigner ID and target role are required',
        code: ROLE_ERROR_CODES.VALIDATION_ERROR
      };
    }

    // Validate target role
    if (!['user', 'staff', 'admin'].includes(targetRole)) {
      return {
        success: false,
        error: 'Invalid target role',
        code: ROLE_ERROR_CODES.INVALID_ROLE
      };
    }

    // Check if assigner exists
    const assigner = await User.findById(assignerId);
    if (!assigner) {
      return {
        success: false,
        error: 'Assigner not found',
        code: ROLE_ERROR_CODES.USER_NOT_FOUND
      };
    }

    // Validate permissions
    const permissionCheck = await validateRoleAssignmentPermission(assignerId, targetRole);

    return {
      success: true,
      data: {
        isValid: permissionCheck.canAssign,
        canAssign: permissionCheck.canAssign,
        reason: permissionCheck.reason
      }
    };

  } catch (error) {
    console.error('Error in validateRoleAssignment:', error);
    return {
      success: false,
      error: 'Internal server error',
      code: ROLE_ERROR_CODES.INTERNAL_ERROR
    };
  }
};

// Export the service object
export const roleService = {
  assignUserRole,
  getUserRole,
  updateUserRole,
  getUsersByRole,
  validateRoleAssignment
};

export default roleService; 