/**
 * AI Data Formatter
 * Converts user engagement data into AI-readable formats for analysis and outreach
 */

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  signupDate: string;
  lastActive: string;
  engagementScore: number;
  previousScore: number;
  status: 'critical' | 'warning' | 'stable' | 'healthy';
  metrics: {
    dailyActiveUse: number;
    weeklyActiveUse: number;
    monthlyActiveUse: number;
    featureAdoption: number;
    dataQuality: number;
    teamCollaboration: number;
  };
  recentActivity: {
    date: string;
    action: string;
    duration: number;
  }[];
  engagementTrend: {
    date: string;
    score: number;
  }[];
  dropoffReason?: string;
}

/**
 * Formats user engagement data into a structured format optimized for AI analysis
 */
export function formatEngagementDataForAI(user: User): string {
  const daysSinceSignup = Math.floor(
    (new Date().getTime() - new Date(user.signupDate).getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysSinceLastActive = Math.floor(
    (new Date().getTime() - new Date(user.lastActive).getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalRecentActivity = user.recentActivity.reduce((sum, act) => sum + act.duration, 0);
  const avgSessionDuration = totalRecentActivity / user.recentActivity.length || 0;

  const engagementDrop = user.previousScore - user.engagementScore;
  const engagementDropPercentage = ((engagementDrop / user.previousScore) * 100).toFixed(1);

  // Calculate trend direction
  const trendScores = user.engagementTrend.map((t) => t.score);
  const isDecreasing = trendScores[trendScores.length - 1] < trendScores[0];
  const trendSlope =
    (trendScores[trendScores.length - 1] - trendScores[0]) / trendScores.length;

  return `
USER PROFILE:
=============
Name: ${user.name}
Company: ${user.company}
Email: ${user.email}
Account Plan: ${user.plan}
User ID: ${user.id}

TEMPORAL CONTEXT:
=================
Signup Date: ${user.signupDate}
Days Since Signup: ${daysSinceSignup} days
Last Active: ${user.lastActive}
Days Since Last Activity: ${daysSinceLastActive} days
Status: ${user.status.toUpperCase()}

ENGAGEMENT METRICS:
===================
Current Engagement Score: ${user.engagementScore}/100
Previous Engagement Score: ${user.previousScore}/100
Score Drop: -${engagementDrop} points (${engagementDropPercentage}% decrease)
Trend Direction: ${isDecreasing ? 'DECLINING' : 'STABLE/IMPROVING'}
Trend Velocity: ${trendSlope.toFixed(2)} points/period

DETAILED METRICS BREAKDOWN:
============================
Daily Active Use: ${user.metrics.dailyActiveUse}%
Weekly Active Use: ${user.metrics.weeklyActiveUse}%
Monthly Active Use: ${user.metrics.monthlyActiveUse}%
Feature Adoption Rate: ${user.metrics.featureAdoption}%
Data Quality Score: ${user.metrics.dataQuality}%
Team Collaboration: ${user.metrics.teamCollaboration}%

RECENT ACTIVITY PATTERN:
========================
Total Sessions (Last 7 days): ${user.recentActivity.length}
Average Session Duration: ${avgSessionDuration.toFixed(1)} minutes
Recent Actions:
${user.recentActivity
  .map(
    (act, i) =>
      `  ${i + 1}. ${act.date}: ${act.action} (${act.duration} min)`
  )
  .join('\n')}

ENGAGEMENT TREND (Last 6 periods):
===================================
${user.engagementTrend
  .map((trend) => `${trend.date}: ${trend.score}/100`)
  .join('\n')}

IDENTIFIED ISSUES:
==================
Primary Concern: ${user.dropoffReason || 'General engagement decline'}

KEY INSIGHTS FOR AI ANALYSIS:
==============================
1. Engagement has dropped ${engagementDropPercentage}% from ${user.previousScore} to ${user.engagementScore}
2. User hasn't logged in for ${daysSinceLastActive} days
3. Low metrics: ${getLowMetrics(user.metrics).join(', ')}
4. Average session duration is only ${avgSessionDuration.toFixed(1)} minutes
5. Team collaboration at ${user.metrics.teamCollaboration}% indicates ${user.metrics.teamCollaboration < 50 ? 'limited team adoption' : 'moderate team usage'}

RECOMMENDED OUTREACH PRIORITY: ${
    user.status === 'critical' ? 'IMMEDIATE/HIGH' : user.status === 'warning' ? 'MEDIUM' : 'LOW'
  }
`.trim();
}

/**
 * Generates an AI call prompt with specific instructions for the conversation
 */
export function generateAICallPrompt(user: User): string {
  const daysSinceLastActive = Math.floor(
    (new Date().getTime() - new Date(user.lastActive).getTime()) / (1000 * 60 * 60 * 24)
  );

  const lowMetrics = getLowMetrics(user.metrics);
  const highMetrics = getHighMetrics(user.metrics);

  return `
CALL OBJECTIVE:
===============
Re-engage ${user.name} from ${user.company} who has shown declining engagement with our analytics platform. The goal is to understand their challenges, provide immediate value, and get them back to regular platform usage.

CONVERSATION FRAMEWORK:
=======================

1. OPENING (Warm & Empathetic):
   "Hi ${user.name}, this is [Your Name] from ProductName. I hope I'm catching you at a good time! 
   I noticed you haven't been as active on the platform lately - you were doing great with a ${user.previousScore}/100 engagement score, 
   and I wanted to reach out personally to see how things are going and if there's anything we can help with."

2. DISCOVERY QUESTIONS (Active Listening):
   ${generateDiscoveryQuestions(user, lowMetrics, daysSinceLastActive)}

3. ACKNOWLEDGE & VALIDATE:
   Listen for their pain points and validate their concerns:
   - "I completely understand that challenge..."
   - "That's a common situation we've helped others solve..."
   - "It makes total sense why you'd be focused on [their priority]..."

4. PROVIDE IMMEDIATE VALUE:
   Based on their responses, offer specific solutions:
   ${generateSolutions(user, lowMetrics, highMetrics)}

5. ACTION ITEMS & COMMITMENT:
   - Offer a personalized onboarding session: "I'd love to set up a 30-minute session to get you back on track"
   - Share specific resources: "I'll send you a guide on [relevant feature] right after this call"
   - Schedule follow-up: "Can we schedule a quick check-in in 2 weeks?"

6. CLOSING:
   "Thanks so much for your time today, ${user.name}. I'm here to make sure ${user.company} gets maximum value 
   from ProductName. You have my direct number - don't hesitate to reach out anytime. Looking forward to 
   seeing you back in the platform!"

TONE & APPROACH:
================
- Warm, friendly, and genuinely helpful (not salesy)
- Consultative partner, not vendor
- Focus on THEIR success, not our product features
- Use their name naturally throughout the conversation
- Be an active listener - pause for their responses
- Mirror their communication style (formal/casual)

CALL METRICS TO TRACK:
======================
- Did they mention a specific blocker? ${user.dropoffReason ? '(Already identified: ' + user.dropoffReason + ')' : ''}
- Are they open to a follow-up session?
- What's their current business priority?
- Is this a timing issue or a product fit issue?

EXPECTED OUTCOME:
=================
✓ Understand root cause of disengagement
✓ Provide at least one actionable solution
✓ Schedule follow-up touchpoint
✓ Re-establish relationship and trust
✓ Set clear next steps

EMERGENCY ESCALATION:
=====================
If ${user.name} mentions:
- Considering switching to a competitor → Immediately involve account manager
- Budget cuts or contract cancellation → Loop in customer success director
- Major technical issues → Create urgent support ticket during call
- Dissatisfaction with ROI → Offer executive business review

Remember: The goal is genuine help, not pressure. If they're not ready, that's okay. 
Plant seeds for future re-engagement and leave the door open.
`.trim();
}

/**
 * Helper function to identify metrics below 50%
 */
function getLowMetrics(metrics: User['metrics']): string[] {
  const low: string[] = [];
  Object.entries(metrics).forEach(([key, value]) => {
    if (value < 50) {
      low.push(key.replace(/([A-Z])/g, ' $1').trim());
    }
  });
  return low;
}

/**
 * Helper function to identify metrics above 70%
 */
function getHighMetrics(metrics: User['metrics']): string[] {
  const high: string[] = [];
  Object.entries(metrics).forEach(([key, value]) => {
    if (value >= 70) {
      high.push(key.replace(/([A-Z])/g, ' $1').trim());
    }
  });
  return high;
}

/**
 * Generates personalized discovery questions based on user data
 */
function generateDiscoveryQuestions(
  user: User,
  lowMetrics: string[],
  daysSinceLastActive: number
): string {
  const questions: string[] = [];

  if (daysSinceLastActive > 7) {
    questions.push(
      `   - "I see it's been about ${daysSinceLastActive} days since you last logged in. Has something changed with your priorities or workflow?"`
    );
  }

  if (lowMetrics.includes('team collaboration')) {
    questions.push(
      '   - "How is your team currently tracking and analyzing your revenue metrics? Are they using the platform or other tools?"'
    );
  }

  if (lowMetrics.includes('feature adoption')) {
    questions.push(
      '   - "When you were using the platform, which features did you find most valuable? What were you trying to accomplish?"'
    );
  }

  if (lowMetrics.includes('data quality')) {
    questions.push(
      '   - "How has the data setup been going? Any challenges getting the right events or integrations connected?"'
    );
  }

  questions.push(
    '   - "What\'s your biggest data or analytics challenge right now at ' +
      user.company +
      '?"'
  );
  questions.push(
    '   - "If you could wave a magic wand, what would you want our platform to help you accomplish?"'
  );

  return questions.join('\n');
}

/**
 * Generates personalized solutions based on user metrics
 */
function generateSolutions(
  user: User,
  lowMetrics: string[],
  highMetrics: string[]
): string {
  const solutions: string[] = [];

  if (lowMetrics.includes('team collaboration')) {
    solutions.push(
      '   - Team Collaboration Issue: "Let me show you how to set up shared dashboards and alerts so your whole team stays in sync. Many of our enterprise customers find this transforms their workflow."'
    );
  }

  if (lowMetrics.includes('feature adoption')) {
    solutions.push(
      '   - Limited Feature Use: "I can create a custom demo focused on the 3-4 features that would have the biggest impact for your specific use case at ' +
        user.company +
        '."'
    );
  }

  if (lowMetrics.includes('data quality')) {
    solutions.push(
      '   - Data Setup: "Our solutions engineering team can audit your current setup and fix any data quality issues - usually takes about 30 minutes and makes a huge difference."'
    );
  }

  if (user.metrics.monthlyActiveUse < 40) {
    solutions.push(
      '   - Low Usage: "I can send you our quick-start guide and schedule a 15-minute power user session to help you get the insights you need in under 5 minutes a day."'
    );
  }

  if (highMetrics.length > 0) {
    solutions.push(
      `   - Build on Strengths: "I noticed you're already strong with ${highMetrics[0]} - let me show you how to take that to the next level and connect it with [complementary feature]."'`
    );
  }

  if (solutions.length === 0) {
    solutions.push(
      '   - General Support: "Based on what you\'ve shared, I can set up a personalized session to address exactly what you need. No generic demo - just solutions for your specific situation."'
    );
  }

  return solutions.join('\n');
}

/**
 * Exports data in JSON format for API consumption
 */
export function formatEngagementDataAsJSON(user: User): object {
  return {
    user_id: user.id,
    user_profile: {
      name: user.name,
      email: user.email,
      company: user.company,
      plan: user.plan,
    },
    engagement_summary: {
      current_score: user.engagementScore,
      previous_score: user.previousScore,
      score_change: user.previousScore - user.engagementScore,
      status: user.status,
      days_since_signup: Math.floor(
        (new Date().getTime() - new Date(user.signupDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
      days_since_last_active: Math.floor(
        (new Date().getTime() - new Date(user.lastActive).getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    },
    metrics: user.metrics,
    recent_activity: user.recentActivity,
    engagement_trend: user.engagementTrend,
    identified_issues: {
      primary_concern: user.dropoffReason,
      low_performing_metrics: getLowMetrics(user.metrics),
      high_performing_metrics: getHighMetrics(user.metrics),
    },
    recommended_actions: generateRecommendedActions(user),
    outreach_priority:
      user.status === 'critical'
        ? 'HIGH'
        : user.status === 'warning'
        ? 'MEDIUM'
        : 'LOW',
  };
}

/**
 * Generates recommended actions for AI
 */
function generateRecommendedActions(user: User): string[] {
  const actions: string[] = [];

  if (user.metrics.teamCollaboration < 50) {
    actions.push('Focus on team adoption and collaboration features');
  }
  if (user.metrics.featureAdoption < 50) {
    actions.push('Provide feature education and onboarding');
  }
  if (user.metrics.dataQuality < 70) {
    actions.push('Offer data setup audit and optimization');
  }
  if (user.status === 'critical') {
    actions.push('Schedule immediate personalized support call');
  }

  return actions;
}
