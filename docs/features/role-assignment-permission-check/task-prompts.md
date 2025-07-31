# Task Prompts for Role Assignment & Permission Check

## HOW TO USE:
1. Copy each prompt exactly
2. Paste to AI in Windsurf Planning Mode
3. Report "done" or exact error message
4. AI will update state files automatically

<!-- ## Backend Task B1: MongoDB Role Audit Log Model

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md

**CRITICAL: Read these contract files to get EXACT property names:**
Read and analyze: shared/contracts/services/role-service.contract.ts
Read and analyze: shared/contracts/models/user.contract.ts
Read and analyze: shared/contracts/api/response.contract.ts

List what you found to prove you read them

**CONTEXT:**
You are implementing role assignment & permission check feature. The developer using this is a beginner who only copies prompts.

**YOUR TASK:**
Create MongoDB schema for role audit log to track role changes

**FILE TO CREATE:**
backend/src/models/role-audit-log.model.ts (MAXIMUM 400 lines)

**REQUIREMENTS FROM CONTRACTS:**
Use EXACT interface names and property names from shared/contracts/services/role-service.contract.ts:
- RoleAuditLog interface with: id, userId, previousRole, newRole, changedBy, reason, timestamp, ipAddress
- CreateAuditLogData interface for creating new logs
- Use UserRole type from user.contract.ts (user, staff, admin)

**CODE STRUCTURE:**
- Use Mongoose with TypeScript following existing user.model.ts patterns
- Include all fields from RoleAuditLog interface
- Add proper indexes on userId, changedBy, timestamp
- Add timestamps: true option
- Export both schema and TypeScript interface
- Follow exact naming from role-service.contract.ts

**DO NOT:**
- Create any other files
- Exceed 400 lines
- Add fields not in contract
- Use different property names than contracts

**TEST YOUR WORK:**
Do testing here in terminal, make sure it works.

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/models/role-audit-log.model.ts
git commit -m "feat(role-assignment): add role audit log MongoDB schema with validation and indexes"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/models/role-audit-log.model.ts - Role audit log MongoDB schema created
- Update "Next Task": B2

Update: docs/features/role-assignment-permission-check/progress.md
- Mark B1 as completed
- Update current state
- Add Git commit hash and message -->



<!-- ## Backend Task B2: Role Service Layer

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Confirm what files exist from previous tasks
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md

**CRITICAL: Read these contract files to get EXACT method names and signatures:**
Read and analyze: shared/contracts/services/role-service.contract.ts
Read and analyze: shared/contracts/models/user.contract.ts
Read and analyze: shared/contracts/api/response.contract.ts

**YOUR TASK:**
Create service layer with all business logic for role assignment

**FILE TO CREATE:**
backend/src/services/role/role.service.ts (MAXIMUM 400 lines)

**USE THE MODELS:**
Import from: ../../models/user.model.ts (existing)
Import from: ../../models/role-audit-log.model.ts (created in B1)

**IMPLEMENT THESE METHODS (EXACT names from role-service.contract.ts):**
- assignUserRole(roleData: AssignRoleData): Promise<ServiceResponse<AssignRoleResponse>>
- getUserRole(userId: string): Promise<ServiceResponse<GetUserRoleResponse>>
- updateUserRole(roleData: UpdateRoleData): Promise<ServiceResponse<UpdateRoleResponse>>
- getUsersByRole(queryData: RoleQueryData): Promise<ServiceResponse<GetUsersByRoleResponse>>
- validateRoleAssignment(assignerId: string, targetRole: UserRole): Promise<ServiceResponse<RoleValidationResponse>>

**ROLE HIERARCHY FROM CONTRACT:**
Use EXACT hierarchy from role-service.contract.ts:
- ADMIN (Level 3): can manage all roles
- STAFF (Level 2): can manage user role only
- USER (Level 1): cannot manage any roles

**MATCH API CONTRACT:**
Return EXACT structure defined in API-CONTRACT.md for each method

**ERROR HANDLING:**
Use exact error codes from role-service.contract.ts:
- VALIDATION_ERROR, USER_NOT_FOUND, ROLE_ASSIGNMENT_DENIED, etc.

**BUSINESS LOGIC REQUIREMENTS:**
- Only admins can assign admin/staff roles
- Staff can only assign user role
- Cannot modify own role (prevent privilege escalation)
- Log all role changes in audit collection
- Validate user exists before role assignment
- Check if user already has the target role


**TEST YOUR WORK:**
Do testing here in terminal, make sure it works.

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/services/role/
git commit -m "feat(role-assignment): add role service layer with business logic and validation"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/services/role/role.service.ts - Role service layer created
- Update "Next Task": B3

Update: docs/features/role-assignment-permission-check/progress.md
- Mark B2 as completed
- Update current state
- Add Git commit hash and message -->



<!-- ## Backend Task B3: Permission Middleware

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify role service exists from B2
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md

**CRITICAL: Read these contract files to get EXACT function names and signatures:**
Read and analyze: shared/contracts/middleware/permission-middleware.contract.ts
Read and analyze: shared/contracts/middleware/auth-middleware.contract.ts
Read and analyze: shared/contracts/models/user.contract.ts

**YOUR TASK:**
Create permission checking middleware for route protection

**FILE TO CREATE:**
backend/src/middleware/permission.middleware.ts (MAXIMUM 400 lines)

**USE EXISTING PATTERNS:**
Follow exact patterns from backend/src/middleware/auth.middleware.ts

**IMPLEMENT THESE FUNCTIONS (EXACT names from permission-middleware.contract.ts):**
- requireRole(role: UserRole)
- requireAnyRole(roles: UserRole[])
- requireAllRoles(roles: UserRole[])
- requirePermission(permission: Permission)
- requireAnyPermission(permissions: Permission[])
- requireAllPermissions(permissions: Permission[])

**PERMISSION MAPPINGS:**
Use EXACT permissions and role mappings from permission-middleware.contract.ts:
- ROLE_PERMISSIONS object with admin/staff/user permission arrays
- PERMISSIONS constants (view_users, create_rooms, etc.)

**ERROR RESPONSES:**
Use exact error format from permission-middleware.contract.ts:
- ROLE_REQUIRED, INSUFFICIENT_ROLE, PERMISSION_DENIED, etc.
- Same response format as auth middleware: { success: false, error: string, code: string }

**MIDDLEWARE PATTERNS:**
- Take req: AuthenticatedRequest (from auth middleware)
- Check req.user exists and has role property
- Return 403 if insufficient permissions
- Call next() if authorized

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/middleware/permission.middleware.ts
git commit -m "feat(role-assignment): add permission checking middleware with role validation"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/middleware/permission.middleware.ts - Permission middleware created
- Update "Next Task": B4

Update: docs/features/role-assignment-permission-check/progress.md
- Mark B3 as completed
- Update current state
- Add Git commit hash and message -->




<!-- ## Backend Task B4: Role Controller

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify permission middleware exists from B3
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md

**CRITICAL: Read these contract files to get EXACT method names and response format:**
Read and analyze: shared/contracts/api/role-api.contract.ts
Read and analyze: shared/contracts/services/role-service.contract.ts
Read and analyze: shared/contracts/api/response.contract.ts

**YOUR TASK:**
Create controller to handle HTTP requests for role assignment

**FILE TO CREATE:**
backend/src/controllers/role/role.controller.ts (MAXIMUM 400 lines)

**USE THE SERVICE:**
Import from: ../../services/role/role.service.ts

**IMPLEMENT ENDPOINTS (EXACT names from role-api.contract.ts):**
- assignRole(req: Request, res: Response): Promise<Response>
- getUserRole(req: Request, res: Response): Promise<Response>
- updateRole(req: Request, res: Response): Promise<Response>
- getUsersByRole(req: Request, res: Response): Promise<Response>
- validateAssignment(req: Request, res: Response): Promise<Response>

**RESPONSE FORMAT:**
MUST match exactly what's in API-CONTRACT.md:
- Success: { success: true, data: {...} }
- Error: { success: false, error: "message", code: "ERROR_CODE" }

**REQUEST VALIDATION:**
Use exact validation rules from role-api.contract.ts:
- ROLE_VALIDATION_RULES for each field
- ROLE_VALIDATION_MESSAGES for error messages
- Validate MongoDB ObjectIds using the pattern in contracts

**ERROR HANDLING:**
Use exact error codes from role-api.contract.ts:
- ROLE_API_ERROR_CODES with proper HTTP status codes

