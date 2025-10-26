# Frontend Integration Guide

## Overview

Your frontend analytics dashboard is now fully integrated with the Vapi AI calling backend! The system automatically:
1. Analyzes user engagement data from your frontend
2. Detects drops using statistical analysis
3. Triggers revenue recovery calls via Vapi
4. **All calls go to**: `+14155797753` (your demo number)

## How It Works

```
Frontend Dashboard (React)
        ↓
   User Engagement Data
        ↓
Backend API (/api/frontend/*)
        ↓
   Data Analyzer
        ↓
   Drop Detected? → Yes
        ↓
   Vapi Service
        ↓
📞 AI Call to +14155797753
```

## API Endpoints

### 1. Analyze Single User

Analyzes one user and triggers a call if engagement dropped.

**Endpoint**: `POST /api/frontend/analyze-user`

**Request**:
```javascript
fetch('http://localhost:3000/api/frontend/analyze-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'usr_001',
    name: 'Sarah Chen',
    email: 'sarah@techflow.com',
    company: 'TechFlow',
    plan: 'Enterprise',
    engagementScore: 32,
    previousScore: 87,
    status: 'critical',
    metrics: {
      dailyActiveUse: 15,
      weeklyActiveUse: 25,
      monthlyActiveUse: 40,
      featureAdoption: 35,
      dataQuality: 60,
      teamCollaboration: 20,
    },
    engagementTrend: [
      { date: 'Oct 1', score: 85 },
      { date: 'Oct 5', score: 82 },
      { date: 'Oct 10', score: 75 },
      { date: 'Oct 15', score: 60 },
      { date: 'Oct 20', score: 45 },
      { date: 'Oct 25', score: 32 },
    ],
    dropoffReason: 'Decreased login frequency, limited feature usage'
  })
});
```

**Response**:
```json
{
  "success": true,
  "result": {
    "userId": "usr_001",
    "userName": "Sarah Chen",
    "status": "call_initiated",
    "analysis": {
      "hasDropped": true,
      "dropPercentage": 62.3,
      "baseline": 78.5,
      "recentAverage": 39.0,
      "trend": "declining"
    },
    "callResult": {
      "success": true,
      "callId": "call_abc123",
      "status": "queued"
    },
    "phoneNumber": "+14155797753"
  },
  "message": "Call initiated to +14155797753"
}
```

### 2. Batch Analyze Multiple Users

Analyzes all users and triggers calls for those with drops.

**Endpoint**: `POST /api/frontend/analyze-batch`

**Request**:
```javascript
fetch('http://localhost:3000/api/frontend/analyze-batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    users: [
      { /* user 1 data */ },
      { /* user 2 data */ },
      { /* user 3 data */ }
    ]
  })
});
```

**Response**:
```json
{
  "success": true,
  "results": [
    {
      "userId": "usr_001",
      "userName": "Sarah Chen",
      "status": "call_initiated",
      "analysis": { "dropPercentage": 62.3 }
    },
    {
      "userId": "usr_002",
      "userName": "Michael Rodriguez",
      "status": "call_initiated",
      "analysis": { "dropPercentage": 25.6 }
    },
    {
      "userId": "usr_003",
      "userName": "Emily Watson",
      "status": "no_action_needed",
      "message": "Engagement is stable"
    }
  ],
  "summary": {
    "totalUsers": 3,
    "callsInitiated": 2,
    "noActionNeeded": 1,
    "recentlyCalled": 0,
    "errors": 0
  }
}
```

### 3. Analyze Only Critical Users

Analyzes only users with `status: 'critical'`.

**Endpoint**: `POST /api/frontend/analyze-critical`

**Request**:
```javascript
fetch('http://localhost:3000/api/frontend/analyze-critical', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    users: allUsers // Will filter for status === 'critical'
  })
});
```

**Response**:
```json
{
  "success": true,
  "results": [
    {
      "userId": "usr_001",
      "userName": "Sarah Chen",
      "status": "call_initiated"
    }
  ],
  "summary": {
    "criticalUsersAnalyzed": 1,
    "callsInitiated": 1
  }
}
```

