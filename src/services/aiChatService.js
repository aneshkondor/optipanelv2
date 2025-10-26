import Anthropic from '@anthropic-ai/sdk';

/**
 * AI Chat Service - Uses Claude to generate insights and chart data
 * For MVP: Generates realistic-looking data based on query patterns
 */
export class AIChatService {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });
  }

  /**
   * Process a user query and generate a response with chart data
   */
  async processQuery(query) {
    try {
      console.log(`🤖 Processing AI query: "${query}"`);

      // Get Claude's analysis of the query
      const analysis = await this.analyzeQuery(query);

      // Generate appropriate chart data based on the analysis
      const chartData = this.generateChartData(analysis);

      return {
        content: analysis.summary,
        chart: chartData,
      };
    } catch (error) {
      console.error('Error processing AI query:', error);
      throw error;
    }
  }

  /**
   * Use Claude to analyze the query and determine what data to show
   */
  async analyzeQuery(query) {
    const prompt = `You are OptiPanel AI, a B2B analytics assistant. A user asked: "${query}"

Analyze this query and provide:
1. A one-line professional business summary (max 150 characters)
2. What type of chart would best visualize this (line, bar, or area)
3. What metrics should be shown (2-3 specific metric names)
4. Appropriate time range (daily, weekly, monthly, quarterly)

Respond in this exact JSON format:
{
  "summary": "Brief professional insight in business terms",
  "chartType": "line|bar|area",
  "metrics": ["metric1", "metric2"],
  "timeRange": "daily|weekly|monthly|quarterly",
  "category": "revenue|retention|conversion|engagement|cac_ltv|general"
}`;

    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    // Parse Claude's response
    const responseText = message.content[0].text;
    console.log('📊 Claude analysis:', responseText);

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Claude response');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Generate realistic chart data based on Claude's analysis
   * For MVP: Using pattern-based generation with realistic trends
   */
  generateChartData(analysis) {
    const { chartType, metrics, timeRange, category } = analysis;

    // Generate data points based on time range
    const dataPoints = this.generateDataPoints(timeRange);

    // Generate realistic values based on category
    const data = dataPoints.map((point, index) => {
      const baseData = { ...point };

      metrics.forEach(metric => {
        baseData[metric] = this.generateMetricValue(category, metric, index, dataPoints.length);
      });

      return baseData;
    });

    return {
      type: chartType,
      title: this.generateChartTitle(category, metrics),
      data,
      dataKeys: metrics,
    };
  }

  /**
   * Generate time-based data points
   */
  generateDataPoints(timeRange) {
    const points = [];
    const now = new Date();

    switch (timeRange) {
      case 'daily':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          points.push({
            name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          });
        }
        break;

      case 'weekly':
        for (let i = 5; i >= 0; i--) {
          points.push({ name: `Week ${6 - i}` });
        }
        break;

      case 'monthly':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        months.forEach(month => points.push({ name: month }));
        break;

      case 'quarterly':
        for (let i = 4; i >= 0; i--) {
          const quarter = 4 - i;
          points.push({ name: `Q${quarter} 2024` });
        }
        break;

      default:
        points.push({ name: 'Current' });
    }

    return points;
  }

  /**
   * Generate realistic metric values with trends
   */
  generateMetricValue(category, metric, index, totalPoints) {
    const lowerMetric = metric.toLowerCase();

    // Base values by category
    const baseValues = {
      revenue: 250000,
      retention: 85,
      conversion: 7.5,
      engagement: 72,
      cac: 900,
      ltv: 14000,
      users: 5000,
      rate: 6.8,
      default: 100,
    };

    // Determine base value
    let base = baseValues.default;
    if (lowerMetric.includes('revenue') || lowerMetric.includes('sales')) base = baseValues.revenue;
    else if (lowerMetric.includes('retention')) base = baseValues.retention;
    else if (lowerMetric.includes('conversion') || lowerMetric.includes('rate')) base = baseValues.rate;
    else if (lowerMetric.includes('engagement')) base = baseValues.engagement;
    else if (lowerMetric.includes('cac')) base = baseValues.cac;
    else if (lowerMetric.includes('ltv')) base = baseValues.ltv;
    else if (lowerMetric.includes('user')) base = baseValues.users;

    // Add growth trend (generally upward for business metrics)
    const growthRate = category === 'cac' ? -0.02 : 0.03; // CAC should decrease
    const trend = base * (1 + growthRate * index);

    // Add some realistic variance
    const variance = (Math.random() - 0.5) * 0.1 * base;

    const value = trend + variance;

    // Round appropriately
    if (base > 1000) return Math.round(value);
    if (base > 10) return Math.round(value * 10) / 10;
    return Math.round(value * 100) / 100;
  }

  /**
   * Generate appropriate chart title
   */
  generateChartTitle(category, metrics) {
    const categoryTitles = {
      revenue: 'Revenue Analysis',
      retention: 'User Retention Metrics',
      conversion: 'Conversion Performance',
      engagement: 'Engagement Trends',
      cac_ltv: 'CAC vs LTV Analysis',
      general: 'Analytics Overview',
    };

    return categoryTitles[category] || `${metrics[0]} Analysis`;
  }
}

export default AIChatService;