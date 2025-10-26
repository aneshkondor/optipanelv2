/**
 * Type definitions for live user metrics
 * These types define the structure of data coming from external sources
 */

export interface UserMetric {
  userId: string;
  userName: string;
  email: string;
  company: string;
  timestamp: string;
  
  // Activity metrics
  sessionDuration: number; // in minutes
  pageViews: number;
  clickCount: number;
  scrollDepth: number; // percentage
  
  // Feature usage
  featuresUsed: string[];
  activeFeature: string;
  featureTime: Record<string, number>; // time spent per feature
  
  // Engagement
  eventsTriggered: number;
  queriesRun: number;
  reportsCreated: number;
  dashboardsViewed: number;
  
  // Status
  isActive: boolean;
  lastAction: string;
  lastActionTime: string;
}

export interface AggregatedMetrics {
  totalUsers: number;
  activeUsers: number;
  avgSessionDuration: number;
  totalPageViews: number;
  totalEvents: number;
  topFeatures: Array<{ name: string; usage: number }>;
  peakHours: Array<{ hour: number; users: number }>;
}

export interface RealtimeEvent {
  type: 'user_joined' | 'user_left' | 'feature_used' | 'event_triggered' | 'query_run';
  userId: string;
  userName: string;
  data: any;
  timestamp: string;
}

export interface MetricsTimeSeriesPoint {
  timestamp: string;
  activeUsers: number;
  totalEvents: number;
  avgEngagement: number;
}

export interface FeatureUsageMetric {
  featureName: string;
  totalUsage: number;
  uniqueUsers: number;
  avgDuration: number;
  trend: 'up' | 'down' | 'stable';
}

export interface UserActivityHeatmap {
  day: string;
  hour: number;
  activity: number;
}
