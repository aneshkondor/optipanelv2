# AI-Powered User Engagement System

## Overview

This system monitors user engagement in real-time and triggers AI-powered outreach calls when user activity drops below critical thresholds. The system formats user data in a way that's optimized for AI analysis and conversation.

## How It Works

### 1. Engagement Monitoring
- Tracks multiple engagement metrics per user:
  - Daily/Weekly/Monthly active usage
  - Feature adoption rates
  - Data quality scores
  - Team collaboration levels
  - Overall engagement score (0-100)

### 2. Status Classification
Users are automatically classified into four categories:
- **Critical** (Score < 40): Immediate intervention required
- **Warning** (Score 40-70): At-risk, proactive outreach recommended
- **Stable** (Score 70-85): Healthy usage, monitor
- **Healthy** (Score > 85): Excellent engagement

### 3. AI Data Formatting

The `formatEngagementDataForAI()` function converts complex user data into a structured, AI-readable format:

```typescript
formatEngagementDataForAI(user)
```

**Output includes:**
- User profile and company context
- Temporal metrics (signup date, last active, days inactive)
- Current vs historical engagement scores
- Detailed metrics breakdown
- Recent activity patterns
- Engagement trend analysis
- Identified issues and concerns

### 4. AI Call Prompt Generation

The `generateAICallPrompt()` function creates a comprehensive conversation guide:

```typescript
generateAICallPrompt(user)
```

**Output includes:**
- Call objective and context
- Structured conversation framework:
  1. Warm opening with personalization
  2. Discovery questions based on user metrics
  3. Active listening prompts
  4. Specific solution recommendations
  5. Action items and commitments
  6. Professional closing
- Tone and approach guidelines
- Call metrics to track
- Emergency escalation procedures

## Data Structure

### User Object
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  signupDate: string;
  lastActive: string;
  engagementScore: number;
  previousScore: number;
  status: 'critical' | 'warning' | 'stable' | 'healthy';
  metrics: {
    dailyActiveUse: number;
    weeklyActiveUse: number;
    monthlyActiveUse: number;
    featureAdoption: number;
    dataQuality: number;
    teamCollaboration: number;
  };
  recentActivity: Array<{
    date: string;
    action: string;
    duration: number;
  }>;
  engagementTrend: Array<{
    date: string;
    score: number;
  }>;
  dropoffReason?: string;
}
```

## Integration with AI Calling Systems

### Option 1: Vapi.ai Integration
```typescript
import { formatEngagementDataForAI, generateAICallPrompt } from './utils/aiDataFormatter';

const callUser = async (user) => {
  const formattedData = formatEngagementDataForAI(user);
  const callPrompt = generateAICallPrompt(user);
  
  // Send to Vapi
  await vapi.call({
    phoneNumber: user.phone,
    assistant: {
      model: "gpt-4",
      context: formattedData,
      instructions: callPrompt,
    }
  });
};
```

### Option 2: Bland.ai Integration
```typescript
const callUser = async (user) => {
  const formattedData = formatEngagementDataForAI(user);
  const callPrompt = generateAICallPrompt(user);
  
  await bland.calls.create({
    phone_number: user.phone,
    task: callPrompt,
    voice: "helpful-woman",
    wait_for_greeting: true,
    record: true,
    transfer_phone_number: "+1234567890", // Optional escalation
    metadata: {
      user_id: user.id,
      engagement_data: formattedData,
    }
  });
};
```

### Option 3: Custom AI Integration
```typescript
const callUser = async (user) => {
  const aiContext = formatEngagementDataAsJSON(user);
  const prompt = generateAICallPrompt(user);
  
  // Send to your custom AI endpoint
  await fetch('/api/ai-call', {
    method: 'POST',
    body: JSON.stringify({
      user: aiContext,
      prompt: prompt,
      metadata: {
        priority: user.status === 'critical' ? 'high' : 'medium',
      }
    })
  });
};
```

## Key Metrics Tracked

1. **Engagement Score**: Composite score (0-100) based on all metrics
2. **Activity Frequency**: Daily, weekly, monthly usage patterns
3. **Feature Adoption**: Percentage of available features used
4. **Data Quality**: Completeness and correctness of data setup
5. **Team Collaboration**: Multi-user adoption within organization
6. **Session Duration**: Average time spent per session
7. **Trend Direction**: Increasing, stable, or declining engagement

## Personalization Features

The system automatically personalizes outreach based on:
- **Low metrics**: Identifies specific problem areas
- **High metrics**: Builds on user strengths
- **Usage patterns**: Tailors recommendations
- **Time factors**: Adjusts urgency based on days inactive
- **Plan tier**: Considers subscription level

## Best Practices

1. **Timing**: Call during business hours in user's timezone
2. **Context**: Always start with empathy and understanding
3. **Listen**: Use discovery questions, don't just pitch
4. **Value**: Offer immediate, actionable solutions
5. **Follow-up**: Always schedule next touchpoint
6. **Documentation**: Record insights for future interactions

## Success Metrics

Track these outcomes:
- **Re-engagement rate**: % of users who return to platform
- **Churn prevention**: % of at-risk users retained
- **Call completion**: % of calls successfully connected
- **Issue resolution**: % of technical issues resolved on call
- **Satisfaction**: User feedback post-call

## Example AI Prompts

### For Critical Users (Score < 40)
The AI is prompted to:
- Express genuine concern
- Ask about major changes in their business
- Listen for signs of churn risk
- Offer immediate executive support if needed
- Schedule hands-on help session

### For Warning Users (Score 40-70)
The AI is prompted to:
- Check in casually
- Explore what's working vs. not working
- Share specific tips based on their usage
- Offer targeted training
- Build relationship for future needs

## Security & Privacy

- All user data is encrypted in transit
- Call recordings stored securely (if enabled)
- GDPR/CCPA compliant data handling
- Users can opt-out of automated outreach
- Clear disclosure that calls are AI-assisted

## Dashboard Features

The Engagement Monitor dashboard provides:
- Real-time status of all users
- Filtering by risk level
- One-click AI outreach initiation
- Complete engagement history
- AI analysis preview before calling
- Post-call documentation

## Future Enhancements

Planned features:
- Predictive churn modeling
- Automated email sequences
- SMS fallback for failed calls
- Multi-language support
- Sentiment analysis from calls
- Integration with CRM systems
