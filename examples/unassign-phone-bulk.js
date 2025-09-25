require('dotenv').config();
const ZoomAPIClient = require('../zoom-api-client');

async function bulkPhoneManagement() {
  console.log('Bulk Phone Number Management Approach\n');

  const client = new ZoomAPIClient();

  try {
    // Method 1: Check if there's an account-level phone number management
    console.log('Method 1: Checking account-level phone management...');
    try {
      // Try to get phone account settings
      const accountSettings = await client.makeRequest('GET', '/phone');
      console.log('Account phone settings:', accountSettings);

      // Look for bulk assignment endpoints
      if (accountSettings && typeof accountSettings === 'object') {
        console.log('Available account-level endpoints might include:', Object.keys(accountSettings));
      }
    } catch (error) {
      console.log('❌ Account-level phone management not accessible:', error.message);
    }

    // Method 2: Try bulk phone number operations
    console.log('\nMethod 2: Trying bulk phone number operations...');
    try {
      // Try to update multiple phone numbers at once
      const bulkUpdate = await client.makeRequest('PATCH', '/phone/numbers', {
        numbers: [{
          id: '6qCz74VyQvyCq4PWSuR6Dg',
          assignee: null
        }]
      });
      console.log('✓ Bulk update succeeded:', bulkUpdate);
    } catch (error) {
      console.log('❌ Bulk update failed:', error.message);
    }

    // Method 3: Check site-level phone management
    console.log('\nMethod 3: Checking site-level phone management...');
    try {
      // Get phone numbers for a specific site
      const siteNumbers = await client.makeRequest('GET', '/phone/sites/yQTPXluJQxikXaBnyPa_BQ/phone_numbers');
      console.log('Site phone numbers:', siteNumbers);
    } catch (error) {
      console.log('❌ Site-level phone management failed:', error.message);
    }

    // Method 4: Try assignment management endpoints
    console.log('\nMethod 4: Trying assignment management...');
    const assignmentEndpoints = [
      'PUT /phone/numbers/6qCz74VyQvyCq4PWSuR6Dg/assignee',
      'POST /phone/numbers/assignments',
      'DELETE /phone/numbers/6qCz74VyQvyCq4PWSuR6Dg/assignments',
      'PUT /phone/users/vBCwaIlxSQWTWXCaatO6-g/phone_numbers'
    ];

    for (const endpoint of assignmentEndpoints) {
      try {
        const [method, path] = endpoint.split(' ');
        console.log(`Trying ${method} ${path}...`);

        let payload = {};
        if (method === 'PUT' && path.includes('assignee')) {
          payload = { assignee: null };
        } else if (method === 'POST' && path.includes('assignments')) {
          payload = { number_id: '6qCz74VyQvyCq4PWSuR6Dg', user_id: null };
        } else if (method === 'PUT' && path.includes('phone_numbers')) {
          payload = { phone_numbers: [] };
        }

        const result = await client.makeRequest(method, path, payload);
        console.log(`✓ ${method} ${path} succeeded:`, result);

        // Check if it worked
        const check = await client.getPhoneNumber('6qCz74VyQvyCq4PWSuR6Dg');
        if (!check.assignee || !check.assignee.id) {
          console.log('✅ SUCCESS: Phone number unassigned!');
          return;
        }

      } catch (error) {
        console.log(`❌ ${endpoint} failed:`, error.message);
      }
    }

    // Method 5: Check if we can move the number to unassigned pool
    console.log('\nMethod 5: Trying to move to unassigned pool...');
    try {
      // Try assigning to an "unassigned" or "available" pool
      await client.updatePhoneNumber('6qCz74VyQvyCq4PWSuR6Dg', {
        assignee: {
          type: 'unassigned',
          id: null,
          name: null
        },
        status: 'available'
      });
      console.log('✓ Moved to unassigned pool');

      const finalCheck = await client.getPhoneNumber('6qCz74VyQvyCq4PWSuR6Dg');
      if (!finalCheck.assignee || finalCheck.assignee.type === 'unassigned') {
        console.log('✅ SUCCESS: Phone number moved to unassigned pool!');
        return;
      }
    } catch (error) {
      console.log('❌ Unassigned pool move failed:', error.message);
    }

    // Final status
    console.log('\nFinal status:');
    const final = await client.getPhoneNumber('6qCz74VyQvyCq4PWSuR6Dg');
    console.log('Assignee:', final.assignee?.name || 'None');
    console.log('Status:', final.status);

    if (!final.assignee || final.assignee.type === 'unassigned') {
      console.log('✅ SUCCESS: Phone number has been unassigned!');
    } else {
      console.log('❌ All bulk management methods failed.');
      console.log('💡 Manual unassignment through Zoom Admin Portal is likely required.');
      console.log('   Go to: https://zoom.us/phone');
    }

  } catch (error) {
    console.error('❌ Bulk management testing failed:', error.message);
  }
}

bulkPhoneManagement();