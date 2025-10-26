/**
 * EXAMPLE BACKEND SERVER
 * 
 * This is a simple Node.js/Express server that receives scraped metrics
 * and forwards them to the frontend via WebSocket
 */

const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Store metrics in memory (use a database in production)
const metricsStore = new Map();

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send current metrics to newly connected client
  const allMetrics = Array.from(metricsStore.values());
  if (allMetrics.length > 0) {
    ws.send(JSON.stringify({
      type: 'bulk_metrics',
      metrics: allMetrics,
    }));
  }
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Broadcast to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// API Endpoints

/**
 * POST /api/metrics
 * Receive single user metric from scraper
 */
app.post('/api/metrics', (req, res) => {
  try {
    const metric = transformScrapedData(req.body);
    
    // Store metric
    metricsStore.set(metric.userId, metric);
    
    // Broadcast to all connected clients
    broadcast({
      type: 'user_metric',
      metric: metric,
    });
    
    console.log(`✓ Received metrics for ${metric.userName}`);
    
    res.json({ success: true, userId: metric.userId });
  } catch (error) {
    console.error('Error processing metric:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/metrics/bulk
 * Receive multiple user metrics at once
 */
app.post('/api/metrics/bulk', (req, res) => {
  try {
    const metrics = req.body.metrics.map(transformScrapedData);
    
    // Store all metrics
    metrics.forEach(metric => {
      metricsStore.set(metric.userId, metric);
    });
    
    // Broadcast to all connected clients
    broadcast({
      type: 'bulk_metrics',
      metrics: metrics,
    });
    
    console.log(`✓ Received ${metrics.length} metrics`);
    
    res.json({ success: true, count: metrics.length });
  } catch (error) {
    console.error('Error processing bulk metrics:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/metrics
 * Get all current metrics (for HTTP polling)
 */
app.get('/api/metrics', (req, res) => {
  const metrics = Array.from(metricsStore.values());
  res.json({
    metrics: metrics,
    events: [], // You can add events here if needed
  });
});

/**
 * GET /api/stream
 * Server-Sent Events endpoint for real-time streaming
 */
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send current metrics
  const metrics = Array.from(metricsStore.values());
  metrics.forEach(metric => {
    res.write(`data: ${JSON.stringify({ metric })}\n\n`);
  });
  
  // Set up interval to send updates
  const intervalId = setInterval(() => {
    const randomMetric = Array.from(metricsStore.values())[
      Math.floor(Math.random() * metricsStore.size)
    ];
    
    if (randomMetric) {
      res.write(`data: ${JSON.stringify({ metric: randomMetric })}\n\n`);
    }
  }, 5000);
  
  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(intervalId);
  });
});

/**
 * POST /api/events
 * Receive real-time events
 */
app.post('/api/events', (req, res) => {
  const event = {
    type: req.body.type || 'feature_used',
    userId: req.body.userId,
    userName: req.body.userName,
    data: req.body.data || {},
    timestamp: new Date().toISOString(),
  };
  
  broadcast({
    type: 'event',
    event: event,
  });
  
  res.json({ success: true });
});

/**
 * Transform scraped data to metrics format
 */
function transformScrapedData(data) {
  return {
    userId: data.user_id || data.userId,
    userName: data.name || data.userName,
    email: data.email,
    company: data.company,
    timestamp: new Date().toISOString(),
    
    // Activity metrics
    sessionDuration: Number(data.session_time_minutes || data.sessionDuration || 0),
    pageViews: Number(data.pages_viewed || data.pageViews || 0),
    clickCount: Number(data.total_clicks || data.clickCount || 0),
    scrollDepth: Number(data.scroll_percentage || data.scrollDepth || 0),
    
    // Feature usage
    featuresUsed: data.features_accessed || data.featuresUsed || [],
    activeFeature: data.current_feature || data.activeFeature || 'Dashboard',
    featureTime: data.time_per_feature || data.featureTime || {},
    
    // Engagement
    eventsTriggered: Number(data.events_count || data.eventsTriggered || 0),
    queriesRun: Number(data.queries_executed || data.queriesRun || 0),
    reportsCreated: Number(data.reports_generated || data.reportsCreated || 0),
    dashboardsViewed: Number(data.dashboards_accessed || data.dashboardsViewed || 0),
    
    // Status
    isActive: Boolean(data.is_currently_active || data.isActive),
    lastAction: data.last_action || data.lastAction || 'Page view',
    lastActionTime: data.last_action_timestamp || data.lastActionTime || new Date().toISOString(),
  };
}

// Mock data generator for testing
function generateMockUpdate() {
  const users = Array.from(metricsStore.values());
  if (users.length === 0) return;
  
  const randomUser = users[Math.floor(Math.random() * users.length)];
  randomUser.timestamp = new Date().toISOString();
  randomUser.pageViews++;
  randomUser.eventsTriggered++;
  randomUser.sessionDuration++;
  
  metricsStore.set(randomUser.userId, randomUser);
  
  broadcast({
    type: 'user_metric',
    metric: randomUser,
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    clients: wss.clients.size,
    metricsCount: metricsStore.size,
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Metrics server running on port ${PORT}`);
  console.log(`📊 WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`📡 HTTP API: http://localhost:${PORT}/api/metrics`);
  console.log(`🔴 SSE Stream: http://localhost:${PORT}/api/stream`);
  
  // Start mock data updates (remove in production)
  if (process.env.MOCK_DATA === 'true') {
    console.log('🧪 Mock data mode enabled');
    setInterval(generateMockUpdate, 3000);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = { app, server, wss };
