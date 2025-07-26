# User Registration & Email Verification Problems Log

## Purpose: AI learns from errors to prevent repeating them

<!-- Format for each problem:
Date: [date]
Task: [task name]
Problem: [what went wrong]
Root Cause: [why it happened]
Solution: [how it was fixed]
Prevention: [how to avoid in future]
-->

## API Route Mismatch

Date: 2025-07-26
Task: Frontend-Backend Integration
Problem: Frontend registration API calls failed with 404 errors. Console showed requests to `/api/v1/api/v1/auth/register` instead of the correct `/api/v1/auth/register`.
Root Cause: The API URL construction in the frontend service was causing a duplication of the `/api/v1/` path segment in the final URL.
Solution: Added a comment in the auth service to clarify the API URL construction and ensure the path is correctly formed.
Prevention: 
- Always test API integrations with browser dev tools to verify the exact URL being called
- Use environment variables consistently for API base URLs
- Add integration tests that verify correct endpoint URLs
- Consider using API client generators from OpenAPI/Swagger specs to ensure consistency
