require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function changeUserExtension() {
  console.log('Change User Extension Example\n');

  const client = new ZoomAPIClient();

  try {
    // Step 1: List phone users to see current extensions
    console.log('1. Listing phone users...');
    const users = await client.getPhoneUsers({ page_size: 10 });
    console.log(`Found ${users.total_records} phone users\n`);

    // Display users with their current extensions
    console.log('Current users and extensions:');
    users.users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} - Extension: ${user.extension_number || 'None'} (ID: ${user.id})`);
    });
    console.log();

    // Step 2: Choose a user to update (using the first user as example)
    if (users.users.length === 0) {
      console.log('No users found to update.');
      return;
    }

    const userToUpdate = users.users[0];
    console.log(`2. Updating extension for: ${userToUpdate.name}`);
    console.log(`   Current extension: ${userToUpdate.extension_number || 'None'}`);
    console.log(`   User ID: ${userToUpdate.id}\n`);

    // Step 3: Generate a new extension (current + 1, or 1000 if none)
    const currentExtension = userToUpdate.extension_number || 999;
    const newExtension = currentExtension + 1;

    console.log(`3. Changing extension from ${currentExtension} to ${newExtension}...\n`);

    // Step 4: Update the user's extension
    const updateData = {
      extension_number: newExtension
    };

    const updatedUser = await client.updatePhoneUser(userToUpdate.id, updateData);
    console.log('✓ Extension updated successfully!');
    console.log('Updated user details:', JSON.stringify(updatedUser, null, 2));
    console.log();

    // Step 5: Verify the change by fetching the user again
    console.log('4. Verifying the change...');
    const verifiedUser = await client.getPhoneUser(userToUpdate.id);
    console.log(`✓ Verified: ${verifiedUser.name} now has extension ${verifiedUser.extension_number}`);

  } catch (error) {
    console.error('❌ Failed to change user extension:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Helper function to change a specific user's extension
async function changeSpecificUserExtension(userId, newExtension) {
  const client = new ZoomAPIClient();

  try {
    console.log(`Changing extension for user ${userId} to ${newExtension}...`);

    const updateData = {
      extension_number: newExtension
    };

    const result = await client.updatePhoneUser(userId, updateData);
    console.log('✓ Extension updated successfully!');
    return result;
  } catch (error) {
    console.error('❌ Failed to update extension:', error.message);
    throw error;
  }
}

// Export functions for use in other scripts
module.exports = {
  changeUserExtension,
  changeSpecificUserExtension
};

// Run the example if this file is executed directly
if (require.main === module) {
  changeUserExtension();
}