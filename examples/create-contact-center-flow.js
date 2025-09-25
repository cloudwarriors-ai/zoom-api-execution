require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function createContactCenterFlow() {
  console.log('Creating contact center flow: opencode\n');

  const client = new ZoomAPIClient();

  try {
    // Step 1: Check existing flows
    console.log('1. Checking existing flows...');
    const existingFlows = await client.getFlows();
    console.log(`Found ${existingFlows.total_records || 0} existing flows`);

    if (existingFlows.flows?.length > 0) {
      console.log('Existing flows:');
      existingFlows.flows.forEach(flow => {
        console.log(`  - ${flow.name} (ID: ${flow.flow_id})`);
      });

      // Check if flow already exists
      const existingFlow = existingFlows.flows.find(f => f.flow_name === 'opencode');
      if (existingFlow) {
        console.log('✅ Flow "opencode" already exists!');
        console.log('Flow details:', {
          id: existingFlow.flow_id,
          name: existingFlow.name,
          status: existingFlow.status
        });
        return;
      }
    }
    console.log();

    // Step 2: Create the flow
    console.log('2. Creating contact center flow...');
    console.log('Flow name: opencode');

    // Based on existing flow structure, try with more complete configuration
    const flowData = {
      flow_name: 'opencode',
      flow_description: 'Contact center flow created via API',
      channel: 'voice', // voice or messaging
      status: 'draft', // draft or published
      entry_points: [], // empty array for now
      // Try without flow_versions as that might be auto-generated
    };

    const createResult = await client.createFlow(flowData);
    console.log('✓ Flow creation request successful');
    console.log('Response:', createResult);

    // Step 3: Verify the flow was created
    console.log('3. Verifying flow creation...');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for creation to complete

    const updatedFlows = await client.getFlows();
    const newFlow = updatedFlows.flows?.find(f => f.flow_name === 'opencode');

    if (newFlow) {
      console.log('✅ Flow successfully created!');
      console.log('Flow details:', {
        id: newFlow.flow_id,
        name: newFlow.name,
        status: newFlow.status,
        created_at: newFlow.created_at
      });

      console.log('\n🎉 SUCCESS: Contact center flow "opencode" created!');
      console.log(`🆔 Flow ID: ${newFlow.flow_id}`);
      console.log(`📊 Status: ${newFlow.status}`);
    } else {
      console.log('⚠️  Flow creation verification failed - flow may not be visible yet');
    }

  } catch (error) {
    console.error('❌ Failed to create contact center flow:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);

      // Handle common error codes
      if (error.response.status === 400) {
        console.log('\n💡 Possible issues:');
        console.log('- Invalid flow configuration');
        console.log('- Missing required fields');
        console.log('- Flow name already exists');
        console.log('- Insufficient permissions');
      } else if (error.response.status === 403) {
        console.log('\n💡 Insufficient permissions to create flows');
      } else if (error.response.status === 404) {
        console.log('\n💡 Contact center flows API not available');
      }
    }

    // Update perfectedendpoints.md with the result
    console.log('\n📝 Note: This endpoint may not be available or may require different parameters.');
    console.log('Check Zoom API documentation for correct flow creation payload.');
  }
}

createContactCenterFlow();