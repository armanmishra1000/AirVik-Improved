# Task Prompts for Change Password Feature

## HOW TO USE:
1. Copy each prompt exactly
2. Paste to AI in Cursor
3. Report "done" or exact error message
4. AI will update state files automatically

## Backend Task B1: Extend Auth Service Layer

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/change-password/CURRENT-STATE.md
Read and analyze: docs/features/change-password/API-CONTRACT.md
Read and analyze: docs/features/change-password/spec.md
Read and analyze: docs/features/change-password/api.md
Read and analyze: docs/features/change-password/tasks.md
Read and analyze: docs/features/change-password/progress.md

List what you found to prove you read them

**CONTEXT:**
You are implementing change-password feature. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Extend existing auth service to add changePassword method

**FILE TO MODIFY:**
`backend/src/services/auth/user-auth.service.ts` (MAXIMUM 50 lines addition)

**REQUIREMENTS FROM SPEC:**
- Add changePassword method that takes userId, currentPassword, newPassword
- Verify currentPassword using existing comparePassword method
- Validate newPassword meets requirements (min 8 chars, uppercase, lowercase, number, special char)
- Update password in database (triggers existing bcrypt hashing via pre-save hook)
- Return success message matching API-CONTRACT.md exactly

**CODE STRUCTURE:**
```typescript
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ message: string }> => {
  // 1. Find user by ID
  // 2. Verify current password using comparePassword
  // 3. Validate new password requirements
  // 4. Update password (triggers pre-save hook)
  // 5. Return success message
};
```

**DO NOT:**
- Create new files
- Exceed 50 lines addition
- Change existing methods
- Add new dependencies

**GIT OPERATIONS:**
After extending the file successfully:
- Stage changes: `git add backend/src/services/auth/user-auth.service.ts`
- Commit with message: `git commit -m "feat(change-password): add changePassword method to auth service"`
- Push to remote: `git push origin feature/change-password`

**AFTER COMPLETING:**
Update docs/features/change-password/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/services/auth/user-auth.service.ts - changePassword method added
- Update "Next Task": B2

Update docs/features/change-password/progress.md:
- Mark B1 as completed
- Add to "Git Status": Last commit hash and message

**TEST YOUR WORK:**
The developer will test by calling the service method directly

---

## Backend Task B2: Extend Auth Controller

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/change-password/CURRENT-STATE.md
Confirm service layer extension exists from B1
Read and analyze: docs/features/change-password/API-CONTRACT.md
Read and analyze: docs/features/change-password/spec.md
Read and analyze: docs/features/change-password/api.md
Read and analyze: docs/features/change-password/tasks.md
Read and analyze: docs/features/change-password/progress.md

**YOUR TASK:**
Extend existing auth controller to add change password endpoint

**FILE TO MODIFY:**
`backend/src/controllers/auth/user-auth.controller.ts` (MAXIMUM 50 lines addition)

**USE THE SERVICE:**
Import and use changePassword method from user-auth.service.ts

**IMPLEMENT ENDPOINT:**
Based on API-CONTRACT.md, create changePassword controller method

**RESPONSE FORMAT:**
MUST match exactly what's in API-CONTRACT.md:
- Success: `{ success: true, data: { message: "Password changed successfully" } }`
- Error: `{ success: false, error: "message", code: "ERROR_CODE" }`

**REQUEST VALIDATION:**
Add Joi validation for:
- currentPassword: required string, min 1 character
- newPassword: required string, min 8 characters with strength requirements

**AUTHENTICATION:**
Use existing JWT authentication middleware pattern

**ERROR HANDLING:**
- 401: Authentication required (UNAUTHORIZED)
- 400: Current password incorrect (INVALID_CURRENT_PASSWORD)  
- 422: Validation errors (VALIDATION_ERROR)

**GIT OPERATIONS:**
After extending the file successfully:
- Stage changes: `git add backend/src/controllers/auth/user-auth.controller.ts`
- Commit with message: `git commit -m "feat(change-password): add changePassword endpoint to auth controller"`
- Push to remote: `git push origin feature/change-password`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to B3
Update progress.md with completion status and git info

---

## Backend Task B3: Extend Auth Routes

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/change-password/CURRENT-STATE.md
Verify controller extension exists from B2
Read and analyze: docs/features/change-password/API-CONTRACT.md
Read and analyze: docs/features/change-password/spec.md
Read and analyze: docs/features/change-password/api.md
Read and analyze: docs/features/change-password/tasks.md
Read and analyze: docs/features/change-password/progress.md
Check existing route files for patterns

**YOUR TASK:**
Extend existing auth routes to add change password route

**FILE TO MODIFY:**
`backend/src/routes/auth.routes.ts` (MAXIMUM 10 lines addition)

**IMPORT CONTROLLER:**
Use existing controller import and add changePassword method

**DEFINE ROUTE:**
Based on API-CONTRACT.md:
- PUT /api/v1/auth/change-password
- Use existing authentication middleware
- Add rate limiting (5 attempts per 15 minutes)

**MIDDLEWARE:**
Include authentication middleware and any validation middleware needed

**GIT OPERATIONS:**
After extending the file successfully:
- Stage changes: `git add backend/src/routes/auth.routes.ts`
- Commit with message: `git commit -m "feat(change-password): add change password route"`
- Push to remote: `git push origin feature/change-password`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to B4
Update progress.md with completion status and git info

---

## Backend Task B4: Extend Postman Collection

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/change-password/CURRENT-STATE.md
Read and analyze: docs/features/change-password/API-CONTRACT.md
Read and analyze: docs/features/change-password/spec.md
Read and analyze: docs/features/change-password/api.md
Read and analyze: docs/features/change-password/tasks.md
Read and analyze: docs/features/change-password/progress.md
Verify all backend files are extended

**YOUR TASK:**
Extend Postman collection for testing change password endpoint, for testing with newman in terminal

**FILE TO MODIFY:**
`postman/user-registration-email-verification.postman_collection.json`

**INCLUDE FOR CHANGE PASSWORD ENDPOINT:**
- Request name: "Change Password"
- Method: PUT
- URL: {{baseUrl}}/api/v1/auth/change-password
- Headers: Content-Type: application/json, Authorization: Bearer {{accessToken}}
- Body with example data from API-CONTRACT.md
- Tests to verify response structure

**EXAMPLE REQUEST BODY:**
```json
{
    "currentPassword": "currentPassword123",
    "newPassword": "newSecurePassword456!"
}
```

**ADD TESTS:**
For the request, add tests in the "Tests" tab:
- Status code is 200
- Response has success: true
- Response data has message field
- Test error scenarios (wrong current password, validation errors)

**GIT OPERATIONS:**
After extending the file successfully:
- Stage changes: `git add postman/`
- Commit with message: `git commit -m "feat(change-password): add change password tests to Postman collection"`
- Push to remote: `git push origin feature/change-password`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and mark backend phase COMPLETE
Update progress.md with completion status and git info

**TEST WITH NEWMAN:**
Create newman test command in terminal:
`newman run postman/user-registration-email-verification.postman_collection.json -e postman/environment.json --folder "Change Password"`

---

## Frontend Task F1: Extend TypeScript Types

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/change-password/CURRENT-STATE.md
Read and analyze: docs/features/change-password/API-CONTRACT.md
Read and analyze: docs/features/change-password/spec.md
Read and analyze: docs/features/change-password/api.md
Read and analyze: docs/features/change-password/tasks.md
Read and analyze: docs/features/change-password/progress.md
Verify backend is complete and tested

**YOUR TASK:**
Extend TypeScript types to include change password interfaces

**FILE TO MODIFY:**
`frontend/src/types/auth.types.ts` (MAXIMUM 30 lines addition)

**TYPES TO ADD:**
Based on API-CONTRACT.md, add interfaces for:

```typescript
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: true;
  data: {
    message: string;
  };
}

export interface ChangePasswordErrorResponse {
  success: false;
  error: string;
  code: string;
}
```

**MUST MATCH:**
Types must match backend responses EXACTLY as shown in API-CONTRACT.md

**EXPORT ALL TYPES:**
Make sure all interfaces are exported for use in components

**GIT OPERATIONS:**
After extending the file successfully:
- Stage changes: `git add frontend/src/types/auth.types.ts`
- Commit with message: `git commit -m "feat(change-password): add TypeScript type definitions"`
- Push to remote: `git push origin feature/change-password`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F2
Update progress.md with completion status and git info

---

## Frontend Task F2: Extend API Service

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/change-password/CURRENT-STATE.md
Read and analyze: docs/features/change-password/API-CONTRACT.md
Read and analyze: docs/features/change-password/spec.md
Read and analyze: docs/features/change-password/api.md
Read and analyze: docs/features/change-password/tasks.md
Read and analyze: docs/features/change-password/progress.md
Verify types exist from F1

**YOUR TASK:**
Extend API service to add change password method

