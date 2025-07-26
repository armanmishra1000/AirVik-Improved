# Airvik Hotel System - Development Rules

## Technology Stack
- **Backend**: Node.js, Express, TypeScript, MongoDB with Mongoose
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: JWT with refresh tokens
- **API**: RESTful with consistent response format

## Code Standards

### File Size Limits
- Maximum 400 lines per file
- Split large files into smaller, focused modules

### Naming Conventions
- **Files**: kebab-case (user-auth.service.ts)
- **React Components**: PascalCase (UserProfile.tsx)
- **Functions/Variables**: camelCase (getUserById)
- **MongoDB Collections**: plural lowercase (users, rooms, bookings)
- **API Routes**: /api/v1/resource-name

### API Response Format (ALWAYS USE)
```typescript
// Success
{
  "success": true,
  "data": any,
  "message?": string
}

// Error
{
  "success": false,
  "error": string,
  "code?": string,
  "details?": any
}
```

## Backend Patterns
- Use service layer pattern (controller → service → model)
- All async functions must have try-catch
- Use TypeScript interfaces for all data structures
- Validate inputs using Joi or express-validator

## Frontend Patterns
- Use functional components with hooks
- Create custom hooks for data fetching
- Use TypeScript for all components
- Handle loading and error states

## Git Workflow
- Commit after each task completion
- Use conventional commits: feat(), fix(), docs(), etc.
- Push to feature branch after each commit

## Important Notes
- Always check CURRENT-STATE.md before starting any task
- Follow API-CONTRACT.md exactly
- Update progress tracking after each task
- One developer completes entire feature
