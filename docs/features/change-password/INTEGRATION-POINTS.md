# Integration Points for Change Password

## Dependencies on Existing Features:
- [x] Uses authentication from user-login feature
- [x] Token storage pattern: sessionStorage for access, localStorage for refresh
- [x] API pattern: /api/v1/auth/change-password
- [x] Response format: { success: true/false, data/error }
- [x] Uses existing User model with password field and comparePassword method
- [x] Integrates with existing JWT authentication middleware

## Shared Code to Reuse:
- Authentication middleware: backend/src/middleware/auth.middleware.ts
- Response utilities: backend/src/utils/response.utils.ts
- Auth service patterns: frontend/src/services/auth.service.ts
- User model: backend/src/models/user.model.ts (comparePassword method)
- Form validation patterns from existing auth forms
- Password hashing patterns from user model pre-save hook

## Potential Conflicts:
- None identified - this feature extends existing auth system without conflicts

## Token Storage Verification:
- Access Token: sessionStorage.getItem('airvik_access_token')
- Refresh Token: localStorage.getItem('airvik_refresh_token')
- Authorization Header: Bearer [accessToken]

## API Pattern Verification:
- Endpoint: PUT /api/v1/auth/change-password
- Follows existing /api/v1/auth/* pattern
- Response: { success: true/false, data/error }
- Error codes follow existing patterns (UNAUTHORIZED, VALIDATION_ERROR, etc.)

## Security Integration:
- Uses existing JWT authentication middleware
- Leverages existing password hashing (bcrypt)
- Follows existing rate limiting patterns
- Integrates with existing user validation