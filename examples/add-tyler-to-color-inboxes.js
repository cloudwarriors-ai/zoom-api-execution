require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function addTylerToColorInboxes() {
  console.log('Adding Tyler Pratt as access member to all color inboxes\n');

  const client = new ZoomAPIClient();
  const targetEmail = 'tyler.pratt@cloudwarriors.ai';

  // Color names for the inboxes
  const colorNames = [
    'red', 'blue', 'green', 'yellow', 'purple',
    'orange', 'pink', 'brown', 'gray', 'black'
  ];

  try {
    // Step 1: Find Tyler Pratt
    console.log('1. Finding Tyler Pratt...');
    const user = await client.makeRequest('GET', `/users/${encodeURIComponent(targetEmail)}`);
    console.log(`✅ Found Tyler Pratt: ${user.first_name} ${user.last_name} (ID: ${user.id})`);
    console.log();

    // Step 2: Get all inboxes and filter for color inboxes
    console.log('2. Finding color inboxes...');
    const allInboxes = await client.getInboxes();
    const colorInboxes = allInboxes.inboxes?.filter(inbox =>
      colorNames.some(color => (inbox.name || inbox.inbox_name) === `${color}-inbox`)
    ) || [];

    console.log(`Found ${colorInboxes.length} color inboxes`);
    if (colorInboxes.length === 0) {
      console.log('❌ No color inboxes found. Please run create-color-inboxes first.');
      return;
    }
    console.log();

    // Step 3: Add Tyler as access member to each color inbox
    console.log('3. Adding Tyler Pratt as access member to each inbox...\n');

    let successCount = 0;
    let alreadyMemberCount = 0;
    let failedCount = 0;

    for (let i = 0; i < colorInboxes.length; i++) {
      const inbox = colorInboxes[i];
      const inboxId = inbox.inbox_id || inbox.id;
      const inboxName = inbox.name || inbox.inbox_name;

      console.log(`${i + 1}. Processing: ${inboxName} (ID: ${inboxId})`);

      try {
        // Check current members first
        const currentMembers = await client.getInboxMembers(inboxId);
        const isAlreadyMember = currentMembers.members?.some(member =>
          member.user_id === user.id
        );

        if (isAlreadyMember) {
          console.log(`   ℹ️  Tyler is already an access member`);
          alreadyMemberCount++;
          continue;
        }

        // Add as access member
        const addResult = await client.addInboxMember(inboxId, user.id);
        console.log(`   ✅ Successfully added Tyler as access member`);
        successCount++;

      } catch (error) {
        console.log(`   ❌ Failed to add Tyler to ${inboxName}:`, error.message);
        failedCount++;

        if (error.response) {
          console.log(`      Status: ${error.response.status}`);
          if (error.response.data?.message) {
            console.log(`      Message: ${error.response.data.message}`);
          }
        }
      }

      // Small delay between operations
      if (i < colorInboxes.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    // Step 4: Final verification
    console.log('\n4. Final verification...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    let totalMemberships = 0;
    for (const inbox of colorInboxes) {
      try {
        const members = await client.getInboxMembers(inbox.inbox_id || inbox.id);
        const isMember = members.members?.some(member => member.user_id === user.id);
        if (isMember) {
          totalMemberships++;
        }
      } catch (error) {
        // Ignore verification errors
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Successfully added: ${successCount} inboxes`);
    console.log(`ℹ️  Already member: ${alreadyMemberCount} inboxes`);
    console.log(`❌ Failed to add: ${failedCount} inboxes`);
    console.log(`👥 Total memberships verified: ${totalMemberships}/${colorInboxes.length}`);

    if (successCount > 0 || alreadyMemberCount > 0) {
      console.log('\n🎉 SUCCESS: Tyler Pratt has been added as an access member to the color inboxes!');
      console.log(`👤 User: ${user.first_name} ${user.last_name}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`📬 Access to: ${totalMemberships} color inboxes`);
    }

  } catch (error) {
    console.error('❌ Failed to add Tyler to color inboxes:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

addTylerToColorInboxes();