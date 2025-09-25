require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function changeTylerExtension() {
  console.log('Changing Tyler Pratt\'s extension to 625\n');

  const client = new ZoomAPIClient();
  const targetEmail = 'tyler.pratt@cloudwarriors.ai';
  const newExtension = 625;

  try {
    // Step 1: Find Tyler Pratt by email
    console.log(`1. Finding user with email: ${targetEmail}`);
    const users = await client.getPhoneUsers({ page_size: 50 }); // Get more users to find Tyler

    const tylerUser = users.users.find(user =>
      user.email && user.email.toLowerCase() === targetEmail.toLowerCase()
    );

    if (!tylerUser) {
      console.log('❌ Tyler Pratt not found in phone users. Available users:');
      users.users.forEach(user => {
        console.log(`  - ${user.name} (${user.email || 'no email'}) - Extension: ${user.extension_number || 'None'}`);
      });
      return;
    }

    console.log(`✓ Found Tyler Pratt:`);
    console.log(`  Name: ${tylerUser.name}`);
    console.log(`  Email: ${tylerUser.email}`);
    console.log(`  Current Extension: ${tylerUser.extension_number || 'None'}`);
    console.log(`  User ID: ${tylerUser.id}`);
    console.log();

    // Step 2: Check if extension 626 is available
    console.log('2. Checking if extension 626 is available...');
    const allUsers = await client.getPhoneUsers({ page_size: 100 });
    const extensionInUse = allUsers.users.find(user =>
      user.extension_number === newExtension
    );

    if (extensionInUse) {
      console.log(`❌ Extension ${newExtension} is already in use by: ${extensionInUse.name} (${extensionInUse.email || 'no email'})`);
      return;
    }

    console.log(`✓ Extension ${newExtension} is available`);
    console.log();

    // Step 3: Update Tyler's extension
    console.log(`3. Updating ${tylerUser.name}'s extension to ${newExtension}...`);

    const updateData = {
      extension_number: newExtension
    };

    const updatedUser = await client.updatePhoneUser(tylerUser.id, updateData);
    console.log('✓ Extension updated successfully!');
    console.log('Updated user details:', JSON.stringify(updatedUser, null, 2));
    console.log();

    // Step 4: Verify the change
    console.log('4. Verifying the change...');
    const verifiedUser = await client.getPhoneUser(tylerUser.id);
    console.log(`✓ Verified: ${verifiedUser.name} now has extension ${verifiedUser.extension_number}`);

    console.log('\n🎉 Tyler Pratt\'s extension has been successfully changed to 625!');

  } catch (error) {
    console.error('❌ Failed to change Tyler\'s extension:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

changeTylerExtension();