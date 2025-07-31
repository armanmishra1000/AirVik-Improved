#!/usr/bin/env node

/**
 * Test Users Setup Script for Role Assignment Feature
 * 
 * This script sets up test users with the provided verified accounts.
 * Run this script after starting the backend server.
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Verified test accounts provided by user
const VERIFIED_TEST_USERS = [
  {
    email: '5speq1gvgf@illubd.com',
    password: '5Speq1gvgf@illubd',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    email: 'k6nhyvw15w@daouse.com',
    password: '5Speq1gvgf@illubd',
    firstName: 'Staff',
    lastName: 'User',
    role: 'staff'
  },
  {
    email: '3hb62vmpdh@bltiwd.com',
    password: '5Speq1gvgf@illubd',
    firstName: 'Regular',
    lastName: 'User',
    role: 'user'
  }
];

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkBackendHealth() {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    log('✅ Backend is running and healthy', 'green');
    return true;
  } catch (error) {
    log('❌ Backend is not responding. Please start the backend server first.', 'red');
    log('Run: cd backend && npm run dev', 'yellow');
    return false;
  }
}

async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.data.success) {
      log(`✅ Successfully logged in as ${email}`, 'green');
      return response.data.data.accessToken;
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    log(`❌ Failed to login as ${email}: ${error.message}`, 'red');
    return null;
  }
}

async function getUsersByRole(accessToken) {
  try {
    const response = await axios.get(`${API_BASE_URL}/roles/users`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (response.data.success) {
      return response.data.data.users;
    } else {
      throw new Error('Failed to get users');
    }
  } catch (error) {
    log(`❌ Failed to get users: ${error.message}`, 'red');
    return [];
  }
}

async function assignRole(userId, role, accessToken) {
  try {
    const response = await axios.post(`${API_BASE_URL}/roles/assign`, {
      userId,
      role,
      reason: 'Test user setup'
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (response.data.success) {
      log(`✅ Assigned role ${role} to user ${userId}`, 'green');
      return true;
    } else {
      log(`⚠️  Role assignment failed for ${userId}: ${response.data.error}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`❌ Failed to assign role ${role} to ${userId}: ${error.message}`, 'red');
    return false;
  }
}

async function setupTestUsers() {
  log('🚀 Setting up test users for Role Assignment Feature', 'blue');
  log('==================================================', 'blue');
  
  // Check if backend is running
  if (!await checkBackendHealth()) {
    process.exit(1);
  }
  
  log('\n🔐 Logging in as admin to setup roles...', 'blue');
  
  // Login as the admin user
  const adminUser = VERIFIED_TEST_USERS[0];
  const accessToken = await loginUser(adminUser.email, adminUser.password);
  
  if (!accessToken) {
    log('❌ Failed to login as admin user. Cannot setup roles.', 'red');
    log('📝 Please check the credentials and try again.', 'yellow');
    return;
  }
  
  log('\n👥 Getting existing users...', 'blue');
  
  // Get all users to see what exists
  const existingUsers = await getUsersByRole(accessToken);
  
  if (existingUsers.length > 0) {
    log(`✅ Found ${existingUsers.length} existing users`, 'green');
    
    // Find our test users and assign roles
    for (const testUser of VERIFIED_TEST_USERS) {
      const existingUser = existingUsers.find(u => u.email === testUser.email);
      if (existingUser && existingUser.role !== testUser.role) {
        log(`🔄 Updating role for ${testUser.email} from ${existingUser.role} to ${testUser.role}`, 'yellow');
        await assignRole(existingUser.id, testUser.role, accessToken);
      } else if (existingUser) {
        log(`✅ User ${testUser.email} already has correct role: ${existingUser.role}`, 'green');
      } else {
        log(`⚠️  User ${testUser.email} not found in system`, 'yellow');
      }
    }
  } else {
    log('⚠️  No users found in system', 'yellow');
  }
  
  log('\n📊 Setup Summary:', 'blue');
  log(`✅ Processed ${VERIFIED_TEST_USERS.length} test users`, 'green');
  
  log('\n🔑 Test User Credentials:', 'blue');
  VERIFIED_TEST_USERS.forEach(user => {
    log(`   Email: ${user.email}`, 'yellow');
    log(`   Password: ${user.password}`, 'yellow');
    log(`   Role: ${user.role}`, 'yellow');
    log('   ---', 'reset');
  });
  
  log('\n📝 Next Steps:', 'blue');
  log('1. Start the frontend: cd frontend && npm run dev', 'yellow');
  log('2. Open http://localhost:3000 in your browser', 'yellow');
  log('3. Login with 5speq1gvgf@illubd.com / 5Speq1gvgf@illubd', 'yellow');
  log('4. Navigate to /admin/roles', 'yellow');
  log('5. Test the role assignment feature', 'yellow');
  
  log('\n✅ Test users setup complete!', 'green');
}

// Handle script execution
if (require.main === module) {
  setupTestUsers().catch(error => {
    log(`❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { setupTestUsers, VERIFIED_TEST_USERS }; 