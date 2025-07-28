# Task Prompts for Password Reset & JWT Token Refresh

## HOW TO USE:
1. Copy each prompt exactly
2. Paste to AI in Windsurf Planning Mode
3. Report "done" or exact error message
4. AI will update state files automatically

## Backend Task B1: Extend MongoDB Schema for Password Reset

**MANDATORY FIRST STEPS:**

Read and analyze: `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/API-CONTRACT.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/spec.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/api.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/tasks.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/progress.md`

List what you found to prove you read them

**CONTEXT:**
You are implementing Password Reset & JWT Token Refresh features. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Extend existing MongoDB User schema for password reset functionality

**FILE TO MODIFY:**
`backend/src/models/user.model.ts` (MAXIMUM 400 lines)

**REQUIREMENTS FROM SPEC:**
- Add passwordResetToken field (optional string)
- Add passwordResetExpires field (optional Date)
- Add passwordResetAttempts field (optional number, default 0)
- Add lastPasswordReset field (optional Date)
- Keep all existing fields intact
- Update TypeScript interface accordingly

**CODE STRUCTURE:**
- Extend existing User schema
- Add proper TypeScript types
- Maintain existing exports
- Preserve all current functionality

**DO NOT:**
- Remove any existing fields
- Change existing field types
- Exceed 400 lines
- Create new files

**GIT OPERATIONS:**
After modifying the file successfully:
- Stage changes: `git add backend/src/models/user.model.ts`
- Commit with message: `git commit -m "feat(password-reset): extend user model with reset fields"`
- Push to remote: `git push origin feature/password-reset-jwt-refresh`

**AFTER COMPLETING:**
Update `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ Extended backend/src/models/user.model.ts - Added password reset fields
- Update "Next Task": B2

Update `docs/features/password-reset-jwt-refresh/progress.md`:
- Task Checklist: Mark B1 as completed
- Current State: Update with new model fields
- Add to "Git Status": Last commit hash and message

**TEST YOUR WORK:**
The developer will test by checking the schema includes all new fields

---

## Backend Task B2: Extend Service Layer for Password Reset

**MANDATORY FIRST STEPS:**

Read and analyze: `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`
Confirm user model was extended in B1
Read and analyze: `docs/features/password-reset-jwt-refresh/API-CONTRACT.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/spec.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/api.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/tasks.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/progress.md`

**YOUR TASK:**
Extend existing auth service with password reset business logic

**FILE TO MODIFY:**
`backend/src/services/auth/user-auth.service.ts` (MAXIMUM 400 lines)

**USE THE EXTENDED SCHEMA:**
Import from: `../../models/user.model.ts` (extended in B1)

**METHODS TO ADD:**
- `generatePasswordResetToken(userId: string): string` - Generate secure 32-byte token
- `sendPasswordResetEmail(email: string, firstName: string, token: string): Promise<ServiceResponse>` - Send reset email with HTML template
- `requestPasswordReset(email: string): Promise<ServiceResponse>` - Generate token, save to DB, send email
- `verifyPasswordReset(token: string, newPassword: string, confirmPassword: string): Promise<ServiceResponse>` - Verify token and update password

**MATCH API CONTRACT:**
Return EXACT structure defined in API-CONTRACT.md for each method

**PASSWORD SECURITY:**
- Hash passwords with bcrypt (use existing pattern from registerUser)
- Validate password strength (min 8 chars, uppercase, lowercase, number, special char)
- Reset token expires in 15 minutes

**ERROR HANDLING:**
Throw errors with: `{ code: 'ERROR_CODE', message: 'Human readable' }`

**REUSE EXISTING CODE:**
- Use existing email transporter
- Follow existing service patterns
- Reuse password hashing logic

**GIT OPERATIONS:**
After modifying successfully:
- Stage changes: `git add backend/src/services/auth/user-auth.service.ts`
- Commit with message: `git commit -m "feat(password-reset): add service methods for password reset"`
- Push to remote: `git push origin feature/password-reset-jwt-refresh`

**AFTER COMPLETING:**
Update `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ Extended auth service with password reset methods
- Update "Next Task": B3

Update `docs/features/password-reset-jwt-refresh/progress.md`:
- Mark B2 as completed
- Update current state
- Add git status

---

## Backend Task B3: Extend Controller for Password Reset

**MANDATORY FIRST STEPS:**

Read and analyze: `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`
Verify service layer extended in B2
Read and analyze: `docs/features/password-reset-jwt-refresh/API-CONTRACT.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/spec.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/api.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/tasks.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/progress.md`

**YOUR TASK:**
Extend existing auth controller with password reset HTTP request handling

**FILE TO MODIFY:**
`backend/src/controllers/auth/user-auth.controller.ts` (MAXIMUM 400 lines)

**USE THE SERVICE:**
Import methods from: `../../services/auth/user-auth.service.ts`

**CONTROLLER METHODS TO ADD:**
- `requestPasswordReset` - Handle POST /api/v1/auth/password-reset/request
- `verifyPasswordReset` - Handle POST /api/v1/auth/password-reset/verify
- `refreshToken` - Handle POST /api/v1/auth/refresh-token (expose existing refreshUserToken service method)

**RESPONSE FORMAT:**
MUST match exactly what's in API-CONTRACT.md:
- Success: `{ success: true, data: {...} }`
- Error: `{ success: false, error: "message", code: "ERROR_CODE" }`

**REQUEST VALIDATION:**
- Email format validation for reset request
- Token format validation for reset verify
- Password strength validation for new password
- Refresh token validation for token refresh

**ERROR HANDLING:**
- Catch service errors and format appropriately
- Return proper HTTP status codes
- Include rate limiting considerations

**GIT OPERATIONS:**
After modifying successfully:
- Stage changes: `git add backend/src/controllers/auth/user-auth.controller.ts`
- Commit with message: `git commit -m "feat(password-reset): add controller methods for reset endpoints"`
- Push to remote: `git push origin feature/password-reset-jwt-refresh`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to B4
Update progress.md with completion status and git info

---

## Backend Task B4: Update Routes for Password Reset

**MANDATORY FIRST STEPS:**

Read and analyze: `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`
Verify controller methods exist from B3
Read and analyze: `docs/features/password-reset-jwt-refresh/API-CONTRACT.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/spec.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/api.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/tasks.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/progress.md`
Check existing route patterns in the file

**YOUR TASK:**
Update existing auth routes file with password reset endpoints

**FILE TO MODIFY:**
`backend/src/routes/auth.routes.ts` (MAXIMUM 200 lines)

**IMPORT CONTROLLER:**
From: `../controllers/auth/user-auth.controller.ts`

**ROUTES TO ADD:**
Based on API-CONTRACT.md:
- `POST /password-reset/request` → controller.requestPasswordReset
- `POST /password-reset/verify` → controller.verifyPasswordReset
- `POST /refresh-token` → controller.refreshToken

**RATE LIMITING:**
- Password reset request: 3 per 15 minutes per email
- Password reset verify: 5 attempts per token
- Token refresh: 10 per minute per user

**MIDDLEWARE:**
- Include input validation middleware if available
- Apply rate limiter from existing patterns
- Use same error handling as existing routes

**GIT OPERATIONS:**
After modifying successfully:
- Stage changes: `git add backend/src/routes/auth.routes.ts`
- Commit with message: `git commit -m "feat(password-reset): add routes for password reset and token refresh"`
- Push to remote: `git push origin feature/password-reset-jwt-refresh`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to B5
Update progress.md with completion and git status

---

## Backend Task B5: Update Postman Collection

**MANDATORY FIRST STEPS:**

Read and analyze: `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/API-CONTRACT.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/spec.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/api.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/tasks.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/progress.md`
Verify all backend files exist and routes are working

**YOUR TASK:**
Update existing Postman collection with password reset and token refresh tests

**FILE TO MODIFY:**
`postman/user-registration-email-verification.postman_collection.json`

**TESTS TO ADD:**

1. **Password Reset Request (Valid)**
   - Method: POST
   - URL: `{{baseUrl}}/api/v1/auth/password-reset/request`
   - Body: `{ "email": "test@example.com" }`
   - Test: Status 200, success: true

2. **Password Reset Request (Invalid Email)**
   - Method: POST
   - URL: `{{baseUrl}}/api/v1/auth/password-reset/request`
   - Body: `{ "email": "nonexistent@example.com" }`
   - Test: Status 400, error code EMAIL_NOT_FOUND

3. **Password Reset Verify (Valid)**
   - Method: POST
   - URL: `{{baseUrl}}/api/v1/auth/password-reset/verify`
   - Body: `{ "token": "{{resetToken}}", "newPassword": "NewPass123!", "confirmPassword": "NewPass123!" }`
   - Test: Status 200, success: true

4. **Password Reset Verify (Invalid Token)**
   - Method: POST
   - URL: `{{baseUrl}}/api/v1/auth/password-reset/verify`
   - Body: `{ "token": "invalid", "newPassword": "NewPass123!", "confirmPassword": "NewPass123!" }`
   - Test: Status 400, error code INVALID_RESET_TOKEN

5. **Token Refresh (Valid)**
   - Method: POST
   - URL: `{{baseUrl}}/api/v1/auth/refresh-token`
   - Body: `{ "refreshToken": "{{validRefreshToken}}" }`
   - Test: Status 200, has accessToken and refreshToken

6. **Token Refresh (Invalid)**
   - Method: POST
   - URL: `{{baseUrl}}/api/v1/auth/refresh-token`
   - Body: `{ "refreshToken": "invalid_token" }`
   - Test: Status 401, error code INVALID_REFRESH_TOKEN

**TESTING WITH NEWMAN:**
Include instructions for running tests:
```bash
# Install newman if not installed
npm install -g newman

# Run the collection
newman run postman/user-registration-email-verification.postman_collection.json \
  --environment postman/environment.json \
  --reporters cli,html \
  --reporter-html-export results.html
```

**GIT OPERATIONS:**
After updating successfully:
- Stage changes: `git add postman/`
- Commit with message: `git commit -m "feat(password-reset): update Postman collection with reset tests"`
- Push to remote: `git push origin feature/password-reset-jwt-refresh`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and mark backend phase COMPLETE
Update progress.md marking all backend tasks done
Set next task to F1 (Frontend phase begins)

---

## Frontend Task F1: Create/Update TypeScript Types

**MANDATORY FIRST STEPS:**

Read and analyze: `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/API-CONTRACT.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/spec.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/api.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/tasks.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/progress.md`
Verify backend is complete and tested

**YOUR TASK:**
Create TypeScript types for password reset matching backend API exactly

**FILE TO CREATE:**
`frontend/src/types/password-reset.types.ts` (MAXIMUM 200 lines)

**TYPES TO DEFINE:**
Based on API-CONTRACT.md, create interfaces for:

```typescript
// Request interfaces
export interface PasswordResetRequestData {
  email: string;
}

export interface PasswordResetVerifyData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TokenRefreshData {
  refreshToken: string;
}

// Response interfaces
export interface PasswordResetResponse {
  success: boolean;
  data?: {
    message: string;
  };
  error?: string;
  code?: string;
}

export interface TokenRefreshResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
  code?: string;
}
```

**FILE TO MODIFY:**
`frontend/src/types/auth.types.ts` - Add TokenRefreshData interface if not already present

**MUST MATCH:**
Types must match backend responses EXACTLY as shown in API-CONTRACT.md

**EXPORT ALL TYPES:**
Make sure all interfaces are exported for use in components

**GIT OPERATIONS:**
After creating successfully:
- Stage changes: `git add frontend/src/types/`
- Commit with message: `git commit -m "feat(password-reset): add TypeScript types for password reset"`
- Push to remote: `git push origin feature/password-reset-jwt-refresh`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F2
Update progress.md with completion and git status

---

## Frontend Task F2: Extend API Service for Password Reset

**MANDATORY FIRST STEPS:**

