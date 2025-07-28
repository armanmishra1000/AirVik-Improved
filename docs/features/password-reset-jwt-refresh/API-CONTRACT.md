# Password Reset & JWT Token Refresh API Contract

## RULE: Frontend and Backend MUST follow this EXACTLY

### Password Reset Request - POST /api/v1/auth/password-reset/request
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/password-reset/request
- Request Body:
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent successfully"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Email not found",
  "code": "EMAIL_NOT_FOUND"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed

### Password Reset Verify - POST /api/v1/auth/password-reset/verify
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/password-reset/verify
- Request Body:
```json
{
  "token": "reset_token_here",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Invalid or expired reset token",
  "code": "INVALID_RESET_TOKEN"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed

### JWT Token Refresh - POST /api/v1/auth/refresh-token
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/refresh-token
- Request Body:
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid or expired refresh token",
  "code": "INVALID_REFRESH_TOKEN"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed
