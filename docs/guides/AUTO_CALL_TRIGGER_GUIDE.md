# 🤖 AUTO CALL TRIGGER - LIVE AI REVENUE RECOVERY

## What This Does:
**Automatically triggers AI phone calls when users show signs of disengagement or exit intent!**

The system watches user behavior in real-time and calls them IMMEDIATELY when it detects:
- 🛒 Cart abandonment
- 💳 Checkout abandonment
- 👀 Product browsing without buying
- ⚡ Quick bounce behavior
- 📉 Low engagement patterns

---

## How It Works:

### 1. User Browses dummy_website
User clicks around, views products, adds to cart...

### 2. Analytics Tracker Captures Everything
Every action is tracked and sent to backend in real-time

### 3. Engagement Detector Analyzes Behavior
Backend runs analysis on EVERY metric update:
```
🔍 ENGAGEMENT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User: Guest User (user_12345)
Engagement Score: 30/100
Risk Level: CRITICAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Signals Detected:
❌ Product Exit
❌ Cart Abandonment
✅ Checkout Abandonment
✅ Repeat Visits No Action
❌ Bounce Rate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reasons:
  • Viewed 3 products but didn't add to cart
  • 2 items in cart but hasn't started checkout after 6 minutes
  • Quick bounce: only 1 min, 2 pages viewed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. Auto-Trigger Decision
If **ANY** of these conditions are met, CALL IS TRIGGERED:
- ✅ Cart abandonment detected
- ✅ Checkout abandonment detected
- ✅ Risk level is HIGH or CRITICAL
- ✅ Engagement score < 40

### 5. AI Call Initiated
```
🚨 TRIGGERING AI CALL for Guest User!
📞 Call initiated successfully! Call ID: call_abc123
Calling: +14155797753
```

---

## Disengagement Signals Tracked:

### 🛍️ Product Exit (-30 points)
**What**: User views 3+ products but doesn't add ANY to cart
**Why**: Window shopping without intent to buy
**Action**: Call with 30% first-purchase discount

### 🛒 Cart Abandonment (-40 points)
**What**: User has items in cart but hasn't checked out after 5+ minutes
**Why**: Price hesitation or comparison shopping
**Action**: Call with 20% cart discount

### 💳 Checkout Abandonment (-50 points) **CRITICAL**
**What**: User started checkout but abandoned after 3+ minutes
**Why**: Payment issues, shipping concerns, last-minute doubts
**Action**: Call with 25% immediate completion discount

### 📊 Low Engagement (-20 points)
**What**: High page views (5+) but low actions (events < pageViews * 1.5)
**Why**: Browsing without purpose, not finding what they need
**Action**: Call to help guide them

### ⚡ Bounce Behavior (-25 points)
**What**: Session < 2 minutes, only 1-2 pages viewed
**Why**: Quick exit, not interested
**Action**: Call with 30% discount to bring them back

---

## Risk Levels:

| Score | Risk Level | Action |
|-------|-----------|---------|
| 70-100 | **LOW** | Monitor only |
| 40-69 | **MEDIUM** | Watch closely |
| 20-39 | **HIGH** | Trigger call |
| 0-19 | **CRITICAL** | Trigger call immediately |

---

## Call Cooldown:
- User can only be called **once per hour**
- Prevents spam/harassment
- Tracked in `callHistory` map

---

## The AI Call Script:

The agent is given personalized context:

```
CUSTOMER CONTEXT:
- Name: Guest User
- Current Situation: Customer was with 2 items in cart
- Detected Issue: 2 items in cart but hasn't started checkout after 6 minutes
- Risk Level: HIGH
- Engagement Score: 35/100

5-PHASE FRAMEWORK:
1. Friendly opener (15s)
2. Identify the blocker (30s)
3. Address & solve (45s)
4. Create urgency (20s)
5. Close or follow-up (10s)

PERSONALIZED OFFER:
20% off cart (worth $89.99) - valid for 10 minutes
```

---

## Test Scenarios:

### Scenario 1: Cart Abandonment
```bash
1. Open dummy_website (http://localhost:3000)
2. Add 2-3 products to cart
3. Wait 5+ minutes (browse around)
4. Check backend console:
   🚨 TRIGGERING AI CALL!
   📞 Call initiated to +14155797753
```

### Scenario 2: Checkout Abandonment
```bash
1. Add products to cart
2. Click "Checkout"
3. Wait 3+ minutes on checkout page
4. Backend triggers call with 25% discount
```

### Scenario 3: Product Exit
```bash
1. Click on 3+ different products
2. Don't add any to cart
3. Navigate away
4. Backend triggers call with 30% first purchase discount
```

---

## API Endpoints:

### Get Engagement Stats
```bash
GET http://localhost:3001/api/engagement/stats

Response:
{
  "success": true,
  "totalUsersAnalyzed": 5,
  "totalCallsTriggered": 2,
  "recentCalls": [...]
}
```

### Clear Call History (for testing)
```bash
POST http://localhost:3001/api/engagement/clear-history/user_12345

Response:
{
  "success": true,
  "message": "Call history cleared for user_12345"
}
```

---

## Testing:

### 1. Start Backend
```bash
cd /Users/aryankhandelwal/Desktop/calhacks
node src/index.js
```

### 2. Start dummy_website
```bash
cd /Users/aryankhandelwal/Desktop/calhacks/dummy_website
npm run dev
```

### 3. Simulate Abandonment
- Add products to cart
- Wait 5+ minutes
- Watch backend console for trigger

### 4. Check Vapi Dashboard
- Go to vapi.ai dashboard
- See call logs
- Listen to call recordings

---

## Console Output Example:

```
[Analytics] ✅ Metrics sent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ENGAGEMENT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User: Guest User (user_1234567890_abc)
Engagement Score: 30/100
Risk Level: HIGH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Signals Detected:
❌ Product Exit
❌ Cart Abandonment
✅ Checkout Abandonment
❌ Repeat Visits No Action
✅ Bounce Rate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reasons:
  • Viewed 4 products but didn't add to cart
  • 3 items in cart but hasn't started checkout after 7 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 TRIGGERING AI CALL for Guest User!
📞 Call initiated successfully! Call ID: call_xyz789
```

---

## Key Features:

✅ **Real-time detection** - Analyzes every user action
✅ **Smart scoring** - 5 different disengagement signals
✅ **Auto-trigger** - No manual intervention needed
✅ **Personalized scripts** - Based on user behavior
✅ **Cooldown protection** - 1 hour between calls
✅ **Multi-level discounts** - 20-30% based on situation
✅ **Urgency creation** - 10-minute offer window

## The Result:
**Lost customers automatically converted back into sales!** 💰🎯
