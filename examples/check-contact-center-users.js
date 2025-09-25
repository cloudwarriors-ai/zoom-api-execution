require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function checkContactCenterUsers() {
  console.log('Checking contact center users\n');

  const client = new ZoomAPIClient();

  try {
    // Get contact center users
    console.log('1. Getting contact center users...');
    const ccUsers = await client.getContactCenterUsers({ page_size: 20 });
    console.log(`Found ${ccUsers.total_records} contact center users`);

    if (ccUsers.users?.length > 0) {
      console.log('Contact center users:');
      ccUsers.users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.display_name} (${user.user_email}) - ID: ${user.user_id}`);
      });

      // Check if Tyler is in the list
      const tylerUser = ccUsers.users.find(u => u.user_email === 'tyler.pratt+opencode2@test.cloudwarriors.ai');
      if (tylerUser) {
        console.log('\n✅ Tyler Pratt found in contact center users!');
        console.log(`User ID: ${tylerUser.user_id}`);
        console.log(`Role: ${tylerUser.role_name}`);
        console.log(`Status: ${tylerUser.status_name}`);
      } else {
        console.log('\n❌ Tyler Pratt NOT found in contact center users');
        console.log('He needs to be added as a contact center agent first.');
      }
    } else {
      console.log('No contact center users found');
    }

  } catch (error) {
    console.error('❌ Failed to check contact center users:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkContactCenterUsers();