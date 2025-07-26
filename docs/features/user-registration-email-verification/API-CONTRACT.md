# User Registration & Email Verification API Contract

## RULE: Frontend and Backend MUST follow this EXACTLY

### User Registration
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/register
- Request Body:
```json
{
  "firstName": "string",
  "lastName": "string", 
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**Registration - ALL POSSIBLE RESPONSES:**

**Success (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "isEmailVerified": false,
      "createdAt": "string"
    },
    "message": "Registration successful. Please check your email for verification."
  }
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": ["Password too weak", "Email invalid"]
}
```

**Duplicate Email (409):**
```json
{
  "success": false,
  "error": "Email already exists",
  "code": "EMAIL_EXISTS"
}
```

**Rate Limited (429):**
```json
{
  "success": false,
  "error": "Too many attempts",
  "code": "RATE_LIMITED"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed

### Email Verification
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/verify-email
- Request Body:
```json
{
  "token": "string"
}
```

**Email Verification - ALL POSSIBLE RESPONSES:**

**Success (200):**
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully"
  }
}
```

**Invalid Token (400):**
```json
{
  "success": false,
  "error": "Invalid or expired verification token",
  "code": "INVALID_TOKEN"
}
```

**Already Verified (400):**
```json
{
  "success": false,
  "error": "Email is already verified",
  "code": "ALREADY_VERIFIED"
}
```

**User Not Found (404):**
```json
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

**Rate Limited (429):**
```json
{
  "success": false,
  "error": "Too many verification attempts",
  "code": "RATE_LIMITED"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

### Resend Verification Email
**Backend MUST provide:**
- Method: POST
- URL: /api/v1/auth/resend-verification
- Request Body:
```json
{
  "email": "string"
}
```

**Resend Verification - ALL POSSIBLE RESPONSES:**

**Success (200):**
```json
{
  "success": true,
  "data": {
    "message": "Verification email sent successfully"
  }
}
```

**Email Not Found (404):**
```json
{
  "success": false,
  "error": "Email not found",
  "code": "EMAIL_NOT_FOUND"
}
```

**Already Verified (400):**
```json
{
  "success": false,
  "error": "Email is already verified",
  "code": "ALREADY_VERIFIED"
}
```

**Rate Limited (429):**
```json
{
  "success": false,
  "error": "Please wait before requesting another verification email",
  "code": "RATE_LIMITED"
}
```

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Invalid email format",
  "code": "VALIDATION_ERROR"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

**Frontend MUST expect:**
- Exact same response structure
- No variations allowed