**FILE TO MODIFY:**
`frontend/src/services/auth.service.ts` (MAXIMUM 50 lines addition)

**IMPORT TYPES:**
From: ../types/auth.types.ts (add ChangePasswordRequest, ChangePasswordResponse)

**ADD TO AUTH_ENDPOINTS:**
```typescript
changePassword: '/api/v1/auth/change-password'
```

**IMPLEMENT METHOD:**
```typescript
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  // Use existing createApiRequest pattern
  // Method: PUT
  // Include authentication token
  // Return typed response
};
```

**API CALLS:**
Use existing createApiRequest function to call backend endpoint
Include proper error handling
Return exact types as defined

**MATCH API CONTRACT:**
Must follow API-CONTRACT.md exactly for request/response format

**GIT OPERATIONS:**
After extending the file successfully:
- Stage changes: `git add frontend/src/services/auth.service.ts`
- Commit with message: `git commit -m "feat(change-password): add changePassword method to API service"`
- Push to remote: `git push origin feature/change-password`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F3
Update progress.md with completion status and git info

---

## Frontend Task F3: Create Change Password Component

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/change-password/CURRENT-STATE.md
Read and analyze: docs/features/change-password/API-CONTRACT.md
Read and analyze: docs/features/change-password/spec.md
Read and analyze: docs/features/change-password/api.md
Read and analyze: docs/features/change-password/tasks.md
Read and analyze: docs/features/change-password/progress.md

Verify API service extension exists from F2
Check UI/UX requirements from spec.md

**YOUR TASK:**
Create change password form component

**FILE TO CREATE:**
`frontend/src/components/auth/ChangePasswordForm.tsx` (MAXIMUM 400 lines)

**USE MOCK DATA FIRST:**
Create component with hardcoded data to test UI
Don't connect to API yet (that's F5)

**COMPONENT FEATURES:**
- Form fields: current password, new password, confirm password
- Real-time password strength indicator
- Form validation on submit
- Loading states
- Error display
- Success feedback
- Responsive design with Tailwind CSS

**FORM FIELDS:**
- Current Password: password input, required
- New Password: password input, required, min 8 chars, strength validation
- Confirm Password: password input, required, must match new password

**VALIDATION RULES:**
- Current password: required
- New password: min 8 chars, uppercase, lowercase, number, special char
- Confirm password: must match new password
- Real-time validation with visual feedback

**COMPONENT STRUCTURE:**
```typescript
'use client';

import React, { useState } from 'react';

export default function ChangePasswordForm() {
  // Use React hooks (useState for form state)
  // Mock data for testing
  // Form validation
  // Loading states
  // Error handling
  // Success feedback
}
```

**STYLING:**
Use Tailwind CSS following existing auth form patterns

**GIT OPERATIONS:**
After creating the file successfully:
- Stage changes: `git add frontend/src/components/auth/`
- Commit with message: `git commit -m "feat(change-password): add change password form component"`
- Push to remote: `git push origin feature/change-password`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F4
Update progress.md with completion status and git info

---

## Frontend Task F4: Create Change Password Page

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/change-password/CURRENT-STATE.md
Read and analyze: docs/features/change-password/API-CONTRACT.md
Read and analyze: docs/features/change-password/spec.md
Read and analyze: docs/features/change-password/api.md
Read and analyze: docs/features/change-password/tasks.md
Read and analyze: docs/features/change-password/progress.md

Verify component exists from F3
Check Next.js app structure

**YOUR TASK:**
Create Next.js page for change password feature

**FILE TO CREATE:**
`frontend/src/app/change-password/page.tsx` (MAXIMUM 200 lines)

**PAGE CONTENT:**
- Import and use ChangePasswordForm component from F3
- Add page title and metadata
- Include proper layout and styling
- Add breadcrumbs or navigation if needed

**PAGE STRUCTURE:**
```typescript
import React from 'react';
import ChangePasswordForm from '@/src/components/auth/ChangePasswordForm';

export default function ChangePasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page content with form */}
    </div>
  );
}
```

**ROUTE SETUP:**
The file location creates the route automatically:
- File: `app/change-password/page.tsx`
- Route: `/change-password`

**METADATA:**
Add proper page title and description for SEO

**GIT OPERATIONS:**
After creating the file successfully:
- Stage changes: `git add frontend/src/app/change-password/`
- Commit with message: `git commit -m "feat(change-password): add change password page"`
- Push to remote: `git push origin feature/change-password`

**AFTER COMPLETING:**
Update CURRENT-STATE.md and set next task to F5
Update progress.md with completion status and git info

