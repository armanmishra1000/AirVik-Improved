# User Login & Logout Tasks

## Developer: [Name] - Completes ALL tasks in order

## Backend Phase (Test each with Postman before moving on):

### Task B1: Create MongoDB Schema
**Files to create/update**: 
- `backend/src/models/user.model.ts` (update existing - max 400 lines)
- `backend/src/models/session.model.ts` (new - max 400 lines)
**What it does**: Defines User and Session data structures for authentication
**Must include**: 
- User: email, password, name, role, isActive, timestamps
- Session: userId, refreshToken, isActive, expiresAt, timestamps
- Proper indexes and validation
**Test**: Create test documents in MongoDB directly
**Git**: Add, commit with "feat(user-login-logout): add MongoDB schemas for User and Session", push

### Task B2: Create Service Layer  
**Files to create**: 
- `backend/src/services/auth/auth.service.ts` (max 400 lines)
**What it does**: All business logic for login/logout/refresh operations
**Must include**:
- `loginUser(email, password)` - validate credentials, generate tokens
- `logoutUser(refreshToken)` - invalidate session
- `refreshTokens(refreshToken)` - generate new token pair
- `validateToken(token)` - JWT validation helper
**Test**: Call functions from Node.js console with test data
**Git**: Add, commit with "feat(user-login-logout): add authentication service layer", push

### Task B3: Create Controller
**Files to create/update**:
- `backend/src/controllers/auth/auth.controller.ts` (update existing - max 400 lines)
**What it does**: HTTP request handling for all auth endpoints
**Must match**: Exact format in API-CONTRACT.md
**Must include**:
- `login(req, res)` - handle POST /api/v1/auth/login
- `logout(req, res)` - handle POST /api/v1/auth/logout  
- `refresh(req, res)` - handle POST /api/v1/auth/refresh
**Test**: Use curl or Postman to verify responses match API contract
**Git**: Add, commit with "feat(user-login-logout): add authentication controllers", push

### Task B4: Create Routes
**File to update**: `backend/src/routes/auth.routes.ts` (update existing - max 200 lines)
**What it does**: Connect URLs to controllers with middleware
**Must include**:
- POST /api/v1/auth/login → controller.login
- POST /api/v1/auth/logout → controller.logout (with JWT middleware)
- POST /api/v1/auth/refresh → controller.refresh
**Test**: Routes appear in Express route list, proper middleware applied
**Git**: Add, commit with "feat(user-login-logout): update auth routes for login/logout", push

### Task B5: Create Postman Collection
**File to create**: `postman/user-login-logout.postman_collection.json`
**Must include**: Every endpoint with example data and tests
**Testing method**: Design tests for newman CLI runner
**Collection structure**:
- Environment variables for base URL
- Login request with valid/invalid scenarios
- Logout request with token validation
- Refresh request with token scenarios
- Pre-request scripts for token handling
- Tests to validate response structure matches API contract
**Test**: Run `newman run postman/user-login-logout.postman_collection.json --environment postman/environment.json`
**Git**: Add, commit with "feat(user-login-logout): add Postman test collection with newman support", push

## Frontend Phase (Only start after backend fully tested):

### Task F1: Create TypeScript Types
**File to update**: `frontend/src/types/auth.types.ts` (update existing - max 200 lines)
**Must match**: Backend response structure EXACTLY from API-CONTRACT.md
**Must include**:
- `LoginRequest` interface
- `LoginResponse` interface
- `LogoutRequest` interface
- `LogoutResponse` interface
- `RefreshRequest` interface
- `RefreshResponse` interface
- `User` interface
- `AuthState` interface for global state
**Test**: No TypeScript errors when importing
**Git**: Add, commit with "feat(user-login-logout): update auth TypeScript types", push

### Task F2: Create API Service
**File to update**: `frontend/src/services/auth.service.ts` (update existing - max 400 lines)
**Must match**: API-CONTRACT.md exactly
**Must include**:
- `login(email, password): Promise<LoginResponse>`
- `logout(refreshToken): Promise<LogoutResponse>`
- `refresh(refreshToken): Promise<RefreshResponse>`
- `setAuthToken(token)` - set JWT in headers
- `getStoredTokens()` - get tokens from storage
- `clearTokens()` - remove tokens from storage
**Test**: Console log responses match expected structure
**Git**: Add, commit with "feat(user-login-logout): update auth API service methods", push

### Task F3: Create UI Components
**Files to create**: 
- `frontend/src/components/auth/LoginForm.tsx` (max 400 lines)
- `frontend/src/components/auth/LogoutButton.tsx` (max 200 lines)
**LoginForm what it does**: Login form with validation and error handling
**LogoutButton what it does**: Logout button with confirmation and loading state
**Must include**:
- Form validation (email format, required fields)
- Loading states during API calls
- Error message display
- Success handling
- Responsive design with Tailwind CSS
**Test**: Components render with mock data, form validation works
**Git**: Add, commit with "feat(user-login-logout): add login form and logout button components", push

### Task F4: Create Page/Route
**Files to create/update**: 
- `frontend/src/app/auth/login/page.tsx` (max 200 lines)
- Update navigation/header for logout button placement
**What it does**: Next.js page for login with proper layout
**Must include**:
- Page metadata (title, description)
- LoginForm component integration
- Redirect logic for authenticated users
- Link to registration page if exists
**Test**: Can navigate to /auth/login, page renders correctly
**Git**: Add, commit with "feat(user-login-logout): add login page and navigation updates", push

### Task F5: Connect to Backend
**Files to modify**: LoginForm.tsx, LogoutButton.tsx, and auth service
**What it does**: Replace mock data with real API calls and add global auth state
**Must include**:
- Replace mock data with authService calls
- Add global authentication state management
- Handle token storage and retrieval
- Implement automatic token refresh
- Add protected route logic
- Handle logout across all components
**Test**: Full feature works end-to-end
**Git**: Add, commit with "feat(user-login-logout): complete backend integration with auth state", push

---

## Dependencies & Prerequisites:
- MongoDB connection configured
- JWT secret in environment variables  
- Bcrypt for password hashing
- Express middleware for JWT validation
- Frontend state management (Context/Redux)

## File Size Limits:
- Each file maximum 400 lines
- Break into smaller files if needed
- Prioritize readability and maintainability
