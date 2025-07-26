# User Registration & Email Verification Task List

## Backend Tasks (Do First):
- [ ] B1: Create MongoDB Schema
- [ ] B2: Create Service Layer  
- [ ] B3: Create Controller
- [ ] B4: Create Routes
- [ ] B5: Create Postman Tests

## Frontend Tasks (Do After Backend):
- [ ] F1: Create Types
- [ ] F2: Create API Service
- [ ] F3: Create UI Component
- [ ] F4: Create Page/Route
- [ ] F5: Connect to Backend

## Current Task: B1

## Task Details:

### B1: Create MongoDB Schema (1 hour)
- File: `backend/src/models/user.model.ts`
- Purpose: Define User model with email verification fields
- Requirements: firstName, lastName, email, password, isEmailVerified, emailVerificationToken, tokenExpiry
- Test: Create test document in MongoDB

### B2: Create Service Layer (2 hours)
- File: `backend/src/services/auth/user-auth.service.ts`
- Purpose: Business logic for registration, email verification, password hashing
- Test: Call functions from Node.js console

### B3: Create Controller (2 hours)
- File: `backend/src/controllers/auth/user-auth.controller.ts`
- Purpose: HTTP request handling for registration and email verification
- Must match: API-CONTRACT.md exactly
- Test: Use Postman

### B4: Create Routes (30 min)
- File: `backend/src/routes/auth.routes.ts`
- Purpose: Connect URLs to controller methods
- Test: Routes appear in Express route list

### B5: Create Postman Collection (1 hour)
- File: `postman/user-registration-email-verification.postman_collection.json`
- Purpose: Test all endpoints with example data
- Test: All requests return expected responses

### F1: Create TypeScript Types (30 min)
- File: `frontend/src/types/auth.types.ts`
- Purpose: Type definitions matching backend responses exactly

### F2: Create API Service (1 hour)
- File: `frontend/src/services/auth.service.ts` 
- Purpose: Frontend API calls to backend endpoints

### F3: Create UI Component (2 hours)
- File: `frontend/src/components/auth/RegistrationForm.tsx`
- Purpose: User registration form with email verification

### F4: Create Page/Route (1 hour)
- File: `frontend/src/app/auth/register/page.tsx`
- Purpose: Next.js page for registration

### F5: Connect to Backend (1 hour)
- Purpose: Replace mock data with real API calls
- Test: Full feature works end-to-end
