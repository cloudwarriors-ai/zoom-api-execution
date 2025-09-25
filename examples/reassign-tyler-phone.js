require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function reassignTylerPhoneNumber() {
  console.log('Reassigning phone number to Tyler Pratt\n');

  const client = new ZoomAPIClient();
  const userId = 'vBCwaIlxSQWTWXCaatO6-g'; // Tyler Pratt
  const phoneNumberId = '6qCz74VyQvyCq4PWSuR6Dg'; // +17205008701

  try {
    // Step 1: Check current user status
    console.log('1. Checking Tyler\'s current phone number assignments...');
    const userDetails = await client.getPhoneUser(userId);
    console.log('Current phone numbers assigned to Tyler:', userDetails.phone_numbers?.length || 0);

    // Step 2: Check if the phone number is available
    console.log('2. Checking phone number availability...');
    const phoneDetails = await client.getPhoneNumber(phoneNumberId);
    console.log('Phone number status:', phoneDetails.status);
    console.log('Current assignee:', phoneDetails.assignee?.name || 'None');

    if (phoneDetails.assignee && phoneDetails.assignee.id === userId) {
      console.log('✅ Phone number is already assigned to Tyler Pratt!');
      return;
    }

    if (phoneDetails.assignee && phoneDetails.assignee.id !== userId) {
      console.log(`❌ Phone number is currently assigned to: ${phoneDetails.assignee.name}`);
      console.log('Cannot reassign - number is already assigned to another user');
      return;
    }

    // Step 3: Assign the phone number to Tyler
    console.log('3. Assigning phone number to Tyler...');
    console.log(`User ID: ${userId}`);
    console.log(`Phone Number ID: ${phoneNumberId}`);

    // Based on the API docs, we need to send phone_numbers array
    const assignResult = await client.makeRequest('POST', `/phone/users/${userId}/phone_numbers`, {
      phone_numbers: [{
        id: phoneNumberId
      }]
    });

    console.log('✓ Assignment request successful');
    console.log('Response:', assignResult);

    // Step 4: Verify the assignment
    console.log('4. Verifying the assignment...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for propagation

    const updatedPhoneDetails = await client.getPhoneNumber(phoneNumberId);
    const updatedUserDetails = await client.getPhoneUser(userId);

    console.log('Phone number assignee:', updatedPhoneDetails.assignee?.name || 'None');
    console.log('User phone numbers count:', updatedUserDetails.phone_numbers?.length || 0);

    if (updatedPhoneDetails.assignee && updatedPhoneDetails.assignee.id === userId) {
      console.log('\n🎉 SUCCESS: Phone number has been reassigned to Tyler Pratt!');
      console.log(`📞 Number: +17205008701`);
      console.log(`👤 User: Tyler Pratt`);
      console.log(`🆔 User ID: ${userId}`);
    } else {
      console.log('\n❌ Assignment verification failed');
      console.log('Phone number may still be unassigned or assigned elsewhere');
    }

  } catch (error) {
    console.error('❌ Failed to reassign phone number:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

reassignTylerPhoneNumber();