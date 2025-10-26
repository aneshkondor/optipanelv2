/**
 * EXAMPLE: How to integrate scraped data into the Live Metrics system
 * 
 * This example shows how to push user metrics from an external scraper
 * to the Live Metrics dashboard
 */

// METHOD 1: Direct JavaScript Integration (Client-side)
// ======================================================

import { metricsService } from '../services/metricsService';

// Example: Push a single user's metrics
function pushUserActivity(scrapedData) {
  const userMetric = {
    userId: scrapedData.user_id,
    userName: scrapedData.name,
    email: scrapedData.email,
    company: scrapedData.company,
    timestamp: new Date().toISOString(),
    
    // Activity metrics from scraper
    sessionDuration: scrapedData.session_time_minutes,
    pageViews: scrapedData.pages_viewed,
    clickCount: scrapedData.total_clicks,
    scrollDepth: scrapedData.scroll_percentage,
    
    // Feature usage
    featuresUsed: scrapedData.features_accessed || [],
    activeFeature: scrapedData.current_feature || 'Dashboard',
    featureTime: scrapedData.time_per_feature || {},
    
    // Engagement
    eventsTriggered: scrapedData.events_count || 0,
    queriesRun: scrapedData.queries_executed || 0,
    reportsCreated: scrapedData.reports_generated || 0,
    dashboardsViewed: scrapedData.dashboards_accessed || 0,
    
    // Status
    isActive: scrapedData.is_currently_active || false,
    lastAction: scrapedData.last_action || 'Page view',
    lastActionTime: scrapedData.last_action_timestamp || new Date().toISOString(),
  };

  // Push to metrics service
  metricsService.pushUserMetric(userMetric);
}

// Example: Push bulk metrics (recommended for scrapers)
function pushBulkUserMetrics(scrapedUsers) {
  const metrics = scrapedUsers.map(user => ({
    userId: user.id,
    userName: user.name,
    email: user.email,
    company: user.company,
    timestamp: new Date().toISOString(),
    sessionDuration: user.session_time,
    pageViews: user.pages,
    clickCount: user.clicks,
    scrollDepth: user.scroll,
    featuresUsed: user.features || [],
    activeFeature: user.current_feature || 'Dashboard',
    featureTime: user.feature_times || {},
    eventsTriggered: user.events || 0,
    queriesRun: user.queries || 0,
    reportsCreated: user.reports || 0,
    dashboardsViewed: user.dashboards || 0,
    isActive: user.active,
    lastAction: user.last_action,
    lastActionTime: user.last_action_time,
  }));

  metricsService.pushBulkMetrics(metrics);
}

// METHOD 2: WebSocket Integration (Real-time)
// ============================================

// Connect to your scraper's WebSocket endpoint
metricsService.connectWebSocket('ws://your-scraper-server.com/metrics');

// Your backend should send messages in this format:
/*
{
  "type": "user_metric",
  "metric": {
    "userId": "user123",
    "userName": "John Doe",
    // ... rest of the metric fields
  }
}

OR for bulk:

{
  "type": "bulk_metrics",
  "metrics": [
    { "userId": "user1", ... },
    { "userId": "user2", ... }
  ]
}
*/

// METHOD 3: HTTP Polling (Simple integration)
// ============================================

// Poll your scraper API every 10 seconds
metricsService.startPolling('https://your-scraper-api.com/metrics', 10000);

// Your API should return:
/*
{
  "metrics": [
    {
      "userId": "user123",
      "userName": "John Doe",
      "email": "john@example.com",
      // ... rest of fields
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
*/

// METHOD 4: Server-Sent Events (SSE)
// ===================================

// Connect to SSE endpoint for streaming metrics
metricsService.connectSSE('https://your-scraper-api.com/stream');

// Your server should send:
/*
event: message
data: {"metric": {"userId": "user123", "userName": "John Doe", ...}}
*/

// EXAMPLE SCRAPER PSEUDO-CODE
// ============================

