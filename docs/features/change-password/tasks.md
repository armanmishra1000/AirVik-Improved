# Change Password Tasks

## Developer: [Name] - Completes ALL tasks in order

## Backend Phase (Test each with Postman before moving on):

### Task B1: Extend Auth Service Layer
**File to modify**: `backend/src/services/auth/user-auth.service.ts` (max 50 lines addition)
**What it does**: Adds changePassword method to existing auth service
**Must include**: Current password verification, new password validation, password hashing
**Test**: Call function from Node.js console or direct service test
**Git**: Add, commit with descriptive message, push

### Task B2: Extend Auth Controller
**File to modify**: `backend/src/controllers/auth/user-auth.controller.ts` (max 50 lines addition)
**What it does**: HTTP request handling for change password endpoint
**Must match**: Exact format in API-CONTRACT.md
**Test**: Use curl or Postman
**Git**: Add, commit, push

### Task B3: Extend Auth Routes
**File to modify**: `backend/src/routes/auth.routes.ts` (max 10 lines addition)
**What it does**: Connect change password URL to controller
**Test**: Route appears in Express route list
**Git**: Add, commit, push

### Task B4: Extend Postman Collection
**File to modify**: `postman/user-registration-email-verification.postman_collection.json`
**Must include**: Change password endpoint with example data and tests
**Test**: All requests return expected responses
**Testing method**: Design test for newman, test with newman in terminal
**Git**: Add, commit, push

## Frontend Phase (Only start after backend fully tested):

### Task F1: Extend TypeScript Types
**File to modify**: `frontend/src/types/auth.types.ts` (max 30 lines addition)
**Must match**: Backend response structure EXACTLY
**Test**: No TypeScript errors
**Git**: Add, commit, push

### Task F2: Extend API Service
**File to modify**: `frontend/src/services/auth.service.ts` (max 50 lines addition)
**Must match**: API-CONTRACT.md exactly
**Test**: Console log responses match expected structure
**Git**: Add, commit, push

### Task F3: Create Change Password Component
**File to create**: `frontend/src/components/auth/ChangePasswordForm.tsx` (max 400 lines)
**What it does**: User interface for changing password with validation
**Test**: Component renders with mock data
**Git**: Add, commit, push

### Task F4: Create Change Password Page
**File to create**: `frontend/src/app/change-password/page.tsx` (max 200 lines)
**What it does**: Next.js page for the change password feature
**Test**: Can navigate to page
**Git**: Add, commit, push

### Task F5: Connect to Backend
**Files to modify**: Component and service files from F2 and F3
**What it does**: Replace mock data with real API calls
**Test**: Full feature works end-to-end
**Git**: Add, commit, push with "integration complete" message