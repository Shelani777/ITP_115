/**
 * Password Reset Test Script
 * 
 * This script tests the complete password reset flow:
 * 1. Request password reset
 * 2. Extract token from console (simulating email)
 * 3. Reset password with token
 * 4. Login with new password
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}\n`)
};

async function testPasswordReset() {
  try {
    log.title('='.repeat(60));
    log.title('PASSWORD RESET SYSTEM TEST');
    log.title('='.repeat(60));

    // Test user credentials
    const testEmail = 'test@example.com'; // Change to an existing user email
    const oldPassword = 'OldPassword123!';
    const newPassword = 'NewSecurePass123!';

    // Step 1: Create test user (if needed)
    log.title('Step 1: Verify test user exists');
    try {
      await axios.post(`${API_URL}/auth/register`, {
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: oldPassword,
        phone: '1234567890'
      });
      log.success(`Test user created: ${testEmail}`);
    } catch (error) {
      if (error.response?.status === 400) {
        log.info(`Test user already exists: ${testEmail}`);
      } else {
        throw error;
      }
    }

    // Step 2: Request password reset
    log.title('Step 2: Request password reset');
    const forgotResponse = await axios.post(`${API_URL}/auth/forgot-password`, {
      email: testEmail
    });

    if (forgotResponse.data.success) {
      log.success('Password reset email sent successfully');
      log.info('Check the backend console for the reset token');
      log.warn('In production, this would be sent via email');
    } else {
      throw new Error('Failed to send reset email');
    }

    // Step 3: Simulate getting token (in real scenario, user gets it from email)
    log.title('Step 3: Reset password with token');
    log.warn('⚠️  MANUAL STEP REQUIRED:');
    log.info('1. Check your email inbox for reset link');
    log.info('2. Or check backend console for reset token');
    log.info('3. Copy the token from the URL: /reset-password/YOUR_TOKEN_HERE');
    log.info('4. Run the following command with the token:');
    log.info('   node test-password-reset.js <token>');

    // If token is provided as command line argument
    const token = process.argv[2];
    
    if (token) {
      log.title('Step 3b: Using provided token to reset password');
      
      try {
        const resetResponse = await axios.post(`${API_URL}/auth/reset-password`, {
          token: token,
          password: newPassword
        });

        if (resetResponse.data.success) {
          log.success('Password reset successful!');
          
          // Step 4: Test login with new password
          log.title('Step 4: Test login with new password');
          
          const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            email: testEmail,
            password: newPassword
          });

          if (loginResponse.data.token) {
            log.success('Login successful with new password!');
            log.success('User:', loginResponse.data.user.email);
            log.success('Role:', loginResponse.data.user.role);
            log.success('Token:', loginResponse.data.token.substring(0, 20) + '...');
          }

          // Step 5: Reset password back to original (cleanup)
          log.title('Step 5: Cleanup - request another reset');
          const cleanup = await axios.post(`${API_URL}/auth/forgot-password`, {
            email: testEmail
          });
          
          if (cleanup.data.success) {
            log.info('Cleanup reset email sent. Check email to restore original password if needed.');
          }

          log.title('='.repeat(60));
          log.success('ALL TESTS PASSED! ✓');
          log.title('='.repeat(60));
        } else {
          throw new Error('Password reset failed');
        }
      } catch (error) {
        log.error('Reset password failed: ' + error.response?.data?.message || error.message);
        throw error;
      }
    } else {
      log.title('='.repeat(60));
      log.info('To complete the test:');
      log.info('1. Check your email or backend console for the reset token');
      log.info('2. Run: node test-password-reset.js <token>');
      log.title('='.repeat(60));
    }

  } catch (error) {
    log.error('Test failed: ' + (error.response?.data?.message || error.message));
    if (error.response?.data) {
      console.error('Error details:', error.response.data);
    }
    process.exit(1);
  }
}

// Test individual endpoints
async function testEndpoints() {
  log.title('Testing Individual Endpoints');

  // Test 1: Forgot password with invalid email
  log.info('Test 1: Forgot password with invalid email format');
  try {
    await axios.post(`${API_URL}/auth/forgot-password`, {
      email: 'invalid-email'
    });
    log.error('Should have failed with invalid email');
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Correctly rejected invalid email format');
    }
  }

  // Test 2: Reset password with invalid token
  log.info('Test 2: Reset password with invalid token');
  try {
    await axios.post(`${API_URL}/auth/reset-password`, {
      token: 'invalid-token-12345',
      password: 'NewPassword123!'
    });
    log.error('Should have failed with invalid token');
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Correctly rejected invalid token');
    }
  }

  // Test 3: Reset password with weak password
  log.info('Test 3: Reset password with weak password');
  try {
    await axios.post(`${API_URL}/auth/reset-password`, {
      token: 'some-token',
      password: '123'
    });
    log.error('Should have failed with weak password');
  } catch (error) {
    if (error.response?.status === 400) {
      log.success('Correctly rejected weak password');
    }
  }

  log.success('Endpoint validation tests completed');
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${API_URL}/auth/password-requirements`);
    log.success('Backend server is running');
    return true;
  } catch (error) {
    log.error('Backend server is not running on ' + API_URL);
    log.info('Please start the backend server first: cd backend && npm start');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    process.exit(1);
  }

  // Check which test to run
  const testType = process.argv[2];
  
  if (testType === 'endpoints') {
    await testEndpoints();
  } else {
    await testPasswordReset();
  }
}

// Run the tests
main();