Read and analyze: `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/API-CONTRACT.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/spec.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/api.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/tasks.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/progress.md`
Verify types exist from F1

**YOUR TASK:**
Create API service to communicate with password reset backend endpoints

**FILE TO CREATE:**
`frontend/src/services/password-reset.service.ts` (MAXIMUM 400 lines)

**IMPORT TYPES:**
From: `../types/password-reset.types.ts`

**METHODS TO IMPLEMENT:**
```typescript
export const passwordResetService = {
  requestReset: async (email: string): Promise<PasswordResetResponse> => {
    // Call POST /api/v1/auth/password-reset/request
  },
  
  verifyReset: async (data: PasswordResetVerifyData): Promise<PasswordResetResponse> => {
    // Call POST /api/v1/auth/password-reset/verify
  }
};
```

**FILE TO MODIFY:**
`frontend/src/services/auth.service.ts` - Add refreshToken method:
```typescript
refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
  // Call POST /api/v1/auth/refresh-token
}
```

**API CALLS:**
- Use fetch or axios consistent with existing service
- Set proper headers: Content-Type: application/json
- Include error handling for network failures
- Return exact types as defined

**ERROR HANDLING:**
- Catch network errors
- Parse API error responses
- Return consistent error format

**GIT OPERATIONS:**
After creating successfully:
- Stage changes: `git add frontend/src/services/`
- Commit with message: `git commit -m "feat(password-reset): add API service methods for password reset"`
- Push to remote: `git push origin feature/password-reset-jwt-refresh`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F3
Update progress.md with completion and git status

---

## Frontend Task F3: Create Password Reset UI Components

**MANDATORY FIRST STEPS:**

Read and analyze: `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/API-CONTRACT.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/spec.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/api.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/tasks.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/progress.md`
Verify API service exists from F2
Check existing auth components for UI patterns

**YOUR TASK:**
Create main UI components for password reset functionality

**FILES TO CREATE:**

1. `frontend/src/components/auth/ForgotPasswordForm.tsx` (MAXIMUM 400 lines)
2. `frontend/src/components/auth/ResetPasswordForm.tsx` (MAXIMUM 400 lines)

**USE MOCK DATA FIRST:**
Create components with hardcoded responses to test UI
Don't connect to real API yet (that's F5)

**FORGOT PASSWORD FORM FEATURES:**
- Email input with validation
- Submit button with loading state
- Success message display
- Error message display
- Link back to login page
- Responsive design with Tailwind CSS

**RESET PASSWORD FORM FEATURES:**
- New password input with validation
- Confirm password input
- Password strength indicator
- Submit button with loading state
- Success/error message display
- Password visibility toggle
- Real-time validation feedback

**COMPONENT STRUCTURE:**
- Use React hooks (useState, useEffect)
- Follow existing auth component patterns
- Implement proper TypeScript typing
- Add form validation before submission

**DESIGN REQUIREMENTS:**
- Match existing auth page styling
- Mobile-first responsive design
- Loading states for all async actions
- Clear error messaging
- Accessibility features (ARIA labels, proper focus)

**GIT OPERATIONS:**
After creating successfully:
- Stage changes: `git add frontend/src/components/auth/`
- Commit with message: `git commit -m "feat(password-reset): add UI components for password reset"`
- Push to remote: `git push origin feature/password-reset-jwt-refresh`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F4
Update progress.md with completion and git status

---

## Frontend Task F4: Create Password Reset Pages/Routes

**MANDATORY FIRST STEPS:**

Read and analyze: `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/API-CONTRACT.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/spec.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/api.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/tasks.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/progress.md`
Verify components exist from F3
Check existing auth pages for layout patterns

**YOUR TASK:**
Create Next.js pages for password reset user flow

**FILES TO CREATE:**

1. `frontend/src/app/auth/forgot-password/page.tsx` (MAXIMUM 200 lines)
2. `frontend/src/app/auth/reset-password/page.tsx` (MAXIMUM 200 lines)

