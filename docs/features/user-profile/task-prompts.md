# Task Prompts for User Profile

## HOW TO USE:
1. Copy each prompt exactly
2. Paste to AI in Windsurf Planning Mode
3. Report "done" or exact error message
4. AI will update state files automatically

## Backend Task B1: Service Layer

### MANDATORY FIRST STEPS:
Read and analyze: docs/features/user-profile/CURRENT-STATE.md
Read and analyze: docs/features/user-profile/API-CONTRACT.md
Read and analyze: docs/features/user-profile/spec.md
Read and analyze: docs/features/user-profile/api.md
Read and analyze: docs/features/user-profile/tasks.md
Read and analyze: shared/contracts/services/user-profile-service.contract.ts
Read and analyze: shared/contracts/models/user.contract.ts

List what you found to prove you read them

### CONTEXT:
You are implementing user-profile feature. The developer using this is a beginner who only copies prompts.

### YOUR TASK:
Create service layer for user profile management (view and update profile)

### FILE TO CREATE:
`backend/src/services/profile/user-profile.service.ts` (MAXIMUM 400 lines)

### REQUIREMENTS FROM SPEC:
- viewUserProfile method: Retrieve user data by ID from JWT token
- updateUserProfile method: Update user name and email with validation
- Name transformation: API firstName+lastName ↔ Model name field
- Email uniqueness validation (excluding current user)
- Error handling using existing patterns from auth service

### CODE STRUCTURE:
- Import existing User model from ../../models/user.model.ts
- Import ServiceResponse interface from auth service contract
- Use exact method names from user-profile-service.contract.ts: viewUserProfile, updateUserProfile
- Return data structure must match API-CONTRACT.md exactly
- Transform model.name ↔ API firstName/lastName
- Use existing error codes: USER_NOT_FOUND, EMAIL_EXISTS, VALIDATION_ERROR

### CRITICAL DATABASE MAPPING:
- API receives: { firstName: "John", lastName: "Doe" }
- Store in model: { name: "John Doe" } (combined)
- API returns: { firstName: "John", lastName: "Doe" } (split from model.name)

### DO NOT:
- Create any other files
- Exceed 400 lines
- Add fields not in contracts
- Use different method names than specified

### GIT OPERATIONS:
After creating the file successfully:
1. Stage changes: `git add backend/src/services/profile/`
2. Commit with message: `git commit -m "feat(user-profile): add service layer for profile management"`
3. Push to remote: `git push origin feature/user-profile`

### AFTER COMPLETING:
Update docs/features/user-profile/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/services/profile/user-profile.service.ts - Service layer created
- Update "Next Task": B2

### TEST YOUR WORK:
The developer will test by calling service methods from Node.js console

---

## Backend Task B2: Controller Layer

### MANDATORY FIRST STEPS:
Read and analyze: docs/features/user-profile/CURRENT-STATE.md
Confirm service layer exists from previous task
Read and analyze: docs/features/user-profile/API-CONTRACT.md
Read and analyze: docs/features/user-profile/spec.md
Read and analyze: docs/features/user-profile/api.md
Read and analyze: docs/features/user-profile/tasks.md
Read and analyze: shared/contracts/api/user-profile-api.contract.ts

### YOUR TASK:
Create controller to handle HTTP requests for user profile features

### FILE TO CREATE:
`backend/src/controllers/profile/user-profile.controller.ts` (MAXIMUM 400 lines)

### USE THE SERVICE:
Import from: ../../services/profile/user-profile.service.ts

### IMPLEMENT ENDPOINTS:
Based on API-CONTRACT.md, create controller methods:
- viewProfile (GET /api/v1/profile/view)
- updateProfile (PUT /api/v1/profile/update)

### RESPONSE FORMAT:
MUST match exactly what's in API-CONTRACT.md:
- Success: { success: true, data: {...} }
- Error: { success: false, error: "message", code: "ERROR_CODE" }

### AUTHENTICATION:
- Extract user ID from req.user (set by auth middleware)
- Both endpoints require authentication
- Handle cases where user not found

### REQUEST VALIDATION:
- GET /view: No body validation needed (user ID from JWT)
- PUT /update: Validate firstName, lastName, email using Joi
- Use validation rules from user-profile-api.contract.ts

### GIT OPERATIONS:
After creating the file successfully:
1. Stage changes: `git add backend/src/controllers/profile/`
2. Commit with message: `git commit -m "feat(user-profile): add controller with request handling"`
3. Push to remote: `git push origin feature/user-profile`

### AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to B3

---

## Backend Task B3: Routes Configuration

### MANDATORY FIRST STEPS:
Read and analyze: docs/features/user-profile/CURRENT-STATE.md
Verify controller exists from B2
Read and analyze: docs/features/user-profile/API-CONTRACT.md
Read and analyze: shared/contracts/api/user-profile-api.contract.ts
Check existing route files for patterns: backend/src/routes/auth.routes.ts

### YOUR TASK:
Create routes file to connect URLs to controller methods

### FILE TO CREATE:
`backend/src/routes/profile.routes.ts` (MAXIMUM 200 lines)

### IMPORT CONTROLLER:
From: ../controllers/profile/user-profile.controller.ts

### DEFINE ROUTES:
Based on API-CONTRACT.md:
- GET /view → viewProfile controller method
- PUT /update → updateProfile controller method

### ADD MIDDLEWARE:
- authenticateToken middleware for both routes (from existing auth middleware)
- Optional: rate limiting middleware

### ROUTE STRUCTURE:
```javascript
router.get('/view', authenticateToken, userProfileController.viewProfile);
router.put('/update', authenticateToken, userProfileController.updateProfile);
```

### GIT OPERATIONS:
After creating the file successfully:
1. Stage changes: `git add backend/src/routes/`
2. Commit with message: `git commit -m "feat(user-profile): add API routes configuration"`
3. Push to remote: `git push origin feature/user-profile`

### AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to B4

---

## Backend Task B4: Integrate Routes with Server

### MANDATORY FIRST STEPS:
Read and analyze: docs/features/user-profile/CURRENT-STATE.md
Verify routes exist from B3
Check existing server setup: backend/src/server.ts

### YOUR TASK:
Register profile routes with Express application

### FILES TO MODIFY:
`backend/src/server.ts` (likely existing file)

### INTEGRATION:
- Import profile routes: `const profileRoutes = require('./routes/profile.routes')`
- Mount routes: `app.use('/api/v1/profile', profileRoutes)`
- Ensure consistent with existing auth routes pattern

### TEST INTEGRATION:
- Profile routes should be accessible at /api/v1/profile/view and /api/v1/profile/update
- Authentication middleware should be enforced

### GIT OPERATIONS:
After modifying successfully:
1. Stage changes: `git add backend/src/server.ts`
2. Commit with message: `git commit -m "feat(user-profile): integrate profile routes with server"`
3. Push to remote: `git push origin feature/user-profile`

### AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to B5

---

## Backend Task B5: Postman Collection

### MANDATORY FIRST STEPS:
Read and analyze: docs/features/user-profile/CURRENT-STATE.md
Read and analyze: docs/features/user-profile/API-CONTRACT.md
Verify all backend files exist
Check existing postman collections for patterns

### YOUR TASK:
Create Postman collection for testing all endpoints, compatible with newman for terminal testing

### FILE TO CREATE:
`postman/user-profile.postman_collection.json`

### INCLUDE FOR EACH ENDPOINT:
- Request name and description
- Method and URL with {{baseUrl}} variable
- Headers (Authorization: Bearer {{accessToken}})
- Body with example data from API-CONTRACT.md
- Tests to verify response structure

### COLLECTION STRUCTURE:
```json
{
  "info": {
    "name": "User Profile API Tests",
    "description": "Complete test suite for user profile features"
  },
  "item": [
    {
      "name": "View Profile",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/v1/profile/view",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{accessToken}}"
          }
        ]
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "pm.test('Response has success: true', function () {",
              "    pm.expect(pm.response.json().success).to.be.true;",
              "});"
            ]
          }
        }
      ]
    },
    {
      "name": "Update Profile",
      "request": {
        "method": "PUT",
        "url": "{{baseUrl}}/api/v1/profile/update",
        "header": [
          {
            "key": "Authorization", 
            "value": "Bearer {{accessToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"firstName\": \"Updated\",\n  \"lastName\": \"Name\",\n  \"email\": \"updated@example.com\"\n}"
        }
      }
    }
  ]
}
```

### ADD TESTS:
For each request, add tests:
- Status code is 200
- Response has success: true
- Response data matches expected structure

### NEWMAN TESTING:
Developer will test with: `newman run postman/user-profile.postman_collection.json -e postman/environment.json`

