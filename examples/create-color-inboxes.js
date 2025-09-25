require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function createColorInboxes() {
  console.log('Creating 10 contact center inboxes with color names\n');

  const client = new ZoomAPIClient();

  // Color names for the inboxes
  const colorNames = [
    'red', 'blue', 'green', 'yellow', 'purple',
    'orange', 'pink', 'brown', 'gray', 'black'
  ];

  try {
    // Step 1: Check existing inboxes first
    console.log('1. Checking existing inboxes...');
    const existingInboxes = await client.getInboxes();
    console.log(`Found ${existingInboxes.total_records || 0} existing inboxes\n`);

    const existingNames = new Set(
      existingInboxes.inboxes?.map(i => (i.name || i.inbox_name)) || []
    );

    // Step 2: Create inboxes for each color
    console.log('2. Creating color-named inboxes...\n');

    let createdCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < colorNames.length; i++) {
      const colorName = colorNames[i];
      const inboxName = `${colorName}-inbox`;

      console.log(`${i + 1}. Processing: ${inboxName}`);

      // Check if already exists
      if (existingNames.has(inboxName)) {
        console.log(`   ⏭️  Already exists, skipping`);
        skippedCount++;
        continue;
      }

      try {
        const inboxData = {
          inbox_name: inboxName,
          description: `Contact center inbox for ${colorName} category - created via API`
        };

        const createResult = await client.createInbox(inboxData);
        console.log(`   ✅ Created: ${createResult.inbox_name} (ID: ${createResult.inbox_id})`);
        createdCount++;

        // Small delay between creations
        if (i < colorNames.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

      } catch (error) {
        console.log(`   ❌ Failed to create ${inboxName}:`, error.message);
      }
    }

    console.log('\n3. Final verification...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const finalInboxes = await client.getInboxes();
    const colorInboxes = finalInboxes.inboxes?.filter(i =>
      colorNames.some(color => (i.name || i.inbox_name) === `${color}-inbox`)
    ) || [];

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully created: ${createdCount} inboxes`);
    console.log(`⏭️  Skipped (already existed): ${skippedCount} inboxes`);
    console.log(`📧 Total color inboxes: ${colorInboxes.length}`);
    console.log(`🏢 Total inboxes: ${finalInboxes.total_records || 0}`);

    if (colorInboxes.length > 0) {
      console.log('\n🎨 Created Color Inboxes:');
      colorInboxes.forEach((inbox, index) => {
        console.log(`${index + 1}. ${inbox.name || inbox.inbox_name} (ID: ${inbox.inbox_id || inbox.id})`);
      });
    }

    console.log('\n🎉 SUCCESS: Color inbox creation completed!');

  } catch (error) {
    console.error('❌ Failed to create color inboxes:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

createColorInboxes();