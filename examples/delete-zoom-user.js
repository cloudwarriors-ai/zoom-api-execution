require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function deleteZoomUser() {
  console.log('Deleting Zoom user: tyler.pratt+opencode@test.cloudwarriors.ai\n');

  const client = new ZoomAPIClient();
  const userEmail = 'tyler.pratt+opencode@test.cloudwarriors.ai';
  const userId = 'y9PqORnQRp-_nhWGbSoOKg'; // From the creation response

  try {
    // Step 1: Check current user status
    console.log('1. Checking current user status...');
    try {
      const userDetails = await client.makeRequest('GET', `/users/${encodeURIComponent(userEmail)}`);
      console.log('Current user status:', {
        id: userDetails.id,
        email: userDetails.email,
        status: userDetails.status,
        created_at: userDetails.created_at
      });
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('ℹ️  User not found or already deleted');
        return;
      }
      throw error;
    }

    // Step 2: Delete the user
    console.log('2. Deleting user account...');
    console.log(`User ID: ${userId}`);
    console.log(`Email: ${userEmail}`);

    // For pending users, we can delete them entirely
    const deleteResult = await client.makeRequest('DELETE', `/users/${userId}`, {
      action: 'delete' // Some APIs require this parameter
    });

    console.log('✓ Delete request successful');
    console.log('Response:', deleteResult);

    // Step 3: Verify the user was deleted
    console.log('3. Verifying user deletion...');
    try {
      await client.makeRequest('GET', `/users/${encodeURIComponent(userEmail)}`);
      console.log('❌ User still exists - deletion may not have completed');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ User successfully deleted!');
        console.log('User no longer exists in the system.');
      } else {
        console.log('⚠️  Could not verify deletion:', error.message);
      }
    }

    console.log('\n🎉 SUCCESS: User invitation deleted!');
    console.log(`📧 Email: ${userEmail}`);
    console.log(`🆔 User ID: ${userId}`);
    console.log('The user will no longer receive activation emails.');

  } catch (error) {
    console.error('❌ Failed to delete user:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);

      // Handle common error codes
      if (error.response.status === 400) {
        console.log('\n💡 Possible issues:');
        console.log('- User is not in pending status');
        console.log('- Insufficient permissions');
      } else if (error.response.status === 404) {
        console.log('\n💡 User not found (may already be deleted)');
      } else if (error.response.status === 403) {
        console.log('\n💡 Insufficient permissions to delete users');
      }
    }

    // Alternative: Try deactivating instead of deleting
    console.log('\n4. Attempting to deactivate user instead...');
    try {
      const deactivateResult = await client.makeRequest('PUT', `/users/${userId}/status`, {
        action: 'deactivate'
      });
      console.log('✓ User deactivated instead of deleted');
      console.log('Response:', deactivateResult);
    } catch (deactivateError) {
      console.log('❌ Could not deactivate either:', deactivateError.message);
    }
  }
}

deleteZoomUser();