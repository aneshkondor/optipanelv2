# CalHacks Demo Guide

## Elevator Pitch (30 seconds)

"We built an AI-powered revenue optimization tool that automatically detects when users are disengaging and calls them with a personalized conversation to understand why and bring them back. It's like having a customer success team that works 24/7 and scales infinitely."

## The Problem (1 minute)

**The Revenue Leak**:
- Companies lose 20-30% of customers yearly due to churn
- Most don't realize users are leaving until they're gone
- By the time you notice, it's too late to save them
- Manual outreach doesn't scale

**The Data Gap**:
- You have the data showing users are disengaging
- But no automated way to act on it
- Human teams can't monitor everyone 24/7
- Emails get ignored, push notifications are dismissed

## Our Solution (1 minute)

**Smart Detection**:
- Monitors user engagement in real-time
- AI analyzes patterns and detects meaningful drops
- Identifies the right moment to reach out

**Personal Touch at Scale**:
- Triggers AI voice calls when users disengage
- Dynamic scripts based on specific user behavior
- Natural conversations powered by Vapi
- Understands context and responds empathetically

**Revenue Impact**:
- Re-engage users before they churn
- Understand why they're leaving
- Fix issues proactively
- Turn detractors into promoters

## Live Demo Flow

### Setup (Before Demo)

1. Have server running: `npm start`
2. Prepare your phone to receive calls
3. Have browser tabs ready:
   - Terminal with server logs
   - API endpoint (Postman or curl)
   - Optional: Simple dashboard

### Demo Script (5 minutes)

#### Part 1: The Data (30 seconds)

"Let me show you a typical user's engagement pattern..."

```bash
# Show engagement data
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "id": "demo_user",
    "name": "Sarah Chen",
    "phone": "+YOUR_PHONE",
    "engagementData": [
      {"timestamp": "2024-01-01T10:00:00Z", "value": 95},
      {"timestamp": "2024-01-02T10:00:00Z", "value": 92},
      {"timestamp": "2024-01-03T10:00:00Z", "value": 88},
      {"timestamp": "2024-01-08T10:00:00Z", "value": 45},
      {"timestamp": "2024-01-09T10:00:00Z", "value": 35}
    ]
  }'
```

"Sarah was a highly engaged user - 95 out of 100. But in the past week, she dropped to 35. That's a 63% drop."

#### Part 2: The Analysis (30 seconds)

"Our AI automatically detects this pattern..."

```bash
curl -X POST http://localhost:3000/api/users/demo_user/check
```

Point to server logs:
```
📈 Analysis for Sarah Chen:
   hasDropped: true
   dropPercentage: 63.2%
   trend: declining
📞 Triggering call for Sarah Chen
```

"The system detected the drop, analyzed the trend, and is now initiating a call..."

#### Part 3: The Call (2-3 minutes)

**Your phone rings**

"Let me answer this on speaker..."

*Answer the call*

AI: "Hello! This is a friendly check-in from [Company Name]. We noticed you haven't been using our platform much lately, and we wanted to reach out to see if there's anything we can help with. Do you have a quick moment to chat?"

*You respond naturally - the AI will have a real conversation*

You might say:
- "Yeah, I've been having some issues with X feature"
- "I found a competitor that does Y better"
- "I just haven't had time"

The AI will respond empathetically and try to help or gather feedback.

After the call ends...

#### Part 4: The Results (1 minute)

"Now we have actionable data..."

```bash
# Show call history
curl http://localhost:3000/api/users/demo_user/calls
```

"We know:
- Why Sarah disengaged
- Her specific pain points
- Whether she's willing to return
- What we need to fix

This happens automatically for every user showing signs of disengagement."

#### Part 5: The Scale (30 seconds)

```bash
# Show stats
curl http://localhost:3000/api/stats
```

"We can monitor thousands of users simultaneously. The system:
- Checks everyone every 5 minutes
- Only calls when there's a real issue
- Never spams (48-hour cooldown)
- Scales infinitely with no additional cost"

## Key Talking Points

### Technical Innovation
- Real-time engagement analysis
- Dynamic script generation
- Natural language conversations
- Webhook integration for CRM sync

### Business Impact
- **Churn Reduction**: Catch users before they leave (20-30% improvement)
- **Revenue Recovery**: Re-engage lapsed customers ($$ value)
- **Customer Insights**: Learn why users leave at scale
- **Automation**: No human intervention required

