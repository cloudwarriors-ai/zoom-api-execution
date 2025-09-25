require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function testUnassignmentEndpoints() {
  console.log('Testing Phone Number Assignment/Unassignment Endpoints\n');

  const client = new ZoomAPIClient();
  const phoneNumberId = '6qCz74VyQvyCq4PWSuR6Dg'; // Tyler's phone number

  try {
    // Get current status
    console.log('Current phone number status:');
    const current = await client.getPhoneNumber(phoneNumberId);
    console.log('Assignee:', current.assignee?.name || 'None');
    console.log();

    // Method 1: Try DELETE /phone/numbers/{id}/assignee
    console.log('Method 1: DELETE /phone/numbers/{id}/assignee');
    try {
      await client.unassignPhoneNumberFromUser(phoneNumberId);
      console.log('✓ DELETE assignee endpoint succeeded');

      // Check if it worked
      const afterDelete = await client.getPhoneNumber(phoneNumberId);
      if (!afterDelete.assignee || !afterDelete.assignee.id) {
        console.log('✅ Phone number successfully unassigned via DELETE!');
        return;
      }
    } catch (error) {
      console.log('❌ DELETE assignee failed:', error.message);
    }

    // Method 2: Try POST /phone/numbers/{id}/assign with empty/null user
    console.log('Method 2: POST /phone/numbers/{id}/assign with null user');
    try {
      await client.assignPhoneNumber(phoneNumberId, null);
      console.log('✓ POST assign with null succeeded');

      // Check if it worked
      const afterAssignNull = await client.getPhoneNumber(phoneNumberId);
      if (!afterAssignNull.assignee || !afterAssignNull.assignee.id) {
        console.log('✅ Phone number successfully unassigned via POST assign!');
        return;
      }
    } catch (error) {
      console.log('❌ POST assign with null failed:', error.message);
    }

    // Method 3: Try assigning to a different user first, then unassign
    console.log('Method 3: Assign to different user then unassign');

    // First get another user to assign to temporarily
    const users = await client.getPhoneUsers({ page_size: 5 });
    const otherUser = users.users.find(u => u.id !== 'vBCwaIlxSQWTWXCaatO6-g'); // Not Tyler

    if (otherUser) {
      console.log(`Temporarily assigning to: ${otherUser.name}`);
      try {
        await client.assignPhoneNumber(phoneNumberId, otherUser.id);
        console.log('✓ Temporarily assigned to other user');

        // Now try to unassign
        await client.unassignPhoneNumberFromUser(phoneNumberId);
        console.log('✓ Unassigned from temporary user');

        // Check final status
        const final = await client.getPhoneNumber(phoneNumberId);
        if (!final.assignee || !final.assignee.id) {
          console.log('✅ Phone number successfully unassigned!');
          return;
        }
      } catch (error) {
        console.log('❌ Temporary assignment method failed:', error.message);
      }
    } else {
      console.log('No other users available for temporary assignment');
    }

    // Method 4: Check if there's an unassign by setting to "unassigned" status
    console.log('Method 4: Try setting status to unassigned');
    try {
      await client.updatePhoneNumber(phoneNumberId, {
        status: 'unassigned',
        assignee: null
      });
      console.log('✓ Set status to unassigned');

      const afterStatus = await client.getPhoneNumber(phoneNumberId);
      if (afterStatus.status === 'unassigned' || !afterStatus.assignee) {
        console.log('✅ Phone number status changed to unassigned!');
        return;
      }
    } catch (error) {
      console.log('❌ Status change failed:', error.message);
    }

    // Final status check
    console.log('\nFinal status check:');
    const finalStatus = await client.getPhoneNumber(phoneNumberId);
    console.log('Assignee:', finalStatus.assignee?.name || 'None');
    console.log('Status:', finalStatus.status);

    if (!finalStatus.assignee || !finalStatus.assignee.id) {
      console.log('✅ SUCCESS: Phone number has been unassigned!');
    } else {
      console.log('❌ FAILURE: Phone number is still assigned to', finalStatus.assignee.name);
      console.log('💡 This may require manual action in the Zoom Admin Portal');
    }

  } catch (error) {
    console.error('❌ Endpoint testing failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testUnassignmentEndpoints();