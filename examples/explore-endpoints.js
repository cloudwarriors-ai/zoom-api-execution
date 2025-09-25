require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function exploreEndpoints() {
  console.log('Exploring available Zoom API endpoints...\n');

  const client = new ZoomAPIClient();

  // Common endpoint patterns to test
  const endpoints = [
    '/users/me',
    '/phone',
    '/phone/accounts',
    '/phone/users',
    '/phone/numbers',
    '/phone/call_logs',
    '/phone/call_queues',
    '/contact_center',
    '/contact_center/accounts',
    '/contact_center/agents',
    '/contact_center/queues',
    '/contact_center/campaigns'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: GET ${endpoint}`);
      const response = await client.makeRequest('GET', endpoint);
      console.log(`✓ Available - ${JSON.stringify(response).substring(0, 100)}...\n`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`✗ Not found: ${endpoint}\n`);
      } else if (error.response?.status === 403) {
        console.log(`⚠ Forbidden (check scopes): ${endpoint}\n`);
      } else {
        console.log(`⚠ Error ${error.response?.status}: ${endpoint} - ${error.message}\n`);
      }
    }
  }
}

exploreEndpoints();