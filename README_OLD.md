# Revenue Optimization AI Voice Agent

A CalHacks project that uses AI-powered voice calls to **convert churning users back into active customers** through strategic negotiation. Built with Vapi for natural voice conversations.

## Overview

This system monitors user engagement metrics and automatically triggers personalized phone calls when it detects significant drops in activity. The AI voice agent is trained as a **Revenue Recovery Specialist** that can:
- Identify why users are disengaging
- Negotiate pricing and offer strategic incentives (up to 50% discounts)
- Re-engage users with empathetic conversation
- Convert dead revenue into active revenue

**💰 Turn churn into revenue with AI-powered retention calls.**

## Features

- **Automatic Engagement Monitoring**: Continuously tracks user engagement metrics
- **Smart Drop Detection**: Identifies meaningful drops using statistical analysis
- **Revenue Recovery AI**: Expert negotiation system trained to win back customers
- **Strategic Discounting**: AI can offer 20-50% discounts with clear authority levels
- **5-Phase Conversation Framework**: Discovery → Qualification → Value → Negotiation → Close
- **Dynamic Call Scripts**: Personalized scripts based on drop severity and user behavior
- **AI Voice Conversations**: Natural, empathetic calls powered by Vapi + GPT-4
- **Call History Tracking**: Records all interactions, offers, and outcomes
- **REST API**: Full API for integration with existing systems
- **Webhook Support**: Real-time updates on call status

## Architecture

```
┌─────────────────┐
│  Your Data      │
│  Source         │
└────────┬────────┘
         │
         v
┌─────────────────┐
│  Engagement     │
│  Monitor        │
└────────┬────────┘
         │
         v
┌─────────────────┐      ┌──────────────┐
│  Data Analyzer  │─────>│ Drop         │
│                 │      │ Detected?    │
└─────────────────┘      └──────┬───────┘
                                │ YES
                                v
                         ┌──────────────┐
                         │ Generate     │
                         │ Script       │
                         └──────┬───────┘
                                │
                                v
                         ┌──────────────┐
                         │ Vapi API     │
                         │ (Make Call)  │
                         └──────────────┘
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Get these from https://vapi.ai
VAPI_API_KEY=your_vapi_api_key_here
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id_here

# Server settings
PORT=3000
NODE_ENV=development

# Engagement settings
ENGAGEMENT_DROP_THRESHOLD=0.30  # 30% drop triggers a call
CHECK_INTERVAL_MS=300000        # Check every 5 minutes

# Company info (used in calls)
COMPANY_NAME=Your Company
SUPPORT_EMAIL=support@yourcompany.com
```

### 3. Get Vapi Credentials

