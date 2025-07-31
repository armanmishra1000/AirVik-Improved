# Integration Test Plan for Change Password

## Token Storage Tests:
- [ ] Access token retrieved from sessionStorage.getItem('airvik_access_token')
- [ ] Refresh token retrieved from localStorage.getItem('airvik_refresh_token')
- [ ] Tokens included in Authorization header as Bearer token

## API Integration Tests:
- [ ] Endpoint uses /api/v1/auth/change-password
- [ ] Response format matches API-CONTRACT.md exactly
- [ ] Error handling consistent with existing auth endpoints
- [ ] Rate limiting works (5 attempts per 15 minutes)

## Feature Integration Tests:
- [ ] Works with existing JWT authentication system
- [ ] Integrates with existing User model and comparePassword method
- [ ] Password hashing uses existing bcrypt patterns
- [ ] Form validation follows existing auth form patterns
- [ ] UI styling matches existing auth pages

## Security Integration Tests:
- [ ] Requires valid JWT token for access
- [ ] Current password verification works correctly
- [ ] New password is properly hashed before storage
- [ ] Session maintained after successful password change
- [ ] Unauthorized requests properly rejected

## End-to-End Integration Tests:
- [ ] User can login with existing credentials
- [ ] User can navigate to /change-password page
- [ ] User can successfully change password with valid current password
- [ ] User can login with new password after change
- [ ] Error messages display for invalid current password
- [ ] Validation errors display for weak new passwords
- [ ] Loading states work properly during API calls

## Cross-Feature Integration Tests:
- [ ] Password change doesn't break existing login functionality
- [ ] Password change doesn't affect other auth features (registration, reset)
- [ ] New password works with password reset feature
- [ ] User profile features still work after password change
- [ ] Role-based permissions maintained after password change