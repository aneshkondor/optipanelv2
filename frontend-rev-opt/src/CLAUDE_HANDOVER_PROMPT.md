# 🤖 AI Integration Prompt

Copy and paste this entire prompt to Claude (or any AI assistant) to help integrate your backend.

---

## 📋 Project Context

I have a **B2B Revenue Analytics Platform** frontend built with:
- **Stack:** React 18 + TypeScript + Vite + Tailwind CSS 4.0
- **UI:** Radix UI (shadcn/ui components)
- **Design:** Royal Purple theme, Dark/Light modes, Inter typography
- **Features:** Executive dashboard, AI chat, live metrics, funnels, cohorts, retention, revenue analytics

The frontend is currently **fully functional with mock data** and I need to integrate it with my existing backend.

---

## 📁 Current File Structure

```
├── App.tsx                          # Main app component
├── components/
│   ├── app/                         # All app pages (14 pages)
│   │   ├── AIChatPanel.tsx         # AI chat functionality
│   │   ├── ExecutiveDashboard.tsx  # Main dashboard
│   │   ├── LiveMetricsPage.tsx     # Real-time metrics
│   │   ├── FunnelsPage.tsx         # Funnel analysis
│   │   ├── CohortsPage.tsx         # Cohort analysis
│   │   ├── RevenuePage.tsx         # Revenue & P/L
│   │   └── [10 more pages...]
│   ├── marketing/                   # Public pages
│   └── ui/                          # shadcn/ui components (50+)
├── contexts/
│   └── MetricsContext.tsx          # Live metrics state
├── services/
│   └── metricsService.ts           # Mock metrics generation
├── types/
│   └── metrics.ts                  # TypeScript types
└── styles/
    └── globals.css                 # Design system
```

---

## 📚 Available Documentation

I have these comprehensive guides (attached):

1. **SETUP_INSTRUCTIONS.md** - Complete local setup guide (package.json, vite config, etc.)
2. **BACKEND_INTEGRATION.md** - Backend integration guide with all mock data locations
3. **INTEGRATION_GUIDE.md** - Live Metrics data source integration (scrapers, WebSocket)
4. **LIVE_METRICS_README.md** - Live Metrics feature documentation
5. **QUICK_REFERENCE.md** - Quick reference for common tasks

---

## 🎯 My Backend Setup

**Replace this section with your actual backend details:**

```
Technology: [Express.js / FastAPI / Django / Rails / etc.]
Port: [3000 / 8000 / etc.]
Database: [PostgreSQL / MongoDB / MySQL / etc.]
Auth: [JWT / Session / OAuth / etc.]
Current APIs: [List any existing endpoints]
```

