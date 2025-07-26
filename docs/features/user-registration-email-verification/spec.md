# User Registration & Email Verification Feature Specification

## Overview
Complete user registration system with email verification for the AirVik hotel booking platform.

## Business Requirements

### 1. User Registration
- **Fields**: firstName, lastName, email, password, confirmPassword
- **Validation**: Email format, password strength (min 8 chars), passwords match
- **Security**: Password hashing with bcrypt, rate limiting
- **Response**: User object (without password) + success message

### 2. Email Verification
- **Flow**: Send verification email with token → User clicks link → Account activated
- **Token**: JWT with expiration (24 hours)
- **Email Template**: Professional HTML email with verification link
- **Security**: Token validation, expiration check

### 3. Resend Verification
- **Trigger**: User requests new verification email
- **Limits**: Rate limiting to prevent spam (1 per 5 minutes)
- **Validation**: Email exists and not already verified

## Technical Specifications

### Backend Requirements
- **Framework**: Node.js + Express + TypeScript
- **Database**: MongoDB with Mongoose
- **Security**: bcrypt, JWT, express-rate-limit
- **Email**: nodemailer for SMTP
- **Validation**: joi or express-validator

### Frontend Requirements
- **Framework**: Next.js 14 + TypeScript + Tailwind CSS
- **Forms**: React Hook Form with validation
- **UI**: Modern, responsive design
- **State**: React hooks for form state

### Database Schema
```typescript
interface User {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string; // unique index
  password: string; // hashed
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  tokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### API Endpoints
1. `POST /api/v1/auth/register` - User registration
2. `POST /api/v1/auth/verify-email` - Email verification
3. `POST /api/v1/auth/resend-verification` - Resend verification email

### Security Measures
- Password hashing with salt rounds (12)
- JWT tokens for email verification
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Helmet security headers

### Email Configuration
- SMTP service integration
- HTML email templates
- Professional styling
- Verification link with frontend route

## User Experience Flow

### Registration Flow
1. User visits `/auth/register`
2. Fills form with required fields
3. Frontend validates inputs
4. Submits to backend API
5. Backend creates user, sends verification email
6. User sees success message
7. User checks email for verification link

### Verification Flow
1. User clicks verification link in email
2. Frontend extracts token from URL
3. Calls verification API
4. Shows success/error message
5. Redirects to login page

### Error Handling
- Duplicate email registration
- Invalid email format
- Weak passwords
- Expired verification tokens
- Network errors
- Server errors

## Success Criteria
- User can register with valid credentials
- Verification email is sent immediately
- Email verification works correctly
- Error states are handled gracefully
- UI is responsive and accessible
- All security measures are implemented
