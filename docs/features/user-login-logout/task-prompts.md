# Task Prompts for User Login & Logout

## HOW TO USE:
1. Copy each prompt exactly
2. Paste to AI in Windsurf Planning Mode
3. Report "done" or exact error message
4. AI will update state files automatically

---

## Backend Task B1: MongoDB Schema

**MANDATORY FIRST STEPS:**
1. Read and analyze: `docs/features/user-login-logout/CURRENT-STATE.md`
2. Read and analyze: `docs/features/user-login-logout/API-CONTRACT.md`
3. Read and analyze: `docs/features/user-login-logout/spec.md`
4. Read and analyze: `docs/features/user-login-logout/api.md`
5. Read and analyze: `docs/features/user-login-logout/tasks.md`

**List what you found to prove you read them**

**CONTEXT:**
You are implementing user-login-logout feature. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create/update MongoDB schemas for User and Session models

**FILES TO CREATE/UPDATE:**
- `backend/src/models/user.model.ts` (MAXIMUM 400 lines)
- `backend/src/models/session.model.ts` (MAXIMUM 400 lines)

**REQUIREMENTS FROM SPEC:**
- User Model: email (unique), password (hashed), name, role, isActive, timestamps
- Session Model: userId (ref), refreshToken (unique), isActive, expiresAt, timestamps
- Proper indexes for performance
- Mongoose with TypeScript interfaces

**CODE STRUCTURE:**
- Use Mongoose with TypeScript
- Include all fields from spec
- Add proper indexes (email unique, refreshToken unique)
- Add timestamps: true
- Export both schema and TypeScript interface
- Add validation rules

**DO NOT:**
- Create any other files
- Exceed 400 lines per file
- Add fields not in spec
- Skip TypeScript interfaces

**GIT OPERATIONS:**
After creating files successfully:
```bash
git add backend/src/models/user.model.ts backend/src/models/session.model.ts
git commit -m "feat(user-login-logout): add MongoDB schemas with validation and indexes"
git push origin feature/user-login-logout
```

**AFTER COMPLETING:**
Update `docs/features/user-login-logout/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ backend/src/models/user.model.ts - User MongoDB schema
- Add to "What Exists Now": ✅ backend/src/models/session.model.ts - Session MongoDB schema  
- Update "Next Task": B2 - Service Layer
- Add to "Git Status": Last commit hash and message

**TEST YOUR WORK:**
The developer will test by creating documents in MongoDB directly

---

## Backend Task B2: Service Layer

**MANDATORY FIRST STEPS:**
1. Read and analyze: `docs/features/user-login-logout/CURRENT-STATE.md`
2. Confirm User and Session models exist from B1
3. Read and analyze: `docs/features/user-login-logout/API-CONTRACT.md`
4. Read and analyze: `docs/features/user-login-logout/spec.md`
5. Read and analyze: `docs/features/user-login-logout/api.md`
6. Read and analyze: `docs/features/user-login-logout/tasks.md`

**YOUR TASK:**
Create service layer with all business logic for authentication

**FILE TO CREATE:**
- `backend/src/services/auth/auth.service.ts` (MAXIMUM 400 lines)

**USE THE SCHEMAS:**
Import from: `../../models/user.model.ts` and `../../models/session.model.ts`

**IMPLEMENT THESE METHODS:**
- `loginUser(email, password)`: Validate credentials, generate JWT and refresh token
- `logoutUser(refreshToken)`: Invalidate session and tokens
- `refreshTokens(refreshToken)`: Generate new token pair
- `validateToken(token)`: JWT validation helper
- `hashPassword(password)`: Bcrypt password hashing
- `comparePassword(password, hash)`: Password comparison

**MATCH API CONTRACT:**
Return EXACT structure defined in API-CONTRACT.md for each method

**ERROR HANDLING:**
Throw errors with: `{ code: 'ERROR_CODE', message: 'Human readable' }`

**SECURITY REQUIREMENTS:**
- Use bcrypt for password hashing
- Generate secure JWT tokens
- Create unique refresh tokens
- Set proper token expiration

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/services/auth/
git commit -m "feat(user-login-logout): add authentication service with JWT logic"
git push origin feature/user-login-logout
```

**AFTER COMPLETING:**
Update `docs/features/user-login-logout/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ backend/src/services/auth/auth.service.ts - Authentication service
- Update "Next Task": B3 - Controller Layer
- Add to "Git Status": Last commit hash and message

---

## Backend Task B3: Controller Layer

**MANDATORY FIRST STEPS:**
1. Read and analyze: `docs/features/user-login-logout/CURRENT-STATE.md`
2. Verify service layer exists from B2
3. Read and analyze: `docs/features/user-login-logout/API-CONTRACT.md`
4. Read and analyze: `docs/features/user-login-logout/spec.md`
5. Read and analyze: `docs/features/user-login-logout/api.md`
6. Read and analyze: `docs/features/user-login-logout/tasks.md`

**YOUR TASK:**
Create/update controller to handle HTTP requests for authentication

**FILE TO CREATE/UPDATE:**
- `backend/src/controllers/auth/auth.controller.ts` (MAXIMUM 400 lines)

**USE THE SERVICE:**
Import from: `../../services/auth/auth.service.ts`

**IMPLEMENT ENDPOINTS:**
Based on API-CONTRACT.md, create controller methods:
- `login(req, res)`: Handle POST /api/v1/auth/login
- `logout(req, res)`: Handle POST /api/v1/auth/logout
- `refresh(req, res)`: Handle POST /api/v1/auth/refresh

**RESPONSE FORMAT (MUST MATCH API-CONTRACT.md):**
- Success: `{ success: true, data: {...} }`
- Error: `{ success: false, error: "message", code: "ERROR_CODE" }`

**REQUEST VALIDATION:**
- Add basic validation for required fields before calling service
- Validate email format for login
- Check authorization header for logout

**ERROR HANDLING:**
- Try-catch blocks around service calls
- Map service errors to HTTP status codes
- Return consistent error format

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/controllers/auth/
git commit -m "feat(user-login-logout): add auth controllers with request handling"
git push origin feature/user-login-logout
```

**AFTER COMPLETING:**
Update `docs/features/user-login-logout/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ backend/src/controllers/auth/auth.controller.ts - HTTP request handlers
- Update "Next Task": B4 - Routes Configuration
- Add to "Git Status": Last commit hash and message

---

## Backend Task B4: Routes Configuration

**MANDATORY FIRST STEPS:**
1. Read and analyze: `docs/features/user-login-logout/CURRENT-STATE.md`
2. Verify controller exists from B3
3. Read and analyze: `docs/features/user-login-logout/API-CONTRACT.md`
4. Read and analyze: `docs/features/user-login-logout/spec.md`
5. Read and analyze: `docs/features/user-login-logout/api.md`
6. Read and analyze: `docs/features/user-login-logout/tasks.md`
7. Check existing `backend/src/routes/auth.routes.ts` for patterns

**YOUR TASK:**
Update routes file to connect URLs to controller methods

**FILE TO UPDATE:**
- `backend/src/routes/auth.routes.ts` (MAXIMUM 200 lines)

**IMPORT CONTROLLER:**
From: `../controllers/auth/auth.controller.ts`

**DEFINE ROUTES:**
Based on API-CONTRACT.md, add/update routes:
- POST `/api/v1/auth/login` → controller.login
- POST `/api/v1/auth/logout` → controller.logout (with JWT middleware)
- POST `/api/v1/auth/refresh` → controller.refresh

**ADD MIDDLEWARE:**
- JWT authentication middleware for logout endpoint
- Input validation middleware
- Rate limiting for login endpoint

**GIT OPERATIONS:**
After updating the file successfully:
```bash
git add backend/src/routes/auth.routes.ts
git commit -m "feat(user-login-logout): update auth routes for login/logout endpoints"
git push origin feature/user-login-logout
```

**AFTER COMPLETING:**
Update `docs/features/user-login-logout/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ backend/src/routes/auth.routes.ts - API routes updated
- Update "Next Task": B5 - Postman Collection
- Add to "Git Status": Last commit hash and message

---

## Backend Task B5: Postman Collection

**MANDATORY FIRST STEPS:**
1. Read and analyze: `docs/features/user-login-logout/CURRENT-STATE.md`
2. Read and analyze: `docs/features/user-login-logout/API-CONTRACT.md`
3. Read and analyze: `docs/features/user-login-logout/spec.md`
4. Read and analyze: `docs/features/user-login-logout/api.md`
5. Read and analyze: `docs/features/user-login-logout/tasks.md`
6. Verify all backend files exist

**YOUR TASK:**
Create Postman collection for testing all endpoints with newman CLI support

**FILE TO CREATE:**
- `postman/user-login-logout.postman_collection.json`

**COLLECTION STRUCTURE:**
```json
{
  "info": {
    "name": "User Login & Logout API Tests",
    "description": "Complete test suite for user authentication"
  },
  "item": [
    {
      "name": "Login - Valid Credentials",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/v1/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function() { pm.response.to.have.status(200); });",
              "pm.test('Response has success true', function() { pm.expect(pm.response.json().success).to.be.true; });",
              "pm.test('Response has token', function() { pm.expect(pm.response.json().data.token).to.exist; });"
            ]
          }
        }
      ]
    }
  ]
}
```

**INCLUDE FOR EACH ENDPOINT:**
- Request name and description
- Method and URL with environment variables
- Headers (Content-Type: application/json)
- Body with example data from API-CONTRACT.md
- Tests to verify response structure matches contract
- Error scenario tests (invalid credentials, missing fields)

**TESTING WITH NEWMAN:**
Collection must be runnable with:
```bash
newman run postman/user-login-logout.postman_collection.json --environment postman/environment.json
```

**REQUIRED TESTS:**
- Login: Valid credentials, invalid credentials, missing fields
- Logout: Valid token, invalid token, missing refresh token  
- Refresh: Valid refresh token, invalid refresh token
- Response structure validation for all scenarios

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add postman/user-login-logout.postman_collection.json
git commit -m "feat(user-login-logout): add Postman test collection with newman support"
git push origin feature/user-login-logout
```

**AFTER COMPLETING:**
Update `docs/features/user-login-logout/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ postman/user-login-logout.postman_collection.json - API tests
- Mark backend phase COMPLETE
- Update "Next Task": F1 - TypeScript Types (Frontend phase starts)
- Add to "Git Status": Last commit hash and message

---

## Frontend Task F1: TypeScript Types

**MANDATORY FIRST STEPS:**
1. Read and analyze: `docs/features/user-login-logout/CURRENT-STATE.md`
2. Read and analyze: `docs/features/user-login-logout/API-CONTRACT.md`
3. Read and analyze: `docs/features/user-login-logout/spec.md`
4. Read and analyze: `docs/features/user-login-logout/api.md`
5. Read and analyze: `docs/features/user-login-logout/tasks.md`
6. Verify backend is complete and tested

**YOUR TASK:**
Update TypeScript types matching backend API exactly

**FILE TO UPDATE:**
- `frontend/src/types/auth.types.ts` (MAXIMUM 200 lines)

**TYPES TO DEFINE:**
Based on API-CONTRACT.md, update/add interfaces:
- `LoginRequest` - login form data
- `LoginResponse` - login API response
- `LogoutRequest` - logout form data
- `LogoutResponse` - logout API response
- `RefreshRequest` - refresh token data
- `RefreshResponse` - refresh API response
- `User` - user data structure
- `AuthState` - global authentication state
- `AuthError` - error handling

**MUST MATCH:**
Types must match backend responses EXACTLY as shown in API-CONTRACT.md

**EXPORT ALL TYPES:**
Make sure all interfaces are exported for use in components

**GIT OPERATIONS:**
After updating the file successfully:
```bash
git add frontend/src/types/auth.types.ts
git commit -m "feat(user-login-logout): update auth TypeScript type definitions"
git push origin feature/user-login-logout
```

