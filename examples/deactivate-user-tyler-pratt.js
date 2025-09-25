require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function deactivateUserTylerPratt() {
  console.log('Deactivating Zoom user: tyler.pratt+opencode2@test.cloudwarriors.ai\n');

  const client = new ZoomAPIClient();
  const userEmail = 'tyler.pratt+opencode2@test.cloudwarriors.ai';

  try {
    // Step 1: Get user details
    console.log('1. Finding user...');
    const user = await client.makeRequest('GET', `/users/${encodeURIComponent(userEmail)}`);
    console.log('✅ Found user:', {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      status: user.status
    });
    console.log();

    // Step 2: Check if user is already inactive
    if (user.status === 'inactive') {
      console.log('ℹ️  User is already inactive');
      return;
    }

    // Step 3: Deactivate the user
    console.log('2. Deactivating user...');
    console.log(`User ID: ${user.id}`);
    console.log(`Current status: ${user.status}`);

    const deactivateResult = await client.makeRequest('PUT', `/users/${user.id}/status`, {
      action: 'deactivate'
    });

    console.log('✓ Deactivation request successful');
    console.log('Response:', deactivateResult);

    // Step 4: Verify deactivation
    console.log('3. Verifying deactivation...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for sync

    const updatedUser = await client.makeRequest('GET', `/users/${encodeURIComponent(userEmail)}`);
    console.log(`✓ Verified: User status is now ${updatedUser.status}`);

    if (updatedUser.status === 'inactive') {
      console.log('\n🎉 SUCCESS: User deactivated successfully!');
      console.log(`👤 Name: ${user.first_name} ${user.last_name}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🆔 User ID: ${user.id}`);
      console.log(`📊 Status: ${updatedUser.status}`);

      console.log('\n💡 Note: Deactivated users:');
      console.log('- Cannot sign in to Zoom');
      console.log('- Lose access to meetings, phone, etc.');
      console.log('- Can be reactivated later if needed');
      console.log('- Phone license is freed up');
    } else {
      console.log('\n⚠️  Deactivation may not have taken effect yet');
    }

  } catch (error) {
    console.error('❌ Failed to deactivate user:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);

      // Handle common error codes
      if (error.response.status === 404) {
        console.log('\n💡 User not found');
      } else if (error.response.status === 403) {
        console.log('\n💡 Insufficient permissions to deactivate users');
      } else if (error.response.status === 400) {
        console.log('\n💡 Invalid request - user may already be deactivated');
      }
    }
  }
}

deactivateUserTylerPratt();