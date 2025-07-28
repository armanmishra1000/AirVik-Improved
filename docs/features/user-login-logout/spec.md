# User Login & Logout Feature Specification

## Feature Overview
This feature provides secure user authentication with login and logout functionality for the hotel booking system. Users can authenticate with email/password, receive JWT tokens, and securely log out with token invalidation.

## VikBooking Analysis
**Note:** No VikBooking reference files found in the project. Implementation will follow standard authentication patterns.

## User Flow

### Login Flow:
1. User navigates to `/auth/login` page
2. User enters email and password
3. Frontend validates form inputs
4. API call to `/api/v1/auth/login`
5. Backend validates credentials
6. JWT token and refresh token generated
7. User redirected to dashboard/home
8. Tokens stored securely in browser

### Logout Flow:
1. User clicks logout button
2. Frontend calls `/api/v1/auth/logout`
3. Backend invalidates tokens
4. Frontend clears stored tokens
5. User redirected to login page

## API Endpoints

### 1. POST /api/v1/auth/login
- **Purpose:** Authenticate user and generate tokens
- **Input:** email, password
- **Output:** user data, JWT token, refresh token

### 2. POST /api/v1/auth/logout
- **Purpose:** Invalidate user session
- **Input:** refresh token (+ Bearer token in header)
- **Output:** success message

### 3. POST /api/v1/auth/refresh
- **Purpose:** Refresh expired JWT token
- **Input:** refresh token
- **Output:** new JWT token and refresh token

## Database Schema

### User Model (existing - may need updates):
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  name: String (required),
  role: String (default: 'user'),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Session Model (new):
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  refreshToken: String (required, unique),
  isActive: Boolean (default: true),
  expiresAt: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```

## Validation Rules

### Login Validation:
- Email: Required, valid email format
- Password: Required, minimum 6 characters

### Logout Validation:
- RefreshToken: Required, must exist and be active
- Authorization header: Required, valid JWT format

## File Structure

### Backend Files (Max 400 lines each):
- `backend/src/models/user.model.ts` - User schema (update existing)
- `backend/src/models/session.model.ts` - Session schema (new)
- `backend/src/services/auth/auth.service.ts` - Auth business logic
- `backend/src/controllers/auth/auth.controller.ts` - HTTP handlers
- `backend/src/routes/auth.routes.ts` - Route definitions (update existing)
- `backend/src/validators/auth.validator.ts` - Input validation

### Frontend Files (Max 400 lines each):
- `frontend/src/types/auth.types.ts` - TypeScript interfaces (update existing)
- `frontend/src/services/auth.service.ts` - API calls (update existing)
- `frontend/src/components/auth/LoginForm.tsx` - Login UI component
- `frontend/src/components/auth/LogoutButton.tsx` - Logout UI component
- `frontend/src/app/auth/login/page.tsx` - Login page
- `frontend/src/hooks/useAuth.ts` - Authentication hook

### Testing Files:
- `postman/user-login-logout.postman_collection.json` - API tests

## Security Considerations
- Passwords hashed with bcrypt
- JWT tokens with expiration
- Refresh tokens stored securely
- Token invalidation on logout
- Rate limiting on login attempts
