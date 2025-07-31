# Role Assignment Feature - Testing Guide & Success Metrics

## Overview
This guide provides step-by-step instructions for testing the Role Assignment & Permission Check feature in the live frontend environment, along with defined success metrics.

## Prerequisites

### 1. Environment Setup
```bash
# Terminal 1: Start Backend
cd backend
npm install
npm run dev
# Backend should start on http://localhost:5000

# Terminal 2: Start Frontend  
cd frontend
npm install
npm run dev
# Frontend should start on http://localhost:3000
```

### 2. Database Setup
- Ensure MongoDB is running
- Database should contain test users with different roles
- Verify backend connects to database successfully

### 3. Test Users Required
Create these test users in the database:
```javascript
// Admin User
{
  email: "admin@airvik.com",
  password: "admin123",
  role: "admin",
  firstName: "Admin",
  lastName: "User",
  isEmailVerified: true
}

// Staff User  
{
  email: "staff@airvik.com", 
  password: "staff123",
  role: "staff",
  firstName: "Staff",
  lastName: "User",
  isEmailVerified: true
}

// Regular User
{
  email: "user@airvik.com",
  password: "user123", 
  role: "user",
  firstName: "Regular",
  lastName: "User",
  isEmailVerified: true
}
```

## Testing Scenarios

### Scenario 1: Admin Access & Navigation
**Objective**: Verify admin users can access the role management page

**Steps**:
1. Open browser to `http://localhost:3000`
2. Login as admin user (`admin@airvik.com` / `admin123`)
3. Navigate to `/admin/roles`
4. Verify page loads successfully

**Success Criteria**:
- ✅ Page loads without errors
- ✅ User list displays correctly
- ✅ Role assignment form is visible
- ✅ Breadcrumbs show correct navigation path

### Scenario 2: User List Display
**Objective**: Verify the user list shows real data from backend

**Steps**:
1. Access role management page as admin
2. Wait for user list to load
3. Verify all test users are displayed
4. Check role badges show correct colors
5. Verify email verification status

**Success Criteria**:
- ✅ Loading spinner appears initially
- ✅ All test users are displayed in table
- ✅ Role badges show correct colors:
  - Admin: Red background
  - Staff: Blue background  
  - User: Gray background
- ✅ Email verification status is correct
- ✅ User avatars show initials correctly

### Scenario 3: Role Assignment Functionality
**Objective**: Test the core role assignment feature

**Steps**:
1. In role assignment form, search for a user
2. Select a user from dropdown
3. Choose a different role from dropdown
4. Add a reason (optional)
5. Click "Assign Role" button
6. Verify success message appears
7. Check user list refreshes with new role

**Success Criteria**:
- ✅ User search works correctly
- ✅ User selection populates form
- ✅ Role dropdown shows all available roles
- ✅ Form validation works (required fields)
- ✅ Loading state shows during submission
- ✅ Success message appears after assignment
- ✅ User list refreshes automatically
- ✅ New role is displayed in user table

### Scenario 4: Error Handling
**Objective**: Test error scenarios and user feedback

**Steps**:
1. Try to assign role without selecting user
2. Try to assign same role user already has
3. Test with invalid user ID
4. Test network error (disconnect backend)
5. Verify error messages are user-friendly

**Success Criteria**:
- ✅ Form validation prevents submission with missing data
- ✅ Clear error messages for validation errors
- ✅ API errors display user-friendly messages
- ✅ Network errors handled gracefully
- ✅ Loading states reset properly on error

### Scenario 5: Permission Testing
**Objective**: Verify role-based access control

**Steps**:
1. Login as staff user (`staff@airvik.com`)
2. Try to access `/admin/roles`
3. Login as regular user (`user@airvik.com`)
4. Try to access `/admin/roles`
5. Verify appropriate access restrictions

**Success Criteria**:
- ✅ Staff users cannot access role management page
- ✅ Regular users cannot access role management page
- ✅ Appropriate error/redirect messages shown
- ✅ Only admin users can access the feature

### Scenario 6: Data Persistence
**Objective**: Verify role changes persist in database

