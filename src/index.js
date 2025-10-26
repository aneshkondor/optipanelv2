import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { EngagementMonitor } from './services/engagementMonitor.js';
import { VapiService } from './services/vapiService.js';
import { FrontendIntegrationService } from './services/frontendIntegration.js';
import { metricsAggregator } from './services/metricsAggregator.js';
import { EngagementDetector } from './services/engagementDetector.js';
import { AIChatService } from './services/aiChatService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for frontend

// Initialize services
const monitor = new EngagementMonitor();
const vapiService = new VapiService();
const frontendIntegration = new FrontendIntegrationService();
const engagementDetector = new EngagementDetector();
const aiChatService = new AIChatService();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get monitoring stats
app.get('/api/stats', (req, res) => {
  const stats = monitor.getStats();
  res.json(stats);
});

// Add user to monitoring
app.post('/api/users', (req, res) => {
  try {
    const user = monitor.addUser(req.body);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update user engagement data
app.post('/api/users/:userId/engagement', (req, res) => {
  try {
    const { userId } = req.params;
    monitor.updateUserEngagement(userId, req.body);
    res.json({ success: true, userId });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Manually trigger check for a user
app.post('/api/users/:userId/check', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await monitor.checkUser(userId);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user call history
app.get('/api/users/:userId/calls', (req, res) => {
  try {
    const { userId } = req.params;
    const history = monitor.getUserCallHistory(userId);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vapi webhook endpoint for call events
app.post('/api/webhooks/vapi', async (req, res) => {
  const event = req.body;

  console.log('📨 Vapi webhook received:', event.type);

  switch (event.type) {
    case 'call-started':
      console.log(`📞 Call started: ${event.call.id}`);
      break;

    case 'call-ended':
      console.log(`✅ Call ended: ${event.call.id}`);
      console.log(`Duration: ${event.call.duration}s`);
      if (event.call.transcript) {
        console.log('Transcript available');
      }
      break;

    case 'transcript':
      console.log(`💬 Transcript update for call ${event.call.id}`);
      break;

    case 'hang':
      console.log(`📴 Call hung up: ${event.call.id}`);
      break;

    default:
      console.log(`Unknown event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Get call details
app.get('/api/calls/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    const call = await vapiService.getCall(callId);
    res.json({ success: true, call });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start/stop monitoring
app.post('/api/monitoring/start', (req, res) => {
  const interval = req.body.intervalMs;
  monitor.startMonitoring(interval);
  res.json({ success: true, message: 'Monitoring started' });
});

app.post('/api/monitoring/stop', (req, res) => {
  monitor.stopMonitoring();
  res.json({ success: true, message: 'Monitoring stopped' });
});

// ============================================================================
// FRONTEND INTEGRATION ENDPOINTS
// ============================================================================

// Analyze single frontend user and trigger call if needed
app.post('/api/frontend/analyze-user', async (req, res) => {
  try {
    const frontendUser = req.body;

    console.log(`\n📨 Received frontend user: ${frontendUser.name}`);

    const result = await frontendIntegration.analyzeAndCall(frontendUser);

    res.json({
      success: true,
      result,
      message: result.status === 'call_initiated'
        ? `Call initiated to ${result.phoneNumber}`
        : result.message
    });
  } catch (error) {
    console.error('Error analyzing frontend user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Batch analyze multiple frontend users
app.post('/api/frontend/analyze-batch', async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of users'
      });
    }

    console.log(`\n📦 Batch analyzing ${users.length} users from frontend`);

    const results = await frontendIntegration.batchAnalyzeUsers(users);

    const callsInitiated = results.filter(r => r.status === 'call_initiated').length;

    res.json({
      success: true,
      results,
      summary: {
        totalUsers: users.length,
        callsInitiated,
        noActionNeeded: results.filter(r => r.status === 'no_action_needed').length,
        recentlyCalled: results.filter(r => r.status === 'recently_called').length,
        errors: results.filter(r => r.status === 'error').length
      }
    });
  } catch (error) {
    console.error('Error batch analyzing users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analyze only critical users from frontend
app.post('/api/frontend/analyze-critical', async (req, res) => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an array of users'
      });
    }

    // Filter only critical users
    const criticalUsers = users.filter(u => u.status === 'critical');

    console.log(`\n🚨 Analyzing ${criticalUsers.length} critical users from frontend`);

    const results = await frontendIntegration.batchAnalyzeUsers(criticalUsers);

    res.json({
      success: true,
      results,
      summary: {
        criticalUsersAnalyzed: criticalUsers.length,
        callsInitiated: results.filter(r => r.status === 'call_initiated').length
      }
    });
  } catch (error) {
    console.error('Error analyzing critical users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get frontend integration stats
app.get('/api/frontend/stats', (req, res) => {
  const stats = frontendIntegration.getCallStats();
  res.json({
    success: true,
    stats,
    defaultPhoneNumber: process.env.DEFAULT_CALL_NUMBER || '+14155797753'
  });
});

// Update default call number
app.post('/api/frontend/update-phone', (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      error: 'Phone number is required'
    });
  }

  frontendIntegration.defaultPhoneNumber = phoneNumber;

  res.json({
    success: true,
    message: `Default phone number updated to ${phoneNumber}`,
    phoneNumber
  });
});

// ============================================================================
// LIVE METRICS ENDPOINTS (from dummy_website)
// ============================================================================

// Receive metrics from dummy_website
app.post('/api/metrics/track', async (req, res) => {
  try {
    const metric = req.body;

    // Process the metric for aggregation
    const formattedMetrics = metricsAggregator.processMetric(metric);

    // 🔥 ANALYZE ENGAGEMENT & AUTO-TRIGGER CALLS
    const engagementAnalysis = await engagementDetector.processUserMetric(metric);

    res.json({
      success: true,
      message: 'Metric received',
      engagementAnalysis: {
        riskLevel: engagementAnalysis.signals.riskLevel,
        score: engagementAnalysis.signals.engagementScore,
        callTriggered: engagementAnalysis.callTriggered,
      },
    });
  } catch (error) {
    console.error('Error processing metric:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get current aggregated metrics (for frontend02)
app.get('/api/metrics/current', (req, res) => {
  try {
    const metrics = metricsAggregator.getFormattedMetrics();
    res.json({
      success: true,
      ...metrics,
    });
  } catch (error) {
    console.error('Error getting metrics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear all metrics (for testing)
app.post('/api/metrics/clear', (req, res) => {
  metricsAggregator.clearMetrics();
  res.json({
    success: true,
    message: 'All metrics cleared',
  });
});

// Get metrics count
app.get('/api/metrics/count', (req, res) => {
  const count = metricsAggregator.getMetricsCount();
  res.json({
    success: true,
    ...count,
  });
});

// ============================================================================
// ENGAGEMENT DETECTOR ENDPOINTS
// ============================================================================

// Get engagement detection stats
app.get('/api/engagement/stats', (req, res) => {
  const stats = engagementDetector.getStats();
  res.json({
    success: true,
    ...stats,
  });
});

// Clear call history for a user (for testing)
app.post('/api/engagement/clear-history/:userId', (req, res) => {
  const { userId } = req.params;
  engagementDetector.clearCallHistory(userId);
  res.json({
    success: true,
    message: `Call history cleared for ${userId}`,
  });
});

// ============================================================================
// AI CHAT ENDPOINTS (OptiPanel AI)
// ============================================================================

// Process AI chat query with Claude
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query is required and must be a string',
      });
    }

    console.log(`\n💬 AI Chat Query: "${query}"`);

    // Process query with Claude
    const response = await aiChatService.processQuery(query);

    res.json({
      success: true,
      content: response.content,
      chart: response.chart,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing AI chat:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process query',
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Revenue Optimization Server Started`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/stats`);
  console.log(`\n📝 API Endpoints:`);
  console.log(`   POST /api/users - Add user to monitoring`);
  console.log(`   POST /api/users/:userId/engagement - Update engagement data`);
  console.log(`   POST /api/users/:userId/check - Manually check user`);
  console.log(`   GET  /api/users/:userId/calls - Get call history`);
  console.log(`   POST /api/monitoring/start - Start monitoring`);
  console.log(`   POST /api/monitoring/stop - Stop monitoring`);
  console.log(`   POST /api/webhooks/vapi - Vapi webhook endpoint\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  monitor.stopMonitoring();
  process.exit(0);
});
