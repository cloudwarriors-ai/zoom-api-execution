require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function createContactCenterInbox() {
  console.log('Creating contact center inbox: opencode-inbox\n');

  const client = new ZoomAPIClient();

  try {
    // Step 1: Check existing inboxes
    console.log('1. Checking existing inboxes...');
    const existingInboxes = await client.getInboxes();
    console.log(`Found ${existingInboxes.total_records || 0} existing inboxes`);

    if (existingInboxes.inboxes?.length > 0) {
      console.log('Existing inboxes:');
      existingInboxes.inboxes.forEach(inbox => {
        console.log(`  - ${inbox.name || inbox.inbox_name} (ID: ${inbox.inbox_id || inbox.id})`);
      });

      // Check if inbox already exists
      const existingInbox = existingInboxes.inboxes.find(i => (i.name || i.inbox_name) === 'opencode-inbox');
      if (existingInbox) {
        console.log('✅ Inbox "opencode-inbox" already exists!');
        console.log('Inbox details:', {
          id: existingInbox.inbox_id || existingInbox.id,
          name: existingInbox.name || existingInbox.inbox_name,
          status: existingInbox.status
        });
        return;
      }
    }
    console.log();

    // Step 2: Create the inbox
    console.log('2. Creating contact center inbox...');
    console.log('Inbox name: opencode-inbox');

    // Basic inbox configuration - this may need to be adjusted based on API requirements
    const inboxData = {
      inbox_name: 'opencode-inbox',
      description: 'Contact center inbox created via API',
      // Additional configuration may be required
    };

    const createResult = await client.createInbox(inboxData);
    console.log('✓ Inbox creation request successful');
    console.log('Response:', createResult);

    // Step 3: Verify the inbox was created
    console.log('3. Verifying inbox creation...');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for creation to complete

    const updatedInboxes = await client.getInboxes();
    const newInbox = updatedInboxes.inboxes?.find(i => (i.name || i.inbox_name) === 'opencode-inbox');

    if (newInbox) {
      console.log('✅ Inbox successfully created!');
      console.log('Inbox details:', {
        id: newInbox.inbox_id || newInbox.id,
        name: newInbox.name || newInbox.inbox_name,
        status: newInbox.status,
        created_at: newInbox.created_at
      });

      console.log('\n🎉 SUCCESS: Contact center inbox "opencode-inbox" created!');
      console.log(`🆔 Inbox ID: ${newInbox.inbox_id || newInbox.id}`);
      console.log(`📊 Status: ${newInbox.status}`);
    } else {
      console.log('⚠️  Inbox creation verification failed - inbox may not be visible yet');
    }

  } catch (error) {
    console.error('❌ Failed to create contact center inbox:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);

      // Handle common error codes
      if (error.response.status === 400) {
        console.log('\n💡 Possible issues:');
        console.log('- Invalid inbox configuration');
        console.log('- Missing required fields');
        console.log('- Inbox name already exists');
        console.log('- Insufficient permissions');
      } else if (error.response.status === 403) {
        console.log('\n💡 Insufficient permissions to create inboxes');
      } else if (error.response.status === 404) {
        console.log('\n💡 Contact center inboxes API not available');
      }
    }

    // Update perfectedendpoints.md with the result
    console.log('\n📝 Note: This endpoint may not be available or may require different parameters.');
    console.log('Check Zoom API documentation for correct inbox creation payload.');
  }
}

createContactCenterInbox();