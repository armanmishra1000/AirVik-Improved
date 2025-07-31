# Change Password API Contract

## RULE: Frontend and Backend MUST follow this EXACTLY

### Base Configuration
- Base URL: http://localhost:5000
- API Prefix: /api/v1
- Auth Token Location: sessionStorage.getItem('airvik_access_token')
- Refresh Token Location: localStorage.getItem('airvik_refresh_token')

### Change Password Endpoint
**Backend MUST provide:**
- Method: PUT
- URL: /api/v1/auth/change-password
- Headers: Authorization: Bearer [token]
- Request Body:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": "Current password is incorrect",
  "code": "INVALID_CURRENT_PASSWORD"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "error": "Password must be at least 8 characters long",
  "code": "VALIDATION_ERROR"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed