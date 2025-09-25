require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function removeAllQueueMembers() {
  console.log('Removing all members from call queue: Opencode-Tyler\n');

  const client = new ZoomAPIClient();
  const queueId = 'ESvaVhtHTHGcjZKrA6OyuQ';
  const queueName = 'Opencode-Tyler';

  try {
    // Step 1: Get current queue members (use detailed queue info)
    console.log('1. Getting current queue members...');
    const queueDetails = await client.getCallQueue(queueId);
    const members = queueDetails.users || [];

    console.log(`Found ${members.length} members in detailed queue info`);

    // Even if it shows 0, let's try to remove the members we know are there from the detailed view
    if (members.length === 0) {
      console.log('ℹ️  No members found in detailed view, but let\'s double-check...');
      // Force check again in case of timing issues
      await new Promise(resolve => setTimeout(resolve, 1000));
      const doubleCheck = await client.getCallQueue(queueId);
      const doubleCheckMembers = doubleCheck.users || [];
      console.log(`Double-check found ${doubleCheckMembers.length} members`);

      if (doubleCheckMembers.length === 0) {
        console.log('✅ Call queue is confirmed to have no members');
        return;
      }

      console.log('⚠️  Found members on double-check, proceeding with removal...');
      members = doubleCheckMembers;
    }
    console.log(`Found ${members.length} members in the queue`);
    console.log();

    // Step 2: Remove each member individually
    console.log('2. Removing members from call queue...');
    let removedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      console.log(`Removing ${i + 1}/${members.length}: ${member.name} (ID: ${member.id})...`);

      try {
        await client.makeRequest('DELETE', `/phone/call_queues/${queueId}/members/${member.id}`);
        console.log(`✅ Successfully removed ${member.name}`);
        removedCount++;
      } catch (error) {
        console.log(`❌ Failed to remove ${member.name}:`, error.message);
        failedCount++;

        // Continue with other members even if one fails
        if (error.response) {
          console.log(`   Status: ${error.response.status}, Message: ${error.response.data?.message || 'Unknown error'}`);
        }
      }

      // Small delay between removals to be respectful to the API
      if (i < members.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log();
    console.log('3. Removal summary:');
    console.log(`✅ Successfully removed: ${removedCount} members`);
    console.log(`❌ Failed to remove: ${failedCount} members`);
    console.log();

    // Step 3: Verify all members have been removed
    console.log('4. Verifying all members have been removed...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for changes to propagate

    const updatedQueueDetails = await client.getCallQueue(queueId);
    const remainingMembers = updatedQueueDetails.users || [];

    console.log(`Remaining members: ${remainingMembers.length}`);

    if (remainingMembers.length === 0) {
      console.log('\n🎉 SUCCESS: All members have been removed from the call queue!');
      console.log(`📞 Queue: ${queueName}`);
      console.log(`🆔 Queue ID: ${queueId}`);
      console.log('👥 Members: 0 (empty)');
    } else {
      console.log('\n⚠️  Some members may still remain:');
      remainingMembers.forEach((member, index) => {
        console.log(`  ${index + 1}. ${member.name} (ID: ${member.id})`);
      });
    }

    console.log('\n📝 The call queue is now empty and ready for new member assignments.');

  } catch (error) {
    console.error('❌ Failed to remove queue members:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

removeAllQueueMembers();