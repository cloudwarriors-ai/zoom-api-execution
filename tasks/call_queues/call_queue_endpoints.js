require('dotenv').config();
const ZoomAPIClient = require('../../zoom-api-client');

const CALL_QUEUE_ENDPOINTS = {
  listCallQueues: {
    method: 'GET',
    path: '/phone/call_queues',
    clientMethod: 'getCallQueues',
    params: ['page_size', 'next_page_token', 'site_id'],
    tested: true
  },
  
  getCallQueue: {
    method: 'GET',
    path: '/phone/call_queues/{callQueueId}',
    clientMethod: 'getCallQueue',
    params: ['callQueueId'],
    tested: true,
    note: 'Returns queue details including members in users array'
  },
  
  createCallQueue: {
    method: 'POST',
    path: '/phone/call_queues',
    clientMethod: null,
    body: ['name', 'extension_number', 'site_id', 'description', 'max_wait_time', 'ring_mode'],
    tested: false
  },
  
  updateCallQueue: {
    method: 'PATCH',
    path: '/phone/call_queues/{callQueueId}',
    clientMethod: null,
    params: ['callQueueId'],
    body: ['name', 'extension_number', 'description', 'max_wait_time', 'ring_mode'],
    tested: true
  },
  
  deleteCallQueue: {
    method: 'DELETE',
    path: '/phone/call_queues/{callQueueId}',
    clientMethod: null,
    params: ['callQueueId'],
    tested: false
  },
  
  getCallQueueMembers: {
    method: 'GET',
    path: '/phone/call_queues/{callQueueId}/members',
    clientMethod: 'getCallQueueMembers',
    params: ['callQueueId'],
    tested: false,
    note: 'Not working - use getCallQueue instead to get members'
  },
  
  addCallQueueMembers: {
    method: 'POST',
    path: '/phone/call_queues/{callQueueId}/members',
    clientMethod: null,
    params: ['callQueueId'],
    body: ['members'],
    tested: true,
    note: 'Max 10 members per request. Format: {members: {users: [{id: "user-id"}]}}'
  },
  
  removeCallQueueMember: {
    method: 'DELETE',
    path: '/phone/call_queues/{callQueueId}/members/{memberId}',
    clientMethod: null,
    params: ['callQueueId', 'memberId'],
    tested: true
  },
  
  getCallQueuePhoneNumbers: {
    method: 'GET',
    path: '/phone/call_queues/{callQueueId}/phone_numbers',
    clientMethod: null,
    params: ['callQueueId'],
    tested: false
  },
  
  assignPhoneNumberToQueue: {
    method: 'POST',
    path: '/phone/call_queues/{callQueueId}/phone_numbers',
    clientMethod: null,
    params: ['callQueueId'],
    body: ['phone_numbers'],
    tested: false
  },
  
  unassignPhoneNumberFromQueue: {
    method: 'DELETE',
    path: '/phone/call_queues/{callQueueId}/phone_numbers/{phoneNumberId}',
    clientMethod: null,
    params: ['callQueueId', 'phoneNumberId'],
    tested: false
  },
  
  getCallQueuePolicies: {
    method: 'GET',
    path: '/phone/call_queues/{callQueueId}/policies/{policyType}',
    clientMethod: null,
    params: ['callQueueId', 'policyType'],
    tested: false,
    note: 'policyType: overflow, holiday_hours, etc.'
  },
  
  updateCallQueuePolicies: {
    method: 'PUT',
    path: '/phone/call_queues/{callQueueId}/policies/{policyType}',
    clientMethod: null,
    params: ['callQueueId', 'policyType'],
    body: ['varies by policyType'],
    tested: false
  },
  
  getCallQueueRecordings: {
    method: 'GET',
    path: '/phone/call_queues/{callQueueId}/recordings',
    clientMethod: null,
    params: ['callQueueId', 'from', 'to', 'page_size'],
    tested: false
  },
  
  getCallQueueAnalytics: {
    method: 'GET',
    path: '/phone/call_queue_analytics',
    clientMethod: null,
    params: ['from', 'to', 'type', 'page_size'],
    tested: false
  },
  
  updateCallQueueMaxWaitTime: {
    method: 'PATCH',
    path: '/phone/extension/{extensionId}/call_handling/settings/{settingType}',
    clientMethod: null,
    params: ['extensionId', 'settingType'],
    body: ['sub_setting_type', 'settings'],
    tested: true,
    note: 'Use queue extension_id. settingType: business_hours, closed_hours, holiday, custom. sub_setting_type must be "call_handling". settings: {max_wait_time: seconds}'
  },
  
  updateCallQueueBusinessHours: {
    method: 'PATCH',
    path: '/phone/extension/{extensionId}/call_handling/settings/business_hours',
    clientMethod: null,
    params: ['extensionId'],
    body: ['sub_setting_type', 'settings'],
    tested: true,
    note: 'Use queue extension_id. sub_setting_type: "custom_hours". settings: {type: 2, allow_members_to_reset: true/false, custom_hours_settings: [{weekday: 1-7, type: 2 (open) or 0 (closed), from: "HH:MM", to: "HH:MM"}]}. IMPORTANT: weekday type must be 2 for open hours, 0 for closed.'
  }
};

async function testCallQueueEndpoints() {
  const client = new ZoomAPIClient();
  
  console.log('Testing Zoom Phone Call Queue Endpoints\n');
  
  const queues = await client.getCallQueues({ page_size: 5 });
  console.log(`✅ Found ${queues.total_records} call queues`);
  
  if (queues.call_queues && queues.call_queues.length > 0) {
    const queueId = queues.call_queues[0].id;
    const queueDetails = await client.getCallQueue(queueId);
    console.log(`✅ Retrieved queue: ${queueDetails.name}`);
  }
}

if (require.main === module) {
  testCallQueueEndpoints().catch(console.error);
}

module.exports = { CALL_QUEUE_ENDPOINTS };
