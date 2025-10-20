require('dotenv').config();
const ZoomAPIClient = require('../../zoom-api-client');

const ALERT_ENDPOINTS = {
  listAlertSettings: {
    method: 'GET',
    path: '/phone/alert_settings',
    clientMethod: 'getAlertSettings',
    params: ['page_size', 'next_page_token'],
    tested: false
  },
  
  getAlertSetting: {
    method: 'GET',
    path: '/phone/alert_settings/{alertSettingId}',
    clientMethod: 'getAlertSetting',
    params: ['alertSettingId'],
    tested: false
  },
  
  createAlertSetting: {
    method: 'POST',
    path: '/phone/alert_settings',
    clientMethod: 'createAlertSetting',
    body: ['alert_setting_name', 'module', 'rule', 'target_type', 'target_ids', 'rule_conditions', 'time_frame_type', 'time_frame_from', 'time_frame_to', 'frequency', 'email_recipients', 'status'],
    tested: true,
    notes: [
      'Used for emergency service alerts',
      'module: 5 (for emergency services)',
      'rule: 14 (emergency alert rule)',
      'target_type: 4 (Site)',
      'target_ids: array of site IDs',
      'rule_conditions: [{ rule_condition_type: 5, rule_condition_value: "Critical" }]',
      'IMPORTANT: rule_condition_value must be "Critical" for emergency alerts (not "severity" or "Warning")',
      'time_frame_type: "all_day" for 24/7 alerts',
      'time_frame_from and time_frame_to: REQUIRED even with all_day (use "08:30:00" and "18:00:00" format)',
      'frequency: how often to send alerts (5 recommended)',
      'email_recipients: array of email addresses for emergency notifications (from CSV Emergency email column)',
      'status: 1 (active)',
      'Successfully tested with alert ID: L5svRxVgT5W9jZA_jh3M8w',
      'NOTE: POST request succeeds but GET /phone/alert_settings returns empty/no data',
      'Alerts may be created successfully but not visible via API - verify in Zoom Phone dashboard',
      'Created 73 emergency alerts for sites (4 sites skipped due to missing emergency email)'
    ],
    example: {
      alert_setting_name: 'CDPS-PV Emergency Alert',
      module: 5,
      rule: 14,
      target_type: 4,
      target_ids: ['trJk9j8bSJCvI2DtPoboUQ'],
      rule_conditions: [
        {
          rule_condition_type: 5,
          rule_condition_value: 'Critical'
        }
      ],
      time_frame_type: 'all_day',
      time_frame_from: '08:30:00',
      time_frame_to: '18:00:00',
      frequency: 5,
      email_recipients: ['compliance@platinumderm.com'],
      status: 1
    }
  },
  
  updateAlertSetting: {
    method: 'PATCH',
    path: '/phone/alert_settings/{alertSettingId}',
    clientMethod: 'updateAlertSetting',
    params: ['alertSettingId'],
    body: ['name', 'email', 'settings'],
    tested: false
  },
  
  deleteAlertSetting: {
    method: 'DELETE',
    path: '/phone/alert_settings/{alertSettingId}',
    clientMethod: 'deleteAlertSetting',
    params: ['alertSettingId'],
    tested: false
  }
};

async function createCDPSPVEmergencyAlert() {
  const client = new ZoomAPIClient();
  
  console.log('Creating Emergency Alert for CDPS-PV site...\n');
  
  const alertData = {
    alert_setting_name: 'CDPS-PV Emergency Alert',
    module: 5,
    rule: 14,
    target_type: 4,
    target_ids: ['trJk9j8bSJCvI2DtPoboUQ'],
    rule_conditions: [
      {
        rule_condition_type: 5,
        rule_condition_value: 'Critical'
      }
    ],
    time_frame_type: 'all_day',
    time_frame_from: '08:30:00',
    time_frame_to: '18:00:00',
    frequency: 5,
    email_recipients: ['compliance@platinumderm.com'],
    status: 1
  };
  
  try {
    const result = await client.createAlertSetting(alertData);
    console.log('✅ Emergency alert created successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to create emergency alert:', error.response?.data || error.message);
    throw error;
  }
}

async function testAlertEndpoints() {
  const client = new ZoomAPIClient();
  
  console.log('Testing Zoom Phone Alert Endpoints\n');
  
  try {
    const alerts = await client.getAlertSettings({ page_size: 10 });
    console.log(`✅ Found ${alerts.total_records || alerts.alert_settings?.length || 0} alert settings`);
    
    if (alerts.alert_settings && alerts.alert_settings.length > 0) {
      const alertId = alerts.alert_settings[0].id;
      const alertDetails = await client.getAlertSetting(alertId);
      console.log(`✅ Retrieved alert: ${alertDetails.name}`);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

if (require.main === module) {
  createCDPSPVEmergencyAlert().catch(console.error);
}

module.exports = { ALERT_ENDPOINTS, createCDPSPVEmergencyAlert, testAlertEndpoints };