**CONTROLLER PATTERNS:**
Follow existing controller patterns from backend/src/controllers/auth/user-auth.controller.ts:
- Extract data from req.body and req.params
- Validate input before calling service
- Handle service responses properly
- Use response.utils.ts for consistent responses

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/controllers/role/
git commit -m "feat(role-assignment): add role controller with request handling and validation"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/controllers/role/role.controller.ts - Role controller created
- Update "Next Task": B5

Update: docs/features/role-assignment-permission-check/progress.md
- Mark B4 as completed
- Update current state
- Add Git commit hash and message -->




<!-- ## Backend Task B5: Role Routes Configuration

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Verify controller exists from B4
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md

**CRITICAL: Read these contract files to get EXACT route patterns:**
Read and analyze: shared/contracts/api/role-api.contract.ts
Check existing route files for patterns: backend/src/routes/auth.routes.ts

**YOUR TASK:**
Create routes file to connect URLs to controller methods

**FILE TO CREATE:**
backend/src/routes/role.routes.ts (MAXIMUM 200 lines)

**IMPORT CONTROLLER:**
From: ../controllers/role/role.controller.ts

**IMPORT MIDDLEWARE:**
From: ../middleware/auth.middleware.ts (requireAuth)
From: ../middleware/permission.middleware.ts (requireRole, requireAnyRole)

**DEFINE ROUTES (EXACT from role-api.contract.ts):**
Use ROLE_ROUTE_PATTERNS with exact middleware chains:

- POST /api/v1/roles/assign
  - Middleware: requireAuth(), requireRole("admin")
  - Controller: roleController.assignRole

- GET /api/v1/roles/user/:userId/role
  - Middleware: requireAuth(), requireAnyRole(["admin", "staff"])
  - Controller: roleController.getUserRole

- PUT /api/v1/roles/update
  - Middleware: requireAuth(), requireRole("admin")
  - Controller: roleController.updateRole

- GET /api/v1/roles/users-by-role
  - Middleware: requireAuth(), requireAnyRole(["admin", "staff"])
  - Controller: roleController.getUsersByRole

- POST /api/v1/roles/validate-assignment
  - Middleware: requireAuth(), requireAnyRole(["admin", "staff"])
  - Controller: roleController.validateAssignment

**RATE LIMITING:**
Add rate limiting using patterns from auth.routes.ts:
- Use ROLE_API_RATE_LIMITS from role-api.contract.ts

**ROUTE REGISTRATION:**
Follow existing pattern from auth.routes.ts for export and route registration

**ADD TO MAIN SERVER:**
Update backend/src/server.ts to include role routes


**TEST YOUR WORK:**
Do testing here in terminal, make sure it works.

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add backend/src/routes/role.routes.ts
git add backend/src/server.ts
git commit -m "feat(role-assignment): add role API routes configuration with middleware"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ backend/src/routes/role.routes.ts - Role routes configured
- Update "Next Task": B6

Update: docs/features/role-assignment-permission-check/progress.md
- Mark B5 as completed
- Update current state
- Add Git commit hash and message -->





<!-- ## Backend Task B6: Postman Collection

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md
Verify all backend files exist
Check existing postman collection: postman/user-registration-email-verification.postman_collection.json

**YOUR TASK:**
Create Postman collection for testing all endpoints, for testing with newman in terminal

**FILE TO CREATE:**
postman/role-assignment-permission-check.postman_collection.json

**INCLUDE FOR EACH ENDPOINT:**
- Request name and description
- Method and URL matching API-CONTRACT.md exactly
- Headers (Content-Type: application/json, Authorization: Bearer {{token}})
- Body with example data from API-CONTRACT.md
- Tests to verify response structure and status codes

**COLLECTION STRUCTURE:**
```json
{
  "info": {
    "name": "Role Assignment & Permission Check API Tests",
    "description": "Complete test suite for role assignment and permission checking"
  },
  "auth": {
    "type": "bearer",
    "bearer": [{"key": "token", "value": "{{accessToken}}", "type": "string"}]
  },
  "variable": [
    {"key": "baseUrl", "value": "http://localhost:5000"},
    {"key": "accessToken", "value": ""},
    {"key": "userId", "value": ""},
    {"key": "adminUserId", "value": ""}
  ],
  "item": [...]
}
```

