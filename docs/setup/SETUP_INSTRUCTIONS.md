# Complete Setup Instructions

## What You've Got

A complete AI voice agent system that:
- Monitors user engagement in real-time
- Detects when users are disengaging
- Automatically calls them with a personalized script
- Uses Vapi for natural AI conversations
- Tracks all interactions and outcomes

## Files Overview

```
✅ Core Services
   ├── src/services/dataAnalyzer.js        - Detects engagement drops
   ├── src/services/vapiService.js         - Makes AI voice calls
   └── src/services/engagementMonitor.js   - Orchestrates everything

✅ Configuration
   ├── src/config/vapi.config.js          - Vapi settings
   └── .env.example                       - Environment template

✅ Server
   └── src/index.js                       - REST API server

✅ Documentation
   ├── README.md                          - Full documentation
   ├── QUICKSTART.md                      - 5-minute setup
   ├── PROJECT_STRUCTURE.md               - Architecture details
   └── SETUP_INSTRUCTIONS.md              - This file

✅ Examples & Tests
   ├── examples/usage-example.js          - Code examples
   ├── examples/api-usage.sh              - API examples
   └── test-quick.js                      - Quick test
```

## Step-by-Step Setup

### 1. Install Node.js (if not installed)

```bash
# Check if you have Node.js
node --version

# If not, install from https://nodejs.org (v18 or higher)
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `@vapi-ai/server-sdk` - Vapi SDK
- `axios` - HTTP client
- `express` - Web server
- `dotenv` - Environment variables

### 3. Get Vapi Credentials

#### 3a. Create Vapi Account
1. Go to https://vapi.ai
2. Sign up (they have a free tier!)
3. Verify your email

#### 3b. Get API Key
1. Go to Dashboard → Settings → API Keys
2. Click "Create New Key"
3. Copy the key (starts with `sk_live_...`)

#### 3c. Get Phone Number
1. Go to Dashboard → Phone Numbers
2. Click "Buy Phone Number"
3. Choose a number (costs ~$1/month)
4. Copy the Phone Number ID

### 4. Configure Environment

```bash
# Copy the template
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use any text editor
```

Add your Vapi credentials:

```env
VAPI_API_KEY=sk_live_your_actual_api_key_here
VAPI_PHONE_NUMBER_ID=your_phone_number_id_here

PORT=3000
NODE_ENV=development

ENGAGEMENT_DROP_THRESHOLD=0.30
CHECK_INTERVAL_MS=300000

COMPANY_NAME=Your Company Name
SUPPORT_EMAIL=support@yourcompany.com
```

### 5. Test the Setup

```bash
# Quick test (doesn't make calls)
npm install && node test-quick.js
```

You should see:
```
🧪 Testing Revenue Optimization System
✅ Drop detected correctly!
✅ All tests passed!
```

### 6. Start the Server

```bash
npm start
```

You should see:
```
🚀 Revenue Optimization Server Started
📍 Port: 3000
🌐 Health check: http://localhost:3000/health
```

### 7. Test with a Real Call

Open a new terminal:

```bash
# Add yourself as a test user (USE YOUR REAL PHONE NUMBER!)
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "myself",
    "name": "Your Name",
    "phone": "+1234567890",
    "engagementData": [
      {"timestamp": "2024-01-01T10:00:00Z", "value": 90},
      {"timestamp": "2024-01-05T10:00:00Z", "value": 40}
    ]
  }'

# Trigger a call to yourself
curl -X POST http://localhost:3000/api/users/myself/check
```

**You should receive a phone call within seconds!** 📞

The AI will say something like:
> "Hello! This is a friendly check-in from [Your Company]. We noticed you haven't been using our platform much lately, and we wanted to reach out to see if there's anything we can help with..."

### 8. Integration with Your Data

Now integrate with your actual analytics:

```javascript
// In your application code
async function trackUserEngagement(userId, engagementScore) {
  await fetch('http://localhost:3000/api/users/${userId}/engagement', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      value: engagementScore,
      timestamp: new Date().toISOString()
    })
  });
}

// Call this whenever you have new engagement data
trackUserEngagement('user_123', 75);
```

## Customization Guide

### Change the Voice

1. Go to https://elevenlabs.io/voice-library
2. Find a voice you like and copy its ID
3. Edit [src/config/vapi.config.js](src/config/vapi.config.js):

```javascript
voice: {
  provider: "11labs",
  voiceId: "YOUR_CHOSEN_VOICE_ID"
}
```

### Customize the Script

Edit [src/services/vapiService.js](src/services/vapiService.js) in the `generateScript()` method:

```javascript
let greeting = `Hello ${userName}! This is [Your Custom Message]...`;
```

### Adjust Sensitivity

In `.env`:

```env
# More aggressive (trigger on 20% drop)
ENGAGEMENT_DROP_THRESHOLD=0.20

