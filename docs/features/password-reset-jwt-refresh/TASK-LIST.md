# Password Reset & JWT Token Refresh Task List

## Backend Tasks (Do First):
- [ ] B1: Extend User MongoDB Schema for Password Reset
- [ ] B2: Extend Auth Service Layer for Password Reset  
- [ ] B3: Extend Auth Controller for Password Reset
- [ ] B4: Update Auth Routes for Password Reset
- [ ] B5: Create/Update Postman Tests

## Frontend Tasks (Do After Backend):
- [ ] F1: Create/Update TypeScript Types
- [ ] F2: Extend API Service for Password Reset
- [ ] F3: Create Password Reset UI Components
- [ ] F4: Create Password Reset Pages/Routes
- [ ] F5: Connect Frontend to Backend

## Current Task: B1

## Notes:
- JWT Token Refresh already exists in backend (refreshUserToken method)
- Will need to expose it as a separate endpoint for frontend use
- Password Reset is completely new functionality
- Reuse existing email infrastructure from user registration
