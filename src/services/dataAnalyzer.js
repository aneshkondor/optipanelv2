/**
 * Data Analyzer Service
 * Analyzes user engagement data to detect drops and anomalies
 */

export class DataAnalyzer {
  constructor(dropThreshold = 0.30) {
    this.dropThreshold = dropThreshold;
  }

  /**
   * Analyze engagement data for a specific user
   * @param {Array} dataPoints - Array of engagement metrics with timestamps
   * @returns {Object} Analysis result
   */
  analyzeEngagement(dataPoints) {
    if (!dataPoints || dataPoints.length < 2) {
      return {
        hasDropped: false,
        dropPercentage: 0,
        baseline: 0,
        recentAverage: 0,
        trend: 'stable',
        dataPoints: dataPoints ? dataPoints.length : 0,
        lastDataPoint: dataPoints && dataPoints.length > 0 ? dataPoints[dataPoints.length - 1] : null,
        reason: 'Insufficient data points'
      };
    }

    // Sort by timestamp to ensure chronological order
    const sorted = [...dataPoints].sort((a, b) =>
      new Date(a.timestamp) - new Date(b.timestamp)
    );

    // Calculate baseline (average of older data points)
    const baselinePoints = sorted.slice(0, Math.floor(sorted.length / 2));
    const baseline = this.calculateAverage(baselinePoints.map(p => p.value));

    // Calculate recent average
    const recentPoints = sorted.slice(-3); // Last 3 data points
    const recentAverage = this.calculateAverage(recentPoints.map(p => p.value));

    // Calculate drop percentage
    const dropPercentage = (baseline - recentAverage) / baseline;

    const hasDropped = dropPercentage >= this.dropThreshold && recentAverage < baseline;

    return {
      hasDropped,
      dropPercentage: dropPercentage * 100,
      baseline,
      recentAverage,
      trend: this.calculateTrend(sorted),
      dataPoints: sorted.length,
      lastDataPoint: sorted[sorted.length - 1]
    };
  }

  /**
   * Calculate average of values
   */
  calculateAverage(values) {
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  /**
   * Calculate engagement trend
   */
  calculateTrend(dataPoints) {
    if (dataPoints.length < 2) return 'stable';

    const values = dataPoints.map(p => p.value);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = this.calculateAverage(firstHalf);
    const secondAvg = this.calculateAverage(secondHalf);

    const change = (secondAvg - firstAvg) / firstAvg;

    if (change < -0.1) return 'declining';
    if (change > 0.1) return 'improving';
    return 'stable';
  }

  /**
   * Detect specific engagement patterns
   */
  detectPatterns(dataPoints) {
    const patterns = [];

    // Detect sudden drop
    for (let i = 1; i < dataPoints.length; i++) {
      const change = (dataPoints[i].value - dataPoints[i-1].value) / dataPoints[i-1].value;
      if (change < -0.5) {
        patterns.push({
          type: 'sudden_drop',
          timestamp: dataPoints[i].timestamp,
          change: change * 100
        });
      }
    }

    // Detect consecutive declines
    let consecutiveDeclines = 0;
    for (let i = 1; i < dataPoints.length; i++) {
      if (dataPoints[i].value < dataPoints[i-1].value) {
        consecutiveDeclines++;
      } else {
        consecutiveDeclines = 0;
      }
    }

    if (consecutiveDeclines >= 3) {
      patterns.push({
        type: 'consecutive_decline',
        count: consecutiveDeclines
      });
    }

    return patterns;
  }
}
