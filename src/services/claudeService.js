import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Claude API Service
 * Uses Claude AI to make intelligent decisions about when to call users
 * based on their engagement metrics and behavior patterns
 */
export class ClaudeService {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.baseUrl = 'https://api.anthropic.com/v1/messages';
    this.model = 'claude-3-5-sonnet-20241022';
    
    if (!this.apiKey) {
      console.warn('⚠️ CLAUDE_API_KEY not found in environment variables');
    }
  }

  /**
   * Analyze user metrics and decide if a call should be made
   * @param {Object} userMetrics - Current user metrics
   * @param {Object} previousMetrics - Previous user metrics for comparison
   * @param {Object} behaviorSignals - Engagement signals from detector
   * @returns {Promise<Object>} Decision object with recommendation
   */
  async analyzeCallDecision(userMetrics, previousMetrics, behaviorSignals) {
    try {
      const prompt = this.buildAnalysisPrompt(userMetrics, previousMetrics, behaviorSignals);
      
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          max_tokens: 1000,
          temperature: 0.3, // Lower temperature for more consistent decision making
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      const analysis = this.parseClaudeResponse(response.data.content[0].text);
      
      console.log(`🤖 Claude Analysis for ${userMetrics.userName}:`);
      console.log(`   Recommendation: ${analysis.shouldCall ? 'CALL' : 'NO CALL'}`);
      console.log(`   Confidence: ${analysis.confidence}%`);
      console.log(`   Reasoning: ${analysis.reasoning}`);
      
      return analysis;

    } catch (error) {
      console.error('❌ Claude API Error:', error.response?.data || error.message);
      
      // Fallback to simple rule-based decision if Claude fails
      return this.fallbackDecision(behaviorSignals);
    }
  }

  /**
   * Build the analysis prompt for Claude
   */
  buildAnalysisPrompt(userMetrics, previousMetrics, behaviorSignals) {
    const cartValue = userMetrics.cartValue || 0;
    const cartItems = userMetrics.cartItems || 0;
    const timeSinceLastVisit = previousMetrics ? 
      Math.floor((Date.now() - new Date(previousMetrics.timestamp).getTime()) / (1000 * 60 * 60)) : 0;

    return `You are an expert customer success analyst for an e-commerce platform. Your job is to analyze user behavior and decide whether a proactive phone call would be valuable and appropriate.

CURRENT USER CONTEXT:
- User: ${userMetrics.userName} (ID: ${userMetrics.userId})
- Email: ${userMetrics.email || 'Not provided'}
- Current Cart Value: $${cartValue.toFixed(2)}
- Items in Cart: ${cartItems}
- Checkout Started: ${userMetrics.checkoutStarted || false}
- Order Completed: ${userMetrics.orderCompleted || false}
- Hours Since Last Visit: ${timeSinceLastVisit}

BEHAVIORAL SIGNALS DETECTED:
- Long-time Cart Abandonment (5+ min): ${behaviorSignals.longTimeCartAbandonment}
- Cart Item Removed: ${behaviorSignals.cartItemRemoved}
${behaviorSignals.cartRemovalCount ? `- CART REMOVAL COUNT: ${behaviorSignals.cartRemovalCount} (Escalation Level)` : ''}
- Long-time Inactive (24+ hours): ${behaviorSignals.longTimeInactive}
- Engagement Score: ${behaviorSignals.engagementScore}/100
- Risk Level: ${behaviorSignals.riskLevel}

DETECTED REASONS:
${behaviorSignals.reasons.length > 0 ? behaviorSignals.reasons.map(r => `- ${r}`).join('\n') : 'No specific triggers detected'}

🚨 CART REMOVAL ESCALATION POLICY:
- 1st Removal: User is exploring options - DO NOT CALL. Monitor behavior. (Alternative: Send gentle reminder email)
- 2nd Removal: User showing hesitation - BE ON ALERT. Consider calling only if cart value > $75 or high-value items.
- 3rd+ Removal: CRITICAL - User about to abandon! Strong recommendation to call if cart has any value.

${behaviorSignals.cartRemovalCount === 1 ? '⚠️ STATUS: First removal - Give user space to explore. DO NOT call unless cart value > $100.' : ''}
${behaviorSignals.cartRemovalCount === 2 ? '⚠️ STATUS: Second removal - User is hesitating. Consider calling if high value or premium items in cart.' : ''}
${behaviorSignals.cartRemovalCount >= 3 ? '🚨 STATUS: Third removal - CRITICAL! User likely to abandon. Strong call recommendation.' : ''}

DECISION CRITERIA:
Consider these factors when deciding whether to call:

CALL WORTHY SCENARIOS (High Value):
- Cart value > $50 with items sitting for 5+ minutes
- User removed high-value items from cart (shows serious consideration)
- Previously active user hasn't visited in 24+ hours
- Multiple engagement drops indicating genuine interest but hesitation

NOT CALL WORTHY SCENARIOS (Low Value/Intrusive):
- Very low cart value (< $20) - not worth the interruption
- User just started browsing (< 2 minutes on site)
- Cart abandonment on very cheap items
- User seems to be just window shopping
- Recent new user who might not be familiar with the brand yet

TIMING CONSIDERATIONS:
- Is this the right time of day to call?
- Would an email or SMS be less intrusive but equally effective?
- Has enough time passed to indicate genuine abandonment vs. just thinking?

Please analyze this situation and respond with a JSON object in this exact format:

{
  "shouldCall": true/false,
  "confidence": 85,
  "reasoning": "Detailed explanation of why you recommend calling or not calling",
  "alternativeAction": "If not calling, what should we do instead? (email, SMS, wait, etc.)",
  "urgency": "low/medium/high",
  "expectedOutcome": "What do you expect to happen if we call?",
  "callScript": "Brief suggested approach for the call if shouldCall is true"
}

Be thoughtful about the user experience. A well-timed, helpful call can save a sale, but a poorly timed or unnecessary call can damage the relationship.`;
  }

  /**
   * Parse Claude's response and extract decision data
   */
  parseClaudeResponse(responseText) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          shouldCall: parsed.shouldCall || false,
          confidence: parsed.confidence || 50,
          reasoning: parsed.reasoning || 'No reasoning provided',
          alternativeAction: parsed.alternativeAction || 'Monitor user behavior',
          urgency: parsed.urgency || 'low',
          expectedOutcome: parsed.expectedOutcome || 'Unknown',
          callScript: parsed.callScript || 'Standard recovery script'
        };
      }
    } catch (error) {
      console.error('Error parsing Claude response:', error);
    }

    // Fallback parsing if JSON extraction fails
    const shouldCall = responseText.toLowerCase().includes('shouldcall": true') || 
                      responseText.toLowerCase().includes('recommend calling') ||
                      responseText.toLowerCase().includes('should call');

    return {
      shouldCall,
      confidence: 50,
      reasoning: 'Failed to parse detailed response, using fallback logic',
      alternativeAction: 'Monitor user behavior',
      urgency: 'low',
      expectedOutcome: 'Unknown',
      callScript: 'Standard recovery script'
    };
  }

  /**
   * Fallback decision logic if Claude API fails
   */
  fallbackDecision(behaviorSignals) {
    console.log('🔄 Using fallback decision logic (Claude API unavailable)');

    // Respect the cart removal escalation policy
    const removalCount = behaviorSignals.cartRemovalCount || 0;

    // Simple rule-based fallback with escalation policy
    let shouldCall = false;
    let reasoning = 'No strong signals detected';

    if (removalCount === 1) {
      // First removal - don't call
      shouldCall = false;
      reasoning = 'First cart removal detected - giving user space to explore';
    } else if (removalCount === 2) {
      // Second removal - only call if high value
      shouldCall = behaviorSignals.engagementScore < 60;
      reasoning = 'Second cart removal detected - calling based on engagement score';
    } else if (removalCount >= 3) {
      // Third+ removal - strong call recommendation
      shouldCall = true;
      reasoning = 'Third cart removal detected - critical intervention needed';
    } else {
      // Other triggers
      shouldCall = (
        (behaviorSignals.longTimeCartAbandonment && behaviorSignals.engagementScore < 50) ||
        (behaviorSignals.longTimeInactive && behaviorSignals.riskLevel === 'critical')
      );
      reasoning = 'Fallback logic: Based on engagement score and risk level';
    }

    return {
      shouldCall,
      confidence: 60,
      reasoning,
      alternativeAction: shouldCall ? 'Make call' : (removalCount === 1 ? 'Send gentle reminder email' : 'Monitor user behavior'),
      urgency: removalCount >= 3 || behaviorSignals.riskLevel === 'critical' ? 'high' : 'medium',
      expectedOutcome: 'Standard recovery attempt',
      callScript: 'Use standard engagement recovery script'
    };
  }

  /**
   * Generate a personalized call script based on Claude's analysis
   * Tailored for e-commerce website with natural, conversational tone
   */
  generatePersonalizedScript(userMetrics, claudeAnalysis) {
    const userName = userMetrics.userName || 'there';
    const cartValue = userMetrics.cartValue || 0;
    const cartItems = userMetrics.cartItems || 0;
    const lastCategory = userMetrics.lastCategory || 'our products';
    const removalCount = userMetrics.cartRemovalCount || 0;

    // Create context-aware personalized script
    let greeting = '';
    let mainMessage = '';
    let callToAction = '';
    let tonalGuidance = '';

    // GREETING - Natural and friendly
    if (removalCount >= 3) {
      greeting = `Hi ${userName}! This is Sarah from the customer success team. I hope I'm not catching you at a bad time?`;
    } else {
      greeting = `Hey ${userName}! This is Sarah calling from the e-commerce team. How's it going?`;
    }

    // MAIN MESSAGE - Context-aware based on user behavior
    if (removalCount >= 3 && cartItems > 0) {
      // Critical cart abandonment
      mainMessage = `So, I was actually looking at your account and I noticed you've been browsing quite a bit - which is awesome! - but I also saw you've got ${cartItems} item${cartItems !== 1 ? 's' : ''} sitting in your cart. ${cartValue > 0 ? `That's about $${cartValue.toFixed(0)} worth of great stuff` : 'Some really nice products there'}.

I'm calling because, um, honestly we want to make sure you're having a good experience. I noticed you've been adding and removing things a few times, and I just wanted to check in - is there something specific you're looking for? Or maybe you have some questions about any of the products?`;

      callToAction = `I can actually help you right now if you'd like - or if you prefer, I can send you a personalized discount code to help make the decision easier. What do you think?`;

      tonalGuidance = `TONE: Empathetic and helpful, not pushy. Acknowledge their browsing behavior positively. Use natural pauses and filler words. Listen actively to their response - they might mention price concerns, product questions, or just browsing.`;

    } else if (cartValue > 100) {
      // High-value cart
      mainMessage = `I was taking a look at your account and noticed you've got some items in your cart - looks like you've been checking out our ${lastCategory} section! Good taste, by the way.

Quick question - I see you started to check out but didn't quite finish. Is there anything I can help with? Sometimes our checkout process can be a bit finicky, or maybe you have questions about shipping or returns?`;

      callToAction = `I'm here for the next little bit, so if there's anything I can do to help you complete that order, just let me know. We might also be able to do something special on the price if that helps!`;

      tonalGuidance = `TONE: Casual and conversational. Position yourself as helpful, not sales-y. Be ready to discuss: shipping times, return policy, product details, or offer a discount if they mention price.`;

    } else {
      // General re-engagement
      mainMessage = `I noticed you haven't been on the site in a little while, and I wanted to reach out. Last time you were here, you were looking at ${lastCategory} - did you find what you were looking for?

Sometimes people tell us they couldn't find exactly what they needed, or they had questions and just moved on. I wanted to make sure that wasn't the case with you!`;

      callToAction = `Is there anything specific you were hoping to find? I can actually help you look right now, or I can send you some recommendations based on what you were browsing. No pressure at all!`;

      tonalGuidance = `TONE: Friendly and low-pressure. Sound genuinely curious about their experience. Be empathetic if they mention negative feedback. Offer solutions organically.`;
    }

    // ADDITIONAL CONTEXT FOR THE AI AGENT
    const behavioralInsights = `
USER BEHAVIOR CONTEXT:
- Cart items: ${cartItems}
- Cart value: $${cartValue.toFixed(2)}
- Times they've modified cart: ${removalCount}
- Last browsing category: ${lastCategory}
- Urgency level: ${claudeAnalysis.urgency}
- Expected outcome: ${claudeAnalysis.expectedOutcome}

CONVERSATION STRATEGY:
${claudeAnalysis.urgency === 'high' ?
  '- This is a critical recovery call - user is close to purchasing but hesitant\n- Focus on removing barriers (price, shipping, product questions)\n- Offer concrete solutions: discount code, free shipping, product comparison\n- Goal: Convert today if possible' :
  '- This is a gentle re-engagement call\n- Focus on understanding their experience\n- Offer value: recommendations, notifications about new products, insider tips\n- Goal: Build relationship and bring them back organically'
}

IF THEY MENTION:
- Price concerns → "I totally get it. Let me see what I can do - I can apply a special discount code right now."
- Shipping time → "Great question! Most of our ${lastCategory} ships within 2-3 days. Need it faster? We have express options."
- Product questions → "Oh yeah, let me pull that up... [pause] Okay so that particular item..." [Be helpful, reference specific details]
- Not interested → "No worries at all! Would you like me to send you an email when we have sales on ${lastCategory}?"
- Browsing only → "Totally understand! Are you looking for anything specific? I can keep an eye out for you."

NATURAL CONVERSATION TIPS:
- Use filler words: "So...", "Actually...", "You know...", "Um..."
- Acknowledge what they say: "Oh totally!", "Yeah, I get that", "That makes sense"
- Don't rush - let them talk
- Reference the "office" if asked: "Yeah, it's a bit busy in here today!"
- End naturally: "Awesome!", "Perfect!", "Sounds good!"`;

    // Combine everything into the final script
    const fullScript = `${greeting}

${mainMessage}

${callToAction}

---
${tonalGuidance}

${behavioralInsights}`;

    return fullScript;
  }

  /**
   * Health check for Claude API
   */
  async healthCheck() {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          max_tokens: 10,
          messages: [
            {
              role: 'user',
              content: 'Hello, please respond with "OK"'
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      return {
        status: 'healthy',
        model: this.model,
        response: response.data.content[0].text
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.response?.data || error.message
      };
    }
  }
}