# User Profile API Documentation

This is CRITICAL - prevents API mismatches between frontend and backend!

## View Profile - GET /api/v1/profile/view

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/profile/user-profile.controller.ts`
- Service: `backend/src/services/profile/user-profile.service.ts`
- Route: `backend/src/routes/profile.routes.ts`

### Frontend Usage:
- Service call: `frontend/src/services/profile.service.ts`
- Component: `frontend/src/components/profile/ViewProfile.tsx`

### Request:
```http
GET /api/v1/profile/view
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Request Body:** None (GET request, user ID from JWT token)

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe", 
      "email": "john.doe@example.com",
      "isEmailVerified": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T14:22:00.000Z"
    }
  }
}
```

### Response Error (401):
```json
{
  "success": false,
  "error": "Unauthorized access",
  "code": "UNAUTHORIZED"
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

---

## Update Profile - PUT /api/v1/profile/update

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/profile/user-profile.controller.ts`
- Service: `backend/src/services/profile/user-profile.service.ts`
- Route: `backend/src/routes/profile.routes.ts`

### Frontend Usage:
- Service call: `frontend/src/services/profile.service.ts`
- Component: `frontend/src/components/profile/EditProfileForm.tsx`

### Request:
```http
PUT /api/v1/profile/update
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@example.com"
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
      "lastName": "Smith",
      "email": "john.smith@example.com",
      "isEmailVerified": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-27T16:45:00.000Z"
    },
    "message": "Profile updated successfully"
  }
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    "First name must be at least 2 characters long",
    "Email format is invalid"
  ]
}
```

### Response Error (409):
```json
{
  "success": false,
  "error": "Email is already in use",
  "code": "EMAIL_EXISTS"
}
```

### Response Error (401):
```json
{
  "success": false,
  "error": "Unauthorized access",
  "code": "UNAUTHORIZED"
}
```

---

## Critical Implementation Notes:

### Database Field Mapping:
**CRITICAL:** Model uses different field structure than API
- **Model stores:** `name: "John Smith"` (single field)
- **API sends/receives:** `firstName: "John", lastName: "Smith"` (separate fields)
- **Backend MUST transform:** Combine firstName + lastName → name for database
- **Backend MUST split:** name → firstName + lastName for API response

### Authentication:
- Both endpoints require valid JWT token in Authorization header
- Token MUST contain valid user ID that exists in database
- Use existing `authenticateToken` middleware from auth system

### Error Handling:
- MUST use exact error codes and messages as specified
- MUST follow existing error response format from `response.utils.ts`
- MUST include validation details array for VALIDATION_ERROR cases

### Rate Limiting:
- Apply same rate limiting patterns as auth endpoints
- Suggested: 10 requests per minute per user for profile operations