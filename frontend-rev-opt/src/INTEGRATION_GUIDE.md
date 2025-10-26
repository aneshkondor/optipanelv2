# Live Metrics Integration Guide

## Overview

The Live Metrics system is designed to receive and visualize real-time user activity data from external sources like web scrapers, analytics tools, or backend APIs. This guide shows you exactly how to integrate your data source.

---

## 🎯 Quick Start

### 1. **Understand the Data Format**

Your scraper needs to provide user metrics in this structure:

```typescript
{
  userId: string;          // Unique user identifier
  userName: string;        // Display name
  email: string;           // User email
  company: string;         // Company name
  timestamp: string;       // ISO 8601 timestamp
  
  // Activity metrics
  sessionDuration: number; // Minutes in current session
  pageViews: number;       // Total page views
  clickCount: number;      // Total clicks
  scrollDepth: number;     // Scroll percentage (0-100)
  
  // Feature usage
  featuresUsed: string[];  // Array of feature names
  activeFeature: string;   // Currently active feature
  featureTime: Record<string, number>; // Time spent per feature (minutes)
  
  // Engagement
  eventsTriggered: number; // Total events fired
  queriesRun: number;      // Queries executed
  reportsCreated: number;  // Reports generated
  dashboardsViewed: number; // Dashboards accessed
  
  // Status
  isActive: boolean;       // Currently active?
  lastAction: string;      // Description of last action
  lastActionTime: string;  // ISO 8601 timestamp
}
```

### 2. **Choose Your Integration Method**

We support **5 different integration methods**:

| Method | Use Case | Complexity | Real-time |
|--------|----------|------------|-----------|
| **Direct Push** | Same-origin, client-side | Easy | ✅ Yes |
| **WebSocket** | Real-time streaming | Medium | ✅ Yes |
| **HTTP Polling** | Simple backend integration | Easy | ⚠️ Near real-time |
| **Server-Sent Events (SSE)** | One-way server push | Medium | ✅ Yes |
| **REST API** | Backend-to-backend | Easy | ⚠️ On-demand |

---

## 📡 Integration Methods

### Method 1: Direct Push (Client-Side)

**Best for:** Browser-based scrapers, same-origin data

```typescript
import { metricsService } from './services/metricsService';

// Push single user metric
const userMetric = {
  userId: 'user123',
  userName: 'John Doe',
  email: 'john@company.com',
  company: 'Acme Corp',
  timestamp: new Date().toISOString(),
  sessionDuration: 25,
  pageViews: 42,
  clickCount: 156,
  scrollDepth: 75,
  featuresUsed: ['Dashboard', 'Funnels', 'Revenue'],
  activeFeature: 'Revenue',
  featureTime: {
    'Dashboard': 10,
    'Funnels': 8,
    'Revenue': 7,
  },
  eventsTriggered: 23,
  queriesRun: 5,
  reportsCreated: 2,
  dashboardsViewed: 3,
  isActive: true,
  lastAction: 'Viewed revenue report',
  lastActionTime: new Date().toISOString(),
};

metricsService.pushUserMetric(userMetric);
```

**Push multiple users:**

```typescript
const users = [user1, user2, user3];
metricsService.pushBulkMetrics(users);
```

---

### Method 2: WebSocket (Real-time Streaming)

**Best for:** Continuous real-time updates, low latency

**Frontend:**
```typescript
import { metricsService } from './services/metricsService';

// Connect to your WebSocket server
metricsService.connectWebSocket('ws://your-server.com/metrics');
```

**Backend (Node.js + ws):**
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  // When you receive scraped data, send it to all clients
  function sendMetric(scrapedData) {
    const message = {
      type: 'user_metric',  // or 'bulk_metrics'
      metric: transformedData,
    };
    
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
});
```

**Message Format:**

Single metric:
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

Bulk metrics:
```json
{
  "type": "bulk_metrics",
  "metrics": [
    { "userId": "user1", ... },
    { "userId": "user2", ... }
  ]
}
```

---

### Method 3: HTTP Polling

**Best for:** Simple setup, existing REST APIs

**Frontend:**
```typescript
import { metricsService } from './services/metricsService';