1. Sign up at [vapi.ai](https://vapi.ai)
2. Get your API key from the dashboard
3. Purchase a phone number and get its ID
4. (Optional) Configure webhook URL: `https://your-domain.com/api/webhooks/vapi`

## Usage

### Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### API Endpoints

#### Add User to Monitoring

```bash
POST /api/users
Content-Type: application/json

{
  "id": "user_123",
  "name": "John Doe",
  "phone": "+14155551234",
  "engagementData": [
    {"timestamp": "2024-01-01T10:00:00Z", "value": 85},
    {"timestamp": "2024-01-02T10:00:00Z", "value": 82}
  ]
}
```

#### Update Engagement Data

```bash
POST /api/users/:userId/engagement
Content-Type: application/json

{
  "value": 75,
  "timestamp": "2024-01-03T10:00:00Z",
  "metric": "engagement_score"
}
```

#### Manually Check User

```bash
POST /api/users/:userId/check
```

#### Get Monitoring Stats

```bash
GET /api/stats
```

#### Start/Stop Monitoring

```bash
POST /api/monitoring/start
POST /api/monitoring/stop
```

### Programmatic Usage

```javascript
import { EngagementMonitor } from './src/services/engagementMonitor.js';

const monitor = new EngagementMonitor();

// Add user
monitor.addUser({
  id: 'user_001',
  name: 'John Doe',
  phone: '+14155551234',
  engagementData: [
    { timestamp: '2024-01-01T10:00:00Z', value: 85 },
    { timestamp: '2024-01-05T10:00:00Z', value: 50 }
  ]
});

// Check user
const result = await monitor.checkUser('user_001');

// Start automatic monitoring
monitor.startMonitoring(300000); // Every 5 minutes
```

## How It Works

### 1. Data Analysis

The system analyzes engagement data to detect:
- **Percentage drops**: Compares recent activity to baseline
- **Trends**: Identifies declining, improving, or stable patterns
- **Patterns**: Detects sudden drops or consecutive declines

### 2. Call Triggering

Calls are triggered when:
- Drop percentage exceeds threshold (default: 30%)
- Recent average is below baseline
- User hasn't been called in the last 48 hours

### 3. Dynamic Scripts

Scripts are generated based on:
- User name and context
- Drop percentage severity
- Engagement trend pattern

Example scripts:

**Large drop (>50%)**:
> "Hello John! This is a friendly check-in from Our Company. We noticed you haven't been using our platform much lately, and we wanted to reach out to see if there's anything we can help with..."

**Moderate decline**:
> "Hello John! This is a friendly check-in from Our Company. We saw that your engagement has been declining a bit, and we wanted to make sure everything is going smoothly..."

### 4. Call Execution

Vapi handles:
- Natural voice synthesis
- Conversation flow
- User responses
- Call recording and transcription

## Configuration

### Engagement Thresholds

Adjust in `.env`:

```env
# Trigger calls when engagement drops by 30%
ENGAGEMENT_DROP_THRESHOLD=0.30

# Check every 5 minutes
CHECK_INTERVAL_MS=300000
```

### Voice Settings

Customize in [src/config/vapi.config.js](src/config/vapi.config.js):

```javascript
voice: {
  provider: "11labs",
  voiceId: "21m00Tcm4TlvDq8ikWAM", // Change to your preferred voice
}
```

### System Prompt

Modify the assistant's behavior in [src/config/vapi.config.js](src/config/vapi.config.js):

```javascript
systemPrompt: `You are a helpful customer success representative...`
```

## Data Format

### Engagement Data Points

```javascript
{
  "timestamp": "2024-01-01T10:00:00Z",  // ISO 8601 format
  "value": 85,                           // Numeric engagement score
  "metric": "engagement_score"           // Optional: metric type
}
```

Common metrics:
- `engagement_score`: Overall engagement (0-100)
- `daily_active_minutes`: Time spent
- `feature_usage`: Number of features used
- `login_frequency`: Logins per week

## Testing

### Test with Sample Data

Run the example:

```bash
node examples/usage-example.js
```

### Test API Endpoints

```bash
chmod +x examples/api-usage.sh
./examples/api-usage.sh
```

### Test Individual Components

```javascript
import { DataAnalyzer } from './src/services/dataAnalyzer.js';

const analyzer = new DataAnalyzer(0.30);
const result = analyzer.analyzeEngagement([
  { timestamp: '2024-01-01', value: 80 },
  { timestamp: '2024-01-05', value: 50 }
]);

console.log(result);
// { hasDropped: true, dropPercentage: 37.5, ... }
```

## Webhook Integration

Configure your webhook URL in Vapi dashboard to receive events:

```javascript
// Events you'll receive
{
  "type": "call-started",
  "call": { "id": "...", "status": "in-progress" }
}

{
  "type": "call-ended",
  "call": { "id": "...", "duration": 120, "transcript": "..." }
}
```

## Best Practices

1. **Data Quality**: Ensure consistent, accurate engagement data
2. **Call Frequency**: Don't call users too frequently (default: 48h cooldown)
3. **Threshold Tuning**: Adjust drop threshold based on your metrics
4. **Script Testing**: Test scripts with different scenarios
5. **Monitoring**: Check call outcomes and adjust approach

## Troubleshooting

### Calls Not Triggering

- Check if `ENGAGEMENT_DROP_THRESHOLD` is too high
- Verify users have enough data points (minimum: 3)
- Check if cooldown period is active
- Review logs for analysis results

### API Errors

- Verify `VAPI_API_KEY` is correct
- Check phone number format (E.164: +14155551234)
- Ensure phone number is verified in Vapi

### Voice Quality Issues

- Try different voice IDs from 11labs or other providers
- Adjust temperature in model config
- Refine system prompts

## License

MIT

## Support

For questions about:
- **Vapi**: [Vapi Documentation](https://docs.vapi.ai)
- **This Project**: Open an issue on GitHub

---

Built for CalHacks 2024
