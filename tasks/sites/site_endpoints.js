require('dotenv').config();
const ZoomAPIClient = require('../../zoom-api-client');

const SITE_ENDPOINTS = {
  listSites: {
    method: 'GET',
    path: '/phone/sites',
    clientMethod: 'getSites',
    params: ['page_size', 'next_page_token'],
    tested: false
  },
  
  getSite: {
    method: 'GET',
    path: '/phone/sites/{siteId}',
    clientMethod: 'getSite',
    params: ['siteId'],
    tested: false
  },
  
  createSite: {
    method: 'POST',
    path: '/phone/sites',
    clientMethod: 'createSite',
    body: ['name', 'timezone', 'auto_receptionist_name', 'default_emergency_address'],
    tested: true,
    notes: [
      'REQUIRED: auto_receptionist_name - Should be the same as the site name',
      'IMPORTANT: auto_receptionist_name has a 32 character limit - truncate longer names',
      'REQUIRED: default_emergency_address - Must be a structured object with address_line1, city, state_code, zip, country',
      'CRITICAL ISSUE FOUND: default_emergency_address is accepted in POST request but NOT saved to the site',
      'WORKAROUND NEEDED: Must use PATCH /phone/sites/{siteId} after creation to set emergency address',
      'timezone format: America/Phoenix (not US/Arizona)',
      'Emergency address structure: { address_line1, address_line2 (optional), city, state_code, zip, country }',
      'The emergency address should match the physical site location',
      'Site names with hyphens and long names may fail validation - remove hyphens or truncate if needed'
    ],
    example: {
      name: 'CDPS-PV',
      timezone: 'America/Phoenix',
      auto_receptionist_name: 'CDPS-PV',
      default_emergency_address: {
        address_line1: '11209 N Tatum Blvd',
        address_line2: 'Suite 175',
        city: 'Phoenix',
        state_code: 'AZ',
        zip: '85028',
        country: 'US'
      }
    }
  },
  
  updateSite: {
    method: 'PATCH',
    path: '/phone/sites/{siteId}',
    clientMethod: 'updateSite',
    params: ['siteId'],
    body: ['name', 'timezone', 'default_emergency_address'],
    tested: false
  },
  
  deleteSite: {
    method: 'DELETE',
    path: '/phone/sites/{siteId}',
    clientMethod: 'deleteSite',
    params: ['siteId'],
    tested: false
  }
};

async function createCDPSPVSite() {
  const client = new ZoomAPIClient();
  
  console.log('Creating CDPS-PV site from PAD Sites CSV...\n');
  
  const siteData = {
    name: 'CDPS-PV',
    timezone: 'America/Phoenix',
    auto_receptionist_name: 'CDPS-PV',
    default_emergency_address: {
      address_line1: '11209 N Tatum Blvd',
      address_line2: 'Suite 175',
      city: 'Phoenix',
      state_code: 'AZ',
      zip: '85028',
      country: 'US'
    }
  };
  
  try {
    const result = await client.createSite(siteData);
    console.log('✅ Site created successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to create site:', error.response?.data || error.message);
    throw error;
  }
}

async function testSiteEndpoints() {
  const client = new ZoomAPIClient();
  
  console.log('Testing Zoom Phone Site Endpoints\n');
  
  try {
    const sites = await client.getSites({ page_size: 10 });
    console.log(`✅ Found ${sites.total_records || sites.sites?.length || 0} sites`);
    
    if (sites.sites && sites.sites.length > 0) {
      const siteId = sites.sites[0].id;
      const siteDetails = await client.getSite(siteId);
      console.log(`✅ Retrieved site: ${siteDetails.name}`);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

if (require.main === module) {
  createCDPSPVSite().catch(console.error);
}

module.exports = { SITE_ENDPOINTS, createCDPSPVSite, testSiteEndpoints };
