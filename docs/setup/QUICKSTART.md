# Quick Start Guide

Get your AI voice agent running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Vapi Account

1. Go to [vapi.ai](https://vapi.ai) and create an account
2. Navigate to Dashboard → API Keys
3. Copy your API key
4. Go to Phone Numbers → Buy a number
5. Copy the Phone Number ID

## Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
VAPI_API_KEY=sk_live_xxxxxxxxxx
VAPI_PHONE_NUMBER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
COMPANY_NAME=My Awesome Company
```

## Step 4: Start the Server

```bash
npm start
```

You should see:

```
🚀 Revenue Optimization Server Started
📍 Port: 3000
🌐 Health check: http://localhost:3000/health
```

## Step 5: Add Your First User

Open a new terminal and run:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_user_1",
    "name": "Test User",
    "phone": "+1234567890",
    "engagementData": [
      {"timestamp": "2024-01-01T10:00:00Z", "value": 90},
      {"timestamp": "2024-01-02T10:00:00Z", "value": 85},
      {"timestamp": "2024-01-03T10:00:00Z", "value": 80},
      {"timestamp": "2024-01-04T10:00:00Z", "value": 60},
      {"timestamp": "2024-01-05T10:00:00Z", "value": 45}
    ]
  }'
```

**Note**: Replace `+1234567890` with your actual phone number to test!

## Step 6: Trigger a Test Call

```bash
curl -X POST http://localhost:3000/api/users/test_user_1/check
```

This will:
1. Analyze the engagement data (50% drop detected!)
2. Generate a personalized script
3. Initiate a call via Vapi
4. You should receive a phone call!

## Step 7: Check the Results

```bash
# Get monitoring stats
curl http://localhost:3000/api/stats

# Get call history for the user
curl http://localhost:3000/api/users/test_user_1/calls
```

## Step 8: Start Automatic Monitoring

```bash
curl -X POST http://localhost:3000/api/monitoring/start \
  -H "Content-Type: application/json" \
  -d '{"intervalMs": 300000}'
```

Now the system will automatically check all users every 5 minutes!

## Next Steps

### Integrate with Your Data

Replace the manual curl commands with your actual data pipeline:

```javascript
// Example: Send data from your analytics system
async function sendEngagementData(userId, score) {
  await fetch('http://localhost:3000/api/users/${userId}/engagement', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      value: score,
      timestamp: new Date().toISOString()
    })
  });
}
```

### Customize the Voice

Edit [src/config/vapi.config.js](src/config/vapi.config.js):

```javascript
voice: {
  provider: "11labs",
  voiceId: "YOUR_PREFERRED_VOICE_ID"
}
```

Browse voices at [ElevenLabs](https://elevenlabs.io/voice-library)

### Adjust Sensitivity

In `.env`:

```env
# More sensitive (trigger on 20% drop)
ENGAGEMENT_DROP_THRESHOLD=0.20

# Less sensitive (trigger on 50% drop)
ENGAGEMENT_DROP_THRESHOLD=0.50
```

### Set Up Webhooks (Optional)

1. Deploy to a public server (Heroku, Railway, etc.)
2. Add webhook URL in Vapi dashboard: `https://your-domain.com/api/webhooks/vapi`
3. Receive real-time updates on call status

## Common Issues

### "Invalid phone number"
- Use E.164 format: `+14155551234`
- Include country code
- No spaces or special characters

### "Insufficient data points"
- Need at least 3 data points
- Add more historical data

### "No drop detected"
- Check if drop exceeds threshold
- Verify data values are numeric
- Review threshold in `.env`

### "API key invalid"
- Double-check `VAPI_API_KEY` in `.env`
- Ensure no extra spaces
- Get new key from Vapi dashboard

## Demo Mode

Want to test without actual calls? Modify [src/services/vapiService.js](src/services/vapiService.js):

```javascript
async makeCall(callParams) {
  // DEMO MODE: Just log, don't call
  console.log('DEMO: Would call', callParams.phoneNumber);
  return {
    success: true,
    callId: 'demo_' + Date.now(),
    status: 'demo'
  };
}
```

## Need Help?

- Check the full [README.md](README.md)
- Review [examples/usage-example.js](examples/usage-example.js)
- Check Vapi logs in your dashboard
- Review server logs for errors

## Production Checklist

Before going live:

- [ ] Test with real phone numbers
- [ ] Adjust engagement thresholds
- [ ] Customize scripts for your brand
- [ ] Set up webhooks for monitoring
- [ ] Add error handling for your use case
- [ ] Set appropriate check intervals
- [ ] Configure call cooldown periods
- [ ] Test different drop scenarios
- [ ] Monitor call quality and outcomes

Happy building! 🚀
