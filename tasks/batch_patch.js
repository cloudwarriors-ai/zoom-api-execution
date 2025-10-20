require('dotenv').config();
const ZoomAPIClient = require('./zoom-api-client');
const fs = require('fs');

async function batchPatchUsers() {
  const users = require('./all_phone_users.json');
  const client = new ZoomAPIClient();
  const batchSize = 30;

  for (let i = 380; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} users)...`);

    for (const user of batch) {
      const userId = user.id;
      const data = {
        'auto_call_recording_access_members': [{
          'access_user_id': userId,
          'allow_delete': false,
          'allow_download': true
        }]
      };

      try {
        await client.makeRequest('PATCH', `/phone/users/${userId}/settings/auto_call_recording`, data);
        const log = `✓ Updated ${user.email}\n`;
        console.log(log.trim());
        fs.appendFileSync('batch_patch_log.txt', log);
      } catch (error) {
        const log = `✗ Failed ${user.email}: ${error.response?.data?.message || error.message}\n`;
        console.error(log.trim());
        fs.appendFileSync('batch_patch_log.txt', log);
      }
    }

    console.log(`Batch ${Math.floor(i / batchSize) + 1} completed. Waiting...`);
    // Wait 10 seconds between batches
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  console.log('All batches processed.');
}

batchPatchUsers().catch(console.error);