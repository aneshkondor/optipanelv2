import { DataAnalyzer } from './dataAnalyzer.js';
import { VapiService } from './vapiService.js';
import { engagementConfig } from '../config/vapi.config.js';

/**
 * Engagement Monitor Service
 * Monitors user engagement and triggers calls when drops are detected
 */
export class EngagementMonitor {
  constructor() {
    this.dataAnalyzer = new DataAnalyzer(engagementConfig.dropThreshold);
    this.vapiService = new VapiService();
    this.monitoredUsers = new Map();
    this.callHistory = new Map();
    this.isRunning = false;
  }

  /**
   * Add a user to monitoring
   * @param {Object} user - User object with id, name, phone, and engagement data
   */
  addUser(user) {
    const { id, name, phone, engagementData = [] } = user;

    if (!id || !phone) {
      throw new Error('User must have id and phone number');
    }

    this.monitoredUsers.set(id, {
      id,
      name: name || 'User',
      phone,
      engagementData: engagementData.map(d => ({
        timestamp: d.timestamp || new Date().toISOString(),
        value: d.value,
        metric: d.metric || 'engagement_score'
      })),
      lastChecked: null,
      callsMade: 0
    });

    console.log(`✅ Added user ${name} (${id}) to monitoring`);
    return this.monitoredUsers.get(id);
  }

  /**
   * Update engagement data for a user
   */
  updateUserEngagement(userId, newDataPoint) {
    const user = this.monitoredUsers.get(userId);

    if (!user) {
      throw new Error(`User ${userId} not found in monitoring`);
    }

    user.engagementData.push({
      timestamp: newDataPoint.timestamp || new Date().toISOString(),
      value: newDataPoint.value,
      metric: newDataPoint.metric || 'engagement_score'
    });

    // Keep only recent data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    user.engagementData = user.engagementData.filter(d =>
      new Date(d.timestamp) > thirtyDaysAgo
    );

    console.log(`📊 Updated engagement data for user ${user.name} (${userId})`);
  }

  /**
   * Check a specific user's engagement and trigger call if needed
   */
  async checkUser(userId) {
    const user = this.monitoredUsers.get(userId);

    if (!user) {
      console.warn(`⚠️  User ${userId} not found`);
      return null;
    }

    user.lastChecked = new Date().toISOString();

    // Need minimum data points
    if (user.engagementData.length < engagementConfig.minimumDataPoints) {
      console.log(`ℹ️  User ${user.name}: Insufficient data (${user.engagementData.length} points)`);
      return { userId, status: 'insufficient_data' };
    }

    // Analyze engagement
    const analysis = this.dataAnalyzer.analyzeEngagement(user.engagementData);
    const patterns = this.dataAnalyzer.detectPatterns(user.engagementData);

    console.log(`📈 Analysis for ${user.name}:`, {
      hasDropped: analysis.hasDropped,
      dropPercentage: analysis.dropPercentage?.toFixed(1) + '%',
      trend: analysis.trend,
      patterns: patterns.length
    });

    // Check if call should be triggered
    if (analysis.hasDropped) {
      // Check if we've called recently (don't spam)
      const lastCall = this.callHistory.get(userId);
      if (lastCall) {
        const hoursSinceLastCall = (Date.now() - new Date(lastCall.timestamp)) / (1000 * 60 * 60);
        if (hoursSinceLastCall < 48) { // Wait at least 48 hours
          console.log(`⏳ User ${user.name}: Called ${hoursSinceLastCall.toFixed(1)}h ago, skipping`);
          return { userId, status: 'recently_called', analysis };
        }
      }

      // Trigger the call
      return await this.triggerCall(userId, analysis, patterns);
    }

    return { userId, status: 'no_action_needed', analysis };
  }

  /**
   * Trigger a call to the user
   */
  async triggerCall(userId, analysis, patterns = []) {
    const user = this.monitoredUsers.get(userId);

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    console.log(`📞 Triggering call for ${user.name} (${userId})`);

    // Generate dynamic script based on analysis
    const customScript = this.vapiService.generateScript(
      { userName: user.name, userId: user.id },
      analysis
    );

    // Make the call
    const callResult = await this.vapiService.makeCall({
      phoneNumber: user.phone,
      userId: user.id,
      userName: user.name,
      customScript,
      metadata: {
        dropPercentage: analysis.dropPercentage,
        trend: analysis.trend,
        patterns: patterns.map(p => p.type),
        dataPoints: analysis.dataPoints
      }
    });

    // Record call in history
    if (callResult.success) {
      this.callHistory.set(userId, {
        timestamp: new Date().toISOString(),
        callId: callResult.callId,
        analysis,
        patterns
      });

      user.callsMade++;
    }

    return {
      userId,
      status: callResult.success ? 'call_initiated' : 'call_failed',
      callResult,
      analysis
    };
  }

  /**
   * Start monitoring all users periodically
   */
  startMonitoring(intervalMs = engagementConfig.checkIntervalMs) {
    if (this.isRunning) {
      console.log('⚠️  Monitoring is already running');
      return;
    }

    this.isRunning = true;
    console.log(`🚀 Starting engagement monitoring (checking every ${intervalMs / 1000 / 60} minutes)`);

    this.monitoringInterval = setInterval(async () => {
      console.log(`\n🔍 Running engagement check at ${new Date().toLocaleString()}`);
      console.log(`👥 Monitoring ${this.monitoredUsers.size} users\n`);

      for (const userId of this.monitoredUsers.keys()) {
        try {
          await this.checkUser(userId);
        } catch (error) {
          console.error(`❌ Error checking user ${userId}:`, error.message);
        }
      }
    }, intervalMs);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.isRunning = false;
      console.log('🛑 Monitoring stopped');
    }
  }

  /**
   * Get monitoring statistics
   */
  getStats() {
    const users = Array.from(this.monitoredUsers.values());

    return {
      totalUsers: users.length,
      totalCalls: Array.from(this.callHistory.values()).length,
      usersWithCalls: new Set(this.callHistory.keys()).size,
      averageCallsPerUser: users.length > 0
        ? users.reduce((sum, u) => sum + u.callsMade, 0) / users.length
        : 0,
      isMonitoring: this.isRunning,
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        dataPoints: u.engagementData.length,
        callsMade: u.callsMade,
        lastChecked: u.lastChecked
      }))
    };
  }

  /**
   * Get call history for a user
   */
  getUserCallHistory(userId) {
    return this.callHistory.get(userId);
  }
}