### GIT OPERATIONS:
After creating the file successfully:
1. Stage changes: `git add postman/`
2. Commit with message: `git commit -m "feat(user-profile): add Postman test collection"`
3. Push to remote: `git push origin feature/user-profile`

### AFTER COMPLETING:
Update CURRENT-STATE.md and mark backend phase COMPLETE

---

## Frontend Task F1: TypeScript Types

### MANDATORY FIRST STEPS:
Read and analyze: docs/features/user-profile/CURRENT-STATE.md
Read and analyze: docs/features/user-profile/API-CONTRACT.md
Read and analyze: shared/contracts/types/user-profile-types.contract.ts
Verify backend is complete and tested

### YOUR TASK:
Create TypeScript types matching backend API exactly

### FILE TO CREATE:
`frontend/src/types/profile.types.ts` (MAXIMUM 200 lines)

### TYPES TO DEFINE:
Based on API-CONTRACT.md, create interfaces for:
- UserProfile (main user data structure)
- ViewProfileResponse and UpdateProfileResponse (API responses)
- UpdateProfileRequest (form data)
- Form validation interfaces
- Loading state interfaces
- Error handling types

### MUST MATCH:
Types must match backend responses EXACTLY as shown in API-CONTRACT.md

### EXPORT ALL TYPES:
Make sure all interfaces are exported for use in components

### GIT OPERATIONS:
After creating the file successfully:
1. Stage changes: `git add frontend/src/types/`
2. Commit with message: `git commit -m "feat(user-profile): add TypeScript type definitions"`
3. Push to remote: `git push origin feature/user-profile`

### AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to F2

---

## Frontend Task F2: API Service

### MANDATORY FIRST STEPS:
Read and analyze: docs/features/user-profile/CURRENT-STATE.md
Read and analyze: docs/features/user-profile/API-CONTRACT.md
Verify types exist from F1
Check existing API service patterns: frontend/src/services/auth.service.ts

### YOUR TASK:
Create API service to communicate with backend

### FILE TO CREATE:
`frontend/src/services/profile.service.ts` (MAXIMUM 400 lines)

### IMPORT TYPES:
From: ../types/profile.types.ts

### IMPLEMENT METHODS:
For each endpoint in API-CONTRACT.md:
- viewProfile(): Promise<ViewProfileResponse>
- updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse>

### API CALLS:
- Use fetch or axios to call backend endpoints
- Include proper Authorization header with JWT token
- Handle authentication token management (get from localStorage)
- Return exact types as defined

### ERROR HANDLING:
- Network errors
- HTTP error status codes
- Invalid responses
- Authentication failures

### GIT OPERATIONS:
After creating the file successfully:
1. Stage changes: `git add frontend/src/services/`
2. Commit with message: `git commit -m "feat(user-profile): add frontend API service"`
3. Push to remote: `git push origin feature/user-profile`

### AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to F3

---

## Frontend Task F3: View Profile Component

### MANDATORY FIRST STEPS:
Read and analyze: docs/features/user-profile/CURRENT-STATE.md
Read and analyze: docs/features/user-profile/API-CONTRACT.md
Verify API service exists from F2
Check UI/UX requirements from spec.md

### YOUR TASK:
Create main UI component for viewing user profile

### FILE TO CREATE:
`frontend/src/components/profile/ViewProfile.tsx` (MAXIMUM 400 lines)

### USE MOCK DATA FIRST:
Create component with hardcoded data to test UI
Don't connect to API yet (that's F6)

### COMPONENT FEATURES:
- Display user information: firstName, lastName, email, verification status, join date
- "Edit Profile" button to navigate to edit page
- Loading states (skeleton or spinner)
- Error display with retry option
- Responsive design with Tailwind CSS
- Profile picture placeholder

### COMPONENT STRUCTURE:
- Use React hooks (useState, useEffect)
- Separate concerns (UI vs logic)
- Make it reusable
- Props interface for data and callbacks

### GIT OPERATIONS:
After creating the file successfully:
1. Stage changes: `git add frontend/src/components/profile/`
2. Commit with message: `git commit -m "feat(user-profile): add view profile component"`
3. Push to remote: `git push origin feature/user-profile`

### AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to F4

---

## Frontend Task F4: Edit Profile Form Component

