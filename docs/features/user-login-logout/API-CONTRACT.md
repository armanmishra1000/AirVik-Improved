# User Login & Logout API Contract

## RULE: Frontend and Backend MUST follow this EXACTLY

### User Login
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/login
- Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "string"
    },
    "token": "string",
    "refreshToken": "string",
    "expiresIn": "number"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed

### User Logout
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/logout
- Headers: Authorization: Bearer {token}
- Request Body:
```json
{
  "refreshToken": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed

### Token Refresh
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/refresh
- Request Body:
```json
{
  "refreshToken": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "string",
    "refreshToken": "string",
    "expiresIn": "number"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid refresh token",
  "code": "INVALID_REFRESH_TOKEN"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed
