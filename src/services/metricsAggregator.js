/**
 * Metrics Aggregator Service
 * Receives metrics from dummy_website and formats them for frontend02
 */

class MetricsAggregator {
  constructor() {
    this.userMetrics = new Map(); // userId -> metric data
    this.recentEvents = [];
    this.maxEvents = 100;
    this.historicalData = []; // Store actual time series points
    this.maxHistoricalPoints = 20;
  }

  /**
   * Process incoming metric from dummy_website
   */
  processMetric(metric) {
    const userId = metric.userId || 'guest';

    // Store/update user metric
    this.userMetrics.set(userId, {
      ...metric,
      lastUpdate: new Date().toISOString(),
    });

    // Add to event stream
    this.addEvent({
      type: 'user_activity',
      userId,
      userName: metric.userName,
      timestamp: new Date().toISOString(),
      data: {
        feature: metric.activeFeature,
        action: metric.lastAction,
      },
    });

    // Add to time series data (real snapshot)
    this.addHistoricalDataPoint();

    console.log(`[Metrics] Updated metrics for user: ${metric.userName}`);

    return this.getFormattedMetrics();
  }

  /**
   * Add an event to the stream
   */
  addEvent(event) {
    this.recentEvents.unshift(event);
    if (this.recentEvents.length > this.maxEvents) {
      this.recentEvents.pop();
    }
  }

  /**
   * Get formatted metrics for frontend02
   */
  getFormattedMetrics() {
    const userMetricsArray = Array.from(this.userMetrics.values());

    // Calculate aggregated metrics
    const aggregatedMetrics = this.calculateAggregatedMetrics(userMetricsArray);

    // Calculate feature usage
    const featureUsage = this.calculateFeatureUsage(userMetricsArray);

    // Generate time series data (last 10 data points)
    const timeSeriesData = this.generateTimeSeriesData();

    return {
      aggregatedMetrics,
      userMetrics: userMetricsArray,
      timeSeriesData,
      recentEvents: this.recentEvents.slice(0, 50),
      featureUsage,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calculate aggregated metrics across all users
   */
  calculateAggregatedMetrics(userMetrics) {
    const totalUsers = userMetrics.length;
    const activeUsers = userMetrics.filter(u => u.isActive).length;
    const totalPageViews = userMetrics.reduce((sum, u) => sum + (u.pageViews || 0), 0);
    const totalEvents = userMetrics.reduce((sum, u) => sum + (u.eventsTriggered || 0), 0);
    const totalClicks = userMetrics.reduce((sum, u) => sum + (u.clickCount || 0), 0);
    const avgSessionDuration = totalUsers > 0
      ? userMetrics.reduce((sum, u) => sum + (u.sessionDuration || 0), 0) / totalUsers
      : 0;

    // Top features
    const featureCount = {};
    userMetrics.forEach(user => {
      const feature = user.activeFeature || 'Unknown';
      featureCount[feature] = (featureCount[feature] || 0) + 1;
    });

    const topFeatures = Object.entries(featureCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, usage]) => ({ name, usage }));

    return {
      totalUsers,
      activeUsers,
      totalPageViews,
      totalEvents,
      totalClicks,
      avgSessionDuration: Math.round(avgSessionDuration),
      topFeatures,
    };
  }

  /**
   * Calculate feature usage statistics
   */
  calculateFeatureUsage(userMetrics) {
    const featureStats = {};

    userMetrics.forEach(user => {
      if (user.featureTime) {
        Object.entries(user.featureTime).forEach(([featureName, timeSpent]) => {
          if (!featureStats[featureName]) {
            featureStats[featureName] = {
              totalUsage: 0,
              totalTime: 0,
              uniqueUsers: new Set(),
            };
          }

          featureStats[featureName].totalUsage++;
          featureStats[featureName].totalTime += timeSpent;
          featureStats[featureName].uniqueUsers.add(user.userId);
        });
      }
    });

    return Object.entries(featureStats).map(([featureName, stats]) => ({
      featureName,
      totalUsage: stats.totalUsage,
      uniqueUsers: stats.uniqueUsers.size,
      avgDuration: stats.totalTime / stats.totalUsage / 60, // Convert to minutes
      trend: 'stable', // Can be calculated with historical data
    }));
  }

  /**
   * Add a historical data point (called when metrics are updated)
   */
  addHistoricalDataPoint() {
    const userMetricsArray = Array.from(this.userMetrics.values());
    const activeUsers = userMetricsArray.filter(u => u.isActive).length;
    const totalEvents = userMetricsArray.reduce((sum, u) => sum + (u.eventsTriggered || 0), 0);
    const avgEngagement = userMetricsArray.length > 0
      ? userMetricsArray.reduce((sum, u) => sum + (u.sessionDuration || 0), 0) / userMetricsArray.length
      : 0;

    const dataPoint = {
      timestamp: new Date().toISOString(),
      activeUsers,
      totalEvents,
      avgEngagement: Math.round(avgEngagement),
    };

    // Only add if it's different from the last point (avoid duplicates)
    const lastPoint = this.historicalData[this.historicalData.length - 1];
    if (!lastPoint ||
        lastPoint.activeUsers !== dataPoint.activeUsers ||
        lastPoint.totalEvents !== dataPoint.totalEvents) {
      this.historicalData.push(dataPoint);

      // Keep only last N points
      if (this.historicalData.length > this.maxHistoricalPoints) {
        this.historicalData.shift();
      }
    }
  }

  /**
   * Generate time series data for charts
   */
  generateTimeSeriesData() {
    // Return actual historical data instead of generating fake data
    if (this.historicalData.length === 0) {
      // Initialize with one data point if empty
      this.addHistoricalDataPoint();
    }
    return this.historicalData;
  }

  /**
   * Clear all metrics (for testing/demo)
   */
  clearMetrics() {
    this.userMetrics.clear();
    this.recentEvents = [];
    console.log('[Metrics] All metrics cleared');
  }

  /**
   * Get current metrics count
   */
  getMetricsCount() {
    return {
      totalUsers: this.userMetrics.size,
      totalEvents: this.recentEvents.length,
    };
  }
}

// Singleton instance
const metricsAggregator = new MetricsAggregator();

export { metricsAggregator };
