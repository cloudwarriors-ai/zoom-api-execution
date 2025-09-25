require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function checkAndSetExtension() {
  console.log('Checking if Tyler Pratt is enabled for phone and setting extension 6969\n');

  const client = new ZoomAPIClient();
  const targetEmail = 'tyler.pratt+opencode2@test.cloudwarriors.ai';

  try {
    // Step 1: List all phone users and look for our user
    console.log('1. Listing all phone users...');
    const users = await client.getPhoneUsers({ page_size: 50 });
    console.log(`Found ${users.total_records} phone users`);

    const targetUser = users.users.find(user =>
      user.email && user.email.toLowerCase() === targetEmail.toLowerCase()
    );

    if (!targetUser) {
      console.log(`❌ User ${targetEmail} not found in phone users list`);
      console.log('\nAvailable phone users (first 10):');
      users.users.slice(0, 10).forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} - ${user.email} (Extension: ${user.extension_number || 'None'})`);
      });

      console.log('\n💡 The user may not be enabled for Zoom Phone yet.');
      console.log('Please ensure:');
      console.log('1. The account has available Zoom Phone licenses');
      console.log('2. The user is enabled for Zoom Phone in the admin portal');
      console.log('3. Wait a few minutes for the system to sync');
      return;
    }

    console.log(`✅ Found user in phone system:`);
    console.log(`  Name: ${targetUser.name}`);
    console.log(`  Email: ${targetUser.email}`);
    console.log(`  Current Extension: ${targetUser.extension_number || 'None'}`);
    console.log(`  User ID: ${targetUser.id}`);
    console.log();

    // Step 2: Set extension to 6969 if not already set
    if (targetUser.extension_number === '6969') {
      console.log('✅ Extension is already set to 6969!');
    } else {
      console.log('2. Setting extension to 6969...');

      const updateData = {
        extension_number: '6969'
      };

      const updatedUser = await client.updatePhoneUser(targetUser.id, updateData);
      console.log('✅ Extension updated successfully!');
      console.log(`New extension: ${updatedUser.extension_number}`);
    }

    // Step 3: Verify the change
    console.log('3. Verifying the extension...');
    const verifiedUser = await client.getPhoneUser(targetUser.id);
    console.log(`✓ Verified: ${verifiedUser.name} has extension ${verifiedUser.extension_number}`);

    console.log('\n🎉 SUCCESS: Tyler Pratt is enabled for Zoom Phone with extension 6969!');
    console.log(`📞 Extension: 6969`);
    console.log(`👤 User: ${targetUser.name}`);
    console.log(`📧 Email: ${targetUser.email}`);

  } catch (error) {
    console.error('❌ Failed to check/set extension:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkAndSetExtension();