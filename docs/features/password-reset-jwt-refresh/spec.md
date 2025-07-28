# Password Reset & JWT Token Refresh Feature Specification

## Feature Overview
This feature adds password reset functionality and exposes JWT token refresh as a standalone endpoint for the Airvik Hotel System. Users can request password resets via email and securely reset their passwords using time-limited tokens. The JWT refresh endpoint allows frontend applications to maintain authentication without requiring full re-login.

## VikBooking Analysis
- VikBooking uses WordPress's built-in password reset functionality (`wp_lostpassword_url()`)
- Follows standard pattern: request reset → email token → verify token → new password
- No JWT token management found in VikBooking (uses session-based auth)

## User Flow

### Password Reset Flow:
1. **Request Reset**: User enters email on forgot password page
2. **Email Sent**: System sends reset email with secure token (15-minute expiry)
3. **Token Verification**: User clicks email link, arrives at reset password page
4. **Password Update**: User enters new password (with confirmation)
5. **Success**: Password updated, user can login with new credentials

### JWT Token Refresh Flow:
1. **Token Expiry**: Frontend detects access token expiring (before 401 error)
2. **Refresh Request**: Frontend automatically calls refresh endpoint with refresh token
3. **New Tokens**: Backend validates refresh token and returns new token pair
4. **Seamless UX**: User continues using app without interruption

## API Endpoints

### Password Reset Request
- **URL**: `POST /api/v1/auth/password-reset/request`
- **Purpose**: Send password reset email to user
- **Rate Limit**: 3 requests per 15 minutes per email

### Password Reset Verify
- **URL**: `POST /api/v1/auth/password-reset/verify`  
- **Purpose**: Verify reset token and update password
- **Rate Limit**: 5 attempts per token

### JWT Token Refresh
- **URL**: `POST /api/v1/auth/refresh-token`
- **Purpose**: Exchange valid refresh token for new token pair
- **Rate Limit**: 10 requests per minute per user

## Database Schema Extensions

### User Model Additions:
```typescript
interface IUser {
  // ... existing fields
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordResetAttempts?: number;
  lastPasswordReset?: Date;
}
```

## Validation Rules

### Password Reset Request:
- Email must be valid format
- Email must exist in database
- User account must be verified

### Password Reset Verify:
- Token must be valid and not expired (15 minutes)
- New password must meet strength requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter  
  - At least 1 number
  - At least 1 special character
- Password confirmation must match
- Token can only be used once

### JWT Token Refresh:
- Refresh token must be valid and not expired
- Refresh token must exist in user's token array
- User account must be active

## Security Considerations
- Password reset tokens are cryptographically secure (32 bytes)
- Tokens expire after 15 minutes
- Rate limiting prevents brute force attacks
- Email contains secure reset link, not the token directly
- Old refresh tokens are invalidated when new ones are issued
- Failed attempts are logged and tracked

## File Structure (Max 400 lines each)

### Backend Extensions:
- Extend `backend/src/models/user.model.ts` - Add password reset fields
- Extend `backend/src/services/auth/user-auth.service.ts` - Add password reset methods
- Extend `backend/src/controllers/auth/user-auth.controller.ts` - Add reset endpoints
- Extend `backend/src/routes/auth.routes.ts` - Add reset routes

### Frontend New Files:
- `frontend/src/types/password-reset.types.ts` - TypeScript interfaces
- `frontend/src/services/password-reset.service.ts` - API service methods
- `frontend/src/components/auth/ForgotPasswordForm.tsx` - Request reset form
- `frontend/src/components/auth/ResetPasswordForm.tsx` - New password form
- `frontend/src/app/auth/forgot-password/page.tsx` - Forgot password page
- `frontend/src/app/auth/reset-password/page.tsx` - Reset password page

## Testing Requirements
- All endpoints tested with Postman collection
- Edge cases covered: expired tokens, invalid emails, rate limiting
- Frontend form validation tested
- Email delivery verified in development
- Integration testing for complete user flow
