# User Registration & Email Verification API Documentation

## Base URL
`http://localhost:5000/api/v1`

## Authentication
No authentication required for these endpoints.

## Rate Limiting
- Registration: 5 requests per 15 minutes per IP
- Email verification: 10 requests per 15 minutes per IP
- Resend verification: 1 request per 5 minutes per email

## Endpoints

### 1. User Registration

**POST** `/auth/register`

Creates a new user account and sends verification email.

#### Request Body
```json
{
  "firstName": "string", // required, 2-50 chars
  "lastName": "string",  // required, 2-50 chars
  "email": "string",     // required, valid email format
  "password": "string",  // required, min 8 chars, 1 uppercase, 1 lowercase, 1 number
  "confirmPassword": "string" // required, must match password
}
```

#### Success Response (201)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe", 
      "email": "john@example.com",
      "isEmailVerified": false,
      "createdAt": "2025-07-26T10:14:11.000Z"
    },
    "message": "Registration successful. Please check your email for verification."
  }
}
```

#### Error Responses
```json
// 400 - Validation Error
{
  "success": false,
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": [
    "Password must be at least 8 characters long",
    "Email format is invalid"
  ]
}

// 409 - Duplicate Email
{
  "success": false,
  "error": "Email already exists",
  "code": "EMAIL_EXISTS"
}

// 429 - Rate Limited
{
  "success": false,
  "error": "Too many registration attempts. Please try again later.",
  "code": "RATE_LIMITED"
}
```

### 2. Email Verification

**POST** `/auth/verify-email`

Verifies user email using verification token.

#### Request Body
```json
{
  "token": "string" // required, JWT verification token
}
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully"
  }
}
```

#### Error Responses
```json
// 400 - Invalid Token
{
  "success": false,
  "error": "Invalid or expired verification token",
  "code": "INVALID_TOKEN"
}

// 400 - Already Verified
{
  "success": false,
  "error": "Email is already verified",
  "code": "ALREADY_VERIFIED"
}

// 404 - User Not Found
{
  "success": false,
  "error": "User not found",
  "code": "USER_NOT_FOUND"
}
```

### 3. Resend Verification Email

**POST** `/auth/resend-verification`

Resends verification email to user.

#### Request Body
```json
{
  "email": "string" // required, valid email format
}
```

#### Success Response (200)
```json
{
  "success": true,
  "data": {
    "message": "Verification email sent successfully"
  }
}
```

#### Error Responses
```json
// 400 - Email Not Found
{
  "success": false,
  "error": "Email not found",
  "code": "EMAIL_NOT_FOUND"
}

// 400 - Already Verified
{
  "success": false,
  "error": "Email is already verified",
  "code": "ALREADY_VERIFIED"
}

// 429 - Rate Limited
{
  "success": false,
  "error": "Please wait before requesting another verification email",
  "code": "RATE_LIMITED"
}
```

## Common HTTP Status Codes
- **200**: Success
- **201**: Created (registration)
- **400**: Bad Request (validation errors)
- **404**: Not Found
- **409**: Conflict (duplicate email)
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error

## Email Template
Verification emails include:
- Professional HTML template
- AirVik branding
- Clear verification button/link
- Token expires in 24 hours
- Fallback text version

## Frontend Integration Notes
- Always check `success` field first
- Handle all error codes appropriately
- Show user-friendly error messages
- Implement proper loading states
- Validate forms before API calls
