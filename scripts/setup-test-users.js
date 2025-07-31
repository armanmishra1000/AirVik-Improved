#!/usr/bin/env node

/**
 * Test Users Setup Script for Role Assignment Feature
 * 
 * This script creates test users in the database for testing the role assignment feature.
 * Run this script after starting the backend server.
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';
const TEST_USERS = [
  {
    email: 'admin@airvik.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    email: 'staff@airvik.com',
    password: 'staff123',
    firstName: 'Staff',
    lastName: 'User',
    role: 'staff'
  },
  {
    email: 'user@airvik.com',
    password: 'user123',
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

async function createUser(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    
    if (response.data.success) {
      log(`✅ Created user: ${userData.email} (${userData.role})`, 'green');
      return response.data.data;
    } else {
      log(`⚠️  User might already exist: ${userData.email}`, 'yellow');
      return null;
    }
  } catch (error) {
    if (error.response?.status === 409) {
      log(`⚠️  User already exists: ${userData.email}`, 'yellow');
      return null;
    } else {
      log(`❌ Failed to create user ${userData.email}: ${error.message}`, 'red');
      return null;
    }
  }
}

async function verifyEmail(userId) {
  try {
    // In a real scenario, you would get the verification token from email
    // For testing, we'll simulate email verification
    const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, {
      userId: userId,
      token: 'test-verification-token' // This would normally come from email
    });
    
    if (response.data.success) {
      log(`✅ Email verified for user: ${userId}`, 'green');
      return true;
    } else {
      log(`⚠️  Email verification might not be required for testing`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`⚠️  Email verification failed (this might be expected): ${error.message}`, 'yellow');
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
  
  log('\n📋 Creating test users...', 'blue');
  
  const createdUsers = [];
  
  for (const userData of TEST_USERS) {
    const user = await createUser(userData);
    if (user) {
      createdUsers.push(user);
      
      // Try to verify email (optional for testing)
      await verifyEmail(user.id);
    }
  }
  
  log('\n📊 Setup Summary:', 'blue');
  log(`✅ Created ${createdUsers.length} test users`, 'green');
  
  if (createdUsers.length > 0) {
    log('\n🔑 Test User Credentials:', 'blue');
    TEST_USERS.forEach(user => {
      log(`   Email: ${user.email}`, 'yellow');
      log(`   Password: ${user.password}`, 'yellow');
      log(`   Role: ${user.role}`, 'yellow');
      log('   ---', 'reset');
    });
  }
  
  log('\n📝 Next Steps:', 'blue');
  log('1. Start the frontend: cd frontend && npm run dev', 'yellow');
  log('2. Open http://localhost:3000 in your browser', 'yellow');
  log('3. Login with admin@airvik.com / admin123', 'yellow');
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

module.exports = { setupTestUsers, TEST_USERS }; 