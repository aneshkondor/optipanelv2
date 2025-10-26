/**
 * Metrics Service - Central hub for receiving and managing live user metrics
 * This service can accept data from external sources (scrapers, APIs, webhooks)
 */

import type {
  UserMetric,
  AggregatedMetrics,
  RealtimeEvent,
  MetricsTimeSeriesPoint,
  FeatureUsageMetric,
} from '../types/metrics';

type MetricsListener = (metrics: AggregatedMetrics) => void;
type EventListener = (event: RealtimeEvent) => void;
type UserMetricsListener = (users: UserMetric[]) => void;

class MetricsService {
  private users: Map<string, UserMetric> = new Map();
  private timeSeriesData: MetricsTimeSeriesPoint[] = [];
  private recentEvents: RealtimeEvent[] = [];
  private metricsListeners: Set<MetricsListener> = new Set();
  private eventListeners: Set<EventListener> = new Set();
  private userMetricsListeners: Set<UserMetricsListener> = new Set();

  constructor() {
    // Start aggregation interval
    setInterval(() => this.aggregateMetrics(), 5000); // Aggregate every 5 seconds
  }

  /**
   * INTEGRATION METHOD 1: Push individual user metrics
   * Call this method when you receive data from your scraper
   */
  pushUserMetric(metric: UserMetric): void {
    this.users.set(metric.userId, metric);
    this.notifyUserMetricsListeners();
    
    // Create event for activity feed
    const event: RealtimeEvent = {
      type: 'feature_used',
      userId: metric.userId,
      userName: metric.userName,
      data: { feature: metric.activeFeature },
      timestamp: metric.timestamp,
    };
    this.addEvent(event);
  }

  /**
   * INTEGRATION METHOD 2: Push bulk metrics
   * Use this when receiving batch data
   */
  pushBulkMetrics(metrics: UserMetric[]): void {
    metrics.forEach(metric => {
      this.users.set(metric.userId, metric);
    });
    this.notifyUserMetricsListeners();
  }