// Poll every 10 seconds (10000ms)
metricsService.startPolling('https://your-api.com/metrics', 10000);
```

**Backend API Response:**
```json
{
  "metrics": [
    {
      "userId": "user123",
      "userName": "John Doe",
      "email": "john@company.com",
      ...
    }
  ],
  "events": [
    {
      "type": "feature_used",
      "userId": "user123",
      "userName": "John Doe",
      "data": { "feature": "Revenue Analysis" },
      "timestamp": "2024-10-26T12:00:00Z"
    }
  ]
}
```

**Backend Example (Express):**
```javascript
app.get('/api/metrics', (req, res) => {
  const metrics = getUserMetricsFromDatabase();
  res.json({
    metrics: metrics,
    events: []
  });
});
```

---

### Method 4: Server-Sent Events (SSE)

**Best for:** Server-to-client streaming, firewall-friendly

**Frontend:**
```typescript
import { metricsService } from './services/metricsService';

metricsService.connectSSE('https://your-api.com/stream');
```

**Backend (Node.js + Express):**
```javascript
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send metric
  function sendMetric(metric) {
    res.write(`data: ${JSON.stringify({ metric })}\n\n`);
  }
  
  // Send on interval or when data changes
  const interval = setInterval(() => {
    const metric = getLatestMetric();
    sendMetric(metric);
  }, 5000);
  
  req.on('close', () => {
    clearInterval(interval);
  });
});
```

---

### Method 5: REST API (Manual Integration)

**Best for:** Backend-to-backend communication

See `/examples/backend-server.js` for a complete REST API implementation.

**Endpoints:**
- `POST /api/metrics` - Send single metric
- `POST /api/metrics/bulk` - Send multiple metrics
- `GET /api/metrics` - Get current metrics
- `POST /api/events` - Send real-time events

---

## 🔧 Setting Up Your Scraper

### Example: Puppeteer Scraper

```javascript
const puppeteer = require('puppeteer');
const axios = require('axios');

async function scrapeUserMetrics() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to target application
  await page.goto('https://your-target-app.com/dashboard');
  
  // Wait for content to load
  await page.waitForSelector('.user-profile');
  
  // Extract metrics from the page
  const metrics = await page.evaluate(() => {
    // Example: scraping from data attributes and localStorage
    const userId = document.querySelector('[data-user-id]')?.textContent;
    const userName = document.querySelector('.user-name')?.textContent;
    const company = document.querySelector('.company-name')?.textContent;
    
    // Get session data
    const sessionStart = parseInt(localStorage.getItem('sessionStart') || '0');
    const sessionDuration = (Date.now() - sessionStart) / 60000; // minutes
    
    // Count page views
    const pageViews = parseInt(sessionStorage.getItem('pageViews') || '0');
    
    // Get active feature
    const activeFeature = document.querySelector('.active-tab')?.textContent || 'Dashboard';
    
    // Get features used (from navigation history)
    const featuresUsed = Array.from(
      new Set(JSON.parse(sessionStorage.getItem('featuresUsed') || '[]'))
    );
    
    return {
      user_id: userId,
      name: userName,
      company: company,
      session_time_minutes: sessionDuration,
      pages_viewed: pageViews,
      current_feature: activeFeature,
      features_accessed: featuresUsed,
      is_currently_active: document.visibilityState === 'visible',
      last_action: 'Page navigation',
      last_action_timestamp: new Date().toISOString(),
    };
  });
  
  // Send to your backend
  await axios.post('http://localhost:3001/api/metrics', metrics);
  
  await browser.close();
  return metrics;
}

// Run scraper every 30 seconds
setInterval(scrapeUserMetrics, 30000);
```

---

## 🧪 Testing Your Integration

### 1. **Use the Mock Data Generator**

```typescript
import { generateMockMetrics } from './examples/scraper-integration';
import { metricsService } from './services/metricsService';

// Generate 20 fake users
const mockUsers = generateMockMetrics(20);

// Push to service
metricsService.pushBulkMetrics(mockUsers);

// Simulate real-time updates
setInterval(() => {
  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  randomUser.timestamp = new Date().toISOString();
  randomUser.pageViews++;
  randomUser.eventsTriggered++;
  
  metricsService.pushUserMetric(randomUser);
}, 3000);
```

### 2. **Test with cURL**

```bash
# Test POST endpoint
curl -X POST http://localhost:3001/api/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test123",
    "name": "Test User",
    "email": "test@example.com",
    "company": "Test Co",
    "session_time_minutes": 15,
    "pages_viewed": 10,
    "current_feature": "Dashboard",
    "is_currently_active": true
  }'

# Test GET endpoint
curl http://localhost:3001/api/metrics
```

### 3. **Monitor in Browser Console**

```javascript
// Check if metrics are being received
metricsService.onMetricsUpdate((metrics) => {
  console.log('Active users:', metrics.activeUsers);
  console.log('Total events:', metrics.totalEvents);
});

