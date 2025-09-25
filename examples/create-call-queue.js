require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function createCallQueue() {
  console.log('Creating new Zoom Phone call queue: Opencode-Tyler\n');

  const client = new ZoomAPIClient();
  const queueName = 'Opencode-Tyler';

  try {
    // Step 1: Get site information (required for call queue creation)
    console.log('1. Getting site information...');
    const sites = await client.makeRequest('GET', '/phone/sites');
    console.log(`Found ${sites.sites?.length || 0} sites`);

    if (!sites.sites || sites.sites.length === 0) {
      console.log('❌ No sites found. Cannot create call queue without a site.');
      return;
    }

    const primarySite = sites.sites[0]; // Use the first site
    console.log(`Using site: ${primarySite.name} (ID: ${primarySite.id})`);
    console.log();

    // Step 2: Check if call queue already exists
    console.log('2. Checking if call queue already exists...');
    const existingQueues = await client.getCallQueues();
    const existingQueue = existingQueues.call_queues?.find(q =>
      q.name.toLowerCase() === queueName.toLowerCase()
    );

    if (existingQueue) {
      console.log('✅ Call queue already exists!');
      console.log('Queue details:', {
        id: existingQueue.id,
        name: existingQueue.name,
        extension: existingQueue.extension_number,
        status: existingQueue.status
      });
      return;
    }

    console.log('ℹ️  Call queue does not exist, proceeding with creation...');
    console.log();

    // Step 3: Create the call queue
    console.log('3. Creating call queue...');
    console.log(`Name: ${queueName}`);
    console.log(`Site ID: ${primarySite.id}`);

    // Get an available extension number (let's try a high number to avoid conflicts)
    const availableExtension = 999100; // Use a high extension number to avoid conflicts

    const createPayload = {
      name: queueName,
      site_id: primarySite.id,
      extension_number: availableExtension
      // Removed description as it seems to cause validation issues
      // Optionally add members - for now we'll create an empty queue
      // members: {
      //   users: [{ id: 'some-user-id' }]
      // }
    };

    console.log('Payload:', JSON.stringify(createPayload, null, 2));

    const createResult = await client.makeRequest('POST', '/phone/call_queues', createPayload);
    console.log('✓ Call queue creation request successful');
    console.log('Response:', createResult);
    console.log();

    // Step 4: Verify the call queue was created
    console.log('4. Verifying call queue creation...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for creation to complete

    const updatedQueues = await client.getCallQueues();
    const newQueue = updatedQueues.call_queues?.find(q =>
      q.name.toLowerCase() === queueName.toLowerCase()
    );

    if (newQueue) {
      console.log('✅ Call queue successfully created!');
      console.log('Queue details:', {
        id: newQueue.id,
        name: newQueue.name,
        extension: newQueue.extension_number,
        status: newQueue.status,
        site: primarySite.name
      });
      console.log();

      // Step 5: Get detailed queue information
      console.log('5. Getting detailed queue information...');
      const queueDetails = await client.getCallQueue(newQueue.id);
      console.log('Complete queue configuration:', JSON.stringify(queueDetails, null, 2));

    } else {
      console.log('❌ Call queue creation verification failed');
      console.log('Queue may have been created but not yet visible');
    }

    console.log('\n🎉 SUCCESS: Call queue "Opencode-Tyler" created!');
    console.log(`📞 Extension: ${newQueue?.extension_number || 'TBD'}`);
    console.log(`🆔 Queue ID: ${newQueue?.id || 'TBD'}`);
    console.log(`📊 Status: ${newQueue?.status || 'TBD'}`);
    console.log('\n💡 Next steps:');
    console.log('1. Add members to the call queue');
    console.log('2. Configure call routing policies');
    console.log('3. Set up business hours');
    console.log('4. Assign phone numbers to the queue');

  } catch (error) {
    console.error('❌ Failed to create call queue:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);

      // Handle common error codes
      if (error.response.status === 400) {
        console.log('\n💡 Possible issues:');
        console.log('- Invalid site ID');
        console.log('- Name too long (max 32 chars)');
        console.log('- Extension number conflict');
        console.log('- Insufficient permissions');
      } else if (error.response.status === 403) {
        console.log('\n💡 Insufficient permissions to create call queues');
      }
    }
  }
}

createCallQueue();