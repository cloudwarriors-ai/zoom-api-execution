require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function enableUserPhone6969() {
  console.log('Enabling Zoom Phone for Tyler Pratt and setting extension 6969\n');

  const client = new ZoomAPIClient();
  const targetEmail = 'tyler.pratt+opencode2@test.cloudwarriors.ai';

  try {
    // Step 1: Find the user by email
    console.log(`1. Finding user with email: ${targetEmail}`);
    const users = await client.getPhoneUsers({ page_size: 50 });

    const targetUser = users.users.find(user =>
      user.email && user.email.toLowerCase() === targetEmail.toLowerCase()
    );

    if (!targetUser) {
      console.log('❌ User not found in phone users. They may need to be enabled for Zoom Phone first.');
      console.log('Checking if user exists in Zoom at all...');

      // Check if user exists in general Zoom users
      try {
        const zoomUser = await client.makeRequest('GET', `/users/${encodeURIComponent(targetEmail)}`);
        console.log('✅ User exists in Zoom but not enabled for phone');
        console.log('User details:', {
          id: zoomUser.id,
          email: zoomUser.email,
          first_name: zoomUser.first_name,
          last_name: zoomUser.last_name,
          status: zoomUser.status
        });

        console.log('\n💡 To enable Zoom Phone for this user:');
        console.log('1. Go to Zoom Admin Portal');
        console.log('2. Navigate to Phone > Users');
        console.log('3. Find the user and enable Zoom Phone');
        console.log('4. Then run this script again');
        return;
      } catch (zoomError) {
        console.log('❌ User does not exist in Zoom at all');
        console.log('Please create the user first using: npm run create-user-tyler-pratt');
        return;
      }
    }

    console.log(`✅ Found user in phone system:`);
    console.log(`  Name: ${targetUser.name}`);
    console.log(`  Email: ${targetUser.email}`);
    console.log(`  Extension: ${targetUser.extension_number || 'None'}`);
    console.log(`  User ID: ${targetUser.id}`);
    console.log();

    // Step 2: Check current extension and update if needed
    console.log('2. Checking current extension...');
    const currentExtension = targetUser.extension_number;

    if (currentExtension === '6969') {
      console.log('✅ User already has extension 6969!');
    } else {
      console.log(`Current extension: ${currentExtension || 'None'}`);
      console.log('Setting extension to 6969...');

      const updateData = {
        extension_number: '6969'
      };

      const updatedUser = await client.updatePhoneUser(targetUser.id, updateData);
      console.log('✅ Extension updated successfully!');
      console.log('Updated user details:', {
        name: updatedUser.name,
        email: updatedUser.email,
        extension_number: updatedUser.extension_number
      });
    }

    // Step 3: Get detailed user information
    console.log('3. Getting detailed user information...');
    const detailedUser = await client.getPhoneUser(targetUser.id);
    console.log('Phone user details:', JSON.stringify(detailedUser, null, 2));

    // Step 4: Check if user has phone numbers assigned
    const assignedNumbers = detailedUser.phone_numbers || [];
    console.log(`4. User has ${assignedNumbers.length} phone number(s) assigned`);

    if (assignedNumbers.length > 0) {
      console.log('Assigned numbers:');
      assignedNumbers.forEach((number, index) => {
        console.log(`  ${index + 1}. ${number.number} (${number.type || 'unknown type'})`);
      });
    } else {
      console.log('ℹ️  No phone numbers assigned. You can assign one using the phone assignment scripts.');
    }

    console.log('\n🎉 SUCCESS: User is enabled for Zoom Phone with extension 6969!');
    console.log(`👤 Name: ${targetUser.name}`);
    console.log(`📧 Email: ${targetUser.email}`);
    console.log(`📞 Extension: 6969`);
    console.log(`🆔 User ID: ${targetUser.id}`);

  } catch (error) {
    console.error('❌ Failed to enable user for phone:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

enableUserPhone6969();