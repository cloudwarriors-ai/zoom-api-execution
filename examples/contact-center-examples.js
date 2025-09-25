require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function runContactCenterExamples() {
  console.log('Zoom Contact Center API Examples\n');

  const client = new ZoomAPIClient();

  try {
    // Example 1: List contact center queues
    console.log('1. Listing contact center queues...');
    const queues = await client.getQueues({ page_size: 5 });
    console.log(`Found ${queues.total_records} queues`);
    if (queues.queues?.length > 0) {
      console.log('First queue:', {
        queue_id: queues.queues[0].queue_id,
        name: queues.queues[0].name,
        status: queues.queues[0].status
      });
    }
    console.log();

    // Example 2: Get queue details (if queues exist)
    if (queues.queues?.length > 0) {
      console.log('2. Getting queue details...');
      const queueDetails = await client.getQueue(queues.queues[0].queue_id);
      console.log('Queue details:', JSON.stringify(queueDetails, null, 2));
      console.log();
    } else {
      console.log('2. Skipping queue details - no queues found\n');
    }

    // Example 3: Get real-time metrics
    console.log('3. Getting real-time metrics...');
    const metrics = await client.getRealTimeMetrics();
    console.log('Real-time metrics:', JSON.stringify(metrics, null, 2));
    console.log();

    // Example 4: Get contact center analytics
    console.log('4. Getting contact center analytics...');
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    const analytics = await client.getAnalytics({
      from: thirtyDaysAgo,
      to: today
    });
    console.log('Analytics response:', JSON.stringify(analytics, null, 2));
    console.log();

    // Example 5: List contacts
    console.log('5. Listing contacts...');
    const contacts = await client.getContacts({ page_size: 5 });
    console.log(`Found ${contacts.total_records || 0} contacts`);
    if (contacts.contacts?.length > 0) {
      console.log('First contact:', {
        id: contacts.contacts[0].id,
        name: contacts.contacts[0].name,
        phone: contacts.contacts[0].phone,
        email: contacts.contacts[0].email
      });
    }
    console.log();

    // Example 6: Get dispositions
    console.log('6. Getting dispositions...');
    const dispositions = await client.getDispositions();
    console.log(`Found ${dispositions.total_records || 0} dispositions`);
    if (dispositions.dispositions?.length > 0) {
      console.log('First disposition:', dispositions.dispositions[0]);
    }
    console.log();

    // Example 7: Get contact center recordings
    console.log('7. Getting contact center recordings...');
    const recordings = await client.getRecordings({ page_size: 5 });
    console.log(`Found ${recordings.total_records || 0} recordings`);
    if (recordings.recordings?.length > 0) {
      console.log('Most recent recording:', {
        id: recordings.recordings[0].id,
        duration: recordings.recordings[0].duration,
        created_at: recordings.recordings[0].created_at
      });
    }
    console.log();

    console.log('✅ All contact center API examples completed successfully!');

  } catch (error) {
    console.error('❌ Contact center API example failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

runContactCenterExamples();