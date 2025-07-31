# Role Assignment & Permission Check API Contract

## RULE: Frontend and Backend MUST follow this EXACTLY

**CRITICAL: This contract is based on existing shared/contracts/ - USE EXACT PROPERTY NAMES**

### Assign Role Endpoint
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/roles/assign
- Request Body:
```json
{
  "userId": "string (24-char MongoDB ObjectId)",
  "role": "user|staff|admin",
  "reason": "string (optional, max 500 chars)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string", 
      "email": "string",
      "role": "user|staff|admin",
      "isEmailVerified": "boolean",
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    },
    "previousRole": "user|staff|admin",
    "newRole": "user|staff|admin",
    "assignedBy": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    },
    "reason": "string (optional)",
    "message": "string"
  }
}
```

**Error Response (400/403/404):**
```json
{
  "success": false,
  "error": "Human readable message",
  "code": "VALIDATION_ERROR|USER_NOT_FOUND|ROLE_ASSIGNMENT_DENIED|INSUFFICIENT_PERMISSIONS|INVALID_ROLE|SELF_ROLE_MODIFICATION|ROLE_ALREADY_ASSIGNED"
}
```

### Get User Role Endpoint
**Backend MUST provide:**
- Method: GET
- URL: /api/v1/roles/user/:userId/role

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string", 
      "role": "user|staff|admin",
      "isEmailVerified": "boolean",
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    }
  }
}
```

### Update Role Endpoint
**Backend MUST provide:**
- Method: PUT
- URL: /api/v1/roles/update
- Request Body:
```json
{
  "userId": "string (24-char MongoDB ObjectId)",
  "newRole": "user|staff|admin",
  "reason": "string (optional, max 500 chars)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "user|staff|admin", 
      "isEmailVerified": "boolean",
      "createdAt": "string (ISO date)",
      "updatedAt": "string (ISO date)"
    },
    "previousRole": "user|staff|admin",
    "newRole": "user|staff|admin",
    "updatedBy": {
      "id": "string",
      "firstName": "string", 
      "lastName": "string",
      "email": "string"
    },
    "reason": "string (optional)",
    "message": "string"
  }
}
```

### Get Users By Role Endpoint
**Backend MUST provide:**
- Method: GET
- URL: /api/v1/roles/users-by-role
- Query Parameters:
```
?role=user|staff|admin&page=1&limit=10&sortBy=name|email|createdAt&sortOrder=asc|desc
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "role": "user|staff|admin",
        "isEmailVerified": "boolean",
        "createdAt": "string (ISO date)",
        "updatedAt": "string (ISO date)"
      }
    ],
    "pagination": {
      "totalCount": "number",
      "currentPage": "number", 
      "totalPages": "number",
      "limit": "number",
      "hasNextPage": "boolean",
      "hasPreviousPage": "boolean"
    },
    "filters": {
      "role": "user|staff|admin (optional)",
      "sortBy": "string",
      "sortOrder": "string"
    }
  }
}
```

### Validate Assignment Endpoint
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/roles/validate-assignment
- Request Body:
```json
{
  "targetUserId": "string (24-char MongoDB ObjectId)",
  "targetRole": "user|staff|admin"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "canAssign": "boolean",
    "validation": {
      "isValid": "boolean",
      "requiredRole": "user|staff|admin (optional)",
      "currentUserRole": "user|staff|admin",
      "targetRole": "user|staff|admin",
      "reason": "string (optional)"
    },
    "message": "string"
  }
}
```

## Permission Check Middleware
**Backend MUST provide middleware functions:**

### requireRole(role)
- Middleware that checks if user has specific role
- Returns 403 if insufficient permissions

### requireAnyRole(roles)
- Middleware that checks if user has any of the specified roles
- Returns 403 if user doesn't have any required role

### requirePermission(permission)
- Middleware that checks if user has specific permission
- Returns 403 if permission denied

### Available Permissions:
- view_users, create_users, update_users, delete_users, assign_roles
- view_rooms, create_rooms, update_rooms, delete_rooms, manage_room_availability
- view_all_bookings, view_own_bookings, create_bookings, update_bookings, delete_bookings, cancel_bookings
- view_system_logs, manage_settings, backup_restore
- view_own_profile, update_own_profile

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed
- Use exact error codes specified in contracts