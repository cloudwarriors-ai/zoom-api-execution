require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function testUserPhoneNumberEndpoint() {
  console.log('Testing DELETE /phone/users/{userId}/phone_numbers/{phoneNumberId} endpoint\n');

  const client = new ZoomAPIClient();
  const userId = 'vBCwaIlxSQWTWXCaatO6-g'; // Tyler Pratt
  const phoneNumberId = '6qCz74VyQvyCq4PWSuR6Dg'; // +17205008701

  try {
    // Check current status
    console.log('1. Current phone number assignment status:');
    const phoneDetails = await client.getPhoneNumber(phoneNumberId);
    console.log('Assignee:', phoneDetails.assignee?.name || 'None');
    console.log('Phone Number ID:', phoneNumberId);
    console.log('User ID:', userId);
    console.log();

    // Test the suggested endpoint
    console.log('2. Attempting DELETE /phone/users/{userId}/phone_numbers/{phoneNumberId}...');
    console.log(`Endpoint: DELETE /phone/users/${userId}/phone_numbers/${phoneNumberId}`);

    try {
      const result = await client.unassignPhoneNumberFromUserById(userId, phoneNumberId);
      console.log('✓ DELETE request succeeded!');
      console.log('Response:', result);
    } catch (error) {
      console.log('❌ DELETE request failed:', error.message);
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Response data:', error.response.data);
      }
      return;
    }

    // Wait a moment for the change to propagate
    console.log('3. Waiting 2 seconds for change to propagate...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify the change
    console.log('4. Verifying phone number assignment...');
    const updatedDetails = await client.getPhoneNumber(phoneNumberId);
    console.log('New assignee:', updatedDetails.assignee?.name || 'None');
    console.log('Status:', updatedDetails.status);

    if (!updatedDetails.assignee || !updatedDetails.assignee.id) {
      console.log('\n🎉 SUCCESS: Phone number has been unassigned from Tyler Pratt!');
      console.log('✅ The endpoint DELETE /phone/users/{userId}/phone_numbers/{phoneNumberId} works!');
    } else if (updatedDetails.assignee.name !== 'Tyler Pratt') {
      console.log('\n✅ SUCCESS: Phone number has been unassigned from Tyler Pratt!');
      console.log('(Assigned to:', updatedDetails.assignee.name + ')');
    } else {
      console.log('\n❌ Phone number is still assigned to Tyler Pratt');
    }

    // Also check user's phone numbers
    console.log('5. Checking user\'s phone numbers...');
    const userDetails = await client.getPhoneUser(userId);
    const userPhoneNumbers = userDetails.phone_numbers || [];
    console.log(`User has ${userPhoneNumbers.length} phone numbers assigned`);

    if (userPhoneNumbers.length === 0) {
      console.log('✅ User has no phone numbers assigned');
    } else {
      console.log('User\'s phone numbers:', userPhoneNumbers.map(pn => pn.number));
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testUserPhoneNumberEndpoint();