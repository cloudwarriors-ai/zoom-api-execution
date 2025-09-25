require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function testFlowEndpoint() {
  console.log('Testing contact center flows endpoint\n');

  const client = new ZoomAPIClient();

  try {
    // Test GET flows
    console.log('1. Testing GET /contact_center/flows...');
    const flows = await client.getFlows();
    console.log('✅ GET flows successful');
    console.log('Response structure:', JSON.stringify(flows, null, 2));
    console.log();

    // Test POST flows with different payloads
    console.log('2. Testing POST /contact_center/flows with different payloads...');

    const testPayloads = [
      { flow_name: 'opencode' },
      { name: 'opencode' },
      { flow_name: 'opencode', flow_description: 'Test flow' },
      { flow_name: 'opencode', channel: 'voice' },
      { flow_name: 'opencode', status: 'draft' },
      {
        flow_name: 'opencode',
        flow_description: 'Test flow',
        channel: 'voice',
        status: 'draft',
        entry_points: []
      },
      // Try different field names
      { FlowName: 'opencode' },
      { flowName: 'opencode' },
      // Try nested structure
      { flow: { name: 'opencode' } }
    ];

    for (let i = 0; i < testPayloads.length; i++) {
      console.log(`Testing payload ${i + 1}:`, testPayloads[i]);
      try {
        const result = await client.createFlow(testPayloads[i]);
        console.log('✅ Success with payload:', result);
        break;
      } catch (error) {
        console.log('❌ Failed:', error.response?.data?.message || error.message);
      }
    }

  } catch (error) {
    console.error('❌ Failed to test flow endpoint:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testFlowEndpoint();