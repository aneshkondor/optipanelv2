# Live Shopper Metrics - Quick Reference

## 🎯 What Is This?

A real-time shopper activity monitoring system that visualizes e-commerce metrics from your Instacart-like grocery delivery platform. Track cart behavior, checkout flow, order conversions, and delivery scheduling in real-time. Think "Google Analytics meets Mixpanel" but specifically designed for e-commerce and grocery delivery.

---

## ⚡ Quick Integration (3 Steps)

### Step 1: Import the service
```typescript
import { metricsService } from './services/metricsService';
```

### Step 2: Push your data
```typescript
metricsService.pushUserMetric({
  userId: 'shopper_123',
  userName: 'Sarah Johnson',
  email: 'sarah@email.com',
  company: 'San Francisco, CA',  // Location
  timestamp: new Date().toISOString(),
  sessionDuration: 15,  // minutes
  pageViews: 28,
  clickCount: 87,
  scrollDepth: 65,
  featuresUsed: ['Browsing', 'Cart', 'Checkout'],
  activeFeature: 'Cart',
  featureTime: { 'Browsing': 8, 'Cart': 5, 'Checkout': 2 },
  eventsTriggered: 18,
  
  // E-commerce specific fields
  cartValue: 127.50,
  itemsInCart: 12,
  productsViewed: 35,
  searchesPerformed: 4,
  couponsApplied: 1,
  membershipType: 'Premium',
  deliveryWindow: 'Today',
  
  queriesRun: 4,
  reportsCreated: 0,
  dashboardsViewed: 0,
  isActive: true,
  lastAction: 'Added item to cart',
  lastActionTime: new Date().toISOString(),
});
```

### Step 3: View in dashboard
Navigate to **Live Metrics** in the sidebar.

---

## 📊 What You Get

### Real-time Visualizations

1. **Active Shoppers Timeline** - Line chart showing shoppers over time
2. **Cart Actions** - Real-time add/remove tracking
3. **Shopping Session Duration** - Average time shoppers spend browsing
4. **Shopping Activity Distribution** - Pie chart of browsing, cart, checkout behavior
5. **Shopper Details Table** - Complete shopper activity with cart values
6. **Live Shopping Event Stream** - Real-time shopping activity feed

### Key Metrics Tracked

| Metric | Description |
|--------|-------------|
| Active Shoppers | Currently shopping users |
| Active Carts | Users with items in their cart |
| Cart Value | Total value of all active carts |
| Orders/Hour | Completed checkouts per hour |
| Shopping Session | Average time spent shopping |
| Cart Abandonment | Shoppers who leave without purchasing |
| Product Views | Total products viewed |
| Search Activity | Product searches performed |

---

## 🔌 Integration Methods

| Method | Code | Use Case |
|--------|------|----------|
| **Direct Push** | `metricsService.pushUserMetric(data)` | Client-side, same origin |
| **Bulk Push** | `metricsService.pushBulkMetrics(array)` | Batch updates |
| **WebSocket** | `metricsService.connectWebSocket(url)` | Real-time streaming |
| **HTTP Polling** | `metricsService.startPolling(url, ms)` | Simple backend |
| **SSE** | `metricsService.connectSSE(url)` | Server push |

---

## 🧪 Test with Mock Data

Click the **"Start Demo"** button in the Live Shopper Metrics dashboard to generate realistic e-commerce data including:
- Active shoppers browsing products
- Cart additions and removals
- Checkout flows
- Delivery scheduling
- Search queries
- Product views

Or programmatically:
```typescript
// Generate 10 fake shoppers
import { generateMockMetrics } from './examples/scraper-integration';

const mockShoppers = generateMockMetrics(10);
metricsService.pushBulkMetrics(mockShoppers);
```

---

## 📡 Backend Integration

