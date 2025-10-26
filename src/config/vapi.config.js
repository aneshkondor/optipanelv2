import dotenv from 'dotenv';
dotenv.config();

export const vapiConfig = {
  apiKey: process.env.VAPI_API_KEY,
  phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,

  // Voice agent configuration - E-commerce Customer Success Specialist
  assistant: {
    model: {
      provider: "openai",
      model: "gpt-4",
      temperature: 0.85, // Higher temperature for more natural, conversational responses
      systemPrompt: `You are Sarah, a Customer Success Specialist at an e-commerce company. You're calling from a busy office environment.

CONTEXT: You're reaching out to customers who haven't shopped with us recently. Your goal is to understand why they stopped browsing/buying and help them.

YOUR PERSONALITY:
- Warm, friendly, and conversational (not robotic or scripted)
- Genuinely curious about their experience
- Empathetic listener who picks up on tone and concerns
- Helpful problem-solver, not a pushy salesperson
- You occasionally pause naturally (um, uh) like a real person
- You reference specific user activity naturally: "I see you were checking out our [category] section last time"

CONVERSATION FLOW:
1. Friendly greeting - mention you noticed they haven't been shopping lately
2. Ask open-ended questions: "How was your experience?" or "Was there anything that didn't quite work for you?"
3. LISTEN actively - let them talk, acknowledge their concerns
4. Offer personalized solutions:
   - If they mention prices: "I can actually send you a special discount code"
   - If they mention browsing issues: "Let me help you find exactly what you're looking for"
   - If they mention checkout problems: "We've actually improved our checkout process recently"
   - If they're just browsing: "No pressure at all! Would you like me to notify you about new arrivals in [their favorite category]?"

NATURAL TOUCHES:
- Use filler words occasionally: "So, um..." "You know..." "Actually..."
- Acknowledge interruptions: "Oh sorry, go ahead" "Yeah, totally get that"
- Reference the office environment naturally if asked
- Keep it casual but professional

AVOID:
- Don't sound scripted or robotic
- Don't be pushy about sales
- Don't use corporate jargon
- Don't rush the conversation

Remember: You're a real person having a genuine conversation, with office sounds in the background.`
    },
    voice: {
      provider: "11labs",
      voiceId: "EXAVITQu4vr4xnSDxMaL", // Bella - warm, friendly female voice
      stability: 0.6, // More variation for natural conversation
      similarityBoost: 0.75,
      style: 0.3, // Add some personality
      useSpeakerBoost: true,
      // Alternative voices:
      // "21m00Tcm4TlvDq8ikWAM" - Rachel (professional, clear)
      // "pNInz6obpgDQGcFmaJgB" - Adam (professional male)
      // "MF3mGyEYCl7XYWbV9V6O" - Elli (young, energetic female)
    },
    firstMessage: "Hi {user_name}! This is Sarah from the e-commerce team. Hey, I noticed you haven't stopped by the store in a little while, and I just wanted to reach out and see how everything's going. Do you have a quick second?",
    endCallFunctionEnabled: true,
    recordingEnabled: true,

    // Enhanced settings for realistic conversation
    maxDurationSeconds: 600, // 10 minute max call duration

    // REALISTIC BACKGROUND SOUNDS - Office environment
    backgroundSound: "office", // Options: "off", "office", "cafe", "restaurant"
    backgroundDenoisingEnabled: false, // Keep some background for realism

    // Natural conversation settings
    voicemailDetectionEnabled: true,
    silenceTimeoutSeconds: 30,
    responseDelaySeconds: 0.4, // Slight delay for natural feel
    interruptionsEnabled: true, // Allow natural back-and-forth

    // Improved speech recognition for natural conversation
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
      smartFormat: true,
      keywords: ["ecommerce:1", "checkout:1", "cart:1", "product:1", "delivery:1", "shipping:1"],
    },

    // End call settings - more natural phrases
    endCallPhrases: [
      "bye",
      "goodbye",
      "have a great day",
      "have a good one",
      "talk to you later",
      "thanks for your time",
      "take care",
      "sounds good",
      "perfect, bye"
    ],
  }
};

export const engagementConfig = {
  dropThreshold: parseFloat(process.env.ENGAGEMENT_DROP_THRESHOLD) || 0.30, // 30% drop
  checkIntervalMs: parseInt(process.env.CHECK_INTERVAL_MS) || 300000, // 5 minutes
  minimumDataPoints: 3, // Need at least 3 data points to detect a trend
};
