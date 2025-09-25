require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function removeTylerPhoneNumber() {
  console.log('Removing phone number assigned to Tyler Pratt\n');

  const client = new ZoomAPIClient();
  const targetEmail = 'tyler.pratt@cloudwarriors.ai';

  try {
    // Step 1: Find Tyler Pratt by email
    console.log(`1. Finding user with email: ${targetEmail}`);
    const users = await client.getPhoneUsers({ page_size: 50 });

    const tylerUser = users.users.find(user =>
      user.email && user.email.toLowerCase() === targetEmail.toLowerCase()
    );

    if (!tylerUser) {
      console.log('❌ Tyler Pratt not found in phone users.');
      return;
    }

    console.log(`✓ Found Tyler Pratt:`);
    console.log(`  Name: ${tylerUser.name}`);
    console.log(`  Email: ${tylerUser.email}`);
    console.log(`  Extension: ${tylerUser.extension_number || 'None'}`);
    console.log(`  User ID: ${tylerUser.id}`);
    console.log();

    // Step 2: Get detailed user information to see assigned phone numbers
    console.log('2. Getting detailed user information...');
    const detailedUser = await client.getPhoneUser(tylerUser.id);
    console.log('Detailed user info:', JSON.stringify(detailedUser, null, 2));
    console.log();

    // Step 3: Check if user has assigned phone numbers
    // Phone numbers might be in different fields - let's check the response
    const assignedNumbers = detailedUser.phone_numbers || detailedUser.assigned_numbers || [];

    if (assignedNumbers.length === 0) {
      console.log('ℹ️  Tyler Pratt has no assigned phone numbers.');
      return;
    }

    console.log(`3. Found ${assignedNumbers.length} assigned phone number(s):`);
    assignedNumbers.forEach((number, index) => {
      console.log(`  ${index + 1}. ${number.number || number} (${number.type || 'unknown type'})`);
    });
    console.log();

    // Step 4: Remove/unassign phone numbers
    console.log('4. Attempting to remove assigned phone numbers...');

    // Try multiple approaches to unassign the phone number
    for (const number of assignedNumbers) {
      console.log(`Attempting to unassign ${number.number} (ID: ${number.id})...`);

      // Method 1: Try direct phone number update to unassign
      try {
        console.log('Method 1: Updating phone number assignment (remove assignee)...');
        await client.updatePhoneNumber(number.id, {
          assignee: null
        });
        console.log(`✓ Successfully unassigned ${number.number} via direct update`);
        continue;
      } catch (error1) {
        console.log('Method 1 failed:', error1.message);

        // Try alternative payload
        try {
          console.log('Method 1b: Trying alternative unassignment payload...');
          await client.updatePhoneNumber(number.id, {
            assignee: {}
          });
          console.log(`✓ Successfully unassigned ${number.number} via alternative payload`);
          continue;
        } catch (error1b) {
          console.log('Method 1b also failed:', error1b.message);
        }
      }

      // Method 2: Try unassign endpoint
      try {
        console.log('Method 2: Using unassign endpoint...');
        await client.unassignPhoneNumber(number.id);
        console.log(`✓ Successfully unassigned ${number.number} via unassign endpoint`);
        continue;
      } catch (error2) {
        console.log('Method 2 failed:', error2.message);
      }

      // Method 3: Try updating user with empty phone_numbers array
      try {
        console.log('Method 3: Updating user with empty phone numbers...');
        const updateData = {
          phone_numbers: []
        };
        await client.updatePhoneUser(tylerUser.id, updateData);
        console.log('✓ Phone numbers removed via user update!');
        break; // If this works, no need to continue with other numbers
      } catch (error3) {
        console.log('❌ All methods failed for', number.number);
        console.log('Method 3 error:', error3.message);
      }
    }

    // Step 5: Verify the change
    console.log('5. Verifying the changes...');
    const verifiedUser = await client.getPhoneUser(tylerUser.id);
    const remainingNumbers = verifiedUser.phone_numbers || verifiedUser.assigned_numbers || [];

    if (remainingNumbers.length === 0) {
      console.log('✅ All phone numbers successfully removed from Tyler Pratt!');
    } else {
      console.log(`⚠️  ${remainingNumbers.length} phone number(s) still assigned:`);
      remainingNumbers.forEach(number => {
        console.log(`  - ${number.number || number}`);
      });
    }

  } catch (error) {
    console.error('❌ Failed to remove Tyler\'s phone number:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

removeTylerPhoneNumber();