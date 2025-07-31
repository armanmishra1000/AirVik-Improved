# Change Password Problems Log

## How to Use This File:
- AI reads this before every task to learn from past mistakes
- Document EXACT error messages and solutions
- Update after every bug fix
- Include prevention steps for future tasks

## Problems Encountered:

### Problem Template:
```
## Problem: [Brief Description]
**Date:** [YYYY-MM-DD]
**Task:** [Which task - B1, B2, etc.]
**Error Message:** [Exact error text]
**Root Cause:** [Why it happened]
**Solution:** [Exact steps to fix]
**Prevention:** [How to avoid in future]
**Files Affected:** [List files]
```

## Known Patterns from Other Features:

### Password Hashing Issues (From Password Reset Feature):
**Problem:** Double password hashing causing login failures
**Root Cause:** Password being hashed in controller AND model pre-save hook
**Solution:** Use direct database operations (findByIdAndUpdate) with manual bcrypt hashing, bypassing pre-save hooks
**Prevention:** Always check if password is being hashed multiple times in the flow

### Authentication Token Issues:
**Problem:** 401 Unauthorized errors in frontend
**Root Cause:** Token storage keys not matching between storage and retrieval
**Solution:** Ensure exact key names: 'airvik_access_token' (sessionStorage), 'airvik_refresh_token' (localStorage)
**Prevention:** Always verify token storage key names in API service

### API Contract Mismatches:
**Problem:** Frontend expecting different response structure than backend provides
**Root Cause:** Not following API-CONTRACT.md exactly
**Solution:** Always validate response structure matches contract before implementing
**Prevention:** Cross-reference every response with API-CONTRACT.md during development

### Next.js 14 Client Component Issues:
**Problem:** Server component errors with client-side functionality
**Root Cause:** Missing "use client" directive
**Solution:** Add "use client" at top of components using useState, useEffect, or event handlers
**Prevention:** Always add "use client" for interactive components

### Route Configuration Issues:
**Problem:** 404 errors on frontend routes
**Root Cause:** File structure not matching Next.js app router requirements
**Solution:** Ensure correct file naming and directory structure in src/app/
**Prevention:** Follow exact file structure patterns from existing features

## Current Issues:
<!-- AI will update this section as problems are encountered and resolved -->
None at this time - feature documentation created