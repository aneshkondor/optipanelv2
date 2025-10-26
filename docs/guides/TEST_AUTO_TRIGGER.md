# 🧪 TEST AUTO-TRIGGER - Step by Step

## What Changed:
✅ **Made detection MORE AGGRESSIVE** - triggers immediately when cart has items
✅ **Added detailed logging** - see exactly what's being detected
✅ **Removed time delays** - instant detection!

---

## Test Scenario 1: Cart Abandonment (EASIEST)

### 1. Restart Backend
```bash
cd /Users/aryankhandelwal/Desktop/calhacks
node src/index.js
```

### 2. Start dummy_website
```bash
cd /Users/aryankhandelwal/Desktop/calhacks/dummy_website
npm run dev
```

### 3. Add Product to Cart
- Go to http://localhost:3000
- Click on any product
- Click "Add to Cart"

### 4. Watch Backend Console
You should see:
```
📊 Processing metric for user: Guest User
   Cart Items: 1
   Cart Value: $29.99
   Checkout Started: false
   Order Completed: false

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ENGAGEMENT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User: Guest User
Engagement Score: 60/100
Risk Level: MEDIUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Signals Detected:
✅ Product Exit
❌ Cart Abandonment  ← DETECTED!
✅ Checkout Abandonment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reasons:
  • 1 items in cart (worth $29.99) - hasn't started checkout
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 TRIGGERING AI CALL for Guest User!
📞 Call initiated successfully! Call ID: call_xyz
```

---

## Test Scenario 2: Checkout Abandonment (CRITICAL)

### 1. Add products to cart
### 2. Click "Proceed to Checkout"
### 3. Wait on checkout page (even 1 second)

**Backend should show:**
```
❌ Checkout Abandonment - CRITICAL!
🚨 TRIGGERING AI CALL!
```

---

## If It's NOT Triggering:

### Check 1: Are metrics being sent?
```bash
curl http://localhost:3001/api/metrics/count
```
Should show: `"totalUsers": 1` or more

### Check 2: What's in the metrics?
Look at backend console for:
```
📊 Processing metric for user: Guest User
   Cart Items: X  ← Should be > 0
   Cart Value: $X  ← Should have value
```

### Check 3: Is backend running on 3001?
```bash
curl http://localhost:3001/health
```
Should return: `{"status":"ok"}`

### Check 4: Clear call history (if already called)
```bash
curl -X POST http://localhost:3001/api/engagement/clear-history/user_XXXXX
```
(Replace user_XXXXX with actual userId from console)

---

## Expected Console Output:

### ✅ WHEN IT WORKS:
```
[Analytics] ✅ Metrics sent

📊 Processing metric for user: Guest User
   Cart Items: 2
   Cart Value: $59.98
   Checkout Started: false
   Order Completed: false

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ENGAGEMENT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User: Guest User (user_12345)
Engagement Score: 60/100
Risk Level: MEDIUM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Signals Detected:
❌ Cart Abandonment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Reasons:
  • 2 items in cart (worth $59.98) - hasn't started checkout
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚨 TRIGGERING AI CALL for Guest User!
📞 Call initiated successfully! Call ID: call_abc123
```

---

## Debugging:

If you see processing but NO trigger, check:

1. **cartItems = undefined?**
   - Analytics might not be tracking cart properly
   - Check CartContext integration

2. **Already called this user?**
   - 1-hour cooldown between calls
   - Clear history with API endpoint

3. **Risk level too low?**
   - Should trigger if: cartAbandonment OR checkoutAbandonment OR riskLevel = high/critical
   - With cart items, should always trigger now

---

## Quick Debug Commands:

```bash
# Check if backend is receiving metrics
curl http://localhost:3001/api/metrics/count

# Check engagement stats
curl http://localhost:3001/api/engagement/stats

# Clear call history for user
curl -X POST http://localhost:3001/api/engagement/clear-history/USER_ID_HERE
```

---

## The Changes Made:

### Before (TOO STRICT):
```javascript
if (currentMetric.cartItems > 0 && currentMetric.sessionDuration >= 5) {
  // Only trigger after 5 minutes
}
```

### After (AGGRESSIVE):
```javascript
if (currentMetric.cartItems > 0) {
  // Trigger IMMEDIATELY!
  signals.cartAbandonment = true;
}
```

**NOW IT SHOULD WORK!** Try adding something to cart and watch the magic happen! 🚀