  /**
   * INTEGRATION METHOD 3: WebSocket connection
   * Connect to a WebSocket endpoint that streams metrics
   */
  connectWebSocket(url: string): void {
    const ws = new WebSocket(url);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'user_metric') {
          this.pushUserMetric(data.metric);
        } else if (data.type === 'bulk_metrics') {
          this.pushBulkMetrics(data.metrics);
        } else if (data.type === 'event') {
          this.addEvent(data.event);
        }
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket closed, attempting reconnect...');
      setTimeout(() => this.connectWebSocket(url), 5000);
    };
  }

  /**
   * INTEGRATION METHOD 4: HTTP Polling
   * Poll an HTTP endpoint for metrics updates
   */
  startPolling(url: string, intervalMs: number = 10000): void {
    const poll = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.metrics) {
          this.pushBulkMetrics(data.metrics);
        }
        if (data.events) {
          data.events.forEach((event: RealtimeEvent) => this.addEvent(event));
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };
    
    setInterval(poll, intervalMs);
    poll(); // Initial poll
  }

  /**
   * INTEGRATION METHOD 5: Server-Sent Events (SSE)
   * Connect to an SSE endpoint for real-time streaming
   */
  connectSSE(url: string): void {
    const eventSource = new EventSource(url);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.metric) {
          this.pushUserMetric(data.metric);
        }
      } catch (error) {
        console.error('SSE parse error:', error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      eventSource.close();
      setTimeout(() => this.connectSSE(url), 5000);
    };
  }

  /**
   * Subscribe to aggregated metrics updates
   */
  onMetricsUpdate(listener: MetricsListener): () => void {
    this.metricsListeners.add(listener);
    return () => this.metricsListeners.delete(listener);
  }

  /**
   * Subscribe to real-time events
   */
  onEvent(listener: EventListener): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  /**
   * Subscribe to user metrics updates
   */
  onUserMetricsUpdate(listener: UserMetricsListener): () => void {
    this.userMetricsListeners.add(listener);
    return () => this.userMetricsListeners.delete(listener);
  }

  /**
   * Get current aggregated metrics
   */
  getAggregatedMetrics(): AggregatedMetrics {
    const userArray = Array.from(this.users.values());
    const activeUsers = userArray.filter(u => u.isActive);
    
    const totalPageViews = userArray.reduce((sum, u) => sum + u.pageViews, 0);
    const totalEvents = userArray.reduce((sum, u) => sum + u.eventsTriggered, 0);
    const avgSessionDuration = activeUsers.length > 0
      ? activeUsers.reduce((sum, u) => sum + u.sessionDuration, 0) / activeUsers.length
      : 0;

    // Calculate top features
    const featureUsage = new Map<string, number>();
    userArray.forEach(user => {
      user.featuresUsed.forEach(feature => {
        featureUsage.set(feature, (featureUsage.get(feature) || 0) + 1);
      });
    });
    
    const topFeatures = Array.from(featureUsage.entries())
      .map(([name, usage]) => ({ name, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5);

    return {
      totalUsers: userArray.length,
      activeUsers: activeUsers.length,
      avgSessionDuration,
      totalPageViews,
      totalEvents,
      topFeatures,
      peakHours: this.calculatePeakHours(userArray),
    };
  }

  /**
   * Get all current user metrics
   */
  getAllUserMetrics(): UserMetric[] {
    return Array.from(this.users.values());
  }

  /**
   * Get time series data
   */
  getTimeSeriesData(): MetricsTimeSeriesPoint[] {
    return this.timeSeriesData;
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 50): RealtimeEvent[] {
    return this.recentEvents.slice(0, limit);
  }

  /**
   * Get feature usage statistics
   */
  getFeatureUsageStats(): FeatureUsageMetric[] {
    const featureStats = new Map<string, { users: Set<string>; totalTime: number; count: number }>();
    
    this.users.forEach(user => {
      Object.entries(user.featureTime).forEach(([feature, time]) => {
        if (!featureStats.has(feature)) {
          featureStats.set(feature, { users: new Set(), totalTime: 0, count: 0 });
        }
        const stats = featureStats.get(feature)!;
        stats.users.add(user.userId);
        stats.totalTime += time;
        stats.count++;
      });
    });

    return Array.from(featureStats.entries()).map(([name, stats]) => ({
      featureName: name,
      totalUsage: stats.count,
      uniqueUsers: stats.users.size,
      avgDuration: stats.totalTime / stats.count,
      trend: 'stable' as const, // Could be calculated based on historical data
    }));
  }

  /**
   * Clear all metrics (useful for testing)
   */
  clearMetrics(): void {
    this.users.clear();
    this.timeSeriesData = [];
    this.recentEvents = [];
    this.notifyMetricsListeners();
    this.notifyUserMetricsListeners();
  }

  // Private methods

  private addEvent(event: RealtimeEvent): void {
    this.recentEvents.unshift(event);
    if (this.recentEvents.length > 100) {
      this.recentEvents.pop();
    }
    this.notifyEventListeners(event);
  }

  private aggregateMetrics(): void {
    const metrics = this.getAggregatedMetrics();
    
    // Add to time series
    const point: MetricsTimeSeriesPoint = {
      timestamp: new Date().toISOString(),
      activeUsers: metrics.activeUsers,
      totalEvents: metrics.totalEvents,
      avgEngagement: metrics.avgSessionDuration,
    };
    
    this.timeSeriesData.push(point);
    
    // Keep only last 100 points
    if (this.timeSeriesData.length > 100) {
      this.timeSeriesData.shift();
    }
    
    this.notifyMetricsListeners();
  }

  private calculatePeakHours(users: UserMetric[]): Array<{ hour: number; users: number }> {
    const hourCounts = new Array(24).fill(0);
    
    users.forEach(user => {
      const hour = new Date(user.timestamp).getHours();
      hourCounts[hour]++;
    });
    
    return hourCounts
      .map((users, hour) => ({ hour, users }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 5);
  }

  private notifyMetricsListeners(): void {
    const metrics = this.getAggregatedMetrics();
    this.metricsListeners.forEach(listener => listener(metrics));
  }

  private notifyEventListeners(event: RealtimeEvent): void {
    this.eventListeners.forEach(listener => listener(event));
  }

  private notifyUserMetricsListeners(): void {
    const users = this.getAllUserMetrics();
    this.userMetricsListeners.forEach(listener => listener(users));
  }
}

// Export singleton instance
export const metricsService = new MetricsService();
