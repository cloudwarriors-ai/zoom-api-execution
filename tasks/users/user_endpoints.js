require('dotenv').config();
const ZoomAPIClient = require('../../zoom-api-client');

const USER_ENDPOINTS = {
  listUsers: {
    method: 'GET',
    path: '/phone/users',
    clientMethod: 'getPhoneUsers',
    params: ['page_size', 'next_page_token', 'status', 'site_id', 'calling_type'],
    tested: true
  },
  
  getUser: {
    method: 'GET',
    path: '/phone/users/{userId}',
    clientMethod: 'getPhoneUser',
    params: ['userId'],
    tested: true
  },
  
  updateUser: {
    method: 'PATCH',
    path: '/phone/users/{userId}',
    clientMethod: 'updatePhoneUser',
    params: ['userId'],
    body: ['extension_number', 'cost_center', 'department', 'name'],
    tested: true
  },
  
  batchUsers: {
    method: 'POST',
    path: '/phone/users/batch',
    clientMethod: null,
    body: ['users'],
    tested: false
  },
  
  getUserPhoneNumbers: {
    method: 'GET',
    path: '/phone/users/{userId}/phone_numbers',
    clientMethod: null,
    params: ['userId'],
    tested: false,
    note: 'Use getUser for phone numbers in user details'
  },
  
  assignPhoneNumber: {
    method: 'POST',
    path: '/phone/users/{userId}/phone_numbers',
    clientMethod: 'assignPhoneNumberToUser',
    params: ['userId'],
    body: ['phone_numbers'],
    tested: true
  },
  
  unassignPhoneNumber: {
    method: 'DELETE',
    path: '/phone/users/{userId}/phone_numbers/{phoneNumberId}',
    clientMethod: 'unassignPhoneNumberFromUserById',
    params: ['userId', 'phoneNumberId'],
    tested: true
  },
  
  getUserSettings: {
    method: 'GET',
    path: '/phone/users/{userId}/settings',
    clientMethod: null,
    params: ['userId'],
    tested: false
  },
  
  updateUserSettings: {
    method: 'PATCH',
    path: '/phone/users/{userId}/settings/{settingType}',
    clientMethod: null,
    params: ['userId', 'settingType'],
    body: ['varies by settingType'],
    tested: false,
    note: 'settingType: call_handling, voicemail, recording'
  },
  
  getCallingPlans: {
    method: 'GET',
    path: '/phone/users/{userId}/calling_plans',
    clientMethod: null,
    params: ['userId'],
    tested: false
  },
  
  assignCallingPlan: {
    method: 'POST',
    path: '/phone/users/{userId}/calling_plans/{planType}',
    clientMethod: null,
    params: ['userId', 'planType'],
    tested: false,
    note: 'planType: unlimited, metered'
  },
  
  getUserCallHistory: {
    method: 'GET',
    path: '/phone/users/{userId}/call_history',
    clientMethod: null,
    params: ['userId', 'from', 'to', 'page_size', 'type'],
    tested: false
  },
  
  getUserCallLogs: {
    method: 'GET',
    path: '/phone/users/{userId}/call_logs',
    clientMethod: null,
    params: ['userId', 'from', 'to', 'page_size', 'next_page_token'],
    tested: false
  },
  
  getUserRecordings: {
    method: 'GET',
    path: '/phone/users/{userId}/recordings',
    clientMethod: null,
    params: ['userId', 'from', 'to', 'page_size'],
    tested: false
  },
  
  getUserVoicemails: {
    method: 'GET',
    path: '/phone/users/{userId}/voice_mails',
    clientMethod: null,
    params: ['userId', 'status', 'from', 'to', 'page_size'],
    tested: false
  }
};

async function testUserEndpoints() {
  const client = new ZoomAPIClient();
  
  console.log('Testing Zoom Phone User Endpoints\n');
  
  const users = await client.getPhoneUsers({ page_size: 5 });
  console.log(`✅ Found ${users.total_records} users`);
  
  if (users.users && users.users.length > 0) {
    const userId = users.users[0].id;
    const userDetails = await client.getPhoneUser(userId);
    console.log(`✅ Retrieved user: ${userDetails.email}`);
  }
}

if (require.main === module) {
  testUserEndpoints().catch(console.error);
}

module.exports = { USER_ENDPOINTS };
