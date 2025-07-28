# User Login Logout Problems Log

## Purpose: AI learns from errors to prevent repeating them

<!-- Format for each problem:
Date: [date]
Task: [task name]
Problem: [what went wrong]
Root Cause: [why it happened]
Solution: [how it was fixed]
Prevention: [how to avoid in future]
-->

## Problem 1: TypeScript Property Errors in Auth Service

Date: 2025-07-28
Task: user-login-logout

Problem: TypeScript errors in user-auth.service.ts due to property mismatches between the user model and service code. Properties like 'firstName', 'lastName', 'isEmailVerified', 'emailVerificationToken', and 'tokenExpiry' were being accessed but didn't exist in the user model.

Root Cause: The API contract expected different field names than what was in the user model. The model used 'name' (single field) instead of separate 'firstName' and 'lastName' fields, and 'isActive' instead of 'isEmailVerified'.

Solution:
1. Extended the user model interface and schema to include missing fields like 'emailVerificationToken' and 'tokenExpiry'
2. Modified the auth service code to adapt to the user model structure:
   - Split the 'name' field into firstName and lastName parts when needed
   - Used 'isActive' field as equivalent to 'isEmailVerified'
   - Added proper type handling for all fields

Prevention:
1. Always check model interfaces before implementing services
2. Document field mappings between API and database models
3. Consider using DTOs (Data Transfer Objects) to formalize the transformation between API and database models
4. Add comments in code to clarify field mappings

## Problem 2: Missing Name Field Validation Error During Login

Date: 2025-07-28
Task: user-login-logout

Problem: Mongoose validation error "User validation failed: name: Name is required" occurring during login process. The login API was returning 500 Internal Server Error instead of processing login requests properly.

Root Cause: Legacy users in the database were created without the required 'name' field, but the user model schema requires this field. When the login process tried to save the user document after updating login tracking fields (loginAttempts, lastLoginAt, etc.), Mongoose validated the entire document and failed because the required 'name' field was undefined.

Solution:
1. Added logic in the loginUser service method to check if the name field exists
2. If name field is missing, automatically generate it from the email prefix
3. Set the name field before proceeding with the login process
4. This ensures backward compatibility with existing users while maintaining model validation

Code fix applied:
```typescript
// Fix: Ensure name field exists (handle legacy users without name)
if (!user.name) {
  // Extract name from email or set a default
  const emailPrefix = user.email.split('@')[0];
  user.name = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
  console.log(`Fixed missing name field for user ${user.email}: set to '${user.name}'`);
}
```

Prevention:
1. Always handle backward compatibility when adding required fields to existing models
2. Consider database migrations when schema changes affect existing data
3. Add validation checks for required fields before document save operations
4. Test with existing database data, not just new test data
5. Use proper debugging techniques to identify root causes (console.log user document state)

## Problem 3: Next.js 14 Client Component Error

Date: 2025-07-28
Task: user-login-logout

Problem: Next.js error when loading the login page: "You're importing a component that needs useState/useEffect. It only works in a Client Component but none of its parents are marked with 'use client', so they're Server Components by default."

Root Cause: In Next.js 14, all components are Server Components by default. Components that use React hooks like useState or useEffect must be explicitly marked as Client Components using the "use client" directive. Our LoginForm.tsx and LogoutButton.tsx components were using React hooks but weren't marked as Client Components.

Solution:
1. Added "use client" directive at the top of LoginForm.tsx
2. Added "use client" directive at the top of LogoutButton.tsx
3. This tells Next.js that these components should be rendered on the client-side where React hooks are available

Code fix applied:
```tsx
// Added to the top of LoginForm.tsx and LogoutButton.tsx
"use client";

import React, { useState, useEffect } from 'react';
// Rest of the imports...
```

Prevention:
1. Always add "use client" directive to components that use React hooks in Next.js 14+
2. Consider creating a template for new components that includes this directive
3. Add this requirement to the frontend development guidelines
4. Test components in the actual Next.js app context, not just in isolation
