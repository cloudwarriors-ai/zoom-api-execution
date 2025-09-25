require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function testAuthentication() {
  console.log('Testing Zoom API Authentication...\n');

  const client = new ZoomAPIClient();

  try {
    // Test token generation
    console.log('1. Generating access token...');
    const token = await client.getAccessToken();
    console.log('✓ Access token generated successfully');
    console.log(`Token preview: ${token.substring(0, 50)}...\n`);

    // Test basic API call - get user info
    console.log('2. Testing basic API call (get current user)...');
    const userInfo = await client.makeRequest('GET', '/users/me');
    console.log('✓ API call successful');
    console.log(`User: ${userInfo.first_name} ${userInfo.last_name} (${userInfo.email})\n`);

    // Test Phone API access
    console.log('3. Testing Phone API access...');
    const phoneUsers = await client.getPhoneUsers({ page_size: 1 });
    console.log('✓ Phone API accessible');
    console.log(`Found ${phoneUsers.total_records} phone users\n`);

    // Test Contact Center API access
    console.log('4. Testing Contact Center API access...');
    const ccQueues = await client.getQueues();
    console.log('✓ Contact Center API accessible');
    console.log(`Found ${ccQueues.total_records} contact center queues\n`);

    console.log('🎉 All authentication tests passed!');

  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAuthentication();