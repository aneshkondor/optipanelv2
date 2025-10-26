/**
 * Metrics Context - Provides live metrics data throughout the app
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { metricsService } from '../services/metricsService';
import type {
  UserMetric,
  AggregatedMetrics,
  RealtimeEvent,
  MetricsTimeSeriesPoint,
  FeatureUsageMetric,
} from '../types/metrics';

interface MetricsContextValue {
  aggregatedMetrics: AggregatedMetrics | null;
  userMetrics: UserMetric[];
  timeSeriesData: MetricsTimeSeriesPoint[];
  recentEvents: RealtimeEvent[];
  featureUsage: FeatureUsageMetric[];
  isConnected: boolean;
}

const MetricsContext = createContext<MetricsContextValue | null>(null);

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [aggregatedMetrics, setAggregatedMetrics] = useState<AggregatedMetrics | null>(null);
  const [userMetrics, setUserMetrics] = useState<UserMetric[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<MetricsTimeSeriesPoint[]>([]);
  const [recentEvents, setRecentEvents] = useState<RealtimeEvent[]>([]);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsageMetric[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Subscribe to metrics updates
    const unsubscribeMetrics = metricsService.onMetricsUpdate((metrics) => {
      setAggregatedMetrics(metrics);
      setTimeSeriesData(metricsService.getTimeSeriesData());
      setFeatureUsage(metricsService.getFeatureUsageStats());
    });

    const unsubscribeEvents = metricsService.onEvent((event) => {
      setRecentEvents(prev => [event, ...prev].slice(0, 50));
    });

    const unsubscribeUsers = metricsService.onUserMetricsUpdate((users) => {
      setUserMetrics(users);
    });

    // Start polling backend for real-time metrics from dummy_website
    let lastDataHash = '';

    const pollInterval = setInterval(async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/metrics/current`);
        const data = await response.json();

        if (data.success && data.userMetrics) {
          // Create hash of current data to detect actual changes
          const currentHash = JSON.stringify({
            events: data.aggregatedMetrics?.totalEvents,
            users: data.aggregatedMetrics?.totalUsers,
            timeSeriesLength: data.timeSeriesData?.length,
          });

          // ONLY update if data actually changed
          if (currentHash !== lastDataHash) {
            lastDataHash = currentHash;

            // Update metrics service with backend data
            metricsService.pushBulkMetrics(data.userMetrics);

            // Update aggregated metrics
            if (data.aggregatedMetrics) {
              setAggregatedMetrics(data.aggregatedMetrics);
            }

            // Update time series (don't regenerate - use backend data)
            if (data.timeSeriesData && data.timeSeriesData.length > 0) {
              setTimeSeriesData(data.timeSeriesData);
            }

            // Update events
            if (data.recentEvents) {
              setRecentEvents(data.recentEvents.slice(0, 50));
            }

            // Update feature usage
            if (data.featureUsage) {
              setFeatureUsage(data.featureUsage);
            }

            console.log('📊 Dashboard updated - new data received');
          } else {
            console.log('⏭️ No changes - skipping update');
          }

          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        setIsConnected(false);
      }
    }, 5000); // Poll every 5 seconds

    // Initial load
    setAggregatedMetrics(metricsService.getAggregatedMetrics());
    setUserMetrics(metricsService.getAllUserMetrics());
    setTimeSeriesData(metricsService.getTimeSeriesData());
    setRecentEvents(metricsService.getRecentEvents());
    setFeatureUsage(metricsService.getFeatureUsageStats());

    return () => {
      unsubscribeMetrics();
      unsubscribeEvents();
      unsubscribeUsers();
      clearInterval(pollInterval);
    };
  }, []);

  const value: MetricsContextValue = {
    aggregatedMetrics,
    userMetrics,
    timeSeriesData,
    recentEvents,
    featureUsage,
    isConnected,
  };

  return (
    <MetricsContext.Provider value={value}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within MetricsProvider');
  }
  return context;
}
