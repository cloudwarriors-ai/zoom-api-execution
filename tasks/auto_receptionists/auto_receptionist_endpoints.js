require('dotenv').config();
const ZoomAPIClient = require('../../zoom-api-client');

const AUTO_RECEPTIONIST_ENDPOINTS = {
  listAutoReceptionists: {
    method: 'GET',
    path: '/phone/auto_receptionists',
    clientMethod: null,
    params: ['page_size', 'next_page_token', 'site_id'],
    tested: false
  },
  
  getAutoReceptionist: {
    method: 'GET',
    path: '/phone/auto_receptionists/{autoReceptionistId}',
    clientMethod: null,
    params: ['autoReceptionistId'],
    tested: false
  },
  
  createAutoReceptionist: {
    method: 'POST',
    path: '/phone/auto_receptionists',
    clientMethod: null,
    body: ['name', 'extension_number', 'site_id'],
    tested: false
  },
  
  updateAutoReceptionist: {
    method: 'PATCH',
    path: '/phone/auto_receptionists/{autoReceptionistId}',
    clientMethod: null,
    params: ['autoReceptionistId'],
    body: ['name', 'extension_number'],
    tested: false
  },
  
  deleteAutoReceptionist: {
    method: 'DELETE',
    path: '/phone/auto_receptionists/{autoReceptionistId}',
    clientMethod: null,
    params: ['autoReceptionistId'],
    tested: false
  },
  
  getAutoReceptionistPhoneNumbers: {
    method: 'GET',
    path: '/phone/auto_receptionists/{autoReceptionistId}/phone_numbers',
    clientMethod: null,
    params: ['autoReceptionistId'],
    tested: false
  },
  
  assignPhoneNumberToAutoReceptionist: {
    method: 'POST',
    path: '/phone/auto_receptionists/{autoReceptionistId}/phone_numbers',
    clientMethod: null,
    params: ['autoReceptionistId'],
    body: ['phone_numbers'],
    tested: false
  },
  
  unassignPhoneNumberFromAutoReceptionist: {
    method: 'DELETE',
    path: '/phone/auto_receptionists/{autoReceptionistId}/phone_numbers/{phoneNumberId}',
    clientMethod: null,
    params: ['autoReceptionistId', 'phoneNumberId'],
    tested: false
  },
  
  updateAutoReceptionistBusinessHours: {
    method: 'PATCH',
    path: '/phone/extension/{extensionId}/call_handling/settings/business_hours',
    clientMethod: null,
    params: ['extensionId'],
    body: ['sub_setting_type', 'settings'],
    tested: true,
    note: 'Use auto receptionist extension_id. sub_setting_type: "custom_hours". settings: {type: 2, allow_members_to_reset: true/false, custom_hours_settings: [{weekday: 1-7, type: 2 (open) or 0 (closed), from: "HH:MM", to: "HH:MM"}]}. IMPORTANT: weekday type must be 2 for open hours, 0 for closed.'
  }
};

module.exports = { AUTO_RECEPTIONIST_ENDPOINTS };