---

## Frontend Task F5: Backend Integration

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/change-password/CURRENT-STATE.md
Read and analyze: docs/features/change-password/API-CONTRACT.md
Read and analyze: docs/features/change-password/spec.md
Read and analyze: docs/features/change-password/api.md
Read and analyze: docs/features/change-password/tasks.md
Read and analyze: docs/features/change-password/progress.md
Verify all frontend files exist
Test backend is working with Postman

**YOUR TASK:**
Connect frontend component to real backend API

**FILES TO MODIFY:**
`frontend/src/components/auth/ChangePasswordForm.tsx`

**CHANGES TO MAKE:**
- Import changePassword method from auth service (F2)
- Replace mock data with real API calls
- Add proper loading states during API calls
- Handle API errors and display to user
- Add success handling (show message, optionally redirect)

**INTEGRATION STEPS:**
1. Import `{ changePassword }` from `'@/src/services/auth.service'`
2. Replace mock form submission with actual API call
3. Handle loading state during API request
4. Handle success response (show success message)
5. Handle error responses (display appropriate error messages)
6. Add proper form reset after successful password change

**TEST INTEGRATION:**
- Change password operation works with correct current password
- Error cases show proper messages (wrong current password, validation errors)
- Loading states display correctly
- Success message appears after successful change

**GIT OPERATIONS:**
After modifying successfully:
- Stage changes: `git add frontend/src/components/auth/`
- Commit with message: `git commit -m "feat(change-password): complete backend integration"`
- Push to remote: `git push origin feature/change-password`

**AFTER COMPLETING:**
Update CURRENT-STATE.md:
- Mark feature as COMPLETE
- List all files created/modified
- Note any issues for PROBLEMS-LOG.md

Update progress.md:
- Mark all tasks as completed
- Add final git status
- Set status to "Complete"

---

## Final Task T1: Integration Testing

**YOUR TASK:**
Run integration tests to ensure feature works with existing system

**TESTS TO RUN:**
1. Login with existing user
2. Navigate to /change-password page
3. Verify form renders correctly
4. Test change password with correct current password
5. Test error scenarios (wrong current password, validation errors)
6. Verify session is maintained after password change

**FIXES IF NEEDED:**
- Token issues: Check sessionStorage/localStorage keys
- API 404: Ensure /api/v1/auth/change-password route exists
- Auth errors: Verify middleware is applied
- Form issues: Check component integration

---

## Final Task T2: Update Project Documentation

**YOUR TASK:**
Update the main project progress file

**FILE TO UPDATE:**
`docs/features/project-progress.md`

**WHAT TO ADD:**
Add new section for Change Password feature following existing pattern:

```markdown
### Change Password
**Status:** ✅ Completed  
**Developer:** [Name]  
**Branch:** feature/change-password  
**Completed:** [Date]

**Description:** Complete change password system allowing authenticated users to securely update their password with current password verification and comprehensive validation.

**Files Created/Modified:**

*Backend Extensions:*
- Extended `backend/src/services/auth/user-auth.service.ts` - Added changePassword method
- Extended `backend/src/controllers/auth/user-auth.controller.ts` - Added change password endpoint
- Extended `backend/src/routes/auth.routes.ts` - Added change password route
- Extended `postman/user-registration-email-verification.postman_collection.json` - Added change password tests

*Frontend:*
- Extended `frontend/src/types/auth.types.ts` - Added change password type definitions  
- Extended `frontend/src/services/auth.service.ts` - Added changePassword API method
- Created `frontend/src/components/auth/ChangePasswordForm.tsx` - Change password form with validation
- Created `frontend/src/app/change-password/page.tsx` - Change password page

**Key Features Implemented:**
- Secure password change with current password verification
- Comprehensive password strength validation
- Real-time form validation with visual feedback
- JWT authentication integration
- Rate limiting to prevent abuse
- Responsive UI design matching existing patterns
- Full API integration with error handling

**Integration Points:**
- Integrates seamlessly with existing JWT authentication system
- Uses existing User model and password hashing patterns
- Follows established API contract patterns
- Reuses authentication middleware and validation patterns

**Technical Patterns Established:**
- Password change workflow with current password verification
- Password strength validation with real-time feedback
- Secure API integration for sensitive operations
- Form validation patterns for password input fields
```

**GIT OPERATIONS:**
- `git add docs/features/project-progress.md`
- `git commit -m "docs: add change-password to completed features"`
- `git push origin feature/change-password`