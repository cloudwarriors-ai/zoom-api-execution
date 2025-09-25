require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function addAllUsersToQueue() {
  console.log('Adding all account members to call queue: Opencode-Tyler\n');

  const client = new ZoomAPIClient();
  const queueId = 'ESvaVhtHTHGcjZKrA6OyuQ'; // Opencode-Tyler queue ID
  const queueName = 'Opencode-Tyler';

  try {
    // Step 1: Verify the call queue exists
    console.log('1. Verifying call queue exists...');
    const queueDetails = await client.getCallQueue(queueId);
    console.log(`✅ Found queue: ${queueDetails.name} (ID: ${queueDetails.id})`);
    console.log();

    // Step 2: Get all phone users in the account
    console.log('2. Getting all phone users...');
    const allUsers = await client.getPhoneUsers({ page_size: 100 }); // Get up to 100 users
    console.log(`Found ${allUsers.total_records} phone users in the account`);
    console.log();

    if (allUsers.total_records === 0) {
      console.log('❌ No phone users found in the account');
      return;
    }

    // Step 3: Filter out users who might already be in the queue or are inactive
    const activeUsers = allUsers.users.filter(user => user.status === 'activate');
    console.log(`Found ${activeUsers.length} active phone users`);
    console.log();

    if (activeUsers.length === 0) {
      console.log('❌ No active phone users found');
      return;
    }

    // Step 4: Split users into batches of 10 (API limit)
    const batchSize = 10;
    const batches = [];
    for (let i = 0; i < activeUsers.length; i += batchSize) {
      batches.push(activeUsers.slice(i, i + batchSize));
    }

    console.log(`3. Splitting ${activeUsers.length} users into ${batches.length} batches of max ${batchSize} users each`);
    console.log();

    // Step 5: Add each batch to the call queue
    let totalAdded = 0;
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`4.${i + 1}. Adding batch ${i + 1}/${batches.length} (${batch.length} users)...`);

      // Prepare the payload
      const userIds = batch.map(user => ({ id: user.id }));
      const payload = {
        members: {
          users: userIds
        }
      };

      console.log(`Users in this batch: ${batch.map(u => u.name).join(', ')}`);

      try {
        await client.makeRequest('POST', `/phone/call_queues/${queueId}/members`, payload);
        console.log(`✅ Successfully added batch ${i + 1}`);
        totalAdded += batch.length;
      } catch (error) {
        console.log(`❌ Failed to add batch ${i + 1}:`, error.message);
        if (error.response) {
          console.log('Response data:', error.response.data);
        }
        // Continue with next batch even if one fails
      }

      // Small delay between batches to be respectful to the API
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log();
    console.log('5. Verifying final queue membership...');
    const finalQueueDetails = await client.getCallQueue(queueId);
    const queueMembers = await client.getCallQueueMembers(queueId);

    console.log(`✅ Call queue "${queueName}" now has ${queueMembers.total_records || 0} members`);
    console.log(`📊 Total users processed: ${activeUsers.length}`);
    console.log(`✅ Total users added: ${totalAdded}`);

    if (queueMembers.members && queueMembers.members.length > 0) {
      console.log('\n📋 Current queue members:');
      queueMembers.members.slice(0, 5).forEach((member, index) => {
        console.log(`  ${index + 1}. ${member.name} (${member.extension_number})`);
      });
      if (queueMembers.members.length > 5) {
        console.log(`  ... and ${queueMembers.members.length - 5} more members`);
      }
    }

    console.log('\n🎉 SUCCESS: All account members added to call queue!');
    console.log(`📞 Queue: ${queueName}`);
    console.log(`🆔 Queue ID: ${queueId}`);
    console.log(`👥 Total Members: ${totalAdded}`);

  } catch (error) {
    console.error('❌ Failed to add users to call queue:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

addAllUsersToQueue();