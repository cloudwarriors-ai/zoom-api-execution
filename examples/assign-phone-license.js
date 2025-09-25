require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function assignPhoneLicense() {
  console.log('Assigning Zoom Phone Basic license to Tyler Pratt\n');

  const client = new ZoomAPIClient();
  const userEmail = 'tyler.pratt+opencode2@test.cloudwarriors.ai';

  try {
    // Step 1: Get the user ID
    console.log(`1. Finding user: ${userEmail}`);
    const user = await client.makeRequest('GET', `/users/${encodeURIComponent(userEmail)}`);
    console.log(`✅ Found user: ${user.first_name} ${user.last_name} (ID: ${user.id})`);
    console.log();

    // Step 2: Check current user settings and licenses
    console.log('2. Checking current user settings...');
    const userSettings = await client.makeRequest('GET', `/users/${user.id}/settings`);
    console.log('Current settings:');
    console.log(`  Type: ${userSettings.type}`);
    console.log(`  Feature:`, userSettings.feature);
    console.log();

    // Step 3: Update user to enable Zoom Phone
    console.log('3. Enabling Zoom Phone license...');
    const updateData = {
      feature: {
        zoom_phone: true
      }
    };

    const updatedSettings = await client.makeRequest('PATCH', `/users/${user.id}/settings`, updateData);
    console.log('✅ Phone license assigned successfully!');
    console.log('Updated settings:', updatedSettings);
    console.log();

    // Step 4: Verify the license assignment
    console.log('4. Verifying license assignment...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for sync

    const verifiedSettings = await client.makeRequest('GET', `/users/${user.id}/settings`);
    console.log(`Zoom Phone enabled: ${verifiedSettings.feature?.zoom_phone || false}`);

    if (verifiedSettings.feature?.zoom_phone) {
      console.log('\n🎉 SUCCESS: Zoom Phone Basic license assigned to Tyler Pratt!');
      console.log(`👤 User: ${user.first_name} ${user.last_name}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🆔 User ID: ${user.id}`);
      console.log(`📞 License: Zoom Phone Basic`);

      console.log('\n💡 Next steps:');
      console.log('1. Wait 5-10 minutes for the system to sync');
      console.log('2. Run: npm run check-and-set-extension');
      console.log('3. The user should now appear in phone users and you can set extension 6969');
    } else {
      console.log('\n❌ License assignment verification failed');
      console.log('The license may not have been applied correctly');
    }

  } catch (error) {
    console.error('❌ Failed to assign phone license:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);

      // Handle common error codes
      if (error.response.status === 400) {
        console.log('\n💡 Possible issues:');
        console.log('- No available Zoom Phone licenses');
        console.log('- User type not compatible with phone');
        console.log('- Account restrictions');
      } else if (error.response.status === 403) {
        console.log('\n💡 Insufficient permissions to manage licenses');
      }
    }
  }
}

assignPhoneLicense();