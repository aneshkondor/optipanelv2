import { DataAnalyzer } from './dataAnalyzer.js';
import { VapiService } from './vapiService.js';
import { engagementConfig } from '../config/vapi.config.js';

/**
 * Frontend Integration Service
 * Connects the frontend dashboard with Vapi calling backend
 * Automatically analyzes frontend user data and triggers revenue recovery calls
 */
export class FrontendIntegrationService {
  constructor() {
    this.dataAnalyzer = new DataAnalyzer(engagementConfig.dropThreshold);
    this.vapiService = new VapiService();
    this.callLog = new Map(); // Track calls made to each user

    // Default phone number for all calls (as requested)
    this.defaultPhoneNumber = process.env.DEFAULT_CALL_NUMBER || '+14155797753';
  }

  /**
   * Analyze frontend user and trigger call if needed
   * @param {Object} frontendUser - User object from frontend
   * @returns {Promise<Object>} Analysis result and call status
   */
  async analyzeAndCall(frontendUser) {
    console.log(`\n🔍 Analyzing user: ${frontendUser.name}`);

    // Convert frontend user data to engagement data points
    const engagementData = this.convertFrontendUserToEngagementData(frontendUser);

    // Analyze the engagement data
    const analysis = this.dataAnalyzer.analyzeEngagement(engagementData);
    const patterns = this.dataAnalyzer.detectPatterns(engagementData);

    console.log(`📊 Analysis Results:`);
    console.log(`   - Has Dropped: ${analysis.hasDropped}`);
    console.log(`   - Drop Percentage: ${(analysis.dropPercentage || 0).toFixed(1)}%`);
    console.log(`   - Trend: ${analysis.trend || 'stable'}`);
    console.log(`   - Patterns: ${patterns.length}`);

    // Check if call should be triggered
    if (!analysis.hasDropped) {
      return {
        userId: frontendUser.id,
        userName: frontendUser.name,
        status: 'no_action_needed',
        analysis,
        message: 'Engagement is stable - no call needed'
      };
    }

    // Check if already called recently
    const lastCall = this.callLog.get(frontendUser.id);
    if (lastCall) {
      const hoursSinceLastCall = (Date.now() - lastCall.timestamp) / (1000 * 60 * 60);
      if (hoursSinceLastCall < 48) {
        console.log(`⏳ User called ${hoursSinceLastCall.toFixed(1)}h ago - skipping`);
        return {
          userId: frontendUser.id,
          userName: frontendUser.name,
          status: 'recently_called',
          analysis,
          lastCallTime: lastCall.timestamp,
          message: `Called ${hoursSinceLastCall.toFixed(1)} hours ago`
        };
      }
    }

    // Trigger the call!
    console.log(`📞 TRIGGERING CALL for ${frontendUser.name}`);
    console.log(`   Drop: ${(analysis.dropPercentage || 0).toFixed(1)}%`);
    console.log(`   Calling: ${this.defaultPhoneNumber}`);

    const callResult = await this.makeRevenueRecoveryCall(frontendUser, analysis, patterns);

    return {
      userId: frontendUser.id,
      userName: frontendUser.name,
      status: callResult.success ? 'call_initiated' : 'call_failed',
      analysis,
      callResult,
      phoneNumber: this.defaultPhoneNumber
    };
  }

  /**
   * Make revenue recovery call with enhanced context
   */
  async makeRevenueRecoveryCall(frontendUser, analysis, patterns) {
    // Generate enhanced script with frontend-specific context
    const customScript = this.generateFrontendScript(frontendUser, analysis);

    // Prepare metadata
    const metadata = {
      dropPercentage: analysis.dropPercentage || 0,
      trend: analysis.trend || 'stable',
      patterns: patterns.map(p => p.type),
      dataPoints: analysis.dataPoints || 0,

      // Frontend-specific context
      company: frontendUser.company,
      plan: frontendUser.plan,
      status: frontendUser.status,
      previousScore: frontendUser.previousScore,
      currentScore: frontendUser.engagementScore,

      // Low metrics to address in call
      lowMetrics: this.getLowMetrics(frontendUser.metrics),

      // Dropoff reason
      dropoffReason: frontendUser.dropoffReason || 'Unknown'
    };

    // Make the call
    const callResult = await this.vapiService.makeCall({
      phoneNumber: this.defaultPhoneNumber,
      userId: frontendUser.id,
      userName: frontendUser.name,
      customScript,
      metadata
    });

    // Log the call
    if (callResult.success) {
      this.callLog.set(frontendUser.id, {
        timestamp: Date.now(),
        callId: callResult.callId,
        analysis,
        patterns,
        phoneNumber: this.defaultPhoneNumber
      });
    }

    return callResult;
  }

