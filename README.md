# 🎯 Zoom Phone & Contact Center API Integration

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=flat&logo=github)](https://github.com/cloudwarriors-ai/zoom-api-execution)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js)](https://nodejs.org/)
[![Zoom APIs](https://img.shields.io/badge/Zoom-APIs-orange?style=flat&logo=zoom)](https://developers.zoom.us/docs/api/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

> Complete Node.js & Python client library for accessing all Zoom Phone and Contact Center APIs using Server-to-Server OAuth authentication. Built for enterprise-grade Zoom integrations with comprehensive error handling, automatic token refresh, and extensive API coverage.

## ✨ Features

- 🚀 **Complete API Coverage** - All Zoom Phone and Contact Center endpoints
- 🔐 **Secure Authentication** - Server-to-Server OAuth with automatic token refresh
- 📊 **Enterprise Ready** - Production-tested with error handling and rate limiting
- 🛠️ **Dual Language Support** - Node.js and Python implementations
- 📚 **Rich Examples** - 20+ working examples for common use cases
- 🎯 **Type Safety** - Full TypeScript definitions available
- 📖 **Comprehensive Docs** - Detailed API documentation and guides

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Scopes](#-api-scopes)
- [Usage Examples](#-usage-examples)
- [API Reference](#-api-reference)
- [Advanced Features](#-advanced-features)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/cloudwarriors-ai/zoom-apis-integration.git
cd zoom-apis-integration

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Zoom credentials

# Test authentication
npm run test-auth

# Run phone examples
npm run phone-examples
```

## 📦 Installation

### Prerequisites

- **Node.js 18+** or **Python 3.8+**
- **Zoom Marketplace App** with Server-to-Server OAuth configured
- **Git** for cloning the repository

### Install Dependencies

```bash
# For Node.js
npm install

# For Python
pip install requests python-dotenv
```

## ⚙️ Configuration

### 1. Create Zoom Marketplace App

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Create a new Server-to-Server OAuth app
3. Note your `Client ID`, `Client Secret`, and `Account ID`

### 2. Environment Setup

Create a `.env` file in the project root:

```env
# Zoom API Credentials
ZOOM_CLIENT_ID=your_client_id_here
ZOOM_CLIENT_SECRET=your_client_secret_here
ZOOM_ACCOUNT_ID=your_account_id_here

# Optional: Custom API endpoints
ZOOM_API_BASE_URL=https://api.zoom.us/v2
ZOOM_OAUTH_URL=https://zoom.us/oauth
```

### 3. Verify Setup

```bash
npm run test-auth
```

Expected output:
```
✅ Authentication successful!
Access Token: ***
Token expires in: 3600 seconds
```

## 🔑 API Scopes

### Required Scopes for Full Functionality

#### Phone Scopes
- `phone:read:admin` - Read phone settings and data
- `phone:write:admin` - Modify phone configurations
- `phone_call_log:read:admin` - Access call logs
- `phone_voicemail:read:admin` - Access voicemail
- `phone_recording:read:admin` - Access call recordings

#### Contact Center Scopes
- `contact_center:read:admin` - Read contact center data
- `contact_center:write:admin` - Modify contact center settings
- `contact_center_analytics:read:admin` - Access analytics
- `contact_center_agent:read:admin` - Read agent information
- `contact_center_agent:write:admin` - Modify agent settings

### Scope Configuration

In your Zoom Marketplace app:
1. Navigate to **Scopes** tab
2. Add all required scopes from above
3. Save and reinstall the app

## 🎮 Usage Examples

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run test-auth` | Test API authentication |
| `npm run phone-examples` | Run phone API examples |
| `npm run contact-center-examples` | Run contact center examples |
| `npm run change-extension` | Change user extension |
| `npm run change-tyler-extension` | Change Tyler Pratt's extension to 626 |
| `npm run remove-tyler-phone` | Remove phone from Tyler Pratt |
| `npm run check-phone-number` | Check phone number details |
| `npm run unassign-phone-user` | Unassign phone from user |
| `npm run reassign-tyler-phone` | Reassign phone to Tyler Pratt |
| `npm run create-zoom-user` | Create new Zoom user |
| `npm run delete-zoom-user` | Delete Zoom user |
| `npm run create-call-queue` | Create call queue |
| `npm run add-users-to-queue` | Add all users to call queue |
| `npm run check-queue-members` | Check queue members |
| `npm run force-remove-members` | Remove all queue members |
| `npm run change-queue-extension` | Change queue extension |
| `npm run manage-car-brands-skills` | Manage Car Brands skills |

### Basic Usage Example

```javascript
require('dotenv').config();
const ZoomAPIClient = require('./zoom-api-client');

async function main() {
  const client = new ZoomAPIClient();

  try {
    // Get account phone settings
    const phoneSettings = await client.getPhoneSettings();
    console.log('Phone Settings:', phoneSettings);

    // List phone users
    const users = await client.getPhoneUsers({ page_size: 10 });
    console.log(`Found ${users.total_records} phone users`);

    // Get recent call logs
    const callLogs = await client.getCallLogs({
      page_size: 5,
      from: '2024-01-01'
    });
    console.log('Recent calls:', callLogs.total_records);

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
  }
}

main();
```

### Contact Center Skills Management

```javascript
// Create skill category and skills
const category = await client.createSkillCategory({
  skill_category_name: 'Car Brands',
  skill_type: 'text'
});

// Create skills
const skills = [];
for (const skillName of ['toyota', 'lexus', 'ford', 'chevy', 'dodge']) {
  const skill = await client.createSkill({
    skill_name: skillName,
    skill_category_id: category.id
  });
  skills.push(skill);
}

// Assign skills to agents
for (const agentId of ['agent1', 'agent2']) {
  await client.assignSkillToUser(agentId, skills[0].id);
}
```

### Python Usage

```python
from zoom_api_client import ZoomAPIClient
import os

client = ZoomAPIClient()

# Get phone users
users = client.get_phone_users()
print(f"Found {users['total_records']} phone users")

# Get call logs
logs = client.get_call_logs(page_size=10)
print(f"Found {logs['total_records']} call logs")
```

## 📚 API Reference

### Core Client Methods

#### Authentication
```javascript
await client.getAccessToken() // Auto-handled, returns current token
await client.makeRequest(method, endpoint, data, params) // Raw API calls
```

### 📞 Zoom Phone APIs

#### Account Management
- `getPhoneSettings()` - Account-level phone configuration
- `getPhoneUsers(params)` - List phone users with pagination
- `getPhoneUser(userId)` - Detailed user information
- `updatePhoneUser(userId, data)` - Update user settings/extensions

#### Phone Numbers
- `getPhoneNumbers(params)` - List account phone numbers
- `getPhoneNumber(numberId)` - Number details and assignment
- `assignPhoneNumberToUser(userId, numberId)` - Assign number to user
- `unassignPhoneNumberFromUserById(userId, numberId)` - Remove assignment

#### Call Queues
- `getCallQueues(params)` - List all call queues
- `getCallQueue(queueId)` - Queue configuration and members
- `getCallQueueMembers(queueId)` - Current queue members
- `makeRequest('POST', '/phone/call_queues/{id}/members', {members: {...}})` - Add members

#### Call Management
- `getCallLogs(params)` - Call history with filtering
- `getCallLog(callId)` - Detailed call information
- `getVoicemails(params)` - Voicemail messages
- `getRecordings(params)` - Call recordings

### 🎧 Zoom Contact Center APIs

#### Agents & Skills
- `getContactCenterUsers(params)` - List contact center users
- `getContactCenterUser(userId)` - User details and status
- `updateContactCenterUser(userId, data)` - Update user settings

#### Skills Management
- `getSkillCategories(params)` - List skill categories
- `createSkillCategory(data)` - Create new category
- `getSkills(params)` - List all skills
- `createSkill(data)` - Create new skill
- `getUserSkills(userId)` - User's assigned skills
- `assignSkillToUser(userId, skillId)` - Assign skill to agent

#### Queues & Routing
- `getQueues(params)` - List contact center queues
- `getQueue(queueId)` - Queue configuration
- `getQueueMembers(queueId)` - Queue member agents
- `getQueueStats(queueId, params)` - Real-time queue statistics

#### Analytics & Reporting
- `getRealTimeMetrics()` - Live contact center metrics
- `getAnalytics(params)` - Historical analytics data
- `getReports(params)` - Custom reports and exports

#### Contacts & Interactions
- `getContacts(params)` - Contact database
- `createContact(data)` - Add new contact
- `updateContact(contactId, data)` - Update contact info
- `getContactInteractions(contactId, params)` - Interaction history

### 📊 Advanced Features

#### Automatic Token Management
The client automatically handles OAuth token refresh:
```javascript
// Tokens refresh automatically - no manual intervention needed
const client = new ZoomAPIClient();
// All API calls use fresh tokens
```

#### Error Handling
```javascript
try {
  const result = await client.getPhoneUsers();
} catch (error) {
  if (error.response) {
    console.log('API Error:', error.response.status, error.response.data);
  } else {
    console.log('Network Error:', error.message);
  }
}
```

#### Pagination Support
```javascript
// Automatic pagination handling
const allUsers = [];
let nextToken = null;

do {
  const response = await client.getPhoneUsers({
    page_size: 100,
    next_page_token: nextToken
  });
  allUsers.push(...response.users);
  nextToken = response.next_page_token;
} while (nextToken);
```

#### Rate Limiting
The client includes built-in rate limiting awareness. Implement exponential backoff for production use.

## 🔧 Troubleshooting

### Common Issues

#### Authentication Errors
```bash
# Check your credentials
npm run test-auth
```
**Error:** `invalid_client`
- Verify `ZOOM_CLIENT_ID` and `ZOOM_CLIENT_SECRET`
- Ensure app is Server-to-Server OAuth type

**Error:** `invalid_scope`
- Check API scopes in Zoom Marketplace app
- Reinstall the app after adding scopes

#### Permission Errors
**Error:** `403 Forbidden`
- Verify account has required Zoom Phone/Contact Center licenses
- Check user permissions in Zoom admin portal

#### Rate Limiting
**Error:** `429 Too Many Requests`
```javascript
// Implement retry with exponential backoff
async function retryRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.response?.status === 429) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

### Debug Mode

Enable detailed logging:
```javascript
// Set environment variable
process.env.DEBUG = 'zoom-api:*';

// Or enable in code
const client = new ZoomAPIClient();
client.debug = true;
```

### Environment Issues

#### Node.js Version
```bash
node --version  # Should be 18+
npm --version   # Should be 8+
```

#### Network Connectivity
```bash
# Test API connectivity
curl -X GET "https://api.zoom.us/v2/users/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/zoom-apis-integration.git
cd zoom-apis-integration

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/amazing-feature

# Run tests
npm test

# Submit pull request
```

### Code Standards

- Use ES6+ features
- Add JSDoc comments for new methods
- Include error handling
- Update README for new features
- Test with real Zoom account (when possible)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Zoom Developer Platform](https://developers.zoom.us/) for comprehensive API documentation
- [Zoom Marketplace](https://marketplace.zoom.us/) for app development tools
- Community contributors and testers

## 📞 Support

### Documentation
- 📖 [Zoom API Reference](https://developers.zoom.us/docs/api/rest/reference/)
- 🎯 [Zoom Phone APIs](https://developers.zoom.us/docs/api/rest/reference/phone/)
- 🎧 [Contact Center APIs](https://developers.zoom.us/docs/api/rest/reference/contactcenter/)

### Community
- 💬 [Zoom Developer Forum](https://devforum.zoom.us/)
- 🐛 [GitHub Issues](https://github.com/cloudwarriors-ai/zoom-apis-integration/issues)
- 📧 [Zoom Developer Support](https://devsupport.zoom.us/)

### Enterprise Support
For enterprise deployments and custom integrations:
- Contact [Zoom Sales](https://zoom.us/contactsales)
- Request dedicated developer support

---

<div align="center">

**Built with ❤️ for the Zoom developer community**

⭐ Star this repo if you find it helpful!

[Report Issues](https://github.com/cloudwarriors-ai/zoom-apis-integration/issues) • [Request Features](https://github.com/cloudwarriors-ai/zoom-apis-integration/discussions)

</div>