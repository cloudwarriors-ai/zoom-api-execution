require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function createUserTylerPratt() {
  console.log('Creating new Zoom user: tyler.pratt+opencode2@test.cloudwarriors.ai\n');

  const client = new ZoomAPIClient();
  const userEmail = 'tyler.pratt+opencode2@test.cloudwarriors.ai';

  try {
    // Step 1: Check if user already exists
    console.log('1. Checking if user already exists...');
    try {
      const existingUser = await client.makeRequest('GET', `/users/${encodeURIComponent(userEmail)}`);
      console.log('✅ User already exists!');
      console.log('User details:', {
        id: existingUser.id,
        email: existingUser.email,
        first_name: existingUser.first_name,
        last_name: existingUser.last_name,
        status: existingUser.status
      });
      return;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('ℹ️  User does not exist, proceeding with creation...');
      } else {
        throw error;
      }
    }

    // Step 2: Create the new user
    console.log('2. Creating new Zoom user...');
    console.log(`Email: ${userEmail}`);
    console.log('Name: Tyler Pratt');
    console.log('Type: Basic (1)');

    const createPayload = {
      action: 'create',
      user_info: {
        email: userEmail,
        type: 1, // Basic user
        first_name: 'Tyler',
        last_name: 'Pratt',
        password: 'TempPass123!' // This will be temporary and user will need to change it
      }
    };

    const createResult = await client.makeRequest('POST', '/users', createPayload);
    console.log('✓ User creation request successful');
    console.log('Response:', createResult);

    // Step 3: Verify the user was created
    console.log('3. Verifying user creation...');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for creation to complete

    const newUser = await client.makeRequest('GET', `/users/${encodeURIComponent(userEmail)}`);
    console.log('✅ User successfully created!');
    console.log('User details:', {
      id: newUser.id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      status: newUser.status,
      created_at: newUser.created_at
    });

    // Step 4: Enable Zoom Phone for the user (optional)
    console.log('4. Checking if Zoom Phone can be enabled...');
    try {
      // First check if the account has Zoom Phone licenses available
      const accountSettings = await client.makeRequest('GET', '/accounts/me/settings');
      console.log('Account has Zoom Phone:', accountSettings.feature?.zoom_phone || false);

      if (accountSettings.feature?.zoom_phone) {
        console.log('Zoom Phone is available. You can manually enable it for this user in the Zoom Admin Portal.');
      }
    } catch (error) {
      console.log('Could not check Zoom Phone availability:', error.message);
    }

    console.log('\n🎉 SUCCESS: New Zoom user created!');
    console.log(`📧 Email: ${userEmail}`);
    console.log(`🆔 User ID: ${newUser.id}`);
    console.log(`📊 Status: ${newUser.status}`);
    console.log('\n📝 Next steps:');
    console.log('1. User will receive an activation email');
    console.log('2. User needs to set up their password');
    console.log('3. Optionally enable Zoom Phone license in Admin Portal');

  } catch (error) {
    console.error('❌ Failed to create user:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);

      // Handle common error codes
      if (error.response.status === 400) {
        console.log('\n💡 Possible issues:');
        console.log('- Email format invalid');
        console.log('- User type not supported');
        console.log('- Account limits reached');
      } else if (error.response.status === 409) {
        console.log('\n💡 User already exists with this email');
      } else if (error.response.status === 403) {
        console.log('\n💡 Insufficient permissions to create users');
      }
    }
  }
}

createUserTylerPratt();