**AFTER COMPLETING:**
Update `docs/features/user-login-logout/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ frontend/src/types/auth.types.ts - TypeScript interfaces
- Update "Next Task": F2 - API Service
- Add to "Git Status": Last commit hash and message

---

## Frontend Task F2: API Service

**MANDATORY FIRST STEPS:**
1. Read and analyze: `docs/features/user-login-logout/CURRENT-STATE.md`
2. Read and analyze: `docs/features/user-login-logout/API-CONTRACT.md`
3. Read and analyze: `docs/features/user-login-logout/spec.md`
4. Read and analyze: `docs/features/user-login-logout/api.md`
5. Read and analyze: `docs/features/user-login-logout/tasks.md`
6. Verify types exist from F1

**YOUR TASK:**
Update API service to communicate with backend auth endpoints

**FILE TO UPDATE:**
- `frontend/src/services/auth.service.ts` (MAXIMUM 400 lines)

**IMPORT TYPES:**
From: `../types/auth.types.ts`

**IMPLEMENT METHODS:**
For each endpoint in API-CONTRACT.md:
- `login(email: string, password: string): Promise<LoginResponse>`
- `logout(refreshToken: string): Promise<LogoutResponse>`
- `refresh(refreshToken: string): Promise<RefreshResponse>`
- `setAuthToken(token: string): void` - set JWT in request headers
- `getStoredTokens(): { token: string | null, refreshToken: string | null }`
- `clearTokens(): void` - remove tokens from storage

**API CALLS:**
- Use fetch or axios to call backend endpoints
- Include proper error handling
- Return exact types as defined
- Handle token storage (localStorage/sessionStorage)
- Add authorization headers where required

**ERROR HANDLING:**
- Map HTTP errors to user-friendly messages
- Handle network errors gracefully
- Throw typed errors for components to catch

**GIT OPERATIONS:**
After updating the file successfully:
```bash
git add frontend/src/services/auth.service.ts
git commit -m "feat(user-login-logout): update auth API service methods"
git push origin feature/user-login-logout
```

**AFTER COMPLETING:**
Update `docs/features/user-login-logout/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ frontend/src/services/auth.service.ts - API service updated
- Update "Next Task": F3 - UI Components
- Add to "Git Status": Last commit hash and message

---

## Frontend Task F3: UI Components

**MANDATORY FIRST STEPS:**
1. Read and analyze: `docs/features/user-login-logout/CURRENT-STATE.md`
2. Read and analyze: `docs/features/user-login-logout/API-CONTRACT.md`
3. Read and analyze: `docs/features/user-login-logout/spec.md`
4. Read and analyze: `docs/features/user-login-logout/api.md`
5. Read and analyze: `docs/features/user-login-logout/tasks.md`
6. Verify API service exists from F2
7. Check UI/UX requirements from spec.md

**YOUR TASK:**
Create UI components for login and logout functionality

**FILES TO CREATE:**
- `frontend/src/components/auth/LoginForm.tsx` (MAXIMUM 400 lines)
- `frontend/src/components/auth/LogoutButton.tsx` (MAXIMUM 200 lines)

**USE MOCK DATA FIRST:**
Create components with hardcoded data to test UI - don't connect to API yet (that's F5)

**LoginForm COMPONENT FEATURES:**
- Email and password input fields
- Form validation (required fields, email format)
- Submit button with loading state
- Error message display
- Success feedback handling
- Responsive design with Tailwind CSS
- Remember me checkbox (optional)

**LogoutButton COMPONENT FEATURES:**
- Logout button with confirmation dialog
- Loading state during logout
- Error handling
- Clean UI integration

**COMPONENT STRUCTURE:**
- Use React hooks (useState, useEffect)
- Separate UI from business logic
- Make components reusable
- Add proper TypeScript typing
- Include accessibility features

**STYLING:**
- Use Tailwind CSS for responsive design
- Modern, clean interface
- Consistent with hotel booking theme
- Mobile-first approach

**GIT OPERATIONS:**
After creating files successfully:
```bash
git add frontend/src/components/auth/
git commit -m "feat(user-login-logout): add login form and logout button components"
git push origin feature/user-login-logout
```

**AFTER COMPLETING:**
Update `docs/features/user-login-logout/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ frontend/src/components/auth/LoginForm.tsx - Login UI component
- Add to "What Exists Now": ✅ frontend/src/components/auth/LogoutButton.tsx - Logout UI component
- Update "Next Task": F4 - Page/Route
- Add to "Git Status": Last commit hash and message

---

## Frontend Task F4: Page/Route

**MANDATORY FIRST STEPS:**
1. Read and analyze: `docs/features/user-login-logout/CURRENT-STATE.md`
2. Read and analyze: `docs/features/user-login-logout/API-CONTRACT.md`
3. Read and analyze: `docs/features/user-login-logout/spec.md`
4. Read and analyze: `docs/features/user-login-logout/api.md`
5. Read and analyze: `docs/features/user-login-logout/tasks.md`
6. Verify components exist from F3
7. Check existing Next.js app structure

**YOUR TASK:**
Create Next.js page for login and update navigation

**FILES TO CREATE/UPDATE:**
- `frontend/src/app/auth/login/page.tsx` (MAXIMUM 200 lines)
- Update existing navigation/header components for logout button

**LOGIN PAGE CONTENT:**
- Import and use LoginForm component from F3
- Add page metadata (title: "Login - Hotel Booking", description)
- Include proper layout and styling
- Add navigation breadcrumbs if needed
- Link to registration page if it exists
- Redirect logic for already authenticated users

**NAVIGATION UPDATES:**
- Add LogoutButton to header/navigation when user is logged in
- Show/hide login/logout based on authentication state
- Update routing logic

**ROUTE SETUP:**
The file location creates the route automatically:
- File: `app/auth/login/page.tsx`
- Route: `/auth/login`

**LAYOUT CONSIDERATIONS:**
- Consistent with existing app design
- Proper spacing and alignment
- Mobile responsive
- Loading states
- Error boundaries

**GIT OPERATIONS:**
After creating/updating files successfully:
```bash
git add frontend/src/app/auth/login/ frontend/src/components/navigation/
git commit -m "feat(user-login-logout): add login page and update navigation"
git push origin feature/user-login-logout
```

**AFTER COMPLETING:**
Update `docs/features/user-login-logout/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ frontend/src/app/auth/login/page.tsx - Login page
- Add to "What Exists Now": ✅ Navigation updated with logout functionality
- Update "Next Task": F5 - Backend Integration
- Add to "Git Status": Last commit hash and message

---

## Frontend Task F5: Backend Integration

**MANDATORY FIRST STEPS:**
1. Read and analyze: `docs/features/user-login-logout/CURRENT-STATE.md`
2. Read and analyze: `docs/features/user-login-logout/API-CONTRACT.md`
3. Read and analyze: `docs/features/user-login-logout/spec.md`
4. Read and analyze: `docs/features/user-login-logout/api.md`
5. Read and analyze: `docs/features/user-login-logout/tasks.md`
6. Verify all frontend files exist
7. Test backend is working with Postman collection

**YOUR TASK:**
Connect frontend components to real backend API and add authentication state management

**FILES TO MODIFY:**
- `frontend/src/components/auth/LoginForm.tsx`
- `frontend/src/components/auth/LogoutButton.tsx`
- Create `frontend/src/hooks/useAuth.ts` for state management
- Create `frontend/src/context/AuthContext.tsx` for global state

**CHANGES TO MAKE:**

**1. Authentication Context:**
- Create global auth context with user state
- Provide login/logout methods
- Handle token storage and retrieval
- Implement automatic token refresh

**2. LoginForm Integration:**
- Import auth service from F2
- Replace mock data with real API calls
- Add proper loading states during API calls
- Handle API errors and display to user
- Add success handling (redirect to dashboard)
- Clear form on successful login

**3. LogoutButton Integration:**
- Import auth service from F2
- Connect to real logout API
- Clear user state and tokens
- Redirect to login page
- Handle errors gracefully

**4. Authentication Hook:**
- Create useAuth hook for components
- Provide current user state
- Provide login/logout functions
- Handle loading and error states

**TEST INTEGRATION:**
- Login operation works and stores tokens
- Logout operation clears tokens and redirects
- Token refresh works automatically
- Protected routes work correctly
- Error cases show proper messages
- User state persists across page refreshes

**SECURITY CONSIDERATIONS:**
- Store tokens securely
- Clear sensitive data on logout
- Handle expired tokens gracefully
- Validate user state on page load

**GIT OPERATIONS:**
After modifying successfully:
```bash
git add frontend/src/components/auth/ frontend/src/hooks/ frontend/src/context/
git commit -m "feat(user-login-logout): complete backend integration with auth state management"
git push origin feature/user-login-logout
```

**AFTER COMPLETING:**
Update `docs/features/user-login-logout/CURRENT-STATE.md`:
- Add to "What Exists Now": ✅ Full authentication system integrated
- Add to "What Exists Now": ✅ Global auth state management
- Add to "What Exists Now": ✅ Protected routes implemented
- Mark feature as **COMPLETE**
- List all files created/updated
- Note any issues for PROBLEMS-LOG.md
- Update "Git Status": Final commit hash and message
