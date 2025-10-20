# Zoom API Executor

Simple, easy-to-use Zoom Phone API integration with Python and Node.js.

## 🚀 Quick Start (5 minutes)

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install requests python-dotenv flask
```

### 2. Get Your Zoom Credentials

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Click **Develop** → **Build App**
3. Choose **Server-to-Server OAuth**
4. Fill in basic app info and create the app
5. Copy your credentials:
   - **Account ID**
   - **Client ID**
   - **Client Secret**

### 3. Add Required Scopes

In your Zoom app, go to the **Scopes** tab and add:

**Phone Scopes:**
- `phone:read:admin`
- `phone:write:admin`
- `phone_call_log:read:admin`
- `phone_recording:read:admin`

Click **Continue** and activate your app.

### 4. Configure Environment

Edit the `.env` file and add your credentials:

```env
ZOOM_CLIENT_ID=your_client_id_here
ZOOM_CLIENT_SECRET=your_client_secret_here
ZOOM_ACCOUNT_ID=your_account_id_here
```

### 5. Start Using!

**Run the Flask API:**
```bash
npm start
# API runs on http://localhost:8080
```

**Test the API:**
```bash
curl http://localhost:8080/api/health
```

**Use in Node.js:**
```javascript
require('dotenv').config();
const ZoomAPIClient = require('./zoom-api-client');

const client = new ZoomAPIClient();

// Get phone users
const users = await client.getPhoneUsers({ page_size: 10 });
console.log(users);
```

**Use in Python:**
```python
from zoom_api_client import ZoomAPIClient

client = ZoomAPIClient()

# Get phone users
users = client.get_phone_users({"page_size": 10})
print(users)
```

## 📁 Project Structure

```
├── app.py                      # Flask REST API
├── zoom_api_client.py          # Python Zoom client
├── zoom-api-client.js          # Node.js Zoom client
├── tasks/                      # Task scripts
│   ├── get_all_users.js
│   ├── batch_patch.js
│   └── update_auto_recording_access.py
├── .env                        # Your credentials (DON'T COMMIT!)
└── README.md
```

## 🎯 What You Can Do

### Flask API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | List phone users |
| GET | `/api/users/{id}` | Get user details |
| PATCH | `/api/users/{id}/extension` | Update extension |
| GET | `/api/phone-numbers` | List phone numbers |
| POST | `/api/users/{id}/phone-numbers/{numberId}` | Assign number |
| DELETE | `/api/users/{id}/phone-numbers/{numberId}` | Unassign number |
| GET | `/api/call-logs` | Get call logs |
| GET | `/api/call-queues` | List call queues |
| POST | `/api/call-queues` | Create call queue |
| POST | `/api/zoom-users` | Create Zoom user |
| DELETE | `/api/zoom-users/{id}` | Delete Zoom user |

### API Client Methods

**Phone APIs:**
- `getPhoneUsers()` - List phone users
- `getPhoneUser(userId)` - Get user details
- `updatePhoneUser(userId, data)` - Update user
- `getPhoneNumbers()` - List phone numbers
- `assignPhoneNumberToUser(userId, numberId)` - Assign number
- `getCallLogs()` - Get call logs
- `getCallQueues()` - List call queues
- `getVoicemails()` - Get voicemails
- `getRecordings()` - Get recordings

## 💡 Quick Examples

### Get All Phone Users
```javascript
const client = new ZoomAPIClient();
const users = await client.getPhoneUsers();
console.log(`Found ${users.total_records} users`);
```

### Update User Extension
```javascript
await client.updatePhoneUser('user_id', {
  extension_number: 1234
});
```

### Get Call Logs
```javascript
const logs = await client.getCallLogs({
  page_size: 100,
  from: '2024-01-01',
  to: '2024-12-31'
});
```

### Use the Flask API
```bash
# Get phone users
curl http://localhost:8080/api/users

# Update extension
curl -X PATCH http://localhost:8080/api/users/USER_ID/extension \
  -H "Content-Type: application/json" \
  -d '{"extension_number": 1234}'

# Get call logs
curl http://localhost:8080/api/call-logs?page_size=10
```

## 🔧 Troubleshooting

**Authentication fails?**
- Check your credentials in `.env`
- Make sure your Zoom app is activated
- Verify you added the required scopes

**403 Forbidden?**
- Check if your account has Zoom Phone license
- Verify scopes are added and app is reactivated

**Module not found?**
- Run `npm install` for Node.js
- Run `pip install requests python-dotenv flask` for Python

## 📖 Documentation

- [Zoom API Docs](https://developers.zoom.us/docs/api/)
- [Zoom Phone API](https://developers.zoom.us/docs/api/rest/reference/phone/)

## 🔒 Security

- Never commit your `.env` file
- Keep your credentials secure
- Use environment variables in production
- Rotate credentials regularly

## 📝 License

MIT License - feel free to use this in your projects!

---

**Need help?** Open an issue on GitHub or check the Zoom Developer Forum.
