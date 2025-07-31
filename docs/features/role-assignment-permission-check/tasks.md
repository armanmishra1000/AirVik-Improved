# Role Assignment & Permission Check Tasks

## Developer: Single Developer - Completes ALL tasks in order

## Backend Phase (Test each with Postman before moving on):

### Task B1: Create MongoDB Role Audit Log Model
**File to create**: `backend/src/models/role-audit-log.model.ts` (max 400 lines)
**What it does**: Defines audit log schema for tracking role changes
**Must include**: userId, previousRole, newRole, changedBy, reason, timestamp, ipAddress fields with proper indexes and validation
**Dependencies**: Uses existing user model structure patterns
**Test**: Create test audit log document in MongoDB directly
**Git**: Add, commit with "feat(role-assignment): add role audit log MongoDB schema", push

### Task B2: Create Role Service Layer  
**Files to create**: 
- `backend/src/services/role/role.service.ts` (max 400 lines)
**What it does**: All business logic for role assignment and validation
**Must include**: assignUserRole, getUserRole, updateUserRole, getUsersByRole, validateRoleAssignment methods
**Dependencies**: Uses role audit log model from B1, existing user model
**Must follow**: Exact method signatures from shared/contracts/services/role-service.contract.ts
**Test**: Call functions from Node.js console
**Git**: Add, commit with "feat(role-assignment): add role service layer with business logic", push

### Task B3: Create Permission Middleware
**Files to create**:
- `backend/src/middleware/permission.middleware.ts` (max 400 lines)
**What it does**: Permission checking middleware functions for route protection
**Must include**: requireRole, requireAnyRole, requirePermission, requireAnyPermission functions
**Dependencies**: Uses existing auth middleware patterns
**Must follow**: Exact function signatures from shared/contracts/middleware/permission-middleware.contract.ts
**Test**: Use middleware in test routes
**Git**: Add, commit with "feat(role-assignment): add permission checking middleware", push

### Task B4: Create Role Controller
**Files to create**:
- `backend/src/controllers/role/role.controller.ts` (max 400 lines)
**What it does**: HTTP request handling for all role assignment endpoints
**Must include**: assignRole, getUserRole, updateRole, getUsersByRole, validateAssignment methods
**Dependencies**: Uses role service from B2, permission middleware from B3
**Must match**: Exact response format from API-CONTRACT.md
**Must follow**: Exact method signatures from shared/contracts/api/role-api.contract.ts
**Test**: Use curl or Postman
**Git**: Add, commit with "feat(role-assignment): add role controller with request handling", push

### Task B5: Create Role Routes
**File to create**: `backend/src/routes/role.routes.ts` (max 200 lines)
**What it does**: Connect URLs to controllers with proper middleware
**Must include**: All endpoints from API-CONTRACT.md with correct middleware chains
**Dependencies**: Uses role controller from B4, permission middleware from B3, existing auth middleware
**Must follow**: Exact route patterns from shared/contracts/api/role-api.contract.ts
**Test**: Routes appear in Express route list
**Git**: Add, commit with "feat(role-assignment): add role API routes configuration", push

### Task B6: Create Postman Collection
**File to create**: `postman/role-assignment-permission-check.postman_collection.json`
**Must include**: Every endpoint with example data, proper auth headers, tests for response structure
**Testing method**: Design tests for newman, test with newman in terminal
**Newman command**: `newman run postman/role-assignment-permission-check.postman_collection.json -e postman/environment.json`
**Test**: All requests return expected responses
**Git**: Add, commit with "feat(role-assignment): add Postman test collection", push

## Frontend Phase (Only start after backend fully tested):

### Task F1: Create Role Management TypeScript Types
**File to create**: `frontend/src/types/role.types.ts` (max 200 lines)
**Must match**: Backend response structure from API-CONTRACT.md EXACTLY
**Must include**: All interfaces for requests, responses, user data, pagination
**Dependencies**: Extends existing auth types patterns
**Test**: No TypeScript errors
**Git**: Add, commit with "feat(role-assignment): add role management TypeScript types", push

### Task F2: Create Role API Service
**File to create**: `frontend/src/services/role.service.ts` (max 400 lines)
**Must match**: API-CONTRACT.md exactly
**Must include**: assignRole, getUserRole, updateRole, getUsersByRole, validateAssignment methods
**Dependencies**: Uses types from F1, existing auth service patterns
**Test**: Console log responses match expected structure
**Git**: Add, commit with "feat(role-assignment): add frontend role API service", push

### Task F3: Create Role Assignment UI Component
**File to create**: `frontend/src/components/role/RoleAssignmentForm.tsx` (max 400 lines)
**What it does**: Form for assigning and updating user roles
**Must include**: User search, role selection, reason input, validation, loading states
**Dependencies**: Uses role service from F2, existing form patterns
**Test**: Component renders with mock data
**Git**: Add, commit with "feat(role-assignment): add role assignment form component", push

### Task F4: Create Role Management Page
**File to create**: `frontend/src/app/admin/roles/page.tsx` (max 200 lines)
**What it does**: Main page for role management with user list and assignment form
**Must include**: User list with roles, search functionality, role assignment interface
**Dependencies**: Uses role assignment component from F3
**Test**: Can navigate to page, see user list
**Git**: Add, commit with "feat(role-assignment): add role management page", push

### Task F5: Connect to Backend
**Files to modify**: Components and service files from F2-F4
**What it does**: Replace mock data with real API calls
**Must include**: Error handling, loading states, success feedback
**Dependencies**: All backend tasks must be complete and tested
**Test**: Full feature works end-to-end, role assignments persist, permissions enforced
**Git**: Add, commit with "feat(role-assignment): complete backend integration", push

## Testing Requirements:
- All backend endpoints must pass Postman tests
- Permission middleware must properly restrict access
- Role changes must be logged in audit collection
- Frontend must handle all error scenarios gracefully
- End-to-end role assignment and permission checking must work

## Security Requirements:
- Only admins can assign staff/admin roles
- Users cannot modify their own roles
- All role changes must be audited
- Rate limiting must be enforced
- Authentication required for all endpoints