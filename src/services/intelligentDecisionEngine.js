/**
 * Intelligent Decision Engine
 * Uses Claude AI to make intelligent decisions about when to call users
 * based on their engagement metrics and behavior patterns
 */

import { ClaudeService } from './claudeService.js';
import { VapiService } from './vapiService.js';

export class IntelligentDecisionEngine {
  constructor() {
    this.claudeService = new ClaudeService();
    this.vapiService = new VapiService();
    this.callHistory = new Map(); // Track who we've called (ONE TIME ONLY)
    this.decisionHistory = new Map(); // Track Claude's decisions for analytics
    this.userBehaviorHistory = new Map(); // Store user behavior for comparison
  }

  /**
   * Main method: Analyze user metrics and decide if a call should be made
   * This replaces the direct call logic with Claude AI decision-making
   */
  async analyzeAndDecide(currentMetric, behaviorSignals) {
    const userId = currentMetric.userId;
    const userName = currentMetric.userName || 'Unknown User';

    console.log(`\n🤖 Claude AI analyzing user: ${userName} (${userId})`);

    try {
      // Check if we've already called this user (ONE TIME ONLY rule)
      if (this.callHistory.has(userId)) {
        console.log(`   ⛔ User ${userId} was already called once - NEVER calling again`);
        return {
          decision: 'no_call',
          reason: 'already_called_once',
          shouldCall: false,
          claudeAnalysis: null,
          callInitiated: false
        };
      }

      // 🚨 FORCE CALL ON 3RD CART REMOVAL - OVERRIDE CLAUDE
      if (behaviorSignals.cartRemovalCount >= 3) {
        console.log(`\n🚨🚨🚨 THIRD CART REMOVAL DETECTED - FORCING CALL (OVERRIDING CLAUDE) 🚨🚨🚨`);

        const forcedAnalysis = {
          shouldCall: true,
          confidence: 100,
          reasoning: `FORCED CALL: User has removed items from cart ${behaviorSignals.cartRemovalCount} times - this is a critical intervention point. Cart value: $${currentMetric.cartValue || 0}. User is about to abandon purchase.`,
          alternativeAction: 'None - calling is mandatory at this stage',
          urgency: 'high',
          expectedOutcome: 'Prevent cart abandonment through immediate intervention',
          callScript: `This is a critical cart abandonment intervention. User has removed items ${behaviorSignals.cartRemovalCount} times, showing strong purchase hesitation.`
        };

        console.log(`   💪 OVERRIDE ACTIVE: Forcing call regardless of Claude's recommendation`);
        console.log(`   📞 Initiating MANDATORY call...`);

        const callResult = await this.initiateIntelligentCall(currentMetric, forcedAnalysis);

        this.userBehaviorHistory.set(userId, currentMetric);

        return {
          decision: 'forced_call_third_removal',
          reason: forcedAnalysis.reasoning,
          shouldCall: true,
          claudeAnalysis: forcedAnalysis,
          callInitiated: callResult?.success || false,
          callId: callResult?.callId || null,
          alternativeAction: null,
          overridden: true
        };
      }

      // Get previous metrics for comparison
      const previousMetric = this.userBehaviorHistory.get(userId);

      // Use Claude AI to analyze and make decision
      const claudeAnalysis = await this.claudeService.analyzeCallDecision(
        currentMetric,
        previousMetric,
        behaviorSignals
      );

      // Store the decision for analytics
      this.decisionHistory.set(userId, {
        timestamp: Date.now(),
        analysis: claudeAnalysis,
        userMetrics: currentMetric,
        behaviorSignals
      });

      console.log(`\n🎯 Claude Decision Summary:`);
      console.log(`   User: ${userName}`);
      console.log(`   Should Call: ${claudeAnalysis.shouldCall ? '✅ YES' : '❌ NO'}`);
      console.log(`   Confidence: ${claudeAnalysis.confidence}%`);
      console.log(`   Urgency: ${claudeAnalysis.urgency.toUpperCase()}`);
      console.log(`   Reasoning: ${claudeAnalysis.reasoning}`);
      
      if (!claudeAnalysis.shouldCall) {
        console.log(`   Alternative Action: ${claudeAnalysis.alternativeAction}`);
      }

      // If Claude recommends calling, initiate the call
      let callResult = null;
      if (claudeAnalysis.shouldCall) {
        console.log(`\n📞 Claude recommends calling - initiating call...`);
        callResult = await this.initiateIntelligentCall(currentMetric, claudeAnalysis);
      }

      // Store current behavior for next comparison
      this.userBehaviorHistory.set(userId, currentMetric);

      return {
        decision: claudeAnalysis.shouldCall ? 'call_recommended' : 'no_call_recommended',
        reason: claudeAnalysis.reasoning,
        shouldCall: claudeAnalysis.shouldCall,
        claudeAnalysis,
        callInitiated: callResult?.success || false,
        callId: callResult?.callId || null,
        alternativeAction: claudeAnalysis.alternativeAction
      };

    } catch (error) {
      console.error('❌ Error in intelligent decision engine:', error);
      
      // Fallback to simple rule-based decision if Claude fails
      return this.fallbackDecision(currentMetric, behaviorSignals);
    }
  }

