/**
 * Engagement Detector Service
 * Analyzes user behavior in real-time and uses Claude AI to make intelligent calling decisions
 */

import { IntelligentDecisionEngine } from './intelligentDecisionEngine.js';

class EngagementDetector {
  constructor() {
    this.intelligentEngine = new IntelligentDecisionEngine();
    this.userBehaviorHistory = new Map(); // userId -> behavior data
    this.cartTimestamps = new Map(); // Track when items were added to cart
    this.callHistory = new Map(); // Track call history per user
    this.cartRemovalCounts = new Map(); // Track number of times user removed items
    this.CART_ABANDON_THRESHOLD_MS = 300000; // 5 minutes before considering abandoned
    this.INACTIVE_THRESHOLD_MS = 86400000; // 24 hours inactivity
  }

  /**
   * Analyze user behavior and detect disengagement signals
   * LENIENT VERSION - Only trigger on these 3 specific scenarios
   */
  analyzeUserBehavior(currentMetric, previousMetric) {
    const userId = currentMetric.userId;
    const now = Date.now();

    const signals = {
      longTimeCartAbandonment: false,
      cartItemRemoved: false,
      longTimeInactive: false,
      engagementScore: 100,
      reasons: [],
    };

    // TRIGGER 1: Cart has items for LONG TIME (5+ minutes) without checkout
    if (currentMetric.cartItems > 0 && !currentMetric.checkoutStarted) {
      // Track when cart was first populated
      if (!this.cartTimestamps.has(userId)) {
        this.cartTimestamps.set(userId, now);
        console.log(`   ⏱️ Started tracking cart for ${userId}`);
      }

      const cartAge = now - this.cartTimestamps.get(userId);

      if (cartAge >= this.CART_ABANDON_THRESHOLD_MS) {
        signals.longTimeCartAbandonment = true;
        signals.engagementScore -= 60;
        const minutesInCart = Math.floor(cartAge / 60000);
        signals.reasons.push(`Cart has ${currentMetric.cartItems} items (worth $${currentMetric.cartValue?.toFixed(2) || '0'}) for ${minutesInCart} minutes without checkout`);
      }
    } else {
      // Cart is empty or checkout started - reset timer
      this.cartTimestamps.delete(userId);
    }

    // TRIGGER 2: User removed items from cart (previously had items, now has less)
    // ESCALATION POLICY: 1st removal = OK, 2nd = warning, 3rd = trigger call
    if (previousMetric && previousMetric.cartItems > 0) {
      const currentCartItems = currentMetric.cartItems || 0;

      if (currentCartItems < previousMetric.cartItems) {
        // Increment removal count
        const currentRemovalCount = (this.cartRemovalCounts.get(userId) || 0) + 1;
        this.cartRemovalCounts.set(userId, currentRemovalCount);

        signals.cartItemRemoved = true;
        signals.cartRemovalCount = currentRemovalCount;

        // Escalate based on removal count
        if (currentRemovalCount === 1) {
          signals.engagementScore -= 20; // First removal - minor concern
        } else if (currentRemovalCount === 2) {
          signals.engagementScore -= 40; // Second removal - warning
        } else {
          signals.engagementScore -= 70; // Third+ removal - critical
        }

        const removedCount = previousMetric.cartItems - currentCartItems;
        signals.reasons.push(`REMOVAL #${currentRemovalCount}: Removed ${removedCount} item(s) from cart (Previous: ${previousMetric.cartItems}, Now: ${currentCartItems})`);
      }
    } else {
      // Initialize removal count for new users
      if (!this.cartRemovalCounts.has(userId)) {
        this.cartRemovalCounts.set(userId, 0);
      }
    }

    // TRIGGER 3: User hasn't visited in a LONG TIME (24+ hours)
    if (previousMetric) {
      const lastVisit = new Date(previousMetric.timestamp).getTime();
      const timeSinceLastVisit = now - lastVisit;

      if (timeSinceLastVisit >= this.INACTIVE_THRESHOLD_MS) {
        signals.longTimeInactive = true;
        signals.engagementScore -= 50;
        const hoursSinceVisit = Math.floor(timeSinceLastVisit / 3600000);
        signals.reasons.push(`User hasn't visited in ${hoursSinceVisit} hours - re-engagement needed!`);
      }
    }

    // Calculate final risk level
    signals.riskLevel = this.calculateRiskLevel(signals.engagementScore);

    return signals;
  }

  /**
   * Calculate risk level based on engagement score
   */
  calculateRiskLevel(score) {
    if (score >= 70) return 'low';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'high';
    return 'critical';
  }

  /**
   * Determine if we should analyze with Claude AI
   * Only analyze if there are engagement signals detected
   */
  shouldAnalyzeWithClaude(signals) {
    // Analyze with Claude if any engagement signals are detected
    const hasSignals =
      signals.longTimeCartAbandonment ||
      signals.cartItemRemoved ||
      signals.longTimeInactive;

    return hasSignals;
  }