/*
// Your scraper might look like this:

const puppeteer = require('puppeteer');

async function scrapeUserMetrics() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to your analytics target
  await page.goto('https://target-app.com');
  
  // Extract metrics
  const metrics = await page.evaluate(() => {
    // Get user data from the page
    return {
      user_id: document.querySelector('[data-user-id]').textContent,
      name: document.querySelector('.user-name').textContent,
      session_time_minutes: parseInt(sessionStorage.getItem('sessionTime')) / 60,
      pages_viewed: parseInt(sessionStorage.getItem('pageViews')),
      current_feature: document.querySelector('.active-feature').textContent,
      is_currently_active: document.visibilityState === 'visible',
      // ... extract more data
    };
  });
  
  // Send to your backend or directly to the app
  await fetch('http://localhost:3000/api/metrics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metrics),
  });
  
  await browser.close();
}

// Run scraper every 30 seconds
setInterval(scrapeUserMetrics, 30000);
*/

// INTEGRATION WITH YOUR OWN BACKEND
// ==================================

/*
If you have a backend that receives scraped data, you can forward it:

// Your backend (Node.js example)
const express = require('express');
const app = express();

app.post('/api/metrics', (req, res) => {
  const scrapedData = req.body;
  
  // Forward to frontend via WebSocket
  wss.clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'user_metric',
      metric: transformScrapedData(scrapedData),
    }));
  });
  
  res.json({ success: true });
});

function transformScrapedData(data) {
  return {
    userId: data.user_id,
    userName: data.name,
    email: data.email,
    company: data.company,
    timestamp: new Date().toISOString(),
    sessionDuration: data.session_time_minutes,
    pageViews: data.pages_viewed,
    clickCount: data.total_clicks,
    scrollDepth: data.scroll_percentage,
    featuresUsed: data.features_accessed || [],
    activeFeature: data.current_feature || 'Dashboard',
    featureTime: data.time_per_feature || {},
    eventsTriggered: data.events_count || 0,
    queriesRun: data.queries_executed || 0,
    reportsCreated: data.reports_generated || 0,
    dashboardsViewed: data.dashboards_accessed || 0,
    isActive: data.is_currently_active || false,
    lastAction: data.last_action || 'Page view',
    lastActionTime: data.last_action_timestamp || new Date().toISOString(),
  };
}
*/

// TESTING THE INTEGRATION
// ========================

// Generate mock data for testing
function generateMockMetrics(count = 10) {
  const mockUsers = [];
  const features = ['Dashboard', 'Funnels', 'Cohorts', 'Revenue', 'Experiments'];
  
  for (let i = 0; i < count; i++) {
    mockUsers.push({
      userId: `user_${i + 1}`,
      userName: `User ${i + 1}`,
      email: `user${i + 1}@company.com`,
      company: `Company ${i + 1}`,
      timestamp: new Date().toISOString(),
      sessionDuration: Math.floor(Math.random() * 60) + 5,
      pageViews: Math.floor(Math.random() * 50) + 1,
      clickCount: Math.floor(Math.random() * 100) + 10,
      scrollDepth: Math.floor(Math.random() * 100),
      featuresUsed: features.slice(0, Math.floor(Math.random() * features.length) + 1),
      activeFeature: features[Math.floor(Math.random() * features.length)],
      featureTime: Object.fromEntries(
        features.map(f => [f, Math.floor(Math.random() * 30)])
      ),
      eventsTriggered: Math.floor(Math.random() * 20),
      queriesRun: Math.floor(Math.random() * 10),
      reportsCreated: Math.floor(Math.random() * 5),
      dashboardsViewed: Math.floor(Math.random() * 8),
      isActive: Math.random() > 0.3,
      lastAction: 'Viewed report',
      lastActionTime: new Date().toISOString(),
    });
  }
  
  return mockUsers;
}

// Test the integration
function testIntegration() {
  console.log('Testing metrics integration...');
  
  // Generate and push mock data
  const mockData = generateMockMetrics(15);
  metricsService.pushBulkMetrics(mockData);
  
  console.log('✓ Pushed 15 mock users to metrics service');
  
  // Simulate real-time updates
  setInterval(() => {
    const randomUser = mockData[Math.floor(Math.random() * mockData.length)];
    randomUser.timestamp = new Date().toISOString();
    randomUser.pageViews++;
    randomUser.eventsTriggered++;
    
    metricsService.pushUserMetric(randomUser);
    console.log(`✓ Updated ${randomUser.userName}`);
  }, 3000);
}

// Uncomment to test:
// testIntegration();

export {
  pushUserActivity,
  pushBulkUserMetrics,
  generateMockMetrics,
  testIntegration,
};
