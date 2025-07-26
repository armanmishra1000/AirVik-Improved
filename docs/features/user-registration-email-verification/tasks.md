# User Registration & Email Verification Complete Task Breakdown

## Rules for Single Developer
- Complete backend tasks B1-B5 before starting frontend
- Test each task thoroughly before moving to next
- Commit after each task completion
- Follow API-CONTRACT.md exactly
- Keep files under 400 lines
- Update CURRENT-STATE.md after each task

---

## BACKEND TASKS (Do First)

### B1: Create MongoDB Schema
**File**: `backend/src/models/user.model.ts`

**Requirements**:
- User interface and schema with Mongoose
- Fields: firstName, lastName, email (unique), password, isEmailVerified, emailVerificationToken, tokenExpiry
- Pre-save middleware for password hashing
- Instance methods for password comparison
- Proper TypeScript types

**Test Criteria**:
- Create test user document
- Verify password hashing works
- Verify unique email constraint

**Commit Message**: `feat: add User MongoDB schema with email verification fields`

---

### B2: Create Service Layer
**File**: `backend/src/services/auth/user-auth.service.ts`

**Requirements**:
- registerUser() - hash password, create user, generate verification token
- verifyEmail() - validate token, update user verification status
- resendVerificationEmail() - generate new token, send email
- generateVerificationToken() - create JWT with 24h expiry
- sendVerificationEmail() - nodemailer integration with HTML template

**Dependencies**:
- bcrypt for password hashing
- jsonwebtoken for verification tokens
- nodemailer for email sending

**Test Criteria**:
- Call each function from Node console
- Verify email sending works (use mailtrap/ethereal for testing)
- Check password hashing/comparison

**Commit Message**: `feat: add user authentication service with email verification`

---

### B3: Create Controller (2 hours)
**File**: `backend/src/controllers/auth/user-auth.controller.ts`

**Requirements**:
- registerUser() controller - validate input, call service, return API response
- verifyEmail() controller - extract token, call service, return response  
- resendVerification() controller - validate email, call service, return response
- Input validation with joi or express-validator
- Error handling with proper HTTP status codes
- Rate limiting middleware integration

**Must Match**: API-CONTRACT.md response format exactly

**Test Criteria**:
- Test with Postman
- Verify all success/error responses match contract
- Check rate limiting works

**Commit Message**: `feat: add auth controllers for user registration and email verification`

---

### B4: Create Routes (30 minutes)
**File**: `backend/src/routes/auth.routes.ts`

**Requirements**:
- POST /register → registerUser controller
- POST /verify-email → verifyEmail controller  
- POST /resend-verification → resendVerification controller
- Rate limiting middleware on all routes
- Input validation middleware

**Integration**:
- Update `backend/src/server.ts` to use auth routes
- Mount at `/api/v1/auth`

**Test Criteria**:
- Routes appear in Express route list
- All endpoints accessible via Postman

**Commit Message**: `feat: add auth routes for registration and email verification`

---

### B5: Create Postman Collection (1 hour)
**File**: `postman/user-registration-email-verification.postman_collection.json`

**Requirements**:
- Complete test scenarios for all 3 endpoints
- Valid registration request with example data
- Email verification with valid/invalid tokens
- Resend verification with valid/invalid emails
- Error case testing (duplicate email, expired tokens, etc.)
- Environment variables for base URL

**Test Criteria**:
- All requests return expected responses
- Error cases handled correctly
- Collection can be imported and run by others

**Commit Message**: `test: add Postman collection for user registration and email verification`

---

## FRONTEND TASKS (Do After Backend)

### F1: Create TypeScript Types (30 minutes)
**File**: `frontend/src/types/auth.types.ts`

**Requirements**:
- User interface matching backend User model
- API request/response types for all endpoints
- Form data types for registration
- Error types for validation

**Test Criteria**:
- No TypeScript compilation errors
- Types match API-CONTRACT.md exactly

**Commit Message**: `feat: add TypeScript types for auth functionality`

---

### F2: Create API Service (1 hour)
**File**: `frontend/src/services/auth.service.ts`

**Requirements**:
- registerUser() - POST to /api/v1/auth/register
- verifyEmail() - POST to /api/v1/auth/verify-email
- resendVerification() - POST to /api/v1/auth/resend-verification
- Proper error handling with try/catch
- TypeScript return types
- Axios or fetch integration

**Test Criteria**:
- API calls work in browser dev tools
- Error responses handled correctly
- TypeScript types enforced

**Commit Message**: `feat: add auth API service for frontend`

---

### F3: Create UI Component (2 hours)
**File**: `frontend/src/components/auth/RegistrationForm.tsx`

**Requirements**:
- React functional component with TypeScript
- React Hook Form for form management
- Tailwind CSS for modern styling
- Real-time validation with error messages
- Loading states during API calls
- Success/error notifications
- Responsive design (mobile-first)

**Fields**:
- firstName, lastName, email, password, confirmPassword
- Proper input types and validation

**Test Criteria**:
- Form validation works before API submission
- Loading states display correctly
- Success/error messages show properly
- Mobile responsive

**Commit Message**: `feat: add registration form component with validation`

---

### F4: Create Page/Route (1 hour)
**File**: `frontend/src/app/auth/register/page.tsx`

**Requirements**:
- Next.js 14 App Router page
- Import and use RegistrationForm component
- Email verification confirmation page
- Proper SEO metadata
- Error boundary handling

**Additional Files**:
- `frontend/src/app/auth/verify-email/page.tsx` - Email verification page

**Test Criteria**:
- Pages accessible via browser navigation
- Components render correctly
- URL routing works

**Commit Message**: `feat: add registration and email verification pages`

---

### F5: Connect to Backend (1 hour)
**Purpose**: Replace any mock data with real API calls

**Requirements**:
- Integration testing between frontend and backend
- End-to-end user registration flow
- Email verification flow testing
- Error handling integration

**Test Criteria**:
- Complete user registration works
- Email verification process works
- All error states handled properly
- UI updates correctly based on API responses

**Commit Message**: `feat: integrate frontend with backend auth APIs`

---

## FINAL TESTING CHECKLIST
- [ ] User can register with valid data
- [ ] Duplicate email registration blocked
- [ ] Password validation works
- [ ] Verification email sent
- [ ] Email verification works
- [ ] Resend verification works
- [ ] Rate limiting functional
- [ ] All error cases handled
- [ ] Mobile responsive
- [ ] TypeScript compilation clean

## COMPLETION CRITERIA
- All tasks committed to git
- CURRENT-STATE.md updated
- API-CONTRACT.md followed exactly
- Feature fully functional end-to-end
- Documentation complete and accurate
