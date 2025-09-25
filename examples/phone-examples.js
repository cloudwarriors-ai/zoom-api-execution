require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function runPhoneExamples() {
  console.log('Zoom Phone API Examples\n');

  const client = new ZoomAPIClient();

  try {
    // Example 1: List phone users
    console.log('1. Listing phone users...');
    const users = await client.getPhoneUsers({ page_size: 5 });
    console.log(`Found ${users.total_records} phone users`);
    if (users.users?.length > 0) {
      console.log('First user:', {
        id: users.users[0].id,
        name: users.users[0].name,
        extension: users.users[0].extension_number,
        status: users.users[0].status
      });
    }
    console.log();

    // Example 2: List phone numbers
    console.log('2. Listing phone numbers...');
    const numbers = await client.getPhoneNumbers({ page_size: 5 });
    console.log(`Found ${numbers.total_records} phone numbers`);
    if (numbers.phone_numbers?.length > 0) {
      console.log('First number:', {
        id: numbers.phone_numbers[0].id,
        number: numbers.phone_numbers[0].number,
        status: numbers.phone_numbers[0].status
      });
    }
    console.log();

    // Example 3: Get call queues
    console.log('3. Getting call queues...');
    const queues = await client.getCallQueues({ page_size: 5 });
    console.log(`Found ${queues.total_records} call queues`);
    if (queues.call_queues?.length > 0) {
      console.log('First queue:', {
        id: queues.call_queues[0].id,
        name: queues.call_queues[0].name,
        extension: queues.call_queues[0].extension_number,
        status: queues.call_queues[0].status
      });
    }
    console.log();

    // Example 4: Get call logs (recent calls)
    console.log('4. Getting recent call logs...');
    const callLogs = await client.getCallLogs({
      page_size: 5,
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Last 7 days
    });
    console.log(`Found ${callLogs.total_records} call logs`);
    if (callLogs.call_logs?.length > 0) {
      console.log('Most recent call:', {
        id: callLogs.call_logs[0].id,
        caller: callLogs.call_logs[0].caller_number,
        callee: callLogs.call_logs[0].callee_number,
        duration: callLogs.call_logs[0].duration,
        date_time: callLogs.call_logs[0].date_time
      });
    }
    console.log();

    // Example 5: Get phone settings
    console.log('5. Getting phone settings...');
    try {
      const settings = await client.getPhoneSettings();
      console.log('Phone settings:', JSON.stringify(settings, null, 2));
    } catch (error) {
      console.log('Phone settings not accessible or not configured');
    }
    console.log();

    // Example 6: Get call queue members (if queues exist)
    if (queues.call_queues?.length > 0) {
      console.log('6. Getting call queue members...');
      try {
        const members = await client.getCallQueueMembers(queues.call_queues[0].id);
        console.log(`Queue has ${members.total_records || 0} members`);
        if (members.members?.length > 0) {
          console.log('First member:', {
            id: members.members[0].id,
            name: members.members[0].name,
            extension: members.members[0].extension_number
          });
        }
      } catch (error) {
        console.log('Could not get queue members:', error.message);
      }
    } else {
      console.log('6. Skipping queue members - no queues found');
    }
    console.log();

    // Example 7: Get detailed call log (if call logs exist)
    if (callLogs.call_logs?.length > 0) {
      console.log('7. Getting detailed call log...');
      try {
        const detailedLog = await client.getCallLog(callLogs.call_logs[0].id);
        console.log('Detailed call log:', JSON.stringify(detailedLog, null, 2));
      } catch (error) {
        console.log('Could not get detailed call log:', error.message);
      }
    } else {
      console.log('7. Skipping detailed call log - no call logs found');
    }
    console.log();

    console.log('✅ All phone API examples completed successfully!');

  } catch (error) {
    console.error('❌ Phone API example failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

runPhoneExamples();