// Check for events
metricsService.onEvent((event) => {
  console.log('New event:', event.type, event.userName);
});
```

---

## 📊 Data Mapping Examples

### From Google Analytics

```javascript
function mapGoogleAnalyticsToMetrics(gaData) {
  return {
    userId: gaData.userId,
    userName: gaData.userName || 'Unknown',
    email: gaData.email || '',
    company: gaData.company || '',
    timestamp: new Date().toISOString(),
    sessionDuration: gaData.sessionDuration / 60, // Convert seconds to minutes
    pageViews: gaData.pageviews,
    clickCount: gaData.events.length,
    scrollDepth: gaData.maxScrollDepth || 0,
    featuresUsed: gaData.pagePaths.map(path => path.split('/')[1]),
    activeFeature: gaData.currentPage || 'Dashboard',
    featureTime: {},
    eventsTriggered: gaData.events.length,
    queriesRun: 0,
    reportsCreated: 0,
    dashboardsViewed: 0,
    isActive: true,
    lastAction: gaData.lastEvent || 'Page view',
    lastActionTime: new Date().toISOString(),
  };
}
```

### From Mixpanel

```javascript
function mapMixpanelToMetrics(mpData) {
  return {
    userId: mpData.distinct_id,
    userName: mpData.properties.$name || 'Unknown',
    email: mpData.properties.$email || '',
    company: mpData.properties.company || '',
    timestamp: new Date(mpData.properties.time).toISOString(),
    sessionDuration: mpData.properties.session_length / 60,
    pageViews: mpData.properties.page_view_count || 0,
    clickCount: mpData.properties.click_count || 0,
    scrollDepth: mpData.properties.scroll_depth || 0,
    featuresUsed: mpData.properties.features_used || [],
    activeFeature: mpData.properties.current_screen || 'Dashboard',
    featureTime: mpData.properties.time_per_feature || {},
    eventsTriggered: mpData.event_count || 0,
    queriesRun: mpData.properties.queries_run || 0,
    reportsCreated: mpData.properties.reports_created || 0,
    dashboardsViewed: mpData.properties.dashboards_viewed || 0,
    isActive: mpData.properties.is_active || false,
    lastAction: mpData.event_name || 'Unknown',
    lastActionTime: new Date().toISOString(),
  };
}
```

---

## 🚀 Production Deployment

### Environment Variables

```bash
# Backend server
METRICS_SERVER_PORT=3001
WEBSOCKET_PORT=8080
CORS_ORIGIN=https://your-app.com
DATABASE_URL=postgresql://...

# Frontend
VITE_METRICS_WS_URL=wss://metrics.your-app.com
VITE_METRICS_API_URL=https://api.your-app.com/metrics
```

### Security Considerations

1. **Authentication**: Add API keys or JWT tokens
```javascript
app.post('/api/metrics', authenticateRequest, (req, res) => {
  // ...
});
```

2. **Rate Limiting**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per minute
});

app.use('/api/metrics', limiter);
```

3. **Data Validation**:
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/metrics', [
  body('user_id').isString().notEmpty(),
  body('email').isEmail(),
  body('session_time_minutes').isNumeric(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // ...
});
```

---

## 🐛 Troubleshooting

### Problem: Metrics not showing up

**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. Backend logs for incoming data
4. Data format matches expected structure

```javascript
// Debug mode
metricsService.onUserMetricsUpdate((users) => {
  console.log('Received users:', users.length);
  console.log('First user:', users[0]);
});
```

### Problem: WebSocket disconnecting

**Solution:** Implement reconnection logic (already built-in)

The service automatically reconnects after 5 seconds.

### Problem: Duplicate metrics

**Solution:** Use userId as unique key

The service uses `userId` to deduplicate, so sending the same userId will update the existing metric.

---

## 📚 Additional Resources

- `/types/metrics.ts` - Full TypeScript type definitions
- `/services/metricsService.ts` - Complete service implementation
- `/examples/scraper-integration.js` - Integration examples
- `/examples/backend-server.js` - Full backend server example
- `/components/app/LiveMetricsPage.tsx` - Frontend visualization

---

## 💡 Best Practices

1. **Batch updates** - Use `pushBulkMetrics()` when possible
2. **Timestamp everything** - Always use ISO 8601 format
3. **Handle disconnections** - Implement reconnection logic
4. **Validate data** - Check data types before sending
5. **Use unique IDs** - Ensure userId is truly unique
6. **Monitor performance** - Don't send updates more than once per second per user
7. **Clean old data** - Remove inactive users after threshold

---

## 🎉 You're Ready!

Your Live Metrics system is now fully integrated. Navigate to **Live Metrics** in the sidebar to see your data in real-time!

Need help? Check the examples folder or review the service documentation.