### MANDATORY FIRST STEPS:
Read and analyze: docs/features/user-profile/CURRENT-STATE.md
Read and analyze: docs/features/user-profile/API-CONTRACT.md
Verify view component exists from F3
Check form patterns from existing auth components

### YOUR TASK:
Create form component for editing user profile

### FILE TO CREATE:
`frontend/src/components/profile/EditProfileForm.tsx` (MAXIMUM 400 lines)

### USE MOCK DATA FIRST:
Create component with form functionality but don't connect to API yet

### COMPONENT FEATURES:
- Form fields: firstName, lastName, email
- Real-time validation with error messages
- Loading state during submission
- Success/error feedback
- Cancel/Save buttons
- Form reset functionality
- "Has changes" detection with unsaved changes warning
- Responsive design with Tailwind CSS

### FORM VALIDATION:
- Required field validation
- Email format validation
- Name length validation (2-50 characters)
- Real-time feedback as user types

### COMPONENT STRUCTURE:
- Use React Hook Form or similar for form management
- Separate validation logic
- Props interface for initial data and callbacks
- Handle form state properly

### GIT OPERATIONS:
After creating the file successfully:
1. Stage changes: `git add frontend/src/components/profile/`
2. Commit with message: `git commit -m "feat(user-profile): add edit profile form component"`
3. Push to remote: `git push origin feature/user-profile`

### AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to F5

---

## Frontend Task F5: Profile Pages

### MANDATORY FIRST STEPS:
Read and analyze: docs/features/user-profile/CURRENT-STATE.md
Verify components exist from F3 and F4
Check Next.js app structure: frontend/src/app/

### YOUR TASK:
Create Next.js pages for profile functionality

### FILES TO CREATE:
- `frontend/src/app/profile/page.tsx` (MAXIMUM 200 lines)
- `frontend/src/app/profile/edit/page.tsx` (MAXIMUM 200 lines)

### PAGE CONTENT:
**Profile View Page:**
- Import and use ViewProfile component from F3
- Page title and metadata
- Navigation breadcrumbs
- Authentication guard (redirect if not logged in)

**Profile Edit Page:**
- Import and use EditProfileForm component from F4
- Page title and metadata
- Navigation back to view page
- Authentication guard
- Handle form submission success (redirect to view page)

### ROUTE SETUP:
The file locations create routes automatically:
- File: `app/profile/page.tsx` → Route: `/profile`
- File: `app/profile/edit/page.tsx` → Route: `/profile/edit`

### GIT OPERATIONS:
After creating files successfully:
1. Stage changes: `git add frontend/src/app/profile/`
2. Commit with message: `git commit -m "feat(user-profile): add Next.js profile pages"`
3. Push to remote: `git push origin feature/user-profile`

### AFTER COMPLETING:
Update CURRENT-STATE.md and set next task to F6

---

## Frontend Task F6: Backend Integration

### MANDATORY FIRST STEPS:
Read and analyze: docs/features/user-profile/CURRENT-STATE.md
Verify all frontend files exist
Test backend is working with Postman
Read integration requirements from spec.md

### YOUR TASK:
Connect frontend components to real backend API

### FILES TO MODIFY:
- `frontend/src/components/profile/ViewProfile.tsx`
- `frontend/src/components/profile/EditProfileForm.tsx`
- Both page files

### CHANGES TO MAKE:
- Import API service from F2
- Replace mock data with real API calls
- Add proper loading states during API calls
- Handle API errors and display to user
- Add success handling (redirect or message)
- Implement authentication token handling
- Add token refresh handling for expired sessions

### TEST INTEGRATION:
- View profile operation works and displays real data
- Update profile operation saves changes to database
- Form validation works with backend validation
- Error cases show proper messages
- Loading states work during API calls
- Authentication is enforced

### GIT OPERATIONS:
After modifying successfully:
1. Stage changes: `git add frontend/src/components/profile/ frontend/src/app/profile/`
2. Commit with message: `git commit -m "feat(user-profile): complete backend integration"`
3. Push to remote: `git push origin feature/user-profile`

### AFTER COMPLETING:
Update CURRENT-STATE.md:
- Mark feature as COMPLETE
- List all files created
- Note any issues for PROBLEMS-LOG.md

### FINAL TESTING:
1. User can view their profile information
2. User can successfully update profile (name and email)
3. Email uniqueness validation works
4. Form validation shows appropriate errors
5. Authentication is enforced on all endpoints
6. Loading states work properly
7. Error states display correctly