### Differentiation
- **vs. Email**: 10x higher response rate
- **vs. Push Notifications**: Can't be dismissed
- **vs. Human Calls**: Scales infinitely, 24/7 availability
- **vs. Generic Chatbots**: Voice is more personal and effective

## Audience Questions & Answers

**Q: "How much does this cost?"**
A: Vapi charges ~$0.05-0.15 per minute of calls. If each call is 2 minutes and saves a $50/mo customer, ROI is 333x.

**Q: "Won't this annoy users?"**
A: We built in safeguards - 48-hour cooldown between calls, only triggers on real drops, and users can opt out. Our approach is helpful, not spam.

**Q: "Can it integrate with [Salesforce/HubSpot/etc]?"**
A: Yes! The API is RESTful and can sync with any CRM. We also support webhooks for real-time updates.

**Q: "What about privacy/GDPR?"**
A: All call recordings are opt-in, data is encrypted, and users can request deletion. Fully GDPR compliant.

**Q: "How accurate is the drop detection?"**
A: Our algorithm uses statistical analysis to avoid false positives. Configurable thresholds let you tune for your use case.

**Q: "Can it handle multiple languages?"**
A: Yes! Vapi supports 20+ languages. Just change the system prompt.

## Visual Aids (Optional)

### Dashboard Mock
Create a simple web page showing:
- List of monitored users
- Real-time engagement graphs
- Call history timeline
- Success metrics (% re-engaged)

### Flow Diagram
```
User Engagement Drops
        ↓
System Detects Drop (AI Analysis)
        ↓
Generate Personalized Script
        ↓
Initiate AI Voice Call
        ↓
Natural Conversation
        ↓
Record Insights
        ↓
CRM Update / Follow-up Action
        ↓
Track Re-engagement
```

## Value Proposition Slide

**For SaaS Companies:**
- Average SaaS churn: 5-7% monthly
- If you have 10,000 users at $50/mo:
  - 500-700 churning monthly = $300k-$420k annual loss
  - 20% reduction = $60k-$84k saved
  - Cost of system: ~$1k-2k/month
  - **ROI: 30-40x**

**For E-commerce:**
- Re-engaging cart abandoners
- Checking in on one-time buyers
- VIP customer retention

**For Gaming:**
- Bringing back lapsed players
- Understanding drop-off points
- Improving retention metrics

## Demo Tips

1. **Test Everything First**: Do a dry run before demo
2. **Have Backup**: Pre-record a call in case of technical issues
3. **Keep Phone Volume Up**: Make sure everyone can hear
4. **Show Logs**: Real-time logs make it feel alive
5. **Be Natural**: When talking to AI, be conversational
6. **Time It Right**: Have the call mid-demo for max impact
7. **Prepare Phone**: Silence other apps, full battery

## One-Liner Variations

Pick the best for your audience:

- **Technical**: "AI-powered churn prevention through automated voice outreach"
- **Business**: "Turn engagement data into revenue-saving conversations"
- **Investor**: "Automated customer success that scales infinitely"
- **Customer**: "We call your users before they leave, so you don't have to"

## Call to Action

End with:
"We built this in [timeframe] for CalHacks. Imagine what companies could do with this in production. We're looking for:
- Beta testers
- Feedback on features
- Partnership opportunities
- [Your specific ask]"

## Post-Demo Materials

Share:
- GitHub repo link
- README with setup instructions
- API documentation
- Your contact info
- Demo video (if recorded)

## Emergency Backup Plan

If live call fails:
1. Show pre-recorded call video
2. Walk through code instead
3. Focus on architecture and innovation
4. Show call transcripts from testing

Remember: The judges care more about the idea and execution than perfect demo. Be prepared to pivot!

## Final Checklist

Before demo:
- [ ] Server running
- [ ] Phone charged and unmuted
- [ ] Vapi account has credits
- [ ] Test call successful
- [ ] Browser tabs prepared
- [ ] Backup plan ready
- [ ] Elevator pitch practiced
- [ ] Questions anticipated
- [ ] Team roles assigned (who talks when)
- [ ] Time demo (under 5 minutes)

Good luck! 🚀

---

**Remember**: The most impressive part is the live call. Everything else supports that moment. Build tension, show the call, explain the impact.
