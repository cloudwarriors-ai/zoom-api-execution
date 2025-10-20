require('dotenv').config();
const ZoomAPIClient = require('../../zoom-api-client');

const COMMON_AREA_ENDPOINTS = {
  listCommonAreas: {
    method: 'GET',
    path: '/phone/common_areas',
    params: ['page_size', 'next_page_token', 'site_id'],
    tested: false,
    notes: [
      'List all common area phones',
      'Can filter by site_id'
    ]
  },
  
  getCommonArea: {
    method: 'GET',
    path: '/phone/common_areas/{commonAreaId}',
    params: ['commonAreaId'],
    tested: false
  },
  
  addCommonArea: {
    method: 'POST',
    path: '/phone/common_areas',
    body: ['name', 'display_name', 'extension_number', 'site_id', 'timezone', 'emergency_address'],
    tested: false,
    notes: [
      'REQUIRED: name - Name of the common area',
      'REQUIRED: site_id - Site ID where common area is located',
      'extension_number - Extension for the common area phone',
      'display_name - Display name (defaults to name if not provided)',
      'timezone - Timezone (e.g., America/Phoenix)',
      'emergency_address - Emergency address object (same structure as site emergency address)'
    ],
    example: {
      name: 'Lobby Phone',
      display_name: 'Lobby Phone',
      extension_number: 2000,
      site_id: 'site-id-here',
      timezone: 'America/Phoenix',
      emergency_address: {
        address_line1: '14275 N 87th St',
        address_line2: 'Suite 109',
        city: 'Scottsdale',
        state_code: 'AZ',
        zip: '85260',
        country: 'US'
      }
    }
  },
  
  updateCommonArea: {
    method: 'PATCH',
    path: '/phone/common_areas/{commonAreaId}',
    params: ['commonAreaId'],
    body: ['name', 'display_name', 'extension_number', 'timezone', 'emergency_address'],
    tested: false
  },
  
  deleteCommonArea: {
    method: 'DELETE',
    path: '/phone/common_areas/{commonAreaId}',
    params: ['commonAreaId'],
    tested: false
  }
};

async function testCommonAreaEndpoints() {
  const client = new ZoomAPIClient();
  
  console.log('Testing Zoom Phone Common Area Endpoints\n');
  
  try {
    const commonAreas = await client.makeRequest('GET', '/phone/common_areas', null, { page_size: 10 });
    console.log(`✅ Found ${commonAreas.total_records || commonAreas.common_areas?.length || 0} common areas`);
    
    if (commonAreas.common_areas && commonAreas.common_areas.length > 0) {
      console.log('\nCommon areas:');
      commonAreas.common_areas.forEach((ca, index) => {
        console.log(`  ${index + 1}. ${ca.name} (ID: ${ca.id}, Extension: ${ca.extension_number})`);
      });
    }
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

async function createTestCommonArea(siteId, siteName, siteAddress) {
  const client = new ZoomAPIClient();
  
  console.log(`Creating test common area for site: ${siteName}\n`);
  
  const commonAreaData = {
    name: `${siteName} - Lobby`,
    display_name: `${siteName} - Lobby Phone`,
    extension_number: 2000,
    site_id: siteId,
    timezone: 'America/Phoenix',
    emergency_address: siteAddress
  };
  
  try {
    const result = await client.makeRequest('POST', '/phone/common_areas', commonAreaData);
    console.log('✅ Common area created successfully:');
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ Failed to create common area:', error.response?.data || error.message);
    throw error;
  }
}

if (require.main === module) {
  testCommonAreaEndpoints().catch(console.error);
}

module.exports = { COMMON_AREA_ENDPOINTS, testCommonAreaEndpoints, createTestCommonArea };
