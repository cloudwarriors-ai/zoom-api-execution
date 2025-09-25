require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function checkQueueMembers() {
  console.log('Checking members of call queue: Opencode-Tyler\n');

  const client = new ZoomAPIClient();
  const queueId = 'ESvaVhtHTHGcjZKrA6OyuQ';

  try {
    // Get queue details
    console.log('1. Getting queue details...');
    const queueDetails = await client.getCallQueue(queueId);
    console.log(`Queue: ${queueDetails.name}`);
    console.log(`ID: ${queueDetails.id}`);
    console.log(`Extension: ${queueDetails.extension_number}`);
    console.log(`Status: ${queueDetails.status}`);
    console.log();

    // Get queue members
    console.log('2. Getting queue members...');
    const queueMembers = await client.getCallQueueMembers(queueId);
    console.log(`Total members: ${queueMembers.total_records || 0}`);

    if (queueMembers.members && queueMembers.members.length > 0) {
      console.log('\n📋 Queue members:');
      queueMembers.members.forEach((member, index) => {
        console.log(`  ${index + 1}. ${member.name} (${member.extension_number}) - ${member.email || 'no email'}`);
      });
    } else {
      console.log('ℹ️  No members found in the queue');
    }

    // Also check if the queue appears in the general call queues list
    console.log('\n3. Checking queue in general call queues list...');
    const allQueues = await client.getCallQueues();
    const ourQueue = allQueues.call_queues?.find(q => q.id === queueId);

    if (ourQueue) {
      console.log(`✅ Queue found in general list: ${ourQueue.name} (${ourQueue.extension_number})`);
    } else {
      console.log('❌ Queue not found in general list');
    }

    // Try to get detailed member info in a different way
    console.log('\n4. Attempting alternative member check...');
    try {
      // Some APIs might have member info in the detailed queue response
      console.log('Queue details member info:', JSON.stringify(queueDetails.members || queueDetails.member_count || 'No member info', null, 2));
    } catch (error) {
      console.log('Could not get alternative member info');
    }

  } catch (error) {
    console.error('❌ Failed to check queue members:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

checkQueueMembers();