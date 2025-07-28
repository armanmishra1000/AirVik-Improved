# Password Reset & JWT Token Refresh Tasks

## Developer: [Name] - Completes ALL tasks in order

## Backend Phase (Test each with Postman before moving on):

### Task B1: Extend MongoDB Schema for Password Reset
**File to modify**: `backend/src/models/user.model.ts` (max 400 lines)
**What it does**: Adds password reset fields to existing user schema
**Must include**: 
- passwordResetToken (optional string)
- passwordResetExpires (optional Date)
- passwordResetAttempts (optional number, default 0)
- lastPasswordReset (optional Date)
**Test**: Create test user document with new fields in MongoDB
**Git**: Add, commit with message "feat(password-reset): extend user model with reset fields", push

### Task B2: Extend Service Layer for Password Reset
**File to modify**: `backend/src/services/auth/user-auth.service.ts` (max 400 lines)
**What it does**: Adds password reset business logic methods
**Methods to add**:
- `requestPasswordReset(email: string)` - Generate token and send email
- `verifyPasswordReset(token: string, newPassword: string, confirmPassword: string)` - Verify token and update password
- `generatePasswordResetToken(userId: string)` - Generate secure reset token
- `sendPasswordResetEmail(email: string, firstName: string, token: string)` - Send reset email
**Must match**: Exact response format in API-CONTRACT.md
**Test**: Call functions from Node.js console with test data
**Git**: Add, commit with message "feat(password-reset): add service methods for password reset", push

### Task B3: Extend Controller for Password Reset
**File to modify**: `backend/src/controllers/auth/user-auth.controller.ts` (max 400 lines)
**What it does**: Adds HTTP request handling for password reset endpoints
**Methods to add**:
- `requestPasswordReset` - Handle POST /api/v1/auth/password-reset/request
- `verifyPasswordReset` - Handle POST /api/v1/auth/password-reset/verify
- `refreshToken` - Handle POST /api/v1/auth/refresh-token (expose existing service method)
**Must match**: Exact format in API-CONTRACT.md
**Input validation**: Email format, password strength, token format
**Test**: Use curl or Postman to call all endpoints
**Git**: Add, commit with message "feat(password-reset): add controller methods for reset endpoints", push

### Task B4: Update Routes for Password Reset
**File to modify**: `backend/src/routes/auth.routes.ts` (max 200 lines)
**What it does**: Adds new routes for password reset endpoints
**Routes to add**:
- `POST /password-reset/request` → controller.requestPasswordReset
- `POST /password-reset/verify` → controller.verifyPasswordReset  
- `POST /refresh-token` → controller.refreshToken
**Rate limiting**: Apply appropriate rate limits per endpoint
**Test**: Routes appear in Express route list and respond correctly
**Git**: Add, commit with message "feat(password-reset): add routes for password reset and token refresh", push

### Task B5: Update Postman Collection
**File to modify**: `postman/user-registration-email-verification.postman_collection.json`
**Must include**: Tests for all 3 new endpoints with example data
**Test scenarios**:
- Valid password reset request
- Invalid email for reset request
- Valid password reset verification
- Invalid/expired token verification
- Valid token refresh
- Invalid refresh token
**Testing method**: Design tests for newman CLI, include instructions for terminal testing
**Test**: All requests return expected responses, newman tests pass
**Git**: Add, commit with message "feat(password-reset): update Postman collection with reset tests", push

## Frontend Phase (Only start after backend fully tested):

### Task F1: Create/Update TypeScript Types
**File to create**: `frontend/src/types/password-reset.types.ts` (max 200 lines)
**Must match**: Backend response structure EXACTLY from API-CONTRACT.md
**Types to define**:
- `PasswordResetRequestData` - Request reset interface
- `PasswordResetVerifyData` - Verify reset interface
- `PasswordResetResponse` - API response interface
- `TokenRefreshResponse` - Token refresh response interface
**File to modify**: `frontend/src/types/auth.types.ts` (add TokenRefreshData interface)
**Test**: No TypeScript errors in project
**Git**: Add, commit with message "feat(password-reset): add TypeScript types for password reset", push

### Task F2: Extend API Service for Password Reset
**File to create**: `frontend/src/services/password-reset.service.ts` (max 400 lines)
**Must match**: API-CONTRACT.md exactly
**Methods to implement**:
- `requestPasswordReset(email: string): Promise<PasswordResetResponse>`
- `verifyPasswordReset(data: PasswordResetVerifyData): Promise<PasswordResetResponse>`
**File to modify**: `frontend/src/services/auth.service.ts` (add refreshToken method)
**Error handling**: Proper error catching and typed responses
**Test**: Console log responses match expected structure
**Git**: Add, commit with message "feat(password-reset): add API service methods for password reset", push

### Task F3: Create Password Reset UI Components
**Files to create**:
- `frontend/src/components/auth/ForgotPasswordForm.tsx` (max 400 lines)
- `frontend/src/components/auth/ResetPasswordForm.tsx` (max 400 lines)
**What they do**: User interface forms for password reset flow
**Components features**:
- Form validation with real-time feedback
- Loading states during API calls
- Success/error message display
- Responsive design with Tailwind CSS
- Password strength indicator for reset form
**Test**: Components render with mock data, form validation works
**Git**: Add, commit with message "feat(password-reset): add UI components for password reset", push

### Task F4: Create Password Reset Pages/Routes
**Files to create**:
- `frontend/src/app/auth/forgot-password/page.tsx` (max 200 lines)
- `frontend/src/app/auth/reset-password/page.tsx` (max 200 lines)
**What they do**: Next.js pages for password reset user flow
**Page features**:
- Proper metadata and SEO tags
- Integration with form components from F3
- Navigation breadcrumbs and back links
- URL parameter handling for reset tokens
**Routes created**:
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password?token=xyz` - Verify and reset password
**Test**: Can navigate to pages, URLs work correctly
**Git**: Add, commit with message "feat(password-reset): add Next.js pages for reset flow", push

### Task F5: Connect Frontend to Backend
**Files to modify**: 
- Components from F3 to use real API calls
- `frontend/src/services/auth.service.ts` to implement auto token refresh
**What it does**: Replace mock data with real API integration
**Integration features**:
- Form submissions call backend APIs
- Error handling displays appropriate messages
- Success flows redirect to appropriate pages
- Automatic token refresh on API calls
- Loading states during network requests
**Test**: Full feature works end-to-end, error cases handled
**Git**: Add, commit with message "feat(password-reset): complete backend integration for password reset", push

## Final Integration Testing
- Test complete password reset flow: request → email → verify → login
- Test token refresh during normal app usage
- Verify rate limiting works correctly
- Test error scenarios and user feedback
- Verify email templates render correctly
- Test responsive design on different screen sizes

## Git Branch Strategy
- Work on branch: `feature/password-reset-jwt-refresh`
- Every task creates separate commit with descriptive message
- Push after every task completion
- Merge to main after all testing passes
