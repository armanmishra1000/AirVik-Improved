# User Profile API Contract

## RULE: Frontend and Backend MUST follow this EXACTLY

### View Profile - GET /api/v1/profile/view
**Backend MUST provide:**
- Method: GET
- URL: /api/v1/profile/view
- Headers: Authorization: Bearer {jwt_token}
- Request Body: None (user ID from JWT token)

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
      "isEmailVerified": boolean,
      "createdAt": "string",
      "updatedAt": "string"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Unauthorized access",
  "code": "UNAUTHORIZED"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed
- Authentication header required

### Update Profile - PUT /api/v1/profile/update
**Backend MUST provide:**
- Method: PUT
- URL: /api/v1/profile/update
- Headers: Authorization: Bearer {jwt_token}
- Request Body:
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string"
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
      "isEmailVerified": boolean,
      "createdAt": "string",
      "updatedAt": "string"
    },
    "message": "Profile updated successfully"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": ["Field-specific error messages"]
}
```

**Error Response (409):**
```json
{
  "success": false,
  "error": "Email is already in use",
  "code": "EMAIL_EXISTS"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed
- Authentication header required