require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function checkPhoneLicenses() {
  console.log('Checking Zoom Phone license availability and account settings\n');

  const client = new ZoomAPIClient();

  try {
    // Step 1: Check account settings for phone features
    console.log('1. Checking account settings...');
    const accountSettings = await client.makeRequest('GET', '/accounts/me/settings');
    console.log('Account settings:');
    console.log(`  Zoom Phone enabled: ${accountSettings.feature?.zoom_phone || false}`);
    console.log(`  Multiple sites: ${accountSettings.multiple_sites?.enabled || false}`);
    console.log(`  BYOC enabled: ${accountSettings.byoc?.enable || false}`);
    console.log();

    // Step 2: Check phone settings
    console.log('2. Checking phone settings...');
    try {
      const phoneSettings = await client.getPhoneSettings();
      console.log('Phone settings retrieved successfully');
      console.log('Country:', phoneSettings.country);
      console.log('Multiple sites enabled:', phoneSettings.multiple_sites?.enabled);
    } catch (error) {
      console.log('❌ Could not retrieve phone settings:', error.message);
      console.log('This suggests Zoom Phone may not be enabled for the account');
    }
    console.log();

    // Step 3: Check current phone users count
    console.log('3. Checking current phone users...');
    const users = await client.getPhoneUsers({ page_size: 100 });
    console.log(`Current phone users: ${users.total_records}`);

    // Step 4: Check available phone numbers
    console.log('4. Checking available phone numbers...');
    let availableNumbers = [];
    try {
      const numbers = await client.getPhoneNumbers();
      const numbersArray = numbers.numbers || numbers.phone_numbers || [];
      availableNumbers = numbersArray.filter(num => num.status === 'available');
      console.log(`Total phone numbers: ${numbers.total_records || numbersArray.length}`);
      console.log(`Available numbers: ${availableNumbers.length}`);
    } catch (error) {
      console.log('❌ Could not retrieve phone numbers:', error.message);
    }

    // Step 5: Check if we can determine license limits
    console.log('5. License analysis:');
    console.log(`  Current users: ${users.total_records}`);
    console.log(`  Available numbers: ${availableNumbers.length}`);

    if (users.total_records >= 32) {
      console.log('⚠️  Account may be at or near license limit (32 users found)');
      console.log('💡 You may need to purchase additional Zoom Phone licenses');
    } else {
      console.log('✅ Account appears to have available licenses');
    }

    console.log('\n📋 Recommendations:');
    console.log('1. Verify Zoom Phone is enabled in your Zoom account');
    console.log('2. Check if you have available phone licenses');
    console.log('3. Ensure the user is properly enabled in the admin portal');
    console.log('4. Wait 5-10 minutes after enabling for sync');

  } catch (error) {
    console.error('❌ Failed to check phone licenses:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkPhoneLicenses();