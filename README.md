# Zoom Phone & Contact Center API Integration

Complete Node.js client for accessing all Zoom Phone and Contact Center APIs using Server-to-Server OAuth authentication.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your credentials:**
   - Copy your credentials to the `.env` file (already done)
   - Ensure your Zoom Marketplace app has the required scopes enabled

## Required Scopes

Make sure your Server-to-Server OAuth app has these scopes enabled:

### Phone Scopes:
- `phone:read:admin`
- `phone:write:admin`
- `phone_call_log:read:admin`
- `phone_voicemail:read:admin`
- `phone_recording:read:admin`

### Contact Center Scopes:
- `contact_center:read:admin`
- `contact_center:write:admin`
- `contact_center_analytics:read:admin`
- `contact_center_agent:read:admin`
- `contact_center_agent:write:admin`

## Usage

### Test Authentication
```bash
npm run test-auth
```

### Phone API Examples
```bash
npm run phone-examples
```

### Contact Center API Examples
```bash
npm run contact-center-examples
```

### Change User Extension
```bash
npm run change-extension
```

### Change Tyler Pratt's Extension to 626
```bash
npm run change-tyler-extension
```

### Remove Phone Number from Tyler Pratt
```bash
npm run remove-tyler-phone
```

### Check Phone Number Details
```bash
npm run check-phone-number
```

### Unassign Phone Number from User
```bash
npm run unassign-phone-user
```

### Reassign Phone Number to Tyler Pratt
```bash
npm run reassign-tyler-phone
```

### Create New Zoom User
```bash
npm run create-zoom-user
```

### Delete Zoom User
```bash
npm run delete-zoom-user
```

### Create Call Queue
```bash
npm run create-call-queue
```

### Add All Users to Call Queue
```bash
npm run add-users-to-queue
```

### Check Call Queue Members
```bash
npm run check-queue-members
```

### Remove All Members from Call Queue
```bash
npm run force-remove-members
```

### Change Call Queue Extension
```bash
npm run change-queue-extension
```

## API Client Methods

### Authentication
- `getAccessToken()` - Generate OAuth access token
- `makeRequest(method, endpoint, data, params)` - Make authenticated API request

### General User Management
- `makeRequest('POST', '/users', userData)` - Create new Zoom user account
- `makeRequest('DELETE', '/users/{userId}', {action: 'delete'})` - Delete Zoom user account

### Zoom Phone APIs

#### Account & Users
- `getPhoneAccount()` - Get phone account information
- `getPhoneUsers()` - List phone users
- `getPhoneUserSettings(userId)` - Get user phone settings

#### Numbers & Extensions
- `getPhoneNumbers()` - List phone numbers

#### Users
- `getPhoneUsers(params)` - List phone users
- `getPhoneUser(userId)` - Get phone user details
- `updatePhoneUser(userId, userData)` - Update phone user (extension, settings, etc.)
- `assignPhoneNumberToUser(userId, phoneNumberId)` - Assign phone number to user
- `unassignPhoneNumberFromUserById(userId, phoneNumberId)` - Unassign phone number from user

#### Call Queues
- `getCallQueues(params)` - List call queues
- `getCallQueue(queueId)` - Get call queue details
- `getCallQueueMembers(queueId)` - Get call queue members (alternative endpoint)
- `makeRequest('POST', '/phone/call_queues', queueData)` - Create call queue
- `makeRequest('PATCH', '/phone/call_queues/{queueId}', updateData)` - Update call queue settings
- `makeRequest('POST', '/phone/call_queues/{queueId}/members', membersData)` - Add members to call queue
- `makeRequest('DELETE', '/phone/call_queues/{queueId}/members/{memberId}')` - Remove member from call queue

#### Calls
- `getCallLogs(params)` - Get call logs with filtering
- `getActiveCalls()` - Get currently active calls
- `initiateCall(from, to, options)` - Make outbound call
- `transferCall(callId, transferTo, transferType)` - Transfer call
- `holdCall(callId, hold)` - Hold/unhold call
- `endCall(callId)` - End call

#### Voicemail & Recordings
- `getVoicemails(userId)` - Get user voicemails

#### Call Management
- `getCallQueues()` - List call queues
- `getAutoReception()` - Get auto reception settings

### Zoom Contact Center APIs

#### Account & Agents
- `getContactCenterAccount()` - Get contact center account info
- `getAgents()` - List agents
- `getAgentStatus(agentId)` - Get agent status
- `updateAgentStatus(agentId, status, reasonId)` - Update agent status

#### Queues & Routing
- `getQueues()` - List queues
- `getQueueStats(queueId, params)` - Get queue statistics

#### Campaigns
- `getCampaigns()` - List campaigns
- `getCampaign(campaignId)` - Get campaign details
- `startCampaign(campaignId)` - Start campaign
- `stopCampaign(campaignId)` - Stop campaign

#### Analytics & Reporting
- `getAnalytics(params)` - Get analytics data
- `getRealTimeMetrics()` - Get real-time metrics

#### Contacts
- `getContacts(params)` - List contacts
- `createContact(contactData)` - Create new contact
- `updateContact(contactId, contactData)` - Update contact
- `getContactInteractions(contactId)` - Get contact interaction history

## Example Usage

```javascript
require('dotenv').config();
const ZoomAPIClient = require('./zoom-api-client');

async function example() {
  const client = new ZoomAPIClient();

  try {
    // Get phone account info
    const account = await client.getPhoneAccount();
    console.log('Phone account:', account);

    // List agents
    const agents = await client.getAgents();
    console.log('Agents:', agents);

    // Get recent call logs
    const callLogs = await client.getCallLogs({
      page_size: 10,
      from: '2024-01-01'
    });
    console.log('Call logs:', callLogs);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

example();
```

## Error Handling

All methods throw errors for failed API requests. Check `error.response.status` and `error.response.data` for detailed error information.

## Rate Limits

Zoom APIs have rate limits. The client handles token refresh automatically, but you should implement retry logic for rate-limited requests.

## Webhooks

For real-time events, configure webhooks in your Zoom Marketplace app and implement webhook endpoints to receive:
- Call events (answered, ended, etc.)
- Agent status changes
- Contact center events

## Support

This client covers all documented Zoom Phone and Contact Center API endpoints. Check the [Zoom Developer Docs](https://developers.zoom.us/docs/api/) for the latest API specifications.