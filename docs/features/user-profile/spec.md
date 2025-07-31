# User Profile Feature Specification

## Feature Overview
User Profile feature enables authenticated users to view and edit their personal information (name and email) in the hotel booking system. This includes two sub-features: View Profile (display current user information) and Edit Profile (update user information with validation).

## VikBooking Analysis
Based on analysis of the `/vikbooking` folder structure:
- **Reference Files:** `vikbooking/admin/views/customer/` - Customer management interface patterns
- **Business Logic:** User information display and editing follows standard CRUD patterns
- **Validation:** Email uniqueness validation, name length validation (2-50 characters)
- **User Flow:** Simple view/edit pattern similar to existing customer management

## User Flow
### View Profile Flow:
1. User clicks "Profile" in navigation (authenticated users only)
2. System fetches user data from database using JWT token
3. Display user information: firstName, lastName, email, verification status, join date
4. Show "Edit Profile" button to allow modifications

### Edit Profile Flow:
1. User clicks "Edit Profile" from View Profile page
2. System pre-fills form with current user data
3. User modifies firstName, lastName, and/or email
4. System validates inputs (required fields, email format, email uniqueness)
5. On successful validation, update database and show success message
6. On validation errors, display field-specific error messages
7. User can cancel changes to revert to original data

## API Endpoints

### 1. View Profile
- **Method:** GET
- **URL:** `/api/v1/profile/view`
- **Authentication:** Required (JWT token)
- **Purpose:** Retrieve current user's profile information

### 2. Update Profile  
- **Method:** PUT
- **URL:** `/api/v1/profile/update`
- **Authentication:** Required (JWT token)
- **Purpose:** Update user's profile information

## Database Schema
**No new MongoDB collections needed** - extends existing User model:
- Uses existing `users` collection from authentication system
- Model field mapping:
  - API `firstName` + `lastName` → Model `name` field (combined as "firstName lastName")
  - API `email` → Model `email` field (with uniqueness validation)
  - API `isEmailVerified` ← Model `isActive` field (display only)

## Validation Rules
### First Name:
- Required field
- Minimum 2 characters
- Maximum 50 characters
- Trim whitespace

### Last Name:
- Required field  
- Minimum 2 characters
- Maximum 50 characters
- Trim whitespace

### Email:
- Required field
- Valid email format
- Must be unique across all users (excluding current user)
- Lowercase and trim

## File Structure
All files limited to 400 lines maximum as specified:

### Backend Files:
- `backend/src/services/profile/user-profile.service.ts` (~350 lines)
- `backend/src/controllers/profile/user-profile.controller.ts` (~300 lines)  
- `backend/src/routes/profile.routes.ts` (~150 lines)

### Frontend Files:
- `frontend/src/types/profile.types.ts` (~200 lines)
- `frontend/src/services/profile.service.ts` (~300 lines)
- `frontend/src/components/profile/ViewProfile.tsx` (~400 lines)
- `frontend/src/components/profile/EditProfileForm.tsx` (~400 lines)
- `frontend/src/app/profile/page.tsx` (~200 lines)
- `frontend/src/app/profile/edit/page.tsx` (~200 lines)

### Testing Files:
- `postman/user-profile.postman_collection.json` (~200 lines)

**Total Estimated Files:** 9 files, all under 400 lines each for optimal AI handling.