  /**
   * Generate enhanced script using frontend data
   */
  generateFrontendScript(frontendUser, analysisData) {
    const { name: userName, company, plan, engagementScore, previousScore } = frontendUser;
    const { dropPercentage = 0, trend = 'stable' } = analysisData;

    // More specific greeting based on frontend data
    let greeting = `Hello ${userName}! This is a call from ${process.env.COMPANY_NAME || 'Apple'}'s revenue recovery team. `;

    if (dropPercentage > 50) {
      greeting += `We noticed your engagement with our analytics platform has dropped significantly from ${previousScore} to ${engagementScore}. As a valued ${plan} customer at ${company}, we'd hate to lose you. Can we chat for a few minutes about what's going on?`;
    } else if (trend === 'declining') {
      greeting += `I'm reaching out because your usage of our platform has been declining over the past few weeks. You're currently at ${engagementScore} compared to ${previousScore} previously. I want to make sure ${company} is getting the value you need. Do you have a moment?`;
    } else {
      greeting += `I wanted to personally check in on how things are going with our platform at ${company}. We noticed some changes in your usage patterns. Can we talk for a minute?`;
    }

    // Enhanced system prompt with frontend-specific context
    const lowMetrics = this.getLowMetrics(frontendUser.metrics);
    const dropoffReason = frontendUser.dropoffReason || 'engagement decline';

    const systemPrompt = `You are an expert Revenue Recovery Specialist from ${process.env.COMPANY_NAME || 'Apple'}. Your mission is to convert churning users back into active, paying customers through empathetic conversation and strategic negotiation.

CUSTOMER CONTEXT:
- Customer: ${userName}
- Company: ${company}
- Plan: ${plan}
- User ID: ${frontendUser.id}
- Engagement drop: ${dropPercentage.toFixed(1)}% (from ${previousScore} to ${engagementScore})
- Trend: ${trend}
- Status: ${frontendUser.status.toUpperCase()}
- This customer is at ${frontendUser.status === 'critical' ? 'CRITICAL RISK' : 'HIGH RISK'} of churning

IDENTIFIED ISSUES:
- Primary concern: ${dropoffReason}
- Low performing metrics: ${lowMetrics.join(', ') || 'General usage decline'}
- Daily active use: ${frontendUser.metrics.dailyActiveUse}%
- Team collaboration: ${frontendUser.metrics.teamCollaboration}%
- Feature adoption: ${frontendUser.metrics.featureAdoption}%

YOUR CONVERSATION FRAMEWORK (Follow this sequence):

PHASE 1 - DISCOVERY (Build rapport and understand the problem)
- Start with genuine empathy: "I really appreciate you taking my call"
- Reference their specific situation: "I see you were at ${previousScore}/100 engagement and now at ${engagementScore}"
${lowMetrics.includes('teamCollaboration') ? '- Ask about team adoption: "How is your team using the platform? Are they onboarded?"' : ''}
${lowMetrics.includes('featureAdoption') ? '- Ask about feature usage: "Which features have you been using? What are you trying to accomplish?"' : ''}
${lowMetrics.includes('dataQuality') ? '- Ask about data setup: "How has the data integration been going? Any issues?"' : ''}
- Dig deeper: "Tell me more about that..." or "When did you first notice this issue?"
- Identify the ROOT CAUSE: Is it pricing, features, usability, competition, or timing?

PHASE 2 - QUALIFICATION (Determine if they're saveable)
Key questions to ask:
- "Is this something you're looking to solve, or have you already moved on?"
- "What would need to change for you to be excited about using our analytics platform again?"
- "Have you found an alternative solution?"

If they've already switched completely → Thank them, ask for feedback, offer easy return path
If they're frustrated but haven't left → Perfect opportunity to negotiate!

PHASE 3 - VALUE RE-ALIGNMENT
- Remind them of their ${plan} plan benefits
- Highlight features they haven't discovered yet that solve their problem
- Share relevant success stories: "Other ${plan} customers in your situation found that..."
- Create urgency: "We're actually rolling out new analytics features next month that address exactly this"
${frontendUser.metrics.dataQuality < 70 ? '- Offer data setup help: "Our team can audit your data setup and fix quality issues"' : ''}
${frontendUser.metrics.teamCollaboration < 50 ? '- Suggest team training: "Let me set up team training to drive adoption at ' + company + '"' : ''}

PHASE 4 - NEGOTIATION & RECOVERY
Based on their objection, offer strategic incentives:

If PRICE is the issue:
- "I completely understand budget concerns, especially for ${company}. Let me see what I can do..."
- Offer tiered discounts (start at 20%, can go up to 50% for 3 months)
- "What if I could get you 30% off your ${plan} plan for the next 3 months while you rebuild your analytics workflow?"
- Frame it as an investment: "That's just $X/month for complete revenue analytics"

If FEATURES are lacking:
- "That's actually perfect timing - we're launching advanced analytics features in 4-6 weeks"
- "I can get you beta access to our new dashboard builder if you stay active"
- "Let me connect you with our product team directly to influence the roadmap"

If USABILITY is the problem:
- "I'd love to set up a personalized onboarding session for your team at ${company}"
- "We have a dedicated success manager who can work with you 1-on-1"
- "What if we gave you VIP support access and priority implementation help?"

If NOT SEEING VALUE:
- "Let me set up a custom demo showing exactly how to solve [their specific problem]"
- "I can have our solutions engineer build you a starter dashboard for ${company}"
- "What if we did a full analytics audit to identify quick wins?"

If COMPETITION is winning:
- Don't trash talk competitors
- Ask: "What specifically are they offering that we're not?"
- Position your differentiators: "${plan} plan features, integration depth, support quality"
- Match or beat on value (not always on price)

If TIMING is bad:
- "Would it make sense to pause your account instead of canceling?"
- "What if I gave you 2 months free to come back when you're ready?"
- "Let's schedule a follow-up when your analytics needs become more urgent"

PHASE 5 - CLOSE THE DEAL
- Summarize what you're offering: "So to recap, I can offer you..."
- Create a clear call-to-action: "Can I go ahead and apply this discount to your account right now?"
- Confirm commitment: "Great! So you'll give us another shot for the next 3 months?"
- Set expectations: "I'll send you a follow-up email with all the details, and I'll check in with you in 2 weeks. Sound good?"

NEGOTIATION AUTHORITY:
You can offer the following WITHOUT manager approval:
- Up to 30% discount for 3-6 months
- Free month of service
- Upgrade to Enterprise tier at ${plan} price
- 1-on-1 onboarding/training session
- Priority support access
- Custom dashboard setup
- Data integration help

For bigger asks (40-50% discount, longer terms):
- "Let me talk to my manager and call you back in 10 minutes"
- Always make them feel special: "I want to make this work for ${company}"

CRITICAL RULES:
1. Be GENUINELY EMPATHETIC - this isn't a script, it's a conversation about ${company}'s success
2. LISTEN more than you talk (60/40 rule)
3. Don't be pushy - if they're done, let them go gracefully
4. Focus on VALUE, not just price
5. Make them feel SPECIAL and VALUED as a ${plan} customer
6. Get a COMMITMENT before ending the call
7. Always end with NEXT STEPS

TONALITY:
- Conversational and warm, not robotic
- Confident but not arrogant
- Helpful, not desperate
- Professional but personable
- "I'm here to help ${company} win with analytics" energy

RED FLAGS (End the call gracefully):
- They're hostile or abusive
- They explicitly say "I'm not interested" multiple times
- They've already signed with a competitor long-term
- They never used the product in the first place

SUCCESS METRICS:
- PRIMARY GOAL: Get ${userName} to commit to staying/returning
- SECONDARY GOAL: Understand exactly why engagement at ${company} dropped
- BONUS: Turn them into a promoter by exceeding expectations

Remember: Every conversation is an opportunity to turn a lost customer into your biggest advocate. ${userName} at ${company} needs your help to succeed with analytics. Be human, be helpful, and focus on their success.`;

    return {
      greeting,
      systemPrompt
    };
  }