**Steps**:
1. Assign a new role to a user
2. Refresh the page
3. Logout and login again
4. Navigate to role management page
5. Verify role change persists

**Success Criteria**:
- ✅ Role changes persist after page refresh
- ✅ Role changes persist after logout/login
- ✅ Database shows updated role information
- ✅ Audit log entries created for role changes

## Success Metrics

### 1. Functional Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load Time | < 3 seconds | Browser dev tools |
| API Response Time | < 2 seconds | Network tab |
| Form Submission Success Rate | > 95% | Manual testing |
| Error Handling Coverage | 100% | All error scenarios tested |
| Data Persistence Rate | 100% | Database verification |

### 2. User Experience Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| User Interface Responsiveness | Smooth | Visual inspection |
| Loading State Clarity | Clear feedback | User observation |
| Error Message Clarity | User-friendly | Content review |
| Navigation Intuitiveness | Easy to use | User testing |
| Accessibility Compliance | WCAG 2.1 AA | Accessibility audit |

### 3. Technical Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| TypeScript Compilation | 0 errors | `npm run build` |
| Console Errors | 0 errors | Browser console |
| Network Errors | 0 errors | Network tab |
| Memory Leaks | None | Performance monitoring |
| Cross-browser Compatibility | All major browsers | Browser testing |

### 4. Security Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| Authentication Required | 100% | Manual testing |
| Authorization Checks | All endpoints | API testing |
| Input Validation | 100% | Form testing |
| XSS Prevention | No vulnerabilities | Security scan |
| CSRF Protection | Implemented | Security review |

## Testing Checklist

### Pre-Testing Setup
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] MongoDB connected and accessible
- [ ] Test users created in database
- [ ] Browser dev tools open for monitoring

### Functional Testing
- [ ] Admin can access role management page
- [ ] User list loads and displays correctly
- [ ] Role assignment form works end-to-end
- [ ] Error handling works for all scenarios
- [ ] Success feedback is clear and helpful
- [ ] Data refresh works after operations
- [ ] Form validation prevents invalid submissions

### Security Testing
- [ ] Non-admin users cannot access page
- [ ] Authentication required for all operations
- [ ] Input validation prevents malicious data
- [ ] API endpoints require proper authorization
- [ ] Session management works correctly

### Performance Testing
- [ ] Page loads within 3 seconds
- [ ] API responses within 2 seconds
- [ ] No memory leaks during usage
- [ ] Smooth user interactions
- [ ] No console errors or warnings

### Cross-browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Common Issues

**Backend Connection Error**:
```bash
# Check if backend is running
curl http://localhost:5000/api/v1/health

# Check backend logs
cd backend && npm run dev
```

**Frontend Build Errors**:
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Database Connection Issues**:
```bash
# Check MongoDB status
mongosh
# or
mongo
```

**CORS Errors**:
- Verify backend CORS configuration
- Check frontend API base URL
- Ensure both servers are running

### Debug Commands

```bash
# Check backend status
curl -X GET http://localhost:5000/api/v1/roles/users

# Check frontend build
cd frontend && npm run build

# Check TypeScript compilation
cd frontend && npx tsc --noEmit

# Monitor network requests
# Use browser dev tools Network tab
```

## Reporting

### Test Results Template
```
Feature: Role Assignment & Permission Check
Date: [Date]
Tester: [Name]
Environment: [Local/Staging/Production]

✅ Passed Tests:
- [List of passed test scenarios]

❌ Failed Tests:
- [List of failed test scenarios with details]

📊 Metrics Summary:
- Page Load Time: [X] seconds
- API Response Time: [X] seconds
- Success Rate: [X]%
- Error Rate: [X]%

🔧 Issues Found:
- [List of issues with severity]

📝 Recommendations:
- [List of improvements needed]
```

## Conclusion

This testing guide ensures comprehensive validation of the Role Assignment feature. Follow the scenarios systematically and document all results. The success metrics provide clear targets for feature quality and user experience.

For additional testing or questions, refer to the API documentation and backend testing guides. 