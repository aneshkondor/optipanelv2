# Analytics Accuracy Test Guide

## How to Verify 100% Accurate Tracking

### Test 1: Page Navigation
1. Open dummy_website (http://localhost:3000)
2. Open browser console (F12)
3. Click through 3 different pages
4. **Expected in console**:
   - 3 logs: `[Analytics] Page View: [PageName]`
   - Final snapshot should show: `Events: 3, PageViews: 3`

### Test 2: Product View
1. Click on a product
2. **Expected in console**:
   - `[Analytics] Page View: Product`
   - `[Analytics] Product View: [ProductName]`
   - Snapshot: `Events: 2` (1 for page view + 1 for product view)

### Test 3: Cart Actions
1. Add a product to cart
2. **Expected in console**:
   - `[Analytics] Cart add: 1 items`
   - Snapshot shows: `Events: +1` (incremented by exactly 1)

### Test 4: Complete Flow
**Start fresh** (reload page):
1. Navigate to Products → **1 event** (page view)
2. Click a product → **2 events** (page view + product view)
3. Add to cart → **3 events** (cart action)
4. Go to checkout → **4 events** (page view)
5. **Final count should be exactly 4 events**

## How to Read Console Logs

Each action logs:
```
[Analytics] [ActionType]: [Details]
[Analytics] Snapshot - Events: X, PageViews: Y, Clicks: Z
```

**Events should equal the number of meaningful actions:**
- Page views
- Product views
- Cart actions
- Search queries
- Checkout start
- Order complete

**Clicks** = raw click count (can be higher)
**PageViews** = number of pages viewed
**Events** = sum of all tracked actions

## Common Issues Fixed

❌ **Before**: 1 action counted as 3 events (click + specific action + duplicate)
✅ **After**: 1 action = 1 event EXACTLY

The fix:
- Removed event counting from generic click listener
- Each specific action (trackPageView, trackCartAction, etc.) counts as exactly 1 event
- No double counting or duplicates
