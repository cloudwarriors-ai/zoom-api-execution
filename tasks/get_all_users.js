require('dotenv').config();
const ZoomAPIClient = require('./zoom-api-client');

async function getAllPhoneUsers() {
  const client = new ZoomAPIClient();
  let allUsers = [];
  let nextPageToken = null;

  do {
    const params = { page_size: 300 };
    if (nextPageToken) params.next_page_token = nextPageToken;

    const response = await client.getPhoneUsers(params);
    allUsers = allUsers.concat(response.users);
    nextPageToken = response.next_page_token;
  } while (nextPageToken);

  const fs = require('fs');
  fs.writeFileSync('all_phone_users.json', JSON.stringify(allUsers, null, 2));
  console.log(`Fetched ${allUsers.length} users. Saved to all_phone_users.json`);
}

getAllPhoneUsers().catch(console.error);