### 4. Get Integration Stats

Get statistics about calls made.

**Endpoint**: `GET /api/frontend/stats`

**Response**:
```json
{
  "success": true,
  "stats": {
    "totalCalls": 5,
    "recentCalls": [ /* last 10 calls */ ],
    "callsByUser": 3,
    "defaultPhoneNumber": "+14155797753"
  },
  "defaultPhoneNumber": "+14155797753"
}
```

### 5. Update Phone Number

Change the default phone number for calls.

**Endpoint**: `POST /api/frontend/update-phone`

**Request**:
```javascript
fetch('http://localhost:3000/api/frontend/update-phone', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+14155551234'
  })
});
```

## Frontend Integration Example

### React Component Integration

Update your `EngagementMonitor.tsx` to trigger actual calls:

```typescript
// In EngagementMonitor.tsx

const handleInitiateOutreach = async (user: User) => {
  setSelectedUser(user);
  setIsAnalyzing(true);
  setShowAIDialog(true);

  try {
    // Call the backend to analyze and initiate Vapi call
    const response = await fetch('http://localhost:3000/api/frontend/analyze-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    const data = await response.json();

    if (data.success && data.result.status === 'call_initiated') {
      // Call was initiated!
      console.log('Call initiated:', data.result.callId);
      console.log('Calling:', data.result.phoneNumber);

      setAiAnalysis({
        callInitiated: true,
        callId: data.result.callId,
        phoneNumber: data.result.phoneNumber,
        analysis: data.result.analysis,
        // ... your existing analysis data
      });
    } else {
      // No call needed or error
      setAiAnalysis({
        callInitiated: false,
        message: data.message,
        // ... your existing analysis data
      });
    }
  } catch (error) {
    console.error('Error initiating outreach:', error);
  } finally {
    setIsAnalyzing(false);
  }
};
```

### Automatic Monitoring

To automatically analyze all critical users every hour:

```typescript
// Add to your frontend
useEffect(() => {
  const interval = setInterval(async () => {
    // Get all critical users
    const criticalUsers = users.filter(u => u.status === 'critical');

    if (criticalUsers.length > 0) {
      const response = await fetch('http://localhost:3000/api/frontend/analyze-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: criticalUsers })
      });

      const data = await response.json();
      console.log(`Analyzed ${criticalUsers.length} users, ${data.summary.callsInitiated} calls initiated`);
    }
  }, 3600000); // Every hour

  return () => clearInterval(interval);
}, [users]);
```

## Testing

### 1. Start the Backend

```bash
npm install
npm start
```

You should see:
```
🚀 Revenue Optimization Server Started
📍 Port: 3000
```

### 2. Run the Test Script

```bash
node test-frontend-integration.js
```

This will:
1. Send Sarah Chen's data (63% drop)
2. Trigger AI analysis
3. Initiate a call to `+14155797753`
4. Show you the results

### 3. Manual Test with cURL

```bash
# Analyze a critical user
curl -X POST http://localhost:3000/api/frontend/analyze-user \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_001",
    "name": "Test User",
    "company": "Test Co",
    "plan": "Enterprise",
    "engagementScore": 30,
    "previousScore": 85,
    "status": "critical",
    "metrics": {
      "dailyActiveUse": 20,
      "weeklyActiveUse": 30,
      "monthlyActiveUse": 40,
      "featureAdoption": 25,
      "dataQuality": 60,
      "teamCollaboration": 15
    },
    "engagementTrend": [
      {"date": "Oct 1", "score": 85},
      {"date": "Oct 10", "score": 65},
      {"date": "Oct 20", "score": 45},
      {"date": "Oct 25", "score": 30}
    ],
    "dropoffReason": "Low team collaboration and feature adoption"
  }'
```

**You should receive a call at +14155797753!**

## What the AI Will Say

When the call is made, the AI agent will:

1. **Greet the user** with their specific context:
   > "Hello Sarah! This is a call from Apple's revenue recovery team. We noticed your engagement with our analytics platform has dropped significantly from 87 to 32. As a valued Enterprise customer at TechFlow, we'd hate to lose you. Can we chat for a few minutes about what's going on?"

2. **Ask discovery questions** based on low metrics:
   - If team collaboration is low: "How is your team using the platform?"
   - If feature adoption is low: "Which features have you been using?"
   - If data quality is low: "How has the data integration been going?"

3. **Negotiate and offer solutions**:
   - 30% discount for 3 months
   - Free onboarding session
   - VIP support access
   - Custom dashboard setup

4. **Close the deal** and set next steps

## Configuration

### Change Default Phone Number

In `.env`:
```env
DEFAULT_CALL_NUMBER=+14155797753
```

Or via API:
```bash
curl -X POST http://localhost:3000/api/frontend/update-phone \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+14155551234"}'
```

### Adjust Drop Threshold

In `.env`:
```env
# Trigger calls on 20% drop instead of 30%
ENGAGEMENT_DROP_THRESHOLD=0.20
```

### Cooldown Period

Users won't be called more than once every 48 hours (configurable in `frontendIntegration.js`).

## Data Flow Details

### Frontend User Object Structure

Required fields from your frontend:
```typescript
{
  id: string;              // Unique user ID
  name: string;            // User name for personalization
  company: string;         // Company name
  plan: string;            // Plan tier (Enterprise, Pro, etc.)
  engagementScore: number; // Current score (0-100)
  previousScore: number;   // Previous score for comparison
  status: 'critical' | 'warning' | 'healthy';
  metrics: {
    dailyActiveUse: number;
    weeklyActiveUse: number;
    monthlyActiveUse: number;
    featureAdoption: number;
    dataQuality: number;
    teamCollaboration: number;
  };
  engagementTrend: Array<{
    date: string;          // Format: "Oct 1", "Oct 5"
    score: number;         // Score at that date
  }>;
  dropoffReason?: string;  // Optional: why they're disengaging
}
```

### Backend Processing

1. **Convert to time series**: `engagementTrend` → engagement data points
2. **Analyze**: Statistical drop detection (30% threshold)
3. **Generate script**: Personalized based on user data
4. **Make call**: All calls to `+14155797753`
5. **Track**: Prevent duplicate calls (48h cooldown)

## Troubleshooting

### "Call not triggered"

Check:
- Is drop >= 30%? (85 → 32 = 62% drop ✓)
- Was user called in last 48h?
- Is server running?

### "CORS error"

The backend has CORS enabled. If you still get errors:
```javascript
// In your frontend fetch
fetch('http://localhost:3000/api/frontend/analyze-user', {
  method: 'POST',
  mode: 'cors',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(user)
});
```

### "Phone call not received"

1. Check Vapi dashboard for call logs
2. Verify phone number format: `+14155797753` (E.164)
3. Check server logs for errors
4. Ensure Vapi account has credits

## Production Deployment

### Environment Variables

Set these in production:
```env
VAPI_API_KEY=your_production_key
VAPI_PHONE_NUMBER_ID=your_production_phone_id
DEFAULT_CALL_NUMBER=+1your_demo_number
ENGAGEMENT_DROP_THRESHOLD=0.30
COMPANY_NAME=Your Company
```

### Security

1. Add API authentication
2. Rate limit the endpoints
3. Validate user data
4. Log all calls for compliance

### Scaling

For high volume:
1. Use a queue (Bull, BullMQ) for call processing
2. Add Redis for call tracking
3. Implement retry logic
4. Monitor Vapi rate limits

## Support

Need help?
- Check server logs: `npm start` output
- Test script: `node test-frontend-integration.js`
- Vapi dashboard: https://dashboard.vapi.ai
- Check [README.md](README.md) for general setup

---

**🎉 Your frontend is now connected to AI revenue recovery calls!**

All engagement drops are automatically detected and trigger personalized AI calls to save churning customers.
