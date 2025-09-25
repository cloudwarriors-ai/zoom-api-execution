require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function checkPhoneNumberDetails() {
  console.log('Checking phone number details after unassignment attempt\n');

  const client = new ZoomAPIClient();
  const phoneNumberId = '6qCz74VyQvyCq4PWSuR6Dg'; // Tyler's phone number ID

  try {
    console.log(`Getting details for phone number ID: ${phoneNumberId}`);
    const numberDetails = await client.getPhoneNumber(phoneNumberId);

    console.log('Phone number details:');
    console.log(JSON.stringify(numberDetails, null, 2));

    // Also check all phone numbers to see assignment status
    console.log('\nChecking all phone numbers...');
    const allNumbers = await client.getPhoneNumbers({ page_size: 50 });

    const tylersNumber = allNumbers.phone_numbers.find(num => num.id === phoneNumberId);
    if (tylersNumber) {
      console.log('Tyler\'s number in list:', JSON.stringify(tylersNumber, null, 2));
    } else {
      console.log('Tyler\'s number not found in the list');
    }

  } catch (error) {
    console.error('❌ Failed to check phone number details:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkPhoneNumberDetails();