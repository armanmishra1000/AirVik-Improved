# Role Assignment & Permission Check API Documentation

This is CRITICAL - prevents API mismatches!

## ASSIGN ROLE - POST /api/v1/roles/assign

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/role/role.controller.ts`
- Service: `backend/src/services/role/role.service.ts`
- Middleware: `requireAuth()`, `requireRole("admin")`

### Frontend Usage:
- Service call: `frontend/src/services/role.service.ts`
- Component: `frontend/src/components/role/RoleAssignmentForm.tsx`

### Request:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "role": "staff",
  "reason": "Promoted to handle customer service"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "staff",
      "isEmailVerified": true,
      "createdAt": "2025-01-27T10:00:00.000Z",
      "updatedAt": "2025-01-27T11:00:00.000Z"
    },
    "previousRole": "user",
    "newRole": "staff",
    "assignedBy": {
      "id": "507f1f77bcf86cd799439012",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com"
    },
    "reason": "Promoted to handle customer service",
    "message": "Role assigned successfully"
  }
}
```

### Response Error (400/403/404):
```json
{
  "success": false,
  "error": "You do not have permission to assign this role",
  "code": "ROLE_ASSIGNMENT_DENIED"
}
```

## GET USER ROLE - GET /api/v1/roles/user/:userId/role

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/role/role.controller.ts`
- Service: `backend/src/services/role/role.service.ts`
- Middleware: `requireAuth()`, `requireAnyRole(["admin", "staff"])`

### Frontend Usage:
- Service call: `frontend/src/services/role.service.ts`
- Component: `frontend/src/components/role/UserRoleList.tsx`

### Request:
URL Parameter: `userId` (24-character MongoDB ObjectId)

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "staff",
      "isEmailVerified": true,
      "createdAt": "2025-01-27T10:00:00.000Z",
      "updatedAt": "2025-01-27T11:00:00.000Z"
    }
  }
}
```

### Response Error (404):
```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

## UPDATE ROLE - PUT /api/v1/roles/update

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/role/role.controller.ts`
- Service: `backend/src/services/role/role.service.ts`
- Middleware: `requireAuth()`, `requireRole("admin")`

### Frontend Usage:
- Service call: `frontend/src/services/role.service.ts`
- Component: `frontend/src/components/role/RoleAssignmentForm.tsx`

### Request:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "newRole": "admin",
  "reason": "Promoted to system administrator"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "admin",
      "isEmailVerified": true,
      "createdAt": "2025-01-27T10:00:00.000Z",
      "updatedAt": "2025-01-27T11:30:00.000Z"
    },
    "previousRole": "staff",
    "newRole": "admin",
    "updatedBy": {
      "id": "507f1f77bcf86cd799439012",
      "firstName": "Super",
      "lastName": "Admin",
      "email": "superadmin@example.com"
    },
    "reason": "Promoted to system administrator",
    "message": "Role updated successfully"
  }
}
```

### Response Error (403):
```json
{
  "success": false,
  "error": "You cannot modify your own role",
  "code": "SELF_ROLE_MODIFICATION"
}
```

## GET USERS BY ROLE - GET /api/v1/roles/users-by-role

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/role/role.controller.ts`
- Service: `backend/src/services/role/role.service.ts`
- Middleware: `requireAuth()`, `requireAnyRole(["admin", "staff"])`

### Frontend Usage:
- Service call: `frontend/src/services/role.service.ts`
- Component: `frontend/src/components/role/UserRoleList.tsx`

### Request:
Query Parameters: `?role=staff&page=1&limit=10&sortBy=name&sortOrder=asc`

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "role": "staff",
        "isEmailVerified": true,
        "createdAt": "2025-01-27T10:00:00.000Z",
        "updatedAt": "2025-01-27T11:00:00.000Z"
      }
    ],
    "pagination": {
      "totalCount": 25,
      "currentPage": 1,
      "totalPages": 3,
      "limit": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "filters": {
      "role": "staff",
      "sortBy": "name",
      "sortOrder": "asc"
    }
  }
}
```

## VALIDATE ASSIGNMENT - POST /api/v1/roles/validate-assignment

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/role/role.controller.ts`
- Service: `backend/src/services/role/role.service.ts`
- Middleware: `requireAuth()`, `requireAnyRole(["admin", "staff"])`

### Frontend Usage:
- Service call: `frontend/src/services/role.service.ts`
- Component: `frontend/src/components/role/RoleAssignmentForm.tsx`

### Request:
```json
{
  "targetUserId": "507f1f77bcf86cd799439011",
  "targetRole": "admin"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "canAssign": false,
    "validation": {
      "isValid": false,
      "requiredRole": "admin",
      "currentUserRole": "staff",
      "targetRole": "admin",
      "reason": "Only admins can assign admin role"
    },
    "message": "Assignment not allowed"
  }
}
```

## Permission Middleware Usage

### Route Protection Examples:
```javascript
// Single role requirement
router.get('/admin-only', requireAuth(), requireRole('admin'), handler);

// Multiple role options  
router.get('/admin-or-staff', requireAuth(), requireAnyRole(['admin', 'staff']), handler);

// Permission-based
router.post('/create-room', requireAuth(), requirePermission('create_rooms'), handler);

// Multiple permissions
router.delete('/delete-user', requireAuth(), requireAllPermissions(['delete_users', 'view_users']), handler);
```

### Middleware Error Responses:
```json
{
  "success": false,
  "error": "Access denied. Required role not found.",
  "code": "ROLE_REQUIRED"
}
```

## Rate Limiting Configuration:
- Role assignment: 10 attempts per 15 minutes
- Role updates: 10 attempts per 15 minutes  
- User queries: 60 requests per minute
- Validation requests: 30 requests per minute