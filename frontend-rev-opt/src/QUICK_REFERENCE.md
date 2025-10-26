# Live Metrics - Quick Reference Card

## 🚀 One-Line Integration

```typescript
metricsService.pushUserMetric({ userId, userName, timestamp, isActive, ...moreData });
```

---

## 📊 5 Integration Methods

```typescript
// 1. Direct Push (easiest)
import { metricsService } from './services/metricsService';
metricsService.pushUserMetric(yourData);

// 2. Bulk Push (efficient)
metricsService.pushBulkMetrics([user1, user2, user3]);

// 3. WebSocket (real-time)
metricsService.connectWebSocket('ws://localhost:8080');

// 4. HTTP Polling (simple)
metricsService.startPolling('https://api.com/metrics', 10000);

// 5. SSE (server push)
metricsService.connectSSE('https://api.com/stream');
```

---

## 📋 Minimum Data Required

```typescript
{
  userId: "user123",
  userName: "John Doe",
  timestamp: new Date().toISOString(),
  isActive: true
}
```

---

## 🎨 Complete Data Structure

```typescript
{
  // IDENTITY
  userId: "user123",
  userName: "John Doe",
  email: "john@example.com",
  company: "Acme Corp",
  timestamp: "2024-10-26T12:00:00Z",
  
  // ACTIVITY
  sessionDuration: 25,      // minutes
  pageViews: 42,
  clickCount: 156,
  scrollDepth: 75,          // percentage 0-100
  
  // FEATURES
  featuresUsed: ["Dashboard", "Funnels", "Revenue"],
  activeFeature: "Revenue",
  featureTime: {
    "Dashboard": 10,
    "Funnels": 8,
    "Revenue": 7
  },
  
  // ENGAGEMENT
  eventsTriggered: 23,
  queriesRun: 5,
  reportsCreated: 2,
  dashboardsViewed: 3,
  
  // STATUS
  isActive: true,
  lastAction: "Viewed revenue report",
  lastActionTime: "2024-10-26T12:00:00Z"
}
```

---

## 🧪 Test with Mock Data

```typescript
import { generateMockMetrics } from './examples/scraper-integration';
import { metricsService } from './services/metricsService';

// Generate & push 10 fake users
const mockUsers = generateMockMetrics(10);
metricsService.pushBulkMetrics(mockUsers);

// Simulate real-time updates every 3 seconds
setInterval(() => {
  const user = mockUsers[0];
  user.pageViews++;
  user.timestamp = new Date().toISOString();
  metricsService.pushUserMetric(user);
}, 3000);
```

---

## 🔌 Backend Examples

### Node.js + WebSocket
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  // Broadcast to all clients
  function broadcast(data) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'user_metric',
          metric: data
        }));
      }
    });
  }
});
```

### Express REST API
```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/metrics', (req, res) => {
  const metric = transformData(req.body);
  broadcastToClients(metric);
  res.json({ success: true });
});

app.get('/api/metrics', (req, res) => {
  res.json({
    metrics: getAllMetrics(),
    events: []
  });
});

app.listen(3001);
```

---

## 📡 WebSocket Message Format

### Single User
```json
{
  "type": "user_metric",
  "metric": {
    "userId": "user123",
    "userName": "John Doe",
    ...
  }
}
```

### Bulk Users
```json
{
  "type": "bulk_metrics",
  "metrics": [
    { "userId": "user1", ... },
    { "userId": "user2", ... }
  ]
}
```

### Events
```json
{
  "type": "event",
  "event": {
    "type": "feature_used",
    "userId": "user123",
    "userName": "John Doe",
    "data": { "feature": "Revenue" },
    "timestamp": "2024-10-26T12:00:00Z"
  }
}
```

---

## 🎯 Dashboard Tabs

1. **Real-time Activity** - Charts, graphs, top features
2. **User Details** - Live user list with metrics
3. **Feature Usage** - Pie/bar charts, detailed stats
4. **Event Stream** - Live activity feed

---

## 🔍 Subscribe to Updates

```typescript
// Listen for aggregated metrics updates
metricsService.onMetricsUpdate((metrics) => {
  console.log('Active users:', metrics.activeUsers);
  console.log('Total events:', metrics.totalEvents);
});

// Listen for individual user updates
metricsService.onUserMetricsUpdate((users) => {
  console.log('Total users:', users.length);
});

// Listen for events
metricsService.onEvent((event) => {
  console.log('New event:', event.type, event.userName);
});
```

---

## 🐛 Debugging

```typescript
// Check what's being stored
console.log(metricsService.getAllUserMetrics());
console.log(metricsService.getAggregatedMetrics());
console.log(metricsService.getRecentEvents());

// Clear all data (testing)
metricsService.clearMetrics();
```

---

## ⚡ Quick cURL Tests

```bash
# Test POST endpoint
curl -X POST http://localhost:3001/api/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test123",
    "name": "Test User",
    "email": "test@example.com",
    "session_time_minutes": 15,
    "is_currently_active": true
  }'

# Test GET endpoint
curl http://localhost:3001/api/metrics

# Test health check
curl http://localhost:3001/health
```

---

## 📚 File Locations

| File | Purpose |
|------|---------|
| `/types/metrics.ts` | TypeScript type definitions |
| `/services/metricsService.ts` | Main service implementation |
| `/contexts/MetricsContext.tsx` | React context provider |
| `/components/app/LiveMetricsPage.tsx` | Dashboard UI |
| `/examples/scraper-integration.js` | Integration examples |
| `/examples/backend-server.js` | Full backend server |
| `/INTEGRATION_GUIDE.md` | Complete integration guide |

---

## 🎓 Learn More

- **Full Guide**: See `/INTEGRATION_GUIDE.md`
- **Quick Overview**: See `/LIVE_METRICS_README.md`
- **TypeScript Types**: See `/types/metrics.ts`
- **Service Code**: See `/services/metricsService.ts`

---

## ✅ Checklist

- [ ] Choose integration method
- [ ] Set up data source (scraper/API)
- [ ] Format data to match structure
- [ ] Push test data
- [ ] View in Live Metrics dashboard
- [ ] Verify real-time updates working
- [ ] Deploy to production

---

## 💡 Best Practices

✅ Use `pushBulkMetrics()` for multiple users  
✅ Always include ISO 8601 timestamps  
✅ Use unique `userId` values  
✅ Update max once per second per user  
✅ Handle WebSocket disconnections (auto-reconnects)  
✅ Validate data before sending  
✅ Monitor browser console for errors  

---

## 🚀 You're Ready!

1. Import: `import { metricsService } from './services/metricsService'`
2. Push: `metricsService.pushUserMetric(yourData)`
3. View: Navigate to "Live Metrics" in sidebar

That's it! 🎉