### Option A: WebSocket Server
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  // Send metrics to all clients
  wss.clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'user_metric',
      metric: yourMetricData
    }));
  });
});
```

### Option B: REST API
```javascript
app.get('/api/metrics', (req, res) => {
  res.json({
    metrics: [/* your user metrics */],
    events: [/* optional events */]
  });
});
```

Then poll it:
```typescript
metricsService.startPolling('https://your-api.com/metrics', 10000);
```

---

## 📋 Required Data Fields

### Minimum Required
```typescript
{
  userId: string;
  userName: string;
  timestamp: string;
  isActive: boolean;
}
```

### Complete Structure
```typescript
{
  // Identity
  userId: string;
  userName: string;
  email: string;
  company: string; // Used for location (e.g., "San Francisco, CA")
  
  // Time
  timestamp: string; // ISO 8601
  
  // Activity
  sessionDuration: number; // minutes
  pageViews: number;
  clickCount: number;
  scrollDepth: number; // 0-100
  
  // Shopping Behavior
  featuresUsed: string[]; // ['Browsing', 'Cart', 'Checkout', etc.]
  activeFeature: string; // Current activity
  featureTime: Record<string, number>;
  
  // E-commerce Specific
  cartValue: number; // Dollar amount
  itemsInCart: number;
  productsViewed: number;
  searchesPerformed: number;
  couponsApplied: number;
  membershipType: string; // 'Free', 'Premium', 'Premium+'
  deliveryWindow: string; // 'Today', 'Tomorrow', etc.
  
  // Engagement
  eventsTriggered: number;
  queriesRun: number; // Product searches
  reportsCreated: number;
  dashboardsViewed: number;
  
  // Status
  isActive: boolean;
  lastAction: string; // 'Added item to cart', 'Scheduled delivery', etc.
  lastActionTime: string; // ISO 8601
}
```

---

## 🎨 Dashboard Features

### 1. Real-time Activity Tab
- Active users over time (area chart)
- Events triggered (line chart)
- Average session duration (area chart)
- Top 5 active features (cards)

### 2. Shopper Details Tab
- Live shopper list with activity status
- Session duration per shopper
- Cart value and item count per shopper
- Currently active feature badge (Browsing, Cart, Checkout, etc.)
- Online/offline indicator

### 3. Shopping Behavior Tab
- Shopping activity distribution (pie chart)
- Activity engagement (bar chart)
- Detailed shopping statistics
- Trend indicators (up/down/stable)

### 4. Event Stream Tab
- Real-time activity feed
- Event type badges
- Timestamps
- User attribution
- Scrollable history (last 50 events)

---

## 🔧 Common Use Cases

### 1. E-commerce Platform Integration
```javascript
// Puppeteer scraping Instacart-like platform
const metrics = await page.evaluate(() => ({
  user_id: document.querySelector('[data-user-id]').textContent,
  session_time_minutes: parseInt(sessionStorage.getItem('sessionTime')) / 60,
  cart_value: parseFloat(document.querySelector('.cart-total').textContent.replace('$', '')),
  items_in_cart: document.querySelectorAll('.cart-item').length,
  products_viewed: parseInt(sessionStorage.getItem('productsViewed')),
  current_activity: document.querySelector('.active-section').dataset.section,
  // ... more fields
}));

await fetch('http://localhost:3001/api/metrics', {
  method: 'POST',
  body: JSON.stringify(metrics)
});
```

### 2. E-commerce Analytics Integration
```javascript
// Integrate with e-commerce tracking
function syncFromEcommerce(ecommerceData) {
  const metric = {
    userId: ecommerceData.customerId,
    sessionDuration: ecommerceData.sessionDuration / 60,
    pageViews: ecommerceData.pageviews,
    cartValue: ecommerceData.cart.total,
    itemsInCart: ecommerceData.cart.items.length,
    productsViewed: ecommerceData.productsViewed,
    activeFeature: ecommerceData.currentStep, // 'Browsing', 'Cart', 'Checkout'
    // ... map other fields
  };
  
  metricsService.pushUserMetric(metric);
}
```

### 3. Real-time Shopping Monitoring
```javascript
// Subscribe to updates
metricsService.onMetricsUpdate((metrics) => {
  console.log(`${metrics.activeUsers} shoppers active`);
  
  if (metrics.activeUsers > 100) {
    alert('Shopping traffic spike!');
  }
  
  // Monitor cart abandonment
  const activeCarts = metrics.activeUsers * 0.7; // Estimated
  const avgCartValue = 87.50; // Calculate from data
  console.log(`Potential revenue at risk: $${activeCarts * avgCartValue}`);
});
```

---

## 🚨 Troubleshooting

### No data showing?
1. Check browser console for errors
2. Verify data format matches requirements
3. Ensure timestamp is ISO 8601 format
4. Check network tab for API calls

### WebSocket disconnecting?
- Built-in auto-reconnect after 5 seconds
- Check firewall/proxy settings
- Verify WebSocket URL is correct

### Duplicate users?
- Uses `userId` as unique key
- Sending same userId updates existing user
- This is expected behavior

---

## 📚 Full Documentation

- **Integration Guide**: `/INTEGRATION_GUIDE.md`
- **Type Definitions**: `/types/metrics.ts`
- **Service Implementation**: `/services/metricsService.ts`
- **Frontend Component**: `/components/app/LiveMetricsPage.tsx`
- **Examples**: `/examples/`

---

## 🎯 Key Benefits

✅ **Real-time updates** - See activity as it happens  
✅ **Easy integration** - 5 different methods to choose from  
✅ **Flexible data sources** - Works with any scraper or API  
✅ **Beautiful visualizations** - Charts update automatically  
✅ **Zero configuration** - Works out of the box  
✅ **TypeScript support** - Full type safety  
✅ **Production ready** - Built for scale  

---

## 💡 Pro Tips

1. **Batch your updates** - Use `pushBulkMetrics()` for multiple users
2. **Update frequency** - Don't push more than once per second per user
3. **Clean old data** - Remove inactive users periodically
4. **Use WebSockets** - For true real-time experience
5. **Monitor performance** - Check metrics in browser DevTools
6. **Test thoroughly** - Use mock data generator first

---

## 🚀 Next Steps

1. Set up your data source (scraper/API)
2. Choose integration method
3. Start pushing data
4. Open Live Metrics dashboard
5. Watch the magic happen! ✨

Need help? Check `/INTEGRATION_GUIDE.md` for detailed instructions.
