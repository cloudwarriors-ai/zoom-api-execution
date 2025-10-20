require('dotenv').config();
const ZoomAPIClient = require('../../zoom-api-client');

const DEVICE_ENDPOINTS = {
  listDevices: {
    method: 'GET',
    path: '/phone/devices',
    clientMethod: null,
    params: ['page_size', 'next_page_token', 'site_id'],
    tested: false
  },
  
  getDevice: {
    method: 'GET',
    path: '/phone/devices/{deviceId}',
    clientMethod: null,
    params: ['deviceId'],
    tested: false
  },
  
  updateDevice: {
    method: 'PATCH',
    path: '/phone/devices/{deviceId}',
    clientMethod: null,
    params: ['deviceId'],
    body: ['display_name', 'assigned_to', 'mac_address'],
    tested: false
  },
  
  deleteDevice: {
    method: 'DELETE',
    path: '/phone/devices/{deviceId}',
    clientMethod: null,
    params: ['deviceId'],
    tested: false
  },
  
  getDeviceExtensions: {
    method: 'GET',
    path: '/phone/devices/{deviceId}/extensions',
    clientMethod: null,
    params: ['deviceId'],
    tested: false
  },
  
  getDeviceLineKeys: {
    method: 'GET',
    path: '/phone/devices/{deviceId}/line_keys',
    clientMethod: null,
    params: ['deviceId'],
    tested: false
  },
  
  updateDeviceBusinessHours: {
    method: 'PATCH',
    path: '/phone/extension/{extensionId}/call_handling/settings/business_hours',
    clientMethod: null,
    params: ['extensionId'],
    body: ['sub_setting_type', 'settings'],
    tested: true,
    note: 'Use device extension_id. sub_setting_type: "custom_hours". settings: {type: 2, allow_members_to_reset: true/false, custom_hours_settings: [{weekday: 1-7, type: 2 (open) or 0 (closed), from: "HH:MM", to: "HH:MM"}]}. IMPORTANT: weekday type must be 2 for open hours, 0 for closed.'
  }
};

module.exports = { DEVICE_ENDPOINTS };
