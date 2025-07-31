# Role Assignment Feature - Quick Test Card

## 🚀 Quick Start Commands

### 1. Start Testing Environment
```bash
# Option A: Use the automated script
./scripts/test-role-feature.sh

# Option B: Manual start
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend  
cd frontend && npm install && npm run dev
```

### 2. Setup Test Users
```bash
# After backend is running
node scripts/setup-test-users.js
```

## 🔗 Important URLs

| URL | Purpose | Access |
|-----|---------|--------|
| `http://localhost:3000` | Frontend Home | Public |
| `http://localhost:3000/auth/login` | Login Page | Public |
| `http://localhost:3000/admin/roles` | Role Management | Admin Only |
| `http://localhost:5000/api/v1/health` | Backend Health | Public |
| `http://localhost:5000/api/v1/roles/users` | Users API | Admin Only |

## 🔑 Test User Credentials

| Role | Email | Password | Can Access Role Management |
|------|-------|----------|---------------------------|
| Admin | `admin@airvik.com` | `admin123` | ✅ Yes |
| Staff | `staff@airvik.com` | `staff123` | ❌ No |
| User | `user@airvik.com` | `user123` | ❌ No |

## 🧪 Essential Test Scenarios

### ✅ Must Test (Core Functionality)
1. **Admin Access**: Login as admin → Navigate to `/admin/roles`
2. **User List**: Verify all test users display with correct roles
3. **Role Assignment**: Assign a new role to a user
4. **Error Handling**: Try invalid operations (no user selected, etc.)
5. **Permission Check**: Try accessing as staff/user (should be blocked)

### 🔍 Quick Health Checks
```bash
# Check backend health
curl http://localhost:5000/api/v1/health

# Check frontend build
cd frontend && npm run build

# Check TypeScript compilation
cd frontend && npx tsc --noEmit
```

## 📊 Success Metrics (Quick Check)

| Metric | Target | How to Check |
|--------|--------|--------------|
| Page Load | < 3s | Browser dev tools |
| API Response | < 2s | Network tab |
| No Console Errors | 0 | Browser console |
| Form Validation | 100% | Try invalid inputs |
| Error Messages | Clear | Test error scenarios |

## 🐛 Common Issues & Fixes

### Backend Not Starting
```bash
# Check if port 5000 is free
lsof -i :5000
# Kill process if needed
kill -9 <PID>

# Check MongoDB connection
mongosh
```

### Frontend Build Errors
```bash
# Clear cache
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Ensure both servers are running
- Check backend CORS configuration
- Verify API base URL in frontend

## 📝 Test Results Template

```
✅ PASSED:
- [List successful tests]

❌ FAILED:
- [List failed tests with details]

🔧 ISSUES:
- [List any issues found]

📊 METRICS:
- Page Load: [X]s
- API Response: [X]s
- Errors: [X]
```

## 🎯 Critical Test Path

1. **Start Environment** → `./scripts/test-role-feature.sh`
2. **Setup Users** → `node scripts/setup-test-users.js`
3. **Login as Admin** → `admin@airvik.com` / `admin123`
4. **Navigate** → Go to `/admin/roles`
5. **Test Assignment** → Assign role to a user
6. **Verify Persistence** → Refresh page, check role change
7. **Test Permissions** → Try as staff/user (should fail)

## 📚 Full Documentation

For detailed testing instructions, see:
- `docs/features/role-assignment-permission-check/TESTING-GUIDE.md`
- `docs/features/role-assignment-permission-check/API-CONTRACT.md`
- `docs/features/role-assignment-permission-check/CURRENT-STATE.md` 