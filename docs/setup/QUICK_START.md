# Quick Start - Making Your First Call

## Setup (2 minutes)

### 1. Start the Backend Server

Open a terminal in `/Users/aryankhandelwal/Desktop/calhacks/`:

```bash
npm start
```

You should see:
```
🚀 Revenue Optimization Server Started
📍 Port: 3000
```

**Keep this running!**

### 2. Start Your Frontend

Open another terminal in `/Users/aryankhandelwal/Desktop/calhacks/frontend/`:

```bash
npm run dev
# or
npm start
```

## Making a Call (30 seconds)

### Step 1: Open Your Dashboard

Go to your frontend (probably `http://localhost:5173` or `http://localhost:3000`)

Navigate to: **AI Engagement Monitor** page

### Step 2: Find a Critical User

You should see **Sarah Chen** with:
- Status: **CRITICAL** (red badge)
- Engagement: **32** (down from 87)
- Drop: **-55 points**

### Step 3: Click "Initiate AI Outreach"

This opens the AI Analysis dialog.

### Step 4: Click "Start Call Now"

The button will show:
- "Calling..." with a spinner
- Then you'll see an alert: "✅ Call initiated to +14155797753!"

### Step 5: Answer Your Phone!

**Check your phone at +14155797753**

You should receive a call from the AI within seconds!

## What the AI Will Say

The AI will introduce itself:

> "Hello Sarah! This is a call from Apple's revenue recovery team. We noticed your engagement with our analytics platform has dropped significantly from 87 to 32. As a valued Enterprise customer at TechFlow, we'd hate to lose you. Can we chat for a few minutes about what's going on?"

### You can respond with:

**Option 1: Price Objection**
> "It's too expensive"

AI will offer: 30% discount for 3 months

**Option 2: Not Using It**
> "I just haven't had time to use it"

AI will offer: Personalized training session

**Option 3: Feature Issues**
> "It doesn't have what I need"

AI will offer: Beta access to new features

**Option 4: Competitor**
> "I found a better tool"

AI will ask what specifically, then match or beat

## Troubleshooting

### "Backend server error"

Make sure backend is running:
```bash
cd /Users/aryankhandelwal/Desktop/calhacks
npm start
```

### "Call not initiated"

Check the browser console (F12) for errors.

Common fixes:
- Backend not running
- Wrong port (should be 3000)
- CORS issue (already enabled)

### "Phone didn't ring"

1. Check Vapi dashboard: https://dashboard.vapi.ai
2. Look for call logs
3. Verify phone number: +14155797753
4. Check Vapi account has credits

### "Drop not detected"

Sarah Chen has a 63% drop, so it should definitely trigger.

If not:
- Check backend logs
- Verify `.env` has `ENGAGEMENT_DROP_THRESHOLD=0.30`

## Testing Other Users

### Michael Rodriguez (Warning)
- Drop: 25.6% (78 → 58)
- Should trigger call (above 20%)
- AI focuses on feature adoption

### Emily Watson (Healthy)
- Drop: None (89 → 92, improving)
- Should NOT trigger call
- Dialog will show "No action needed"

## What Happens in the Backend

When you click "Start Call Now":

1. Frontend sends Sarah's data to `http://localhost:3000/api/frontend/analyze-user`
2. Backend analyzes engagement trend: `[85, 82, 75, 60, 45, 32]`
3. Detects 63% drop (baseline 78.5 → recent 39.0)
4. Generates personalized script with:
   - Her name, company, plan
   - Low metrics: team collaboration (20%), feature adoption (35%)
   - Dropoff reason
5. Calls Vapi API to initiate call
6. Vapi calls +14155797753
7. Returns call ID to frontend
8. Frontend shows success message

## Viewing Call Details

After the call:

1. Go to Vapi dashboard: https://dashboard.vapi.ai
2. Click on "Calls"
3. Find the recent call
4. View:
   - Call recording
   - Transcript
   - Duration
   - Metadata (user ID, drop percentage, etc.)

## Next Steps

### For CalHacks Demo

1. **Start call** with Sarah Chen
2. **Have conversation** with AI (answer phone)
3. **Show call ID** in the dialog
4. **Show Vapi dashboard** with call logs
5. **Explain the value**: Automatic revenue recovery at scale

### For More Testing

Try clicking "Start Call Now" on different users:
- Critical users → Should call
- Warning users → Should call
- Healthy users → Should skip

### Batch Processing

Want to analyze all users at once?

Open browser console and run:
```javascript
fetch('http://localhost:3000/api/frontend/analyze-batch', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    users: [/* all your users */]
  })
})
.then(r => r.json())
.then(console.log);
```

## Configuration

### Change Phone Number

In `/Users/aryankhandelwal/Desktop/calhacks/.env`:

```env
DEFAULT_CALL_NUMBER=+14155797753
```

Change to any number you want!

### Adjust Sensitivity

```env
# More sensitive (20% drop triggers)
ENGAGEMENT_DROP_THRESHOLD=0.20

# Less sensitive (50% drop triggers)
ENGAGEMENT_DROP_THRESHOLD=0.50
```

## Success!

When it works, you should:
1. ✅ See "Calling..." in the button
2. ✅ Get success alert with Call ID
3. ✅ See green success message in dialog
4. ✅ Receive phone call at +14155797753
5. ✅ Have AI conversation with revenue recovery script

That's it! You're now making AI revenue recovery calls! 🎉

---

**Quick Command Reference:**

```bash
# Start backend
cd /Users/aryankhandelwal/Desktop/calhacks
npm start

# Start frontend (separate terminal)
cd /Users/aryankhandelwal/Desktop/calhacks/frontend
npm run dev

# Test from command line
node test-frontend-integration.js

# Check logs
# Look at backend terminal for call logs
```

**Phone Number for All Calls:** +14155797753

Good luck with CalHacks! 🚀