**REQUESTS TO INCLUDE:**
1. **Setup - Login Admin** (to get access token)
2. **Assign Role** - POST /api/v1/roles/assign
3. **Get User Role** - GET /api/v1/roles/user/:userId/role
4. **Update Role** - PUT /api/v1/roles/update
5. **Get Users By Role** - GET /api/v1/roles/users-by-role
6. **Validate Assignment** - POST /api/v1/roles/validate-assignment
7. **Permission Denied Tests** (with staff trying admin functions)

**ADD TESTS FOR EACH REQUEST:**
```javascript
// Status code tests
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Response structure tests
pm.test("Response has success field", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData.success).to.be.a('boolean');
});

// Data structure tests matching API-CONTRACT.md
```

**NEWMAN TESTING:**
Create environment file: postman/environment.json with variables
Test command: `newman run postman/role-assignment-permission-check.postman_collection.json -e postman/environment.json`

**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add postman/role-assignment-permission-check.postman_collection.json
git add postman/environment.json
git commit -m "feat(role-assignment): add Postman test collection with newman support"
git push origin feature/role-assignment-permission-check
```

**TESTING INSTRUCTIONS:**
```bash
# Install newman if not installed
npm install -g newman

# Run tests
cd postman
newman run role-assignment-permission-check.postman_collection.json -e environment.json

# Tests should all pass
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ postman/role-assignment-permission-check.postman_collection.json - API tests created
- Mark backend phase as COMPLETE
- Update "Next Task": F1

Update: docs/features/role-assignment-permission-check/progress.md
- Mark B6 as completed
- Mark backend phase complete
- Update current state
- Add Git commit hash and message -->




<!-- ## Frontend Task F1: Role Management TypeScript Types

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md
Verify backend is complete and tested

**CRITICAL: Read these contract files to get EXACT type definitions:**
Read and analyze: shared/contracts/api/role-api.contract.ts
Read and analyze: shared/contracts/models/user.contract.ts
Check existing frontend types: frontend/src/types/auth.types.ts

**YOUR TASK:**
Create TypeScript types matching backend API exactly

**FILE TO CREATE:**
frontend/src/types/role.types.ts (MAXIMUM 200 lines)

**TYPES TO DEFINE (EXACT from role-api.contract.ts):**
Based on API-CONTRACT.md, create interfaces for:

**Request Types:**
- AssignRoleRequest
- UpdateRoleRequest  
- GetUsersByRoleRequest
- ValidateAssignmentRequest

**Response Types:**
- AssignRoleResponse
- GetUserRoleResponse
- UpdateRoleResponse
- GetUsersByRoleResponse
- ValidateAssignmentResponse

**Data Model Types:**
- UserWithRole (user object with role information)
- RoleAssignmentData
- RoleValidationResult
- PaginationData

**Error Types:**
- RoleApiError
- RoleErrorCode

**MUST MATCH:**
Types must match backend responses EXACTLY as shown in API-CONTRACT.md

**EXPORT ALL TYPES:**
Make sure all interfaces are exported for use in components

**ROLE ENUM:**
```typescript
export enum UserRole {
  USER = 'user',
  STAFF = 'staff', 
  ADMIN = 'admin'
}
```


**TEST YOUR WORK:**
Do testing here in terminal, make sure it works.


**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add frontend/src/types/role.types.ts
git commit -m "feat(role-assignment): add role management TypeScript type definitions"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ frontend/src/types/role.types.ts - TypeScript types created
- Update "Next Task": F2

Update: docs/features/role-assignment-permission-check/progress.md
- Mark F1 as completed
- Update current state
- Add Git commit hash and message -->




<!-- ## Frontend Task F2: Role API Service

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md
Verify types exist from F1

**CRITICAL: Read contract files and existing patterns:**
Read and analyze: shared/contracts/api/role-api.contract.ts
Check existing API service: frontend/src/services/auth.service.ts

**YOUR TASK:**
Create API service to communicate with backend

**FILE TO CREATE:**
frontend/src/services/role.service.ts (MAXIMUM 400 lines)

**IMPORT TYPES:**
From: ../types/role.types.ts

**IMPLEMENT METHODS (EXACT endpoints from API-CONTRACT.md):**
- assignRole(data: AssignRoleRequest): Promise<AssignRoleResponse>
- getUserRole(userId: string): Promise<GetUserRoleResponse>
- updateRole(data: UpdateRoleRequest): Promise<UpdateRoleResponse>
- getUsersByRole(params?: GetUsersByRoleRequest): Promise<GetUsersByRoleResponse>
- validateAssignment(data: ValidateAssignmentRequest): Promise<ValidateAssignmentResponse>

