# Change Password Feature Specification

## Feature Overview
The Change Password feature allows authenticated users to securely update their account password by providing their current password for verification and setting a new password with proper validation. This feature integrates with the existing authentication system and maintains security through JWT authentication and password hashing.

## VikBooking Analysis
Based on analysis of the existing codebase:
- User authentication system is already established with JWT tokens
- User model exists with password field and comparePassword method  
- Password hashing is handled by bcrypt in the user model pre-save hook
- Authentication middleware is available for protecting routes
- Form validation patterns are established in existing auth features

## User Flow
1. **Access Change Password Page**
   - User must be logged in (JWT token required)
   - Navigate to /change-password route
   - System verifies authentication token

2. **Fill Change Password Form**
   - Enter current password (required, min 1 character)
   - Enter new password (required, min 8 characters, with strength validation)
   - Enter confirm new password (must match new password)
   - Form validates in real-time with visual feedback

3. **Submit Password Change**
   - Frontend validates all fields locally
   - API call made to PUT /api/v1/auth/change-password
   - Backend verifies current password using comparePassword method
   - New password is hashed using existing bcrypt patterns
   - Success/error feedback displayed to user

4. **Handle Response**
   - Success: Show success message, optionally redirect
   - Error: Display specific error (wrong current password, validation failed, etc.)
   - Maintain user session after successful password change

## API Endpoints

### Change Password - PUT /api/v1/auth/change-password
- **Authentication:** Required (JWT token in Authorization header)
- **Rate Limiting:** 5 attempts per 15 minutes per user
- **Request Body:** `{ currentPassword: string, newPassword: string }`
- **Success Response:** `{ success: true, data: { message: "Password changed successfully" } }`
- **Error Responses:** 
  - 401: Authentication required
  - 400: Current password incorrect
  - 422: New password validation failed

## Database Schema
**Uses Existing User Model** - No new fields required
- Leverages existing `password` field with bcrypt hashing
- Uses existing `comparePassword` method for current password verification
- Password update triggers existing pre-save hook for new password hashing

## Validation Rules

### Current Password Validation:
- Required field
- Must match user's existing password (verified server-side using comparePassword)

### New Password Validation:
- Required field
- Minimum 8 characters
- Must contain at least one uppercase letter
- Must contain at least one lowercase letter  
- Must contain at least one number
- Must contain at least one special character
- Cannot be the same as current password
- Real-time strength indicator (Weak/Medium/Strong)

### Confirm Password Validation:
- Required field
- Must exactly match new password
- Real-time validation with visual feedback

## File Structure

### Backend Files (Extending Existing):
- `backend/src/services/auth/user-auth.service.ts` - Add changePassword method (max 50 lines addition)
- `backend/src/controllers/auth/user-auth.controller.ts` - Add changePassword endpoint (max 50 lines addition)  
- `backend/src/routes/auth.routes.ts` - Add change password route (max 10 lines addition)
- `postman/user-registration-email-verification.postman_collection.json` - Add change password tests

### Frontend Files (New):
- `frontend/src/types/auth.types.ts` - Add change password interfaces (max 30 lines addition)
- `frontend/src/services/auth.service.ts` - Add changePassword method (max 50 lines addition)
- `frontend/src/components/auth/ChangePasswordForm.tsx` - Change password form component (max 400 lines)
- `frontend/src/app/change-password/page.tsx` - Change password page (max 200 lines)

### Shared Contracts (New):
- `shared/contracts/api/auth-api.contract.ts` - Add change password endpoint contract
- `shared/contracts/types/auth-types.contract.ts` - Add change password type definitions

## Security Considerations
- JWT authentication required for all requests
- Current password verification prevents unauthorized changes
- New password hashing using existing bcrypt patterns
- Rate limiting to prevent brute force attacks
- No password storage in plain text or client-side caching
- Comprehensive input validation and sanitization