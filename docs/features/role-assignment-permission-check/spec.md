# Role Assignment & Permission Check Feature Specification

## Feature Overview
This feature implements role assignment and permission checking functionality for the hotel booking system. Administrators can assign roles (user, staff, admin) to users, and the system enforces role-based permissions across all operations.

## Contracts Analysis
**Using existing contracts from shared/contracts/:**
- `api/role-api.contract.ts` - Complete role assignment API endpoints
- `services/role-service.contract.ts` - Role service layer methods
- `middleware/permission-middleware.contract.ts` - Permission checking middleware
- `models/user.contract.ts` - User model with role field (already exists)

## User Flow

### Admin Role Assignment Flow:
1. Admin logs into the system (existing functionality)
2. Admin navigates to role management page
3. Admin searches for users by email/name or views all users
4. Admin selects a user and chooses new role (user/staff/admin)
5. Admin provides optional reason for role change
6. System validates admin has permission to assign the selected role
7. System updates user's role and logs the change
8. Admin receives confirmation of successful assignment

### Permission Check Flow:
1. User attempts to access a protected resource
2. System verifies user is authenticated (existing middleware)
3. System checks if user's role has required permission
4. If authorized: User accesses the resource
5. If denied: User receives 403 Forbidden error

## API Endpoints

### Role Assignment Endpoints:
- `POST /api/v1/roles/assign` - Assign role to user (admin only)
- `PUT /api/v1/roles/update` - Update user's role (admin only)
- `GET /api/v1/roles/user/:userId/role` - Get user's role (admin/staff)
- `GET /api/v1/roles/users-by-role` - List users by role with pagination (admin/staff)
- `POST /api/v1/roles/validate-assignment` - Validate if assignment is allowed (admin/staff)

### Permission Middleware Functions:
- `requireRole(role)` - Require specific role
- `requireAnyRole(roles)` - Require any of specified roles
- `requirePermission(permission)` - Require specific permission
- `requireAnyPermission(permissions)` - Require any of specified permissions

## Database Schema

### Role Audit Log Collection (New):
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // User whose role was changed
  previousRole: String, // Previous role
  newRole: String, // New role assigned
  changedBy: ObjectId, // Admin who made the change
  reason: String, // Optional reason for change
  timestamp: Date,
  ipAddress: String // Optional IP address
}
```

### User Model Extensions (Already Exists):
The user model already has the `role` field from existing features.

## Validation Rules

### Role Assignment Rules:
- Only admins can assign admin role
- Only admins can assign staff role  
- Admins and staff can assign user role
- Users cannot assign any roles
- Cannot modify own role (prevents privilege escalation)
- User ID must be valid 24-character MongoDB ObjectId
- Role must be one of: user, staff, admin
- Reason is optional but limited to 500 characters

### Permission Hierarchy:
- **ADMIN (Level 3)**: All permissions, can manage all roles
- **STAFF (Level 2)**: Limited permissions, can manage users only
- **USER (Level 1)**: Basic permissions, cannot manage other users

## File Structure

### Backend Files (Max 400 lines each):
- `backend/src/models/role-audit-log.model.ts` - Role change audit log model
- `backend/src/services/role/role.service.ts` - Role assignment business logic
- `backend/src/middleware/permission.middleware.ts` - Permission checking middleware
- `backend/src/controllers/role/role.controller.ts` - Role assignment request handlers
- `backend/src/routes/role.routes.ts` - Role assignment route definitions

### Frontend Files (Max 400 lines each):
- `frontend/src/types/role.types.ts` - Role-related TypeScript interfaces
- `frontend/src/services/role.service.ts` - Role assignment API service
- `frontend/src/components/role/RoleAssignmentForm.tsx` - Role assignment form component
- `frontend/src/components/role/UserRoleList.tsx` - User list with role information
- `frontend/src/app/admin/roles/page.tsx` - Role management page

### Testing:
- `postman/role-assignment-permission-check.postman_collection.json` - Complete API test suite

## Security Considerations
- All role endpoints require authentication
- Role assignment requires admin permissions
- Permission checks happen on every protected route
- Role changes are logged for audit trail
- Rate limiting on role assignment endpoints
- Validation prevents privilege escalation attacks

## Integration Points
- Extends existing user authentication system
- Integrates with existing user model
- Uses existing middleware patterns
- Follows established error handling patterns
- Compatible with existing JWT token system