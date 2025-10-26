# 🚀 CalHacks Revenue Optimization Platform

> AI-powered revenue optimization platform with intelligent voice calling and real-time analytics

[![Deploy Backend](https://img.shields.io/badge/Deploy-Railway-blueviolet)](https://railway.app)
[![Deploy Frontend](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

## 📋 What Is This?

An intelligent B2B revenue optimization platform that:
- 📊 **Tracks user behavior** on your e-commerce site in real-time
- 🤖 **Uses Claude AI** to decide when to intervene with at-risk customers
- 📞 **Makes realistic voice calls** via Vapi with natural-sounding AI agents
- 💬 **AI Chat Interface** powered by Claude for instant business insights
- 📈 **Beautiful dashboards** with real-time metrics and analytics

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- API Keys: [Vapi](https://vapi.ai), [Anthropic Claude](https://anthropic.com), [OpenAI](https://openai.com)

### 1. Clone & Install
```bash
git clone https://github.com/a-khandel/calhacks-demo.git
cd calhacks-demo
npm install
cd frontend02 && npm install && cd ..
cd dummy_website && npm install && cd ..
```

### 2. Configure Environment
```bash
cp .env.example .env
# Add your API keys to .env
```

### 3. Start Everything
```bash
# Terminal 1 - Backend
node src/index.js

# Terminal 2 - Dashboard
cd frontend02 && npm run dev

# Terminal 3 - Demo E-commerce Site
cd dummy_website && npm run dev
```

📖 **Full Setup Guide**: [docs/setup/QUICKSTART.md](docs/setup/QUICKSTART.md)

---

## 📁 Project Structure

```
calhacks-demo/
├── 📂 src/                          # Backend (Node.js + Express)
│   ├── index.js                     # Main server
│   ├── services/
│   │   ├── aiChatService.js        # Claude AI chat integration
│   │   ├── claudeService.js        # AI decision engine
│   │   ├── vapiService.js          # Voice calling via Vapi
│   │   ├── engagementDetector.js   # User behavior analysis
│   │   └── metricsAggregator.js    # Real-time analytics
│   └── config/
│       └── vapi.config.js          # Voice agent configuration
│
├── 📂 frontend02/                   # Main Dashboard (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   └── app/
│   │   │       ├── AIChatPanel.tsx     # Claude AI chat interface
│   │   │       └── EngagementMonitor.tsx # User monitoring
│   │   └── contexts/
│   │       └── MetricsContext.tsx       # Real-time metrics
│   └── package.json
│
├── 📂 dummy_website/                # Demo E-commerce Site (React + Vite)
│   ├── src/
│   │   ├── services/
│   │   │   └── analyticsTracker.js  # Sends metrics to backend
│   │   └── pages/                   # E-commerce pages
│   └── package.json
│
├── 📂 docs/                         # Documentation
│   ├── deployment/                  # Deployment guides
│   │   ├── QUICK_DEPLOY.md         # 15-min deploy guide
│   │   ├── DEPLOYMENT.md           # Full deployment docs
│   │   └── GITHUB_SETUP.md         # GitHub setup
│   ├── setup/                       # Setup instructions
│   │   ├── QUICKSTART.md           # Quick start guide
│   │   └── SETUP_INSTRUCTIONS.md   # Detailed setup
│   ├── guides/                      # Feature guides
│   │   ├── DEMO_GUIDE.md           # How to demo the app
│   │   └── AUTO_CALL_TRIGGER_GUIDE.md
│   ├── technical/                   # Technical docs
│   └── PROJECT_STRUCTURE.md         # Architecture details
│
├── 📂 scripts/                      # Utility scripts
│   ├── START_BACKEND.sh            # Quick backend starter
│   └── test-quick.js               # Test script
│
├── 📂 config/                       # Configuration files
│   └── railway.json                # Railway deployment config
│
├── .env.example                     # Environment variables template
├── package.json                     # Backend dependencies
└── README.md                        # This file
```

---

## 🎯 Key Features

### 1. Real-Time User Tracking
- Monitors user behavior on e-commerce site
- Tracks cart actions, page views, engagement
- Detects abandonment patterns

### 2. AI-Powered Decision Making
- Claude AI analyzes user behavior
- Intelligent intervention timing
- Personalized outreach strategies

### 3. Realistic Voice Calls
- Natural-sounding AI agent (Sarah)
- Office background sounds for realism
- Context-aware conversation scripts
- Handles objections and questions

### 4. AI Chat Interface (OptiPanel AI)
- Ask questions about your data
- Get instant insights and visualizations
- Generate charts automatically
- Save graphs to dashboard

### 5. Beautiful Dashboards
- Real-time metrics visualization
- User engagement monitoring
- Executive dashboard with custom widgets

---

## 🚀 Deployment

### Quick Deploy (15 minutes)

1. **Backend** → Deploy to Railway
2. **Frontend Dashboard** → Deploy to Vercel
3. **Demo Site** → Deploy to Vercel (separate project)

📖 **Step-by-Step**: [docs/deployment/QUICK_DEPLOY.md](docs/deployment/QUICK_DEPLOY.md)

### Cost: $0/month
- Railway: FREE ($5 credits)
- Vercel: FREE (unlimited for personal projects)

---

## 📚 Documentation

### Getting Started
- [Quick Start Guide](docs/setup/QUICKSTART.md) - Get running in 5 minutes
- [Setup Instructions](docs/setup/SETUP_INSTRUCTIONS.md) - Detailed setup
- [Demo Guide](docs/guides/DEMO_GUIDE.md) - How to demo the platform

### Deployment
- [Quick Deploy (15 min)](docs/deployment/QUICK_DEPLOY.md) - Fast deployment
- [Full Deployment Guide](docs/deployment/DEPLOYMENT.md) - All options
- [GitHub Setup](docs/deployment/GITHUB_SETUP.md) - Repository setup

### Technical
- [Project Structure](docs/PROJECT_STRUCTURE.md) - Architecture details
- [Frontend Integration](docs/technical/FRONTEND_INTEGRATION.md) - Frontend docs
- [What's New](docs/technical/WHATS_NEW.md) - Recent updates

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js + Express
- **AI**: Claude 3.5 Sonnet (Anthropic)
- **Voice**: Vapi.ai + ElevenLabs + OpenAI GPT-4
- **Real-time**: WebSocket-like polling

### Frontend
- **Framework**: React + TypeScript + Vite
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **Charts**: Recharts
- **State**: React Context API

### Deployment
- **Backend**: Railway
- **Frontend**: Vercel
- **Demo Site**: Vercel

---

## 🎬 How It Works

```
┌─────────────────────────────────────────────────────────┐
│ 1. User browses demo e-commerce site                    │
│    - Adds items to cart                                 │
│    - Removes items (showing hesitation)                 │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Analytics tracker sends metrics to backend           │
│    - Cart actions, page views, engagement               │
└─────────────┬───────────────────────────────��───────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Backend analyzes behavior with Claude AI             │
│    - Detects 3rd cart removal = critical risk           │
│    - AI decides: "Call now!"                            │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Vapi makes realistic voice call                      │
│    - Natural AI agent with office background sounds     │
│    - Personalized script based on user behavior         │
│    - Offers help, discount, or assistance               │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Dashboard shows everything in real-time              │
│    - User metrics, call status, engagement trends       │
│    - AI chat for instant insights                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Environment Variables

```bash
# Vapi (Voice Calling)
VAPI_API_KEY=your_vapi_api_key
VAPI_PHONE_NUMBER_ID=your_phone_number_id
DEFAULT_CALL_NUMBER=+1234567890

# Anthropic Claude (AI)
CLAUDE_API_KEY=your_claude_api_key

# OpenAI (used by Vapi)
OPENAI_API_KEY=your_openai_api_key

# Server
PORT=3001
NODE_ENV=development
COMPANY_NAME=YourCompany
```

Get API keys:
- Vapi: https://vapi.ai
- Claude: https://console.anthropic.com
- OpenAI: https://platform.openai.com

---

## 🧪 Testing

### Test the Call Trigger
1. Visit demo e-commerce site: http://localhost:5173
2. Add items to cart
3. Remove items from cart **3 times**
4. Check backend console - should see: `🚨 THIRD CART REMOVAL DETECTED`
5. Voice call will be initiated!

📖 **Full Test Guide**: [docs/guides/TEST_AUTO_TRIGGER.md](docs/guides/TEST_AUTO_TRIGGER.md)

---

## 🤝 Contributing

This is a CalHacks demo project. Feel free to fork and experiment!

---

## 📝 License

MIT

---

## 🔗 Links

- **Repository**: https://github.com/a-khandel/calhacks-demo
- **Deployment Guides**: [docs/deployment/](docs/deployment/)
- **Technical Docs**: [docs/technical/](docs/technical/)

---

## 💡 Need Help?

1. Check [docs/setup/QUICKSTART.md](docs/setup/QUICKSTART.md)
2. Review [docs/guides/DEMO_GUIDE.md](docs/guides/DEMO_GUIDE.md)
3. See [docs/deployment/DEPLOYMENT.md](docs/deployment/DEPLOYMENT.md)

---

**Built for CalHacks** 🎉