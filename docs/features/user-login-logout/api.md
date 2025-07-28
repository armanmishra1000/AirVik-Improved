# User Login & Logout API Documentation

## CRITICAL - API Contract Agreement
**Backend provides → Frontend expects → MUST MATCH EXACTLY**

---

## Login Endpoint - POST /api/v1/auth/login

### Contract Agreement:
Backend provides authentication service → Frontend expects user data and tokens → MUST MATCH EXACTLY

### Backend Implementation:
- **Controller:** `backend/src/controllers/auth/auth.controller.ts`
- **Service:** `backend/src/services/auth/auth.service.ts`
- **Validation:** `backend/src/validators/auth.validator.ts`

### Frontend Usage:
- **Service call:** `frontend/src/services/auth.service.ts`
- **Component:** `frontend/src/components/auth/LoginForm.tsx`

### Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f8a1234567890123456789",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "rt_abc123xyz789...",
    "expiresIn": 3600
  }
}
```

### Response Error (401):
```json
{
  "success": false,
  "error": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

### Response Error (400):
```json
{
  "success": false,
  "error": "Email is required",
  "code": "VALIDATION_ERROR"
}
```

---

## Logout Endpoint - POST /api/v1/auth/logout

### Contract Agreement:
Backend provides logout service → Frontend expects success confirmation → MUST MATCH EXACTLY

### Backend Implementation:
- **Controller:** `backend/src/controllers/auth/auth.controller.ts`
- **Service:** `backend/src/services/auth/auth.service.ts`
- **Validation:** `backend/src/validators/auth.validator.ts`

### Frontend Usage:
- **Service call:** `frontend/src/services/auth.service.ts`
- **Component:** `frontend/src/components/auth/LogoutButton.tsx`

### Request:
```json
{
  "refreshToken": "rt_abc123xyz789..."
}
```

### Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

### Response Error (401):
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "INVALID_TOKEN"
}
```

---

## Token Refresh Endpoint - POST /api/v1/auth/refresh

### Contract Agreement:
Backend provides token refresh service → Frontend expects new tokens → MUST MATCH EXACTLY

### Backend Implementation:
- **Controller:** `backend/src/controllers/auth/auth.controller.ts`
- **Service:** `backend/src/services/auth/auth.service.ts`
- **Validation:** `backend/src/validators/auth.validator.ts`

### Frontend Usage:
- **Service call:** `frontend/src/services/auth.service.ts`
- **Auto-called on:** Token expiration detection

### Request:
```json
{
  "refreshToken": "rt_abc123xyz789..."
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "rt_def456uvw012...",
    "expiresIn": 3600
  }
}
```

### Response Error (401):
```json
{
  "success": false,
  "error": "Invalid refresh token",
  "code": "INVALID_REFRESH_TOKEN"
}
```

---

## Error Codes Reference

| Code | Meaning | HTTP Status |
|------|---------|-------------|
| `VALIDATION_ERROR` | Required fields missing or invalid | 400 |
| `INVALID_CREDENTIALS` | Wrong email or password | 401 |
| `INVALID_TOKEN` | JWT token invalid or expired | 401 |
| `INVALID_REFRESH_TOKEN` | Refresh token invalid or expired | 401 |
| `USER_NOT_FOUND` | User account doesn't exist | 404 |
| `ACCOUNT_DISABLED` | User account is deactivated | 403 |

---

## Testing Requirements

### Login Tests:
- Valid credentials → Success response
- Invalid email format → Validation error
- Wrong password → Invalid credentials error
- Missing fields → Validation error

### Logout Tests:
- Valid token + refresh token → Success
- Invalid JWT token → Token error
- Missing refresh token → Validation error
- Already logged out → Token error

### Refresh Tests:
- Valid refresh token → New tokens
- Invalid refresh token → Error
- Expired refresh token → Error
