# User Profile Tasks

## Developer: [Name] - Completes ALL tasks in order

## Backend Phase (Test each with Postman before moving on):

### Task B1: Create Service Layer Extensions
**Files to create**: 
- `backend/src/services/profile/user-profile.service.ts` (max 400 lines)

**What it does**: Business logic for viewing and updating user profile
**Must include**: 
- `viewUserProfile()` method using existing User model
- `updateUserProfile()` method with email uniqueness validation
- Name transformation utilities (API firstName+lastName ↔ Model name)
- Proper error handling with existing error codes

**Dependencies**: Uses existing `backend/src/models/user.model.ts`
**Test**: Call functions from Node.js console with test user ID
**Git**: Add, commit with message "feat(user-profile): add service layer for profile management", push

### Task B2: Create Controller Layer
**Files to create**:
- `backend/src/controllers/profile/user-profile.controller.ts` (max 400 lines)

**What it does**: HTTP request handling for profile endpoints
**Must match**: Exact format in API-CONTRACT.md
**Must include**:
- `viewProfile()` controller method (GET request handler)
- `updateProfile()` controller method (PUT request handler)  
- JWT token extraction and user ID validation
- Request validation using Joi patterns from auth controllers
- Response format matching existing patterns from `response.utils.ts`

**Dependencies**: Uses service layer from B1
**Test**: Use curl or Postman to test endpoints
**Git**: Add, commit with message "feat(user-profile): add controller with request handling", push

### Task B3: Create Routes Configuration
**File to create**: `backend/src/routes/profile.routes.ts` (max 200 lines)

**What it does**: Connect URLs to controller methods
**Must include**:
- GET `/view` → `viewProfile` controller method
- PUT `/update` → `updateProfile` controller method
- Authentication middleware for both routes
- Rate limiting middleware (optional but recommended)

**Dependencies**: Uses controller from B2, existing auth middleware
**Test**: Routes appear in Express route list, authentication required
**Git**: Add, commit with message "feat(user-profile): add API routes configuration", push

### Task B4: Integrate Routes with Main Server
**Files to modify**: `backend/src/server.ts` or existing route index

**What it does**: Register profile routes with Express app
**Must include**: Mount routes at `/api/v1/profile` prefix
**Test**: Profile routes accessible via full URLs
**Git**: Add, commit with message "feat(user-profile): integrate profile routes with server", push

### Task B5: Create Postman Collection
**File to create**: `postman/user-profile.postman_collection.json`

**Must include**: 
- Collection setup with environment variables
- Test for View Profile (GET) with authentication
- Test for Update Profile (PUT) with authentication
- Negative test cases (missing auth, invalid data, duplicate email)
- Newman-compatible structure for terminal testing

**Testing method**: Run with newman in terminal:
```bash
cd AirVik-Improved
newman run postman/user-profile.postman_collection.json -e postman/environment.json
```

**Test**: All requests return expected responses
**Git**: Add, commit with message "feat(user-profile): add Postman test collection", push

## Frontend Phase (Only start after backend fully tested):

### Task F1: Create TypeScript Types
**File to create**: `frontend/src/types/profile.types.ts` (max 200 lines)

**Must match**: Backend response structure EXACTLY from API-CONTRACT.md
**Must include**:
- `UserProfile` interface matching API response
- `ViewProfileResponse` and `UpdateProfileResponse` types
- `UpdateProfileRequest` interface for form data
- Form validation interfaces
- Loading state interfaces
- Error handling types

**Dependencies**: Follows patterns from existing `auth.types.ts`
**Test**: No TypeScript errors, types match API contracts
**Git**: Add, commit with message "feat(user-profile): add TypeScript type definitions", push

### Task F2: Create API Service
**File to create**: `frontend/src/services/profile.service.ts` (max 400 lines)

**Must match**: API-CONTRACT.md exactly
**Must include**:
- `viewProfile()` method (GET request)
- `updateProfile()` method (PUT request)
- Proper authentication header handling (JWT token)
- Error handling and response transformation
- TypeScript integration with types from F1

**Dependencies**: Uses types from F1, existing auth token management
**Test**: Console log responses match expected structure
**Git**: Add, commit with message "feat(user-profile): add frontend API service", push

### Task F3: Create View Profile Component
**File to create**: `frontend/src/components/profile/ViewProfile.tsx` (max 400 lines)

**What it does**: Display user profile information with edit button
**Must include**:
- User information display (name, email, verification status, join date) 
- Loading state during data fetch
- Error handling with user-friendly messages
- "Edit Profile" navigation button
- Responsive design with Tailwind CSS
- Profile picture placeholder

**Dependencies**: Uses API service from F2, types from F1
**Test**: Component renders with mock data, shows loading states
**Git**: Add, commit with message "feat(user-profile): add view profile component", push

### Task F4: Create Edit Profile Form Component
**File to create**: `frontend/src/components/profile/EditProfileForm.tsx` (max 400 lines)

**What it does**: Form for editing user profile information
**Must include**:
- Form fields: firstName, lastName, email
- Real-time validation with error messages
- Loading state during submission
- Success/error feedback
- Cancel/Save buttons
- Form reset functionality
- "Has changes" detection to warn about unsaved changes

**Dependencies**: Uses API service from F2, types from F1
**Test**: Form validates inputs, shows proper error states
**Git**: Add, commit with message "feat(user-profile): add edit profile form component", push

### Task F5: Create Profile Pages
**Files to create**: 
- `frontend/src/app/profile/page.tsx` (max 200 lines)
- `frontend/src/app/profile/edit/page.tsx` (max 200 lines)

**What it does**: Next.js pages for profile functionality
**Must include**:
- Profile view page: Uses ViewProfile component
- Profile edit page: Uses EditProfileForm component  
- Navigation between pages
- Page metadata and SEO
- Authentication guards (redirect if not logged in)

**Dependencies**: Uses components from F3 and F4
**Test**: Can navigate to pages, authentication enforced
**Git**: Add, commit with message "feat(user-profile): add Next.js profile pages", push

### Task F6: Connect to Backend
**Files to modify**: Components and service files

**What it does**: Replace mock data with real API calls
**Must include**:
- Real API integration in both view and edit components
- Proper loading states during API calls
- Error handling for network failures
- Success handling (redirect after successful update)
- Token refresh handling for expired sessions

**Test**: Full feature works end-to-end, data persists in database
**Git**: Add, commit with message "feat(user-profile): complete backend integration", push

## Final Testing & Documentation:

### Task T1: End-to-End Testing
**What to test**:
- User can view their profile information
- User can successfully update profile (name and email)
- Email uniqueness validation works
- Form validation shows appropriate errors
- Authentication is enforced on all endpoints
- Loading states work properly
- Error states display correctly

### Task T2: Update Project Documentation
**Files to update**:
- `docs/features/project-progress.md` - Add completed feature
- Update any shared infrastructure documentation

**Git**: Add, commit with message "docs: update project progress with user profile feature", push