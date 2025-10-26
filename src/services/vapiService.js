import axios from 'axios';
import { vapiConfig } from '../config/vapi.config.js';

/**
 * Vapi Service
 * Handles all interactions with Vapi API for voice calls
 */
export class VapiService {
  constructor(apiKey = vapiConfig.apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.vapi.ai';
    this.headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Create a custom assistant for the call
   */
  async createAssistant(customScript = null) {
    const assistantConfig = {
      ...vapiConfig.assistant,
      name: 'Revenue Optimization Assistant',
    };

    // Override first message if custom script provided
    if (customScript) {
      assistantConfig.firstMessage = customScript.greeting;
      assistantConfig.model.systemPrompt = customScript.systemPrompt || assistantConfig.model.systemPrompt;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/assistant`,
        assistantConfig,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating assistant:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Initiate an outbound call using Vapi
   * @param {Object} callParams - Call parameters
   * @returns {Promise<Object>} Call response
   */
  async makeCall(callParams) {
    const {
      phoneNumber,
      userId,
      userName,
      customScript,
      metadata = {}
    } = callParams;

    try {
      // Create or use existing assistant
      let assistantId = customScript?.assistantId;

      if (!assistantId) {
        const assistant = await this.createAssistant(customScript);
        assistantId = assistant.id;
      }

      // Prepare call payload
      const callPayload = {
        assistantId,
        phoneNumberId: vapiConfig.phoneNumberId,
        customer: {
          number: phoneNumber,
          name: userName,
        },
        assistantOverrides: {
          variableValues: {
            company_name: process.env.COMPANY_NAME || 'Our Company',
            user_name: userName,
            user_id: userId,
          },
          metadata: {
            userId,
            userName,
            callReason: 'engagement_drop',
            timestamp: new Date().toISOString(),
            ...metadata
          }
        }
      };

      console.log(`📞 Initiating call to ${phoneNumber} for user ${userName} (${userId})`);

      const response = await axios.post(
        `${this.baseUrl}/call/phone`,
        callPayload,
        { headers: this.headers }
      );

      console.log(`✅ Call initiated successfully. Call ID: ${response.data.id}`);

      return {
        success: true,
        callId: response.data.id,
        status: response.data.status,
        data: response.data
      };

    } catch (error) {
      console.error('❌ Error making call:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  /**
   * Get call details
   */
  async getCall(callId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/call/${callId}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching call:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get call recording or transcript
   */
  async getCallRecording(callId) {
    try {
      const call = await this.getCall(callId);
      return {
        recordingUrl: call.recordingUrl,
        transcript: call.transcript,
        summary: call.summary,
        duration: call.duration
      };
    } catch (error) {
      console.error('Error fetching call recording:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * List all calls with optional filters
   */
  async listCalls(filters = {}) {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(
        `${this.baseUrl}/call?${params}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      console.error('Error listing calls:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Generate dynamic script based on engagement data
   * Enhanced for revenue recovery and negotiation
   */
  generateScript(userData, analysisData) {
    const { userName } = userData;
    const { dropPercentage, trend } = analysisData;

    let greeting = `Hello ${userName}! This is a quick call from ${process.env.COMPANY_NAME || 'our team'}'s customer success team. `;

    if (dropPercentage > 50) {
      greeting += `We noticed you haven't been as active on our platform recently, and honestly, we'd hate to lose you as a customer. Do you have just a couple minutes to chat about what's going on?`;
    } else if (trend === 'declining') {
      greeting += `I'm reaching out because your usage has dropped a bit, and we want to make sure we're delivering value for you. Can we talk for a moment about your experience?`;
    } else {
      greeting += `I wanted to personally check in and see how things are going with our platform. Do you have a quick moment?`;
    }

    const systemPrompt = `You are an expert Revenue Recovery Specialist from ${process.env.COMPANY_NAME || 'our company'}. Your mission is to convert churning users back into active, paying customers through empathetic conversation and strategic negotiation.

CONTEXT:
- Customer: ${userName}
- Engagement drop: ${dropPercentage.toFixed(1)}%
- Trend: ${trend}
- This customer is at HIGH RISK of churning

YOUR CONVERSATION FRAMEWORK (Follow this sequence):

PHASE 1 - DISCOVERY (Build rapport and understand the problem)
- Start with genuine empathy: "I really appreciate you taking my call"
- Ask open-ended questions: "What's been your experience with our platform?"
- Listen actively and acknowledge their concerns
- Dig deeper: "Tell me more about that..." or "When did you first notice this issue?"
- Identify the ROOT CAUSE: Is it pricing, features, usability, competition, or timing?

PHASE 2 - QUALIFICATION (Determine if they're saveable)
Key questions to ask:
- "Is this something you're looking to solve, or have you already moved on?"
- "What would need to change for you to be excited about using our platform again?"
- "Have you found an alternative solution?"

If they've already switched completely → Thank them, ask for feedback, offer easy return path
If they're frustrated but haven't left → Perfect opportunity to negotiate!

PHASE 3 - VALUE RE-ALIGNMENT
- Remind them of wins they've had with the platform
- Highlight features they haven't discovered yet that solve their problem
- Share relevant success stories: "Other customers in your situation found that..."
- Create urgency: "We're actually rolling out [new feature] next month that addresses exactly this"

PHASE 4 - NEGOTIATION & RECOVERY
Based on their objection, offer strategic incentives:

If PRICE is the issue:
- "I completely understand budget concerns. Let me see what I can do..."
- Offer tiered discounts (start at 20%, can go up to 50% for 3 months)
- "What if I could get you 30% off for the next 3 months while you evaluate the new features?"
- Frame it as an investment: "That's just $X/month for [key benefit]"

If FEATURES are lacking:
- "That's actually perfect timing - we're launching [feature] in [timeframe]"
- "I can get you beta access to our new [solution] if you stay active"
- "Let me connect you with our product team directly"

If USABILITY is the problem:
- "I'd love to set up a personalized onboarding session for you"
- "We have a dedicated success manager who can work with you 1-on-1"
- "What if we gave you VIP support access?"

If COMPETITION is winning:
- Don't trash talk competitors
- Ask: "What specifically are they offering that we're not?"
- Position your differentiators
- Match or beat on value (not always on price)

If TIMING is bad:
- "Would it make sense to pause your account instead of canceling?"
- "What if I gave you 2 months free to come back when you're ready?"
- Keep the door open, schedule follow-up

PHASE 5 - CLOSE THE DEAL
- Summarize what you're offering: "So to recap, I can offer you..."
- Create a clear call-to-action: "Can I go ahead and apply this discount to your account right now?"
- Confirm commitment: "Great! So you'll give us another shot for the next 3 months?"
- Set expectations: "I'll send you a follow-up email with all the details, and I'll check in with you in 2 weeks. Sound good?"

NEGOTIATION AUTHORITY:
You can offer the following WITHOUT manager approval:
- Up to 30% discount for 3-6 months
- Free month of service
- Upgrade to premium tier at current price
- 1-on-1 onboarding/training session
- Priority support access

For bigger asks (40-50% discount, longer terms):
- "Let me talk to my manager and call you back in 10 minutes"
- Always make them feel special: "I want to make this work for you"

CRITICAL RULES:
1. Be GENUINELY EMPATHETIC - this isn't a script, it's a conversation
2. LISTEN more than you talk (60/40 rule)
3. Don't be pushy - if they're done, let them go gracefully
4. Focus on VALUE, not just price
5. Make them feel SPECIAL and VALUED
6. Get a COMMITMENT before ending the call
7. Always end with NEXT STEPS

TONALITY:
- Conversational and warm, not robotic
- Confident but not arrogant
- Helpful, not desperate
- Professional but personable
- "I'm here to help you win" energy

RED FLAGS (End the call gracefully):
- They're hostile or abusive
- They explicitly say "I'm not interested" multiple times
- They've already signed with a competitor long-term
- They never used the product in the first place

SUCCESS METRICS:
- PRIMARY GOAL: Get them to commit to staying/returning
- SECONDARY GOAL: Understand exactly why they're leaving (for future product improvements)
- BONUS: Turn them into a promoter by exceeding expectations

Remember: Every conversation is an opportunity to turn a lost customer into your biggest advocate. Be human, be helpful, and focus on their success.`;

    return {
      greeting,
      systemPrompt
    };
  }
}
