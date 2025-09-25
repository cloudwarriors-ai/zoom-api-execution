require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function advancedPhoneUnassignment() {
  console.log('Advanced Phone Number Unassignment Attempts\n');

  const client = new ZoomAPIClient();
  const phoneNumberId = '6qCz74VyQvyCq4PWSuR6Dg'; // Tyler's phone number

  try {
    // First, get current phone number details
    console.log('1. Getting current phone number details...');
    const currentDetails = await client.getPhoneNumber(phoneNumberId);
    console.log('Current assignee:', JSON.stringify(currentDetails.assignee, null, 2));
    console.log();

    // Method 1: Try setting assignee to empty object
    console.log('Method 1: Setting assignee to empty object...');
    try {
      await client.updatePhoneNumber(phoneNumberId, {
        assignee: {}
      });
      console.log('✓ Method 1 succeeded');
    } catch (error) {
      console.log('❌ Method 1 failed:', error.message);
    }

    // Check if it worked
    const afterMethod1 = await client.getPhoneNumber(phoneNumberId);
    if (!afterMethod1.assignee || Object.keys(afterMethod1.assignee).length === 0) {
      console.log('✅ Phone number successfully unassigned!');
      return;
    }

    // Method 2: Try setting assignee to null with additional fields
    console.log('Method 2: Setting assignee to null with additional fields...');
    try {
      await client.updatePhoneNumber(phoneNumberId, {
        assignee: null,
        assigned_to: null,
        assignment_type: null
      });
      console.log('✓ Method 2 succeeded');
    } catch (error) {
      console.log('❌ Method 2 failed:', error.message);
    }

    // Check if it worked
    const afterMethod2 = await client.getPhoneNumber(phoneNumberId);
    if (!afterMethod2.assignee) {
      console.log('✅ Phone number successfully unassigned!');
      return;
    }

    // Method 3: Try assigning to a system/unassigned user
    console.log('Method 3: Trying to assign to system user...');
    try {
      // Try assigning to a system user or unassigned pool
      await client.updatePhoneNumber(phoneNumberId, {
        assignee: {
          type: "system",
          id: null
        }
      });
      console.log('✓ Method 3 succeeded');
    } catch (error) {
      console.log('❌ Method 3 failed:', error.message);
    }

    // Check if it worked
    const afterMethod3 = await client.getPhoneNumber(phoneNumberId);
    if (afterMethod3.assignee?.type === "system" || !afterMethod3.assignee?.id) {
      console.log('✅ Phone number assigned to system/unassigned!');
      return;
    }

    // Method 4: Try removing assignee field entirely
    console.log('Method 4: Attempting to remove assignee field...');
    try {
      // Some APIs allow removing fields by setting them to null
      await client.updatePhoneNumber(phoneNumberId, {
        "assignee": null
      });
      console.log('✓ Method 4 succeeded');
    } catch (error) {
      console.log('❌ Method 4 failed:', error.message);
    }

    // Final check
    const finalDetails = await client.getPhoneNumber(phoneNumberId);
    console.log('Final assignee status:', JSON.stringify(finalDetails.assignee, null, 2));

    if (!finalDetails.assignee || finalDetails.assignee.type === "system") {
      console.log('✅ Phone number successfully unassigned!');
    } else {
      console.log('❌ All methods failed. Phone number still assigned to:', finalDetails.assignee.name);
      console.log('Manual unassignment through Zoom Admin Portal may be required.');
    }

  } catch (error) {
    console.error('❌ Advanced unassignment failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

advancedPhoneUnassignment();