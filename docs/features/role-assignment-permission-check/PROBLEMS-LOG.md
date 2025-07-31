# Role Assignment & Permission Check Problems Log

## Purpose: AI learns from errors to prevent repeating them

<!-- Format for each problem:
Date: [date]
Task: [task name]
Problem: [what went wrong]
Root Cause: [why it happened]
Solution: [how it was fixed]
Prevention: [how to avoid in future]
-->

## Current Status: No problems yet - fresh start

## Prevention Guidelines Based on Previous Features:

### From User Login/Logout Feature:
- **Password Hashing:** Avoid double hashing by centralizing in model pre-save hooks
- **Form Submission:** Always specify method="post" to prevent GET query parameter leaks
- **Next.js 14:** Use "use client" directive for client-side components
- **Route Configuration:** Proper redirect handling for SPA routing

### From Password Reset Feature:
- **Direct Database Updates:** Use findByIdAndUpdate for sensitive operations to avoid middleware conflicts
- **Token Generation:** Use crypto.randomBytes for secure token generation
- **API Parameter Matching:** Ensure frontend request matches backend expectations exactly

### General Best Practices:
- **Contract Adherence:** Always read shared/contracts/ files before implementing
- **Git Workflow:** Stage, commit, and push after each completed task
- **Testing:** Test each backend endpoint with Postman before moving to next task
- **Documentation:** Update CURRENT-STATE.md after each task completion