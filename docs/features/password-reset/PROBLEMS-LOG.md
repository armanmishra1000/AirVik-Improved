# Password Reset & JWT Token Refresh Problems Log

## Purpose: AI learns from errors to prevent repeating them

<!-- Format for each problem:
Date: [date]
Task: [task name]
Problem: [what went wrong]
Root Cause: [why it happened]
Solution: [how it was fixed]
Prevention: [how to avoid in future]
-->

## Predicted Issues & Solutions:

### Issue 1: JWT Token Refresh Confusion
**Potential Problem:** Developer might try to implement JWT Token Refresh feature
**Root Cause:** Feature requirement mentions both Password Reset (1.5) and JWT Token Refresh (1.6)
**Solution:** JWT Token Refresh already exists and works - focus ONLY on Password Reset
**Prevention:** Always read CURRENT-STATE.md first to understand what already exists

### Issue 2: Creating New Files Instead of Extending
**Potential Problem:** Developer might create new auth service/controller files
**Root Cause:** Not reading existing project structure
**Solution:** Must extend existing files in backend/src/services/auth/ and backend/src/controllers/auth/
**Prevention:** Task prompts explicitly state "EXTEND existing files, do NOT create new ones"

### Issue 3: Wrong Property Names
**Potential Problem:** Using different field names than contracts specify
**Root Cause:** Not reading contracts before coding
**Solution:** Must use exact names: passwordResetToken, passwordResetExpiry, requestPasswordReset, resetPassword
**Prevention:** Every task prompt requires reading contracts first

### Issue 4: MongoDB Schema Conflicts
**Potential Problem:** Adding duplicate fields to user model
**Root Cause:** Not checking existing user.model.ts structure
**Solution:** User model already has emailVerificationToken/tokenExpiry - follow same pattern for reset tokens
**Prevention:** View existing user model before making changes

### Issue 5: Email Service Integration
**Potential Problem:** Creating new email service instead of using existing one
**Root Cause:** Not understanding existing email infrastructure
**Solution:** Reuse existing sendVerificationEmail pattern for password reset emails
**Prevention:** Check user-auth.service.ts for existing email sending patterns

### Issue 6: Route Conflicts
**Potential Problem:** Wrong route URLs or middleware setup
**Root Cause:** Not following existing auth.routes.ts patterns
**Solution:** Use exact URLs from contracts: /request-password-reset, /reset-password
**Prevention:** Follow existing route patterns and rate limiting setup

### Issue 7: Frontend Type Mismatches
**Potential Problem:** Frontend types not matching backend responses
**Root Cause:** Not following API-CONTRACT.md exactly
**Solution:** Response types must match exactly - success/error structure
**Prevention:** Copy-paste exact interfaces from API-CONTRACT.md

### Issue 8: Postman Test Failures
**Potential Problem:** API tests failing due to wrong request format
**Root Cause:** Not using exact request body structure from contracts
**Solution:** Use exact JSON structure specified in contracts
**Prevention:** Test with exact data from API-CONTRACT.md examples