# Less aggressive (trigger on 50% drop)
ENGAGEMENT_DROP_THRESHOLD=0.50
```

### Change Check Frequency

```env
# Check every 1 minute (for testing)
CHECK_INTERVAL_MS=60000

# Check every 30 minutes
CHECK_INTERVAL_MS=1800000

# Check every 1 hour
CHECK_INTERVAL_MS=3600000
```

## Using the API

### Add User
```bash
POST /api/users
{
  "id": "user_123",
  "name": "John Doe",
  "phone": "+14155551234",
  "engagementData": [...]
}
```

### Update Engagement
```bash
POST /api/users/user_123/engagement
{
  "value": 75,
  "timestamp": "2024-01-10T10:00:00Z"
}
```

### Start Monitoring
```bash
POST /api/monitoring/start
{
  "intervalMs": 300000
}
```

### Get Stats
```bash
GET /api/stats
```

## Production Deployment

### Option 1: Railway (Easiest)

1. Push to GitHub
2. Go to https://railway.app
3. Connect your repo
4. Add environment variables
5. Deploy!

### Option 2: Heroku

```bash
# Install Heroku CLI
heroku create your-app-name

# Add environment variables
heroku config:set VAPI_API_KEY=your_key
heroku config:set VAPI_PHONE_NUMBER_ID=your_id

# Deploy
git push heroku main
```

### Option 3: DigitalOcean/AWS/etc.

1. Set up a server
2. Install Node.js
3. Clone your repo
4. Run `npm install`
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name revenue-optimizer
   pm2 save
   ```

## Webhooks Setup (Optional but Recommended)

After deploying to production:

1. Get your public URL (e.g., `https://your-app.railway.app`)
2. Go to Vapi Dashboard → Settings → Webhooks
3. Add webhook URL: `https://your-app.railway.app/api/webhooks/vapi`
4. Select events: `call-started`, `call-ended`, `transcript`

Now you'll receive real-time updates about calls!

## Monitoring and Debugging

### View Logs

```bash
# In development
# Logs appear in terminal

# In production with PM2
pm2 logs revenue-optimizer
```

### Check Stats

```bash
curl http://localhost:3000/api/stats
```

### View Specific Call

```bash
curl http://localhost:3000/api/calls/CALL_ID
```

### Common Issues

**"Cannot find module 'axios'"**
- Run `npm install`

**"Invalid API key"**
- Check `.env` file
- Ensure no extra spaces
- Get new key from Vapi

**"Phone call not received"**
- Check phone number format (+14155551234)
- Verify Vapi account has credit
- Check Vapi dashboard for errors

**"No drop detected"**
- Check engagement data values
- Verify threshold in `.env`
- Need at least 3 data points

## Next Steps for CalHacks

1. **Demo**: Use real phone numbers to demo live calls
2. **Data Source**: Connect to a real database or API
3. **Dashboard**: Build a web UI to visualize engagement
4. **Analytics**: Track call outcomes and re-engagement rates
5. **A/B Testing**: Test different scripts and thresholds
6. **Multi-channel**: Add SMS/email before calling

## Advanced Features to Add

- **Sentiment Analysis**: Analyze call transcripts
- **Follow-up Scheduling**: Schedule callback if needed
- **CRM Integration**: Sync with Salesforce/HubSpot
- **ML Predictions**: Predict churn before it happens
- **Multi-language**: Support multiple languages
- **Call Recording Analysis**: Use AI to analyze conversations

## Resources

- **Vapi Docs**: https://docs.vapi.ai
- **Vapi Dashboard**: https://dashboard.vapi.ai
- **ElevenLabs Voices**: https://elevenlabs.io/voice-library
- **This Project Docs**: README.md, QUICKSTART.md, PROJECT_STRUCTURE.md

## Support

Questions? Check:
1. [README.md](README.md) - Full documentation
2. [QUICKSTART.md](QUICKSTART.md) - Quick setup
3. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture
4. Vapi Discord/Support

## Demo Script for CalHacks

When demoing:

1. **Show the Problem**: "Users are disengaging, and we're losing revenue"
2. **Show the Data**: Display engagement metrics dropping
3. **Trigger the System**: Run the check endpoint
4. **Receive the Call**: Answer the AI call live
5. **Show the Results**: Display call logs and transcript
6. **Show ROI**: Explain how re-engagement increases revenue

Good luck with CalHacks! 🚀
