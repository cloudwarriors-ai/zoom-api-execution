require('dotenv').config();
const ZoomAPIClient = require('../../zoom-api-client');

const PHONE_USER_ENDPOINTS = {
  listPhoneUsers: {
    method: 'GET',
    path: '/phone/users',
    clientMethod: 'getPhoneUsers',
    params: ['page_size', 'next_page_token', 'status', 'site_id', 'calling_type'],
    tested: true
  },
  
  getPhoneUser: {
    method: 'GET',
    path: '/phone/users/{userId}',
    clientMethod: 'getPhoneUser',
    params: ['userId'],
    tested: true
  },
  
  updatePhoneUser: {
    method: 'PATCH',
    path: '/phone/users/{userId}',
    clientMethod: 'updatePhoneUser',
    params: ['userId'],
    body: ['extension_number', 'cost_center', 'department', 'name'],
    tested: true
  },
  
  batchPhoneUsers: {
    method: 'POST',
    path: '/phone/users/batch',
    clientMethod: null,
    body: ['users'],
    tested: false
  },
  
  getPhoneUserPhoneNumbers: {
    method: 'GET',
    path: '/phone/users/{userId}/phone_numbers',
    clientMethod: null,
    params: ['userId'],
    tested: false,
    note: 'Use getPhoneUser for phone numbers in user details'
  },
  
  assignPhoneNumberToUser: {
    method: 'POST',
    path: '/phone/users/{userId}/phone_numbers',
    clientMethod: 'assignPhoneNumberToUser',
    params: ['userId'],
    body: ['phone_numbers'],
    tested: true
  },
  
  unassignPhoneNumberFromUser: {
    method: 'DELETE',
    path: '/phone/users/{userId}/phone_numbers/{phoneNumberId}',
    clientMethod: 'unassignPhoneNumberFromUserById',
    params: ['userId', 'phoneNumberId'],
    tested: true
  },
  
  getPhoneUserSettings: {
    method: 'GET',
    path: '/phone/users/{userId}/settings',
    clientMethod: null,
    params: ['userId'],
    tested: false
  },
  
  updatePhoneUserSettings: {
    method: 'PATCH',
    path: '/phone/users/{userId}/settings/{settingType}',
    clientMethod: null,
    params: ['userId', 'settingType'],
    body: ['varies by settingType'],
    tested: false,
    note: 'settingType: call_handling, voicemail, recording'
  },
  
  getPhoneUserCallingPlans: {
    method: 'GET',
    path: '/phone/users/{userId}/calling_plans',
    clientMethod: null,
    params: ['userId'],
    tested: false
  },
  
  assignCallingPlanToUser: {
    method: 'POST',
    path: '/phone/users/{userId}/calling_plans/{planType}',
    clientMethod: null,
    params: ['userId', 'planType'],
    tested: false,
    note: 'planType: unlimited, metered'
  },
  
  getPhoneUserCallHistory: {
    method: 'GET',
    path: '/phone/users/{userId}/call_history',
    clientMethod: null,
    params: ['userId', 'from', 'to', 'page_size', 'type'],
    tested: false
  },
  
  getPhoneUserCallLogs: {
    method: 'GET',
    path: '/phone/users/{userId}/call_logs',
    clientMethod: null,
    params: ['userId', 'from', 'to', 'page_size', 'next_page_token'],
    tested: false
  },
  
  getPhoneUserRecordings: {
    method: 'GET',
    path: '/phone/users/{userId}/recordings',
    clientMethod: null,
    params: ['userId', 'from', 'to', 'page_size'],
    tested: false
  },
  
  getPhoneUserVoicemails: {
    method: 'GET',
    path: '/phone/users/{userId}/voice_mails',
    clientMethod: null,
    params: ['userId', 'status', 'from', 'to', 'page_size'],
    tested: false
  },
  
  updatePhoneUserBusinessHours: {
    method: 'PATCH',
    path: '/phone/extension/{extensionId}/call_handling/settings/business_hours',
    clientMethod: null,
    params: ['extensionId'],
    body: ['sub_setting_type', 'settings'],
    tested: true,
    note: 'Use user extension_id. sub_setting_type: "custom_hours". settings: {type: 2, allow_members_to_reset: true/false, custom_hours_settings: [{weekday: 1-7, type: 2 (open) or 0 (closed), from: "HH:MM", to: "HH:MM"}]}. IMPORTANT: weekday type must be 2 for open hours, 0 for closed.'
  }
};

async function testPhoneUserEndpoints() {
  const client = new ZoomAPIClient();
  
  console.log('Testing Zoom Phone User Endpoints\n');
  
  const users = await client.getPhoneUsers({ page_size: 5 });
  console.log(`✅ Found ${users.total_records} phone users`);
  
  if (users.users && users.users.length > 0) {
    const userId = users.users[0].id;
    const userDetails = await client.getPhoneUser(userId);
    console.log(`✅ Retrieved user: ${userDetails.email}`);
  }
}

if (require.main === module) {
  testPhoneUserEndpoints().catch(console.error);
}

module.exports = { PHONE_USER_ENDPOINTS };