  /**
   * Initiate a call based on Claude's intelligent analysis
   */
  async initiateIntelligentCall(userMetrics, claudeAnalysis) {
    try {
      const userId = userMetrics.userId;
      const userName = userMetrics.userName || 'Valued Customer';

      // Generate personalized script using Claude's analysis
      const personalizedScript = this.claudeService.generatePersonalizedScript(
        userMetrics, 
        claudeAnalysis
      );

      // Make the call via Vapi
      const phoneNumber = process.env.DEFAULT_CALL_NUMBER || '+14155797753';

      const callResult = await this.vapiService.makeCall({
        phoneNumber,
        script: personalizedScript,
        metadata: {
          userId: userMetrics.userId,
          userName: userMetrics.userName,
          email: userMetrics.email,
          claudeDecision: claudeAnalysis,
          cartValue: userMetrics.cartValue,
          cartItems: userMetrics.cartItems,
          urgency: claudeAnalysis.urgency,
          expectedOutcome: claudeAnalysis.expectedOutcome,
          intelligentCall: true // Flag to identify Claude-driven calls
        },
      });

      // Record call in history - ONE TIME ONLY, NEVER call again
      this.callHistory.set(userId, {
        timestamp: Date.now(),
        callId: callResult.callId,
        claudeAnalysis,
        phoneNumber,
        neverCallAgain: true,
        intelligentCall: true
      });

      console.log(`✅ Intelligent call initiated successfully!`);
      console.log(`   Call ID: ${callResult.callId}`);
      console.log(`   Phone: ${phoneNumber}`);
      console.log(`   Expected Outcome: ${claudeAnalysis.expectedOutcome}`);
      console.log(`🔒 User ${userId} marked as called - WILL NEVER BE CALLED AGAIN`);

      return {
        success: true,
        callId: callResult.callId,
        phoneNumber,
        script: personalizedScript,
        claudeAnalysis
      };

    } catch (error) {
      console.error('❌ Failed to initiate intelligent call:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Fallback decision logic if Claude API fails
   */
  fallbackDecision(userMetrics, behaviorSignals) {
    console.log('🔄 Using fallback decision logic (Claude AI unavailable)');
    
    const userId = userMetrics.userId;

    // Check if already called
    if (this.callHistory.has(userId)) {
      return {
        decision: 'no_call',
        reason: 'already_called_once',
        shouldCall: false,
        claudeAnalysis: null,
        callInitiated: false
      };
    }

    // Simple rule-based fallback - only call on high-value scenarios
    const shouldCall = (
      (behaviorSignals.longTimeCartAbandonment && userMetrics.cartValue > 50) ||
      (behaviorSignals.cartItemRemoved && userMetrics.cartValue > 30) ||
      (behaviorSignals.longTimeInactive && behaviorSignals.riskLevel === 'critical')
    );

    return {
      decision: shouldCall ? 'fallback_call' : 'fallback_no_call',
      reason: 'Fallback logic: Based on cart value and risk level',
      shouldCall,
      claudeAnalysis: {
        shouldCall,
        confidence: 60,
        reasoning: 'Fallback decision due to Claude API unavailability',
        alternativeAction: shouldCall ? 'Make call using fallback logic' : 'Send follow-up email',
        urgency: behaviorSignals.riskLevel === 'critical' ? 'high' : 'medium',
        expectedOutcome: 'Standard recovery attempt',
        callScript: 'Use standard engagement recovery script'
      },
      callInitiated: false
    };
  }

  /**
   * Get analytics and statistics about Claude's decisions
   */
  getDecisionAnalytics() {
    const decisions = Array.from(this.decisionHistory.values());
    const calls = Array.from(this.callHistory.values());

    const totalDecisions = decisions.length;
    const callRecommendations = decisions.filter(d => d.analysis.shouldCall).length;
    const actualCalls = calls.length;

    // Calculate confidence distribution
    const confidenceDistribution = {
      high: decisions.filter(d => d.analysis.confidence >= 80).length,
      medium: decisions.filter(d => d.analysis.confidence >= 60 && d.analysis.confidence < 80).length,
      low: decisions.filter(d => d.analysis.confidence < 60).length
    };

    // Calculate urgency distribution
    const urgencyDistribution = {
      high: decisions.filter(d => d.analysis.urgency === 'high').length,
      medium: decisions.filter(d => d.analysis.urgency === 'medium').length,
      low: decisions.filter(d => d.analysis.urgency === 'low').length
    };

    return {
      totalDecisions,
      callRecommendations,
      actualCalls,
      callRecommendationRate: totalDecisions > 0 ? (callRecommendations / totalDecisions * 100).toFixed(1) : 0,
      confidenceDistribution,
      urgencyDistribution,
      recentDecisions: decisions.slice(-10).map(d => ({
        timestamp: new Date(d.timestamp).toISOString(),
        shouldCall: d.analysis.shouldCall,
        confidence: d.analysis.confidence,
        urgency: d.analysis.urgency,
        reasoning: d.analysis.reasoning.substring(0, 100) + '...'
      }))
    };
  }

  /**
   * Get call history and statistics
   */
  getCallStats() {
    const calls = Array.from(this.callHistory.entries()).map(([userId, callData]) => ({
      userId,
      timestamp: new Date(callData.timestamp).toISOString(),
      callId: callData.callId,
      phoneNumber: callData.phoneNumber,
      urgency: callData.claudeAnalysis?.urgency || 'unknown',
      expectedOutcome: callData.claudeAnalysis?.expectedOutcome || 'unknown',
      intelligentCall: callData.intelligentCall || false
    }));

    return {
      totalCalls: calls.length,
      intelligentCalls: calls.filter(c => c.intelligentCall).length,
      recentCalls: calls.slice(-10),
      callsByUrgency: {
        high: calls.filter(c => c.urgency === 'high').length,
        medium: calls.filter(c => c.urgency === 'medium').length,
        low: calls.filter(c => c.urgency === 'low').length
      }
    };
  }

  /**
   * Health check for the intelligent decision engine
   */
  async healthCheck() {
    try {
      // Check Claude API health
      const claudeHealth = await this.claudeService.healthCheck();
      
      return {
        status: 'healthy',
        claudeApi: claudeHealth.status,
        totalDecisions: this.decisionHistory.size,
        totalCalls: this.callHistory.size,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Clear call history for a user (for testing)
   */
  clearUserCallHistory(userId) {
    this.callHistory.delete(userId);
    this.decisionHistory.delete(userId);
    this.userBehaviorHistory.delete(userId);
    console.log(`[IntelligentDecisionEngine] Cleared history for user ${userId}`);
  }

  /**
   * Clear all history (for testing)
   */
  clearAllHistory() {
    this.callHistory.clear();
    this.decisionHistory.clear();
    this.userBehaviorHistory.clear();
    console.log(`[IntelligentDecisionEngine] Cleared all history`);
  }
}