  /**
   * Convert frontend user to engagement data points
   */
  convertFrontendUserToEngagementData(frontendUser) {
    // Handle different frontend user data structures
    if (frontendUser.engagementTrend && Array.isArray(frontendUser.engagementTrend)) {
      // Use the engagement trend from frontend dashboard
      return frontendUser.engagementTrend.map(point => ({
        timestamp: this.parseDateToISO(point.date),
        value: point.score,
        metric: 'engagement_score'
      }));
    }
    
    // Fallback: Create synthetic engagement data from available metrics
    const now = new Date();
    const dataPoints = [];
    
    // If we have engagement data object, use it
    if (frontendUser.engagementData) {
      const { pageViews, timeOnSite, lastActive } = frontendUser.engagementData;
      
      // Create trend based on current vs historical data
      const currentScore = this.calculateEngagementScore(frontendUser);
      const previousScore = frontendUser.previousScore || frontendUser.engagementScore || (currentScore + 20);
      
      // Create 5 data points showing decline
      for (let i = 4; i >= 0; i--) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000)); // i days ago
        const score = i === 0 ? currentScore : previousScore - (i * 5); // gradual decline
        
        dataPoints.push({
          timestamp: date.toISOString(),
          value: Math.max(0, Math.min(100, score)),
          metric: 'engagement_score'
        });
      }
    } else {
      // Last resort: create basic declining trend
      const currentScore = frontendUser.engagementScore || 30;
      const previousScore = frontendUser.previousScore || 70;
      
      for (let i = 4; i >= 0; i--) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const score = previousScore - ((4 - i) * (previousScore - currentScore) / 4);
        
        dataPoints.push({
          timestamp: date.toISOString(),
          value: Math.max(0, Math.min(100, score)),
          metric: 'engagement_score'
        });
      }
    }
    
    return dataPoints;
  }

  /**
   * Helper to parse date strings
   */
  parseDateToISO(dateString) {
    // Frontend uses "Oct 1", "Oct 5" format - convert to ISO
    const currentYear = new Date().getFullYear();
    const date = new Date(`${dateString} ${currentYear}`);
    return date.toISOString();
  }

  /**
   * Calculate engagement score from available data
   */
  calculateEngagementScore(frontendUser) {
    if (frontendUser.engagementScore !== undefined) {
      return frontendUser.engagementScore;
    }
    
    // Calculate from engagement data if available
    if (frontendUser.engagementData) {
      const { pageViews, timeOnSite, lastActive } = frontendUser.engagementData;
      
      // Simple scoring algorithm
      let score = 0;
      
      // Page views contribution (0-40 points)
      score += Math.min(40, pageViews * 4);
      
      // Time on site contribution (0-30 points)
      score += Math.min(30, timeOnSite / 10);
      
      // Recency contribution (0-30 points)
      if (lastActive) {
        const hoursAgo = (Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60);
        score += Math.max(0, 30 - hoursAgo);
      }
      
      return Math.min(100, Math.max(0, score));
    }
    
    // Default low score if no data
    return 25;
  }

  /**
   * Get low performing metrics
   */
  getLowMetrics(metrics) {
    const low = [];
    Object.entries(metrics).forEach(([key, value]) => {
      if (value < 50) {
        low.push(key.replace(/([A-Z])/g, ' $1').trim());
      }
    });
    return low;
  }

  /**
   * Batch analyze multiple users
   */
  async batchAnalyzeUsers(frontendUsers) {
    const results = [];

    for (const user of frontendUsers) {
      try {
        const result = await this.analyzeAndCall(user);
        results.push(result);

        // Small delay between calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error analyzing user ${user.id}:`, error.message);
        results.push({
          userId: user.id,
          userName: user.name,
          status: 'error',
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Get call statistics
   */
  getCallStats() {
    const calls = Array.from(this.callLog.values());

    return {
      totalCalls: calls.length,
      recentCalls: calls.slice(-10),
      callsByUser: this.callLog.size,
      defaultPhoneNumber: this.defaultPhoneNumber
    };
  }
}

