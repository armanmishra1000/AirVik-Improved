# Role Assignment & Permission Check Task List

## Backend Tasks (Do First):
- [ ] B1: Create MongoDB Role Assignment Models
- [ ] B2: Create Role Service Layer
- [ ] B3: Create Permission Middleware
- [ ] B4: Create Role Controller
- [ ] B5: Create Role Routes
- [ ] B6: Create Postman Tests

## Frontend Tasks (Do After Backend):
- [ ] F1: Create Role Management Types
- [ ] F2: Create Role API Service
- [ ] F3: Create Role Assignment Component
- [ ] F4: Create Role Management Page
- [ ] F5: Connect to Backend

## Current Task: B1

## Task Dependencies:
- All backend tasks must be completed before frontend tasks
- Each task builds on the previous one
- Testing must happen after each task

## Critical Requirements:
- MUST use exact property names from shared/contracts/
- MUST follow existing authentication middleware patterns
- MUST use exact response format: { success: boolean, data?: T, error?: string }
- MUST implement role hierarchy: ADMIN > STAFF > USER
- MUST implement permission system with role-based access