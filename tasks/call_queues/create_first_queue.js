require('dotenv').config();
const ZoomAPIClient = require('../../zoom-api-client');

async function createFirstCallQueue() {
  const client = new ZoomAPIClient();
  
  console.log('Creating call queue for first site from PAD Sites CSV...\n');
  
  console.log('Step 1: Getting list of sites to find the site ID...');
  const sites = await client.getSites({ page_size: 100 });
  
  if (!sites.sites || sites.sites.length === 0) {
    console.error('❌ No sites found. Please create a site first.');
    return;
  }
  
  console.log(`✅ Found ${sites.total_records} sites`);
  
  const cdpsSite = sites.sites.find(site => site.name === 'CDPS-S');
  
  if (!cdpsSite) {
    console.log('\n📋 Available sites:');
    sites.sites.forEach(site => {
      console.log(`  - ${site.name} (ID: ${site.id})`);
    });
    console.error('\n❌ Site "CDPS-S" not found. Using first available site instead.');
    const firstSite = sites.sites[0];
    console.log(`Using site: ${firstSite.name} (ID: ${firstSite.id})`);
    
    const queueData = {
      name: `${firstSite.name} - Call Queue`,
      site_id: firstSite.id,
      extension_number: '1001',
      description: 'Call queue for ' + firstSite.name
    };
    
    console.log('\nStep 2: Creating call queue with data:', JSON.stringify(queueData, null, 2));
    
    try {
      const result = await client.makeRequest('POST', '/phone/call_queues', queueData);
      console.log('\n✅ Call queue created successfully:');
      console.log(JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('\n❌ Failed to create call queue:', error.response?.data || error.message);
      throw error;
    }
  }
  
  const queueData = {
    name: 'CDPS-S Call Queue',
    site_id: cdpsSite.id,
    extension_number: '1001',
    description: 'Call queue for CDPS-S - Scottsdale location'
  };
  
  console.log(`\n✅ Found CDPS-S site (ID: ${cdpsSite.id})`);
  console.log('\nStep 2: Creating call queue with data:', JSON.stringify(queueData, null, 2));
  
  try {
    const result = await client.makeRequest('POST', '/phone/call_queues', queueData);
    console.log('\n✅ Call queue created successfully:');
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('\n❌ Failed to create call queue:', error.response?.data || error.message);
    throw error;
  }
}

if (require.main === module) {
  createFirstCallQueue().catch(console.error);
}

module.exports = { createFirstCallQueue };