  /**
   * Process user metric and trigger call if needed
   */
  async processUserMetric(metric) {
    const userId = metric.userId;
    const previous = this.userBehaviorHistory.get(userId);

    console.log(`\n📊 Processing metric for user: ${metric.userName}`);
    console.log(`   Cart Items: ${metric.cartItems || 0}`);
    console.log(`   Cart Value: $${metric.cartValue?.toFixed(2) || '0'}`);
    console.log(`   Checkout Started: ${metric.checkoutStarted || false}`);
    console.log(`   Order Completed: ${metric.orderCompleted || false}`);

    // Analyze behavior
    const signals = this.analyzeUserBehavior(metric, previous);

    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ENGAGEMENT ANALYSIS (LENIENT MODE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User: ${metric.userName} (${userId})
Engagement Score: ${signals.engagementScore}/100
Risk Level: ${signals.riskLevel.toUpperCase()}
Already Called: ${this.callHistory.has(userId) ? 'YES - NEVER CALLING AGAIN' : 'NO'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Trigger Signals (Need 1 to call):
${signals.longTimeCartAbandonment ? '🔴' : '🟢'} Long-Time Cart Abandonment (5+ min)
${signals.cartItemRemoved ? '🔴' : '🟢'} Cart Item Removed (disinterest)
${signals.longTimeInactive ? '🔴' : '🟢'} Long-Time Inactive (24+ hours)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${signals.reasons.length > 0 ? 'Reasons:\n' + signals.reasons.map(r => `  • ${r}`).join('\n') : 'No triggers detected yet'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);

    // Check if we should analyze with Claude AI
    let intelligentDecision = null;
    if (this.shouldAnalyzeWithClaude(signals)) {
      console.log(`🤖 Analyzing with Claude AI for ${metric.userName}...`);
      try {
        intelligentDecision = await this.intelligentEngine.analyzeAndDecide(metric, signals);
      } catch (error) {
        console.error('❌ Error in intelligent decision engine:', error);
        intelligentDecision = {
          decision: 'error',
          reason: 'Intelligent engine error: ' + error.message,
          shouldCall: false,
          claudeAnalysis: null,
          callInitiated: false
        };
      }
      
      if (intelligentDecision.callInitiated) {
        console.log(`📞 Claude AI initiated call for ${metric.userName}!`);
      } else {
        console.log(`✅ Claude AI decided not to call ${metric.userName}`);
        console.log(`   Reason: ${intelligentDecision.reason}`);
        if (intelligentDecision.alternativeAction) {
          console.log(`   Alternative: ${intelligentDecision.alternativeAction}`);
        }
      }
    } else {
      console.log(`✅ User ${metric.userName} is OK - no signals detected, no analysis needed`);
    }

    // Store current behavior for next comparison
    this.userBehaviorHistory.set(userId, metric);

    return {
      userId,
      signals,
      intelligentDecision,
      callTriggered: intelligentDecision?.callInitiated || false,
      claudeAnalysis: intelligentDecision?.claudeAnalysis || null
    };
  }

  /**
   * Legacy method - now handled by IntelligentDecisionEngine
   * Kept for backward compatibility but delegates to intelligent engine
   */
  async triggerRevenueRecoveryCall(metric, signals) {
    console.log('⚠️ Using legacy triggerRevenueRecoveryCall - delegating to IntelligentDecisionEngine');
    const decision = await this.intelligentEngine.analyzeAndDecide(metric, signals);
    return {
      success: decision.callInitiated,
      callId: decision.callId,
      phoneNumber: process.env.DEFAULT_CALL_NUMBER || '+14155797753',
      intelligentDecision: decision
    };
  }

  /**
   * Get engagement statistics including Claude AI analytics
   */
  getStats() {
    const intelligentStats = this.intelligentEngine.getDecisionAnalytics();
    const callStats = this.intelligentEngine.getCallStats();
    
    return {
      totalUsersAnalyzed: this.userBehaviorHistory.size,
      totalCallsTriggered: callStats.totalCalls,
      intelligentCalls: callStats.intelligentCalls,
      claudeDecisions: intelligentStats.totalDecisions,
      callRecommendationRate: intelligentStats.callRecommendationRate,
      confidenceDistribution: intelligentStats.confidenceDistribution,
      urgencyDistribution: intelligentStats.urgencyDistribution,
      recentCalls: callStats.recentCalls,
      recentDecisions: intelligentStats.recentDecisions
    };
  }

  /**
   * Clear call history for a user (for testing)
   */
  clearCallHistory(userId) {
    this.intelligentEngine.clearUserCallHistory(userId);
    console.log(`[EngagementDetector] Cleared call history for ${userId}`);
  }

  /**
   * Get Claude AI health status
   */
  async getHealthStatus() {
    return await this.intelligentEngine.healthCheck();
  }
}

export { EngagementDetector };