**API ENDPOINTS:**
Use exact URLs from API-CONTRACT.md:
- POST /api/v1/roles/assign
- GET /api/v1/roles/user/:userId/role
- PUT /api/v1/roles/update
- GET /api/v1/roles/users-by-role
- POST /api/v1/roles/validate-assignment

**API CALLS:**
- Use fetch() following existing auth.service.ts patterns
- Include Authorization header with JWT token
- Include proper error handling for 400/403/404 responses
- Return exact types as defined in role.types.ts

**ERROR HANDLING:**
```typescript
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.error || 'Failed to assign role');
}
```

**TOKEN MANAGEMENT:**
Follow existing patterns from auth.service.ts:
- Get token from localStorage
- Include in Authorization header
- Handle token refresh if needed


**TEST YOUR WORK:**
Do testing here in terminal, make sure it works.


**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add frontend/src/services/role.service.ts
git commit -m "feat(role-assignment): add frontend role API service with error handling"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ frontend/src/services/role.service.ts - API service created
- Update "Next Task": F3

Update: docs/features/role-assignment-permission-check/progress.md
- Mark F2 as completed
- Update current state
- Add Git commit hash and message -->





<!-- ## Frontend Task F3: Role Assignment UI Component

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md
Verify API service exists from F2
Check existing form components: frontend/src/components/auth/

**YOUR TASK:**
Create main UI component for role assignment

**FILE TO CREATE:**
frontend/src/components/role/RoleAssignmentForm.tsx (MAXIMUM 400 lines)

**USE MOCK DATA FIRST:**
Create component with hardcoded data to test UI
Don't connect to API yet (that's F5)

**COMPONENT FEATURES:**
- User search by email/name
- Role selection dropdown (user, staff, admin)
- Reason input field (optional)
- Current role display
- Validation on submit
- Loading states (for F5)
- Error display
- Success feedback
- Responsive design with Tailwind CSS

**FORM FIELDS:**
```typescript
interface RoleAssignmentFormData {
  selectedUserId: string;
  newRole: UserRole;
  reason?: string;
}
```

**MOCK DATA FOR TESTING:**
```typescript
const mockUsers = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'user' },
  { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'staff' }
];
```

**COMPONENT STRUCTURE:**
- Use React hooks (useState, useEffect)
- Use react-hook-form for form management (following existing patterns)
- Separate concerns (UI vs logic)
- Make it reusable

**VALIDATION:**
- Required: selectedUserId, newRole
- Optional: reason (max 500 characters)
- Prevent self-role modification

**UI SECTIONS:**
1. User Search/Selection
2. Current Role Display
3. New Role Selection
4. Reason Input
5. Action Buttons (Assign/Update/Cancel)


**TEST YOUR WORK:**
Do testing here in terminal, make sure it works.


**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add frontend/src/components/role/
git commit -m "feat(role-assignment): add role assignment form component with validation"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ frontend/src/components/role/RoleAssignmentForm.tsx - Role assignment component created
- Update "Next Task": F4

Update: docs/features/role-assignment-permission-check/progress.md
- Mark F3 as completed
- Update current state
- Add Git commit hash and message -->





<!-- ## Frontend Task F4: Role Management Page

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md
Verify component exists from F3
Check Next.js app structure: frontend/src/app/

**YOUR TASK:**
Create Next.js page for role management

**FILE TO CREATE:**
frontend/src/app/admin/roles/page.tsx (MAXIMUM 200 lines)

**CREATE DIRECTORY FIRST:**
mkdir -p frontend/src/app/admin/roles

**PAGE CONTENT:**
- Import and use RoleAssignmentForm from F3
- Add page title and metadata
- Include admin-only layout requirements
- Add breadcrumbs navigation
- User list with role information (mock data initially)

**PAGE STRUCTURE:**
```typescript
export default function RoleManagementPage() {
  return (
    <div className="container mx-auto p-6">
      <h1>Role Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2>Users List</h2>
          {/* User list with roles */}
        </div>
        <div>
          <RoleAssignmentForm />
        </div>
      </div>
    </div>
  );
}
```

**MOCK USER LIST:**
Display list of users with:
- Name and email
- Current role
- "Change Role" button

**ROUTE SETUP:**
The file location creates the route automatically:
- File: app/admin/roles/page.tsx
- Route: /admin/roles

