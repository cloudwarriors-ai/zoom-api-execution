require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function deleteColorInboxes() {
  console.log('Deleting all color inboxes\n');

  const client = new ZoomAPIClient();
  const colorNames = [
    'red', 'blue', 'green', 'yellow', 'purple',
    'orange', 'pink', 'brown', 'gray', 'black'
  ];

  try {
    // Step 1: Get all inboxes and filter for color inboxes
    console.log('1. Finding color inboxes...');
    const allInboxes = await client.getInboxes();
    const colorInboxes = allInboxes.inboxes?.filter(inbox =>
      colorNames.some(color => (inbox.name || inbox.inbox_name) === `${color}-inbox`)
    ) || [];

    console.log(`Found ${colorInboxes.length} color inboxes to delete`);
    if (colorInboxes.length === 0) {
      console.log('ℹ️  No color inboxes found to delete.');
      return;
    }
    console.log();

    // Step 2: Delete each color inbox
    console.log('2. Deleting color inboxes...\n');

    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < colorInboxes.length; i++) {
      const inbox = colorInboxes[i];
      const inboxId = inbox.inbox_id || inbox.id;
      const inboxName = inbox.name || inbox.inbox_name;

      console.log(`${i + 1}. Deleting: ${inboxName} (ID: ${inboxId})`);

      try {
        await client.deleteInbox(inboxId, { delete_all_messages_and_inboxes: true });
        console.log(`   ✅ Successfully deleted ${inboxName}`);
        successCount++;

      } catch (error) {
        console.log(`   ❌ Failed to delete ${inboxName}:`, error.message);
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

    // Step 3: Final verification
    console.log('\n3. Final verification...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const remainingInboxes = await client.getInboxes();
    const remainingColorInboxes = remainingInboxes.inboxes?.filter(inbox =>
      colorNames.some(color => (inbox.name || inbox.inbox_name) === `${color}-inbox`)
    ) || [];

    console.log('\n📊 Summary:');
    console.log(`✅ Successfully deleted: ${successCount} inboxes`);
    console.log(`❌ Failed to delete: ${failedCount} inboxes`);
    console.log(`📁 Remaining color inboxes: ${remainingColorInboxes.length}`);

    if (remainingColorInboxes.length === 0 && successCount > 0) {
      console.log('\n🎉 SUCCESS: All color inboxes have been deleted!');
    } else if (remainingColorInboxes.length > 0) {
      console.log('\n⚠️  WARNING: Some color inboxes may still exist');
      remainingColorInboxes.forEach(inbox => {
        console.log(`   - ${inbox.name || inbox.inbox_name} (ID: ${inbox.inbox_id || inbox.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Failed to delete color inboxes:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

deleteColorInboxes();