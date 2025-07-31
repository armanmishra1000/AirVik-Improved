# Change Password API Documentation

This is CRITICAL - prevents API mismatches!

## Change Password - PUT /api/v1/auth/change-password

### Contract Agreement:
Backend provides → Frontend expects → MUST MATCH EXACTLY

### Backend Implementation:
- Controller: `backend/src/controllers/auth/user-auth.controller.ts` (extend existing)
- Service: `backend/src/services/auth/user-auth.service.ts` (extend existing)
- Route: `backend/src/routes/auth.routes.ts` (extend existing)
- Validation: Built into controller with Joi validation

### Frontend Usage:
- Service call: `frontend/src/services/auth.service.ts` (extend existing)
- Component: `frontend/src/components/auth/ChangePasswordForm.tsx` (new)
- Page: `frontend/src/app/change-password/page.tsx` (new)

### Request:
```json
{
  "currentPassword": "userCurrentPassword123",
  "newPassword": "newSecurePassword456!"
}
```

### Response Success (200):
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

### Response Error (400) - Invalid Current Password:
```json
{
  "success": false,
  "error": "Current password is incorrect",
  "code": "INVALID_CURRENT_PASSWORD"
}
```

### Response Error (401) - Unauthorized:
```json
{
  "success": false,
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

### Response Error (422) - Validation Error:
```json
{
  "success": false,
  "error": "Password must be at least 8 characters long and contain uppercase, lowercase, number and special character",
  "code": "VALIDATION_ERROR"
}
```

### Response Error (429) - Rate Limit:
```json
{
  "success": false,
  "error": "Too many password change attempts. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

### Headers Required:
```
Authorization: Bearer <jwt_access_token>
Content-Type: application/json
```

### Business Logic Flow:
1. Extract JWT token from Authorization header
2. Verify token and get user ID using existing auth middleware
3. Validate request body (currentPassword, newPassword)
4. Fetch user from database by ID
5. Verify currentPassword using existing comparePassword method
6. Validate newPassword meets strength requirements
7. Hash newPassword using existing bcrypt patterns (model pre-save hook)
8. Update user password in database
9. Return success response

### Error Handling:
- Authentication errors return 401 with UNAUTHORIZED code
- Invalid current password returns 400 with INVALID_CURRENT_PASSWORD code
- Validation errors return 422 with VALIDATION_ERROR code
- Rate limiting errors return 429 with RATE_LIMIT_EXCEEDED code
- Server errors return 500 with INTERNAL_ERROR code

### Rate Limiting:
- 5 password change attempts per 15 minutes per user
- Implemented using existing rate limiting middleware patterns
- Counter resets after successful password change