**Example:**
```
Technology: Express.js + TypeScript
Port: 3000
Database: PostgreSQL
Auth: JWT tokens
Current APIs: 
  - GET /api/users
  - POST /api/auth/login
  - GET /api/analytics/overview
```

  TECHNOLOGIES

  Core Stack

  - Runtime: Node.js (ES Modules)
  - Framework: Express.js 4.18.2
  - Language: JavaScript (not TypeScript)

  AI/Voice Services

  - Vapi AI (@vapi-ai/server-sdk) - Voice call orchestration
  - Claude AI (Anthropic) - Intelligent decision-making for when to trigger calls
  - OpenAI GPT-4 - Powers the conversation agent via Vapi
  - 11labs - Text-to-speech voice provider

  Key Dependencies

  - axios - HTTP requests to Vapi/Claude APIs
  - cors - Cross-origin requests enabled
  - dotenv - Environment configuration
  - express - REST API server

  ---
  PORT

  - Default: 3001 (see src/index.js:13)
  - Configurable: via PORT environment variable

  ---
  DATABASE

  ❌ NO DATABASE - Everything is in-memory:
  - Map() objects for storage (JavaScript's built-in data structure)
  - Data is lost on server restart
  - Storage locations:
    - User metrics: metricsAggregator.userMetrics (Map)
    - Call history: intelligentDecisionEngine.callHistory (Map)
    - Engagement data: engagementDetector.userBehaviorHistory (Map)
    - Decision history: intelligentDecisionEngine.decisionHistory (Map)

  ---
  AUTHENTICATION

  ❌ NO AUTHENTICATION - All endpoints are public:
  - No JWT tokens
  - No OAuth
  - No API keys required for endpoints
  - No user login system
  - External API auth only:
    - Vapi API: Bearer token via VAPI_API_KEY
    - Claude API: Bearer token via CLAUDE_API_KEY

  ---
  ALL CURRENT APIs

  Health & Stats

  GET  /health                    - Health check
  GET  /api/stats                 - Monitoring statistics

  User Monitoring (Legacy)

  POST /api/users                 - Add user to monitoring system
  POST /api/users/:userId/engagement - Update user engagement data
  POST /api/users/:userId/check  - Manually trigger check for user
  GET  /api/users/:userId/calls   - Get call history for user

  Monitoring Control

  POST /api/monitoring/start      - Start automatic monitoring
  POST /api/monitoring/stop       - Stop monitoring

  Vapi Integration

  POST /api/webhooks/vapi         - Vapi webhook events (call-started, call-ended, etc.)
  GET  /api/calls/:callId         - Get call details from Vapi

  Frontend Integration (Main integration layer)

  POST /api/frontend/analyze-user     - Analyze single user and trigger call
  POST /api/frontend/analyze-batch    - Batch analyze multiple users
  POST /api/frontend/analyze-critical - Analyze only critical status users
  GET  /api/frontend/stats            - Get frontend integration stats
  POST /api/frontend/update-phone     - Update default call number

  Live Metrics (from dummy_website)

  POST /api/metrics/track         - Receive metrics from website tracking
  GET  /api/metrics/current       - Get aggregated metrics
  POST /api/metrics/clear         - Clear all metrics (testing)
  GET  /api/metrics/count         - Get metrics count

  Engagement Detection (Claude AI powered)

  GET  /api/engagement/stats      - Get engagement detection stats
  POST /api/engagement/clear-history/:userId - Clear call history for user

  ---
  EXTERNAL API INTEGRATIONS

  1. Vapi AI API

  - Base URL: https://api.vapi.ai
  - Auth: Bearer token (VAPI_API_KEY)
  - Endpoints used:
    - POST /assistant - Create voice assistant
    - POST /call/phone - Initiate outbound call
    - GET /call/:callId - Get call details
    - GET /call - List calls

  2. Claude AI API

  - Provider: Anthropic
  - Purpose: Analyzes user behavior and decides when to trigger calls
  - Service: src/services/claudeService.js
  - Auth: Bearer token (CLAUDE_API_KEY)

  ---
  ENVIRONMENT VARIABLES

  # Vapi Configuration
  VAPI_API_KEY=                    # Required
  VAPI_PHONE_NUMBER_ID=            # Required

  # Claude AI Configuration
  CLAUDE_API_KEY=                  # Required

  # Server Configuration
  PORT=3001                        # Default: 3001
  NODE_ENV=development

  # Engagement Thresholds
  ENGAGEMENT_DROP_THRESHOLD=0.30   # 30% drop
  CHECK_INTERVAL_MS=300000         # 5 minutes

  # Call Decision Settings
  DEFAULT_CALL_NUMBER=+1234567890  # Phone to call
  ENABLE_CLAUDE_DECISIONS=true
  CLAUDE_CONFIDENCE_THRESHOLD=70

  # Company Details
  COMPANY_NAME=Your Company
  SUPPORT_EMAIL=support@yourcompany.com

  ---
  KEY ARCHITECTURAL NOTES

  1. Stateless: No persistent storage, all data in memory
  2. Single-threaded: Standard Node.js event loop
  3. No rate limiting: APIs are unprotected
  4. CORS enabled: All origins allowed
  5. Webhook receiver: Listens for Vapi call events
  6. Real-time processing: Metrics analyzed immediately on receipt
  7. One-time calling rule: Each user called max once (tracked in memory)
---

## ✅ What I Need Help With

Please help me integrate this frontend with my backend by doing the following:

### **Phase 1: Initial Setup** ✅
- [ ] Review SETUP_INSTRUCTIONS.md and confirm I have the right setup
- [ ] Help me create the required files (src/main.tsx, index.html, vite.config.ts, etc.)
- [ ] Verify my directory structure is correct
- [ ] Set up environment variables (.env.local)

### **Phase 2: API Client Setup** 🔌
- [ ] Create `src/services/apiClient.ts` with fetch wrapper
- [ ] Add authentication token handling
- [ ] Set up error handling and retry logic
- [ ] Configure CORS or Vite proxy (whichever is appropriate)

### **Phase 3: Authentication** 🔐
- [ ] Create `src/services/auth.ts` for login/logout
- [ ] Create `src/contexts/AuthContext.tsx` for auth state
- [ ] Add protected route logic
- [ ] Update App.tsx to use AuthProvider
- [ ] Add token refresh logic (if using JWT)

### **Phase 4: Replace Mock Data** 🔄
Based on BACKEND_INTEGRATION.md, help me replace mock data in:

- [ ] **Live Metrics** (services/metricsService.ts) → WebSocket or polling
- [ ] **AI Chat** (components/app/AIChatPanel.tsx) → POST /api/ai/chat
- [ ] **Executive Dashboard** (components/app/ExecutiveDashboard.tsx) → GET /api/dashboard
- [ ] **Funnels** (components/app/FunnelsPage.tsx) → GET/POST /api/funnels
- [ ] **Cohorts** (components/app/CohortsPage.tsx) → GET /api/cohorts
- [ ] **Revenue** (components/app/RevenuePage.tsx) → GET /api/revenue
- [ ] **Other pages** as needed

### **Phase 5: WebSocket Integration** 📡
- [ ] Set up WebSocket client for live metrics
- [ ] Update MetricsContext.tsx to use real WebSocket
- [ ] Add reconnection logic
- [ ] Handle connection errors gracefully

### **Phase 6: Testing & Debugging** 🧪
- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Check WebSocket connection
- [ ] Test error handling
- [ ] Verify loading states work correctly

---

## 🚀 Step-by-Step Assistance Needed

**Start here:**

1. **First**, review my backend setup above and the BACKEND_INTEGRATION.md file
2. **Then**, create the API client service (src/services/apiClient.ts) based on my backend
3. **Next**, help me set up authentication (auth.ts + AuthContext.tsx)
4. **Then**, let's replace the mock data one feature at a time, starting with the Executive Dashboard
5. **Finally**, set up the WebSocket connection for Live Metrics

---

## 📝 Specific Questions

**Answer these to help me get started:**

1. Should I use Vite proxy or CORS for development? (My backend is on [PORT])
2. What's the best way to handle JWT token refresh?
3. Should I use WebSocket or polling for live metrics?
4. How should I structure error handling across all API calls?
5. What's the best way to handle loading states globally?

---

## 🎯 Expected Output from You

For each phase, please provide:

1. **Complete code** for new files (no placeholders like "// rest of code...")
2. **Exact edits** for existing files with clear before/after examples
3. **Configuration changes** needed (vite.config.ts, .env, etc.)
4. **Testing commands** to verify each step works
5. **Troubleshooting tips** for common issues

---

## 📖 Additional Context

**Current Mock Data Behavior:**

- **Live Metrics**: Generates random shopper data every 5 seconds
- **AI Chat**: Returns hardcoded responses based on keyword matching
- **Dashboard**: Shows static chart data
- **All pages**: Use localStorage for any saved state

**Design Requirements:**

- Must maintain existing UI/UX (don't change component structure)
- Keep the royal purple theme (#6E56CF)
- Preserve all animations and transitions
- Maintain accessibility (WCAG 2.2 AA)

**Important Files to Preserve:**

- Don't modify: `components/figma/ImageWithFallback.tsx`
- Don't modify: `styles/globals.css` (design system)
- Don't modify: `components/ui/*` (shadcn components)

---

## 🔗 Backend API Endpoints I Need

Based on the frontend, I'll need these endpoints. Please help me map them to my existing backend or tell me what new endpoints to create:

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token (if applicable)
- `GET /api/auth/me` - Get current user

### **Dashboard**
- `GET /api/dashboard/executive` - Main dashboard data
- `GET /api/dashboard/metrics` - Key metrics summary

### **Live Metrics**
- `WS /ws/metrics` - WebSocket for real-time metrics
- `GET /api/metrics/current` - Current metrics snapshot (fallback)

### **AI Chat**
- `POST /api/ai/chat` - Send query, get response with chart data

### **Funnels**
- `GET /api/funnels` - List all funnels
- `POST /api/funnels` - Create new funnel
- `GET /api/funnels/:id` - Get funnel details
- `PUT /api/funnels/:id` - Update funnel
- `DELETE /api/funnels/:id` - Delete funnel

### **Cohorts**
- `GET /api/cohorts` - Get cohort analysis data

### **Revenue**
- `GET /api/revenue` - Revenue & P/L data

### **User Flows**
- `GET /api/flows` - User flow analysis

### **Retention**
- `GET /api/retention` - Retention analysis

---

## 💬 How to Help Me

Please respond with:

1. **Confirmation** you understand the project structure
2. **Questions** about my backend setup (if needed)
3. **Step 1** of the integration process with complete code
4. **Clear next steps** after Step 1 is complete

Let's start with **Phase 1** and **Phase 2** (setup + API client). Once those are working, we'll move to authentication and replacing mock data.

---

## 🎁 Bonus: If You Can Also Help With...

- Setting up proper TypeScript types for API responses
- Adding React Query / SWR for data fetching (if recommended)
- Setting up error boundaries
- Adding loading skeletons
- Implementing optimistic updates
- Setting up API response caching

---

**Ready to start! Please confirm you've reviewed the documentation and ask any clarifying questions about my backend setup.**

