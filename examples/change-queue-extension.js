require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function changeQueueExtension() {
  console.log('Changing extension for call queue: Opencode-Tyler\n');

  const client = new ZoomAPIClient();
  const queueId = 'ESvaVhtHTHGcjZKrA6OyuQ';
  const queueName = 'Opencode-Tyler';
  const newExtension = 13245; // Using shorter extension due to length limits

  try {
    // Step 1: Get current queue details
    console.log('1. Getting current queue details...');
    const currentQueue = await client.getCallQueue(queueId);
    console.log(`Current extension: ${currentQueue.extension_number}`);
    console.log(`Queue name: ${currentQueue.name}`);
    console.log(`Queue ID: ${currentQueue.id}`);
    console.log();

    // Step 2: Check if extension is already set to the desired value
    if (currentQueue.extension_number === newExtension) {
      console.log(`✅ Extension is already set to ${newExtension}`);
      return;
    }

    // Step 3: Update the queue extension
    console.log(`2. Updating extension from ${currentQueue.extension_number} to ${newExtension}...`);

    const updatePayload = {
      extension_number: newExtension
    };

    console.log('Update payload:', JSON.stringify(updatePayload, null, 2));

    const updateResult = await client.makeRequest('PATCH', `/phone/call_queues/${queueId}`, updatePayload);
    console.log('✓ Extension update request successful');
    console.log('Response:', updateResult);
    console.log();

    // Step 4: Verify the extension change
    console.log('3. Verifying the extension change...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for change to propagate

    const updatedQueue = await client.getCallQueue(queueId);
    console.log(`New extension: ${updatedQueue.extension_number}`);

    if (updatedQueue.extension_number === newExtension) {
      console.log('\n🎉 SUCCESS: Call queue extension updated successfully!');
      console.log(`📞 Queue: ${queueName}`);
      console.log(`🆔 Queue ID: ${queueId}`);
      console.log(`📱 New Extension: ${newExtension}`);
      console.log(`📊 Status: ${updatedQueue.status}`);
    } else {
      console.log('\n❌ Extension update verification failed');
      console.log(`Expected: ${newExtension}, Got: ${updatedQueue.extension_number}`);
    }

    // Step 5: Test that the queue still appears in the general list
    console.log('\n4. Verifying queue appears in general call queues list...');
    const allQueues = await client.getCallQueues();
    const ourQueue = allQueues.call_queues?.find(q => q.id === queueId);

    if (ourQueue) {
      console.log(`✅ Queue found in general list with extension: ${ourQueue.extension_number}`);
    } else {
      console.log('❌ Queue not found in general list');
    }

  } catch (error) {
    console.error('❌ Failed to change queue extension:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);

      // Handle common error codes
      if (error.response.status === 400) {
        console.log('\n💡 Possible issues:');
        console.log('- Extension number already in use');
        console.log('- Invalid extension format');
        console.log('- Extension out of allowed range');
        console.log('- Insufficient permissions');
      } else if (error.response.status === 403) {
        console.log('\n💡 Insufficient permissions to modify call queues');
      } else if (error.response.status === 404) {
        console.log('\n💡 Call queue not found');
      }
    }
  }
}

changeQueueExtension();