**METADATA:**
```typescript
export const metadata = {
  title: 'Role Management | Admin',
  description: 'Manage user roles and permissions'
};
```

**PROTECTION:**
Add comment for future authentication check:
```typescript
// TODO: Add admin role check in F5
```


**TEST YOUR WORK:**
Do testing here in terminal, make sure it works.


**GIT OPERATIONS:**
After creating the file successfully:
```bash
git add frontend/src/app/admin/roles/
git commit -m "feat(role-assignment): add role management page with user list"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Add to "What Exists Now": ✅ frontend/src/app/admin/roles/page.tsx - Role management page created
- Update "Next Task": F5

Update: docs/features/role-assignment-permission-check/progress.md
- Mark F4 as completed
- Update current state
- Add Git commit hash and message -->





<!-- ## Frontend Task F5: Backend Integration

**MANDATORY FIRST STEPS:**

Read and analyze: docs/features/role-assignment-permission-check/CURRENT-STATE.md
Read and analyze: docs/features/role-assignment-permission-check/API-CONTRACT.md
Read and analyze: docs/features/role-assignment-permission-check/spec.md
Read and analyze: docs/features/role-assignment-permission-check/api.md
Read and analyze: docs/features/role-assignment-permission-check/tasks.md
Read and analyze: docs/features/role-assignment-permission-check/progress.md
Verify all frontend files exist
Test backend is working with Postman

**YOUR TASK:**
Connect frontend component to real backend API

**FILES TO MODIFY:**
- frontend/src/components/role/RoleAssignmentForm.tsx
- frontend/src/app/admin/roles/page.tsx

**CHANGES TO RoleAssignmentForm.tsx:**
1. Import API service from F2: `import * as roleService from '../../services/role.service';`
2. Replace mock data with real API calls using roleService methods
3. Add proper loading states during API calls
4. Handle API errors and display to user with specific error messages
5. Add success handling (show message and refresh data)
6. Implement form submission with actual role assignment

**CHANGES TO page.tsx:**
1. Import roleService and fetch real user list
2. Replace mock users with getUsersByRole API call
3. Add loading states for data fetching
4. Handle API errors gracefully
5. Add refresh functionality after role assignments
6. Implement user search functionality

**API INTEGRATION REQUIREMENTS:**
- Role assignment works and persists
- User list shows real data with current roles
- Error cases show proper user-friendly messages
- Loading states prevent multiple submissions
- Success feedback confirms role changes
- Page refreshes data after successful operations

**ERROR HANDLING:**
```typescript
try {
  const result = await roleService.assignRole(formData);
  setSuccessMessage('Role assigned successfully');
  // Refresh user list
} catch (error) {
  setErrorMessage(error.message || 'Failed to assign role');
}
```

**ADMIN PROTECTION:**
Add route protection to ensure only admins can access:
- Check user role from auth context
- Redirect non-admins to appropriate page
- Show loading during auth check

**TESTING CHECKLIST:**
- [ ] Can load users list from backend
- [ ] Can assign roles (admin to any role)
- [ ] Staff cannot assign admin/staff roles (gets 403)
- [ ] Users cannot access page at all
- [ ] Error messages show for failed operations
- [ ] Success feedback for completed operations
- [ ] Loading states work properly
- [ ] Page refreshes after role changes



**TEST YOUR WORK:**
Do testing here in terminal, make sure it works.


**GIT OPERATIONS:**
After modifying successfully:
```bash
git add frontend/src/components/role/RoleAssignmentForm.tsx
git add frontend/src/app/admin/roles/page.tsx
git commit -m "feat(role-assignment): complete backend integration with role assignment functionality"
git push origin feature/role-assignment-permission-check
```

**AFTER COMPLETING:**
Update docs/features/role-assignment-permission-check/CURRENT-STATE.md:
- Mark feature as COMPLETE
- List all files created
- Note any issues for PROBLEMS-LOG.md

Update: docs/features/role-assignment-permission-check/progress.md
- Mark F5 as completed
- Mark entire feature as COMPLETE
- Final status summary
- Add Git commit hash and message

**FINAL TESTING:**
Test complete end-to-end functionality:
1. Login as admin
2. Navigate to /admin/roles
3. View users list with roles
4. Assign different roles to users
5. Verify role changes persist
6. Test permission restrictions work
7. Logout and test access restrictions -->