# Password Reset & JWT Token Refresh API Documentation

## CRITICAL - This prevents API mismatches between frontend and backend!

## Password Reset Request - POST /api/v1/auth/password-reset/request

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/auth/user-auth.controller.ts` (extend existing)
- Service: `backend/src/services/auth/user-auth.service.ts` (extend existing)
- Validation: Input validation within controller method

### Frontend Usage:
- Service call: `frontend/src/services/password-reset.service.ts`
- Component: `frontend/src/components/auth/ForgotPasswordForm.tsx`

### Request:
```json
{
  "email": "user@example.com"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "message": "Password reset email sent successfully"
  }
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "Email not found",
  "code": "EMAIL_NOT_FOUND"
}
```

### Response Error (429):
```json
{
  "success": false,
  "error": "Too many password reset requests. Please try again later",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

---

## Password Reset Verify - POST /api/v1/auth/password-reset/verify

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/auth/user-auth.controller.ts` (extend existing)
- Service: `backend/src/services/auth/user-auth.service.ts` (extend existing)
- Validation: Password strength validation

### Frontend Usage:
- Service call: `frontend/src/services/password-reset.service.ts`
- Component: `frontend/src/components/auth/ResetPasswordForm.tsx`

### Request:
```json
{
  "token": "abc123resettoken456def",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "Invalid or expired reset token",
  "code": "INVALID_RESET_TOKEN"
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "Passwords do not match",
  "code": "PASSWORD_MISMATCH"
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "Password does not meet security requirements",
  "code": "WEAK_PASSWORD"
}
```

---

## JWT Token Refresh - POST /api/v1/auth/refresh-token

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/auth/user-auth.controller.ts` (extend existing)
- Service: `backend/src/services/auth/user-auth.service.ts` (use existing refreshUserToken method)
- Validation: Refresh token validation

### Frontend Usage:
- Service call: `frontend/src/services/auth.service.ts` (extend existing)
- Auto-called by HTTP interceptor on 401 responses

### Request:
```json
{
  "refreshToken": "refresh_token_jwt_string_here"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "new_access_jwt_token",
    "refreshToken": "new_refresh_jwt_token"
  }
}
```

### Response Error (401):
```json
{
  "success": false,
  "error": "Invalid or expired refresh token",
  "code": "INVALID_REFRESH_TOKEN"
}
```

### Response Error (401):
```json
{
  "success": false,
  "error": "Refresh token not found",
  "code": "REFRESH_TOKEN_NOT_FOUND"
}
```

---

## Rate Limiting Rules

### Password Reset Request:
- **Limit**: 3 requests per 15 minutes per email address
- **Implementation**: In-memory store or Redis preferred
- **Reset**: Sliding window based on email

### Password Reset Verify:
- **Limit**: 5 attempts per reset token
- **Implementation**: Counter in user document
- **Reset**: Token invalidated after max attempts

### JWT Token Refresh:
- **Limit**: 10 requests per minute per user
- **Implementation**: In-memory store with user ID key
- **Reset**: Sliding window per user

## Security Headers
All endpoints must include:
```
Content-Type: application/json
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## CORS Configuration
- Must allow frontend origin: `http://localhost:3000`
- Production origins to be configured per environment
- Credentials: true (for cookie-based sessions if used)

## Testing Contract
Each endpoint MUST be tested with:
1. Valid request with expected success response
2. Invalid input with appropriate error response  
3. Rate limiting test with 429 response
4. Authentication edge cases
5. Malformed request body handling