**FORGOT PASSWORD PAGE:**
- Import and use ForgotPasswordForm component
- Add proper page metadata (title, description)
- Include navigation breadcrumbs
- Add link to login page
- Handle success state (show message, redirect option)

**RESET PASSWORD PAGE:**
- Import and use ResetPasswordForm component
- Extract token from URL parameters
- Add proper page metadata
- Handle invalid/missing token scenarios
- Success state redirects to login

**PAGE FEATURES:**
- Proper Next.js metadata configuration
- SEO-friendly titles and descriptions
- Error boundary handling
- Loading states while checking tokens
- Responsive layout matching auth pages

**ROUTES CREATED:**
- `/auth/forgot-password` - Request password reset
- `/auth/reset-password?token=xyz` - Verify and reset password

**URL PARAMETER HANDLING:**
```typescript
// For reset password page
const searchParams = useSearchParams();
const token = searchParams.get('token');
```

**GIT OPERATIONS:**
After creating successfully:
- Stage changes: `git add frontend/src/app/auth/`
- Commit with message: `git commit -m "feat(password-reset): add Next.js pages for reset flow"`
- Push to remote: `git push origin feature/password-reset-jwt-refresh`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F5
Update progress.md with completion and git status

---

## Frontend Task F5: Connect Frontend to Backend

**MANDATORY FIRST STEPS:**

Read and analyze: `docs/features/password-reset-jwt-refresh/CURRENT-STATE.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/API-CONTRACT.md`  
Read and analyze: `docs/features/password-reset-jwt-refresh/spec.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/api.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/tasks.md`
Read and analyze: `docs/features/password-reset-jwt-refresh/progress.md`
Verify all frontend files exist
Test backend is working with Postman

**YOUR TASK:**
Connect frontend components to real backend API, implement automatic token refresh

**FILES TO MODIFY:**

1. `frontend/src/components/auth/ForgotPasswordForm.tsx`
2. `frontend/src/components/auth/ResetPasswordForm.tsx`  
3. `frontend/src/services/auth.service.ts` (add automatic token refresh)

**CHANGES TO MAKE:**

**ForgotPasswordForm Integration:**
- Import passwordResetService from F2
- Replace mock data with real API calls
- Add proper loading states during API calls
- Handle API errors and display to user
- Show success message on successful email sent

**ResetPasswordForm Integration:**
- Import passwordResetService from F2
- Replace mock data with real API calls
- Handle token validation errors
- Add success handling (redirect to login with message)
- Display appropriate error messages

**Automatic Token Refresh:**
- Create HTTP interceptor for API calls
- Detect 401 responses (token expired)
- Automatically call refresh token endpoint
- Retry original request with new token
- Handle refresh token expiry (redirect to login)

**INTEGRATION FEATURES:**
- Form submissions call backend APIs
- Loading states during network requests
- Error handling displays user-friendly messages
- Success flows redirect appropriately
- Token refresh happens transparently
- Network error handling

**TEST INTEGRATION:**
- Password reset request works end-to-end
- Password reset verification works
- Token refresh works automatically
- Error cases show proper messages
- Loading states work correctly
- Form validation prevents invalid submissions

**GIT OPERATIONS:**
After modifying successfully:
- Stage changes: `git add frontend/src/components/auth/ frontend/src/services/`
- Commit with message: `git commit -m "feat(password-reset): complete backend integration for password reset"`
- Push to remote: `git push origin feature/password-reset-jwt-refresh`

**AFTER COMPLETING:**
Update CURRENT-STATE.md:
- Mark feature as COMPLETE
- List all files created/modified
- Note any issues for PROBLEMS-LOG.md

Update progress.md:
- Mark all tasks completed
- Add final git status
- Note feature completion

**FINAL TESTING CHECKLIST:**
- [ ] Complete password reset flow: request → email → verify → login
- [ ] Token refresh during normal app usage  
- [ ] Rate limiting works correctly
- [ ] Error scenarios show proper user feedback
- [ ] Email templates render correctly
- [ ] Responsive design works on mobile/desktop
- [ ] All Postman tests pass
- [ ] No console errors in browser
- [ ] TypeScript compilation successful
