# 🔌 Backend Integration Guide

## 📋 Overview

This guide shows how to connect the frontend to your existing backend. The app currently uses mock data in specific locations - this document identifies where to replace mocks with real API calls.

---

## 🏗️ Architecture

### **Current Setup** (Frontend Only)
```
Frontend (Vite + React)
├── Mock data generation
├── localStorage for persistence
└── sessionStorage for cross-page state
```

### **Target Setup** (Full Stack)
```
Frontend (Vite + React) ←→ Backend API
├── REST API calls          ├── Express/FastAPI/etc.
├── WebSocket connection    ├── WebSocket server
└── JWT/Session auth        └── Database
```

---

## 🎯 Mock Data Locations (Replace These)

### **1. Live Metrics** 
**File:** `src/services/metricsService.ts`  
**Current:** Generates random data every 5 seconds  
**Replace with:** WebSocket or polling endpoint

```typescript
// CURRENT (Mock)
export const metricsService = {
  subscribe: (callback: (data: MetricsData) => void) => {
    const interval = setInterval(() => {
      const mockData = generateMockData(); // ← MOCK
      callback(mockData);
    }, 5000);
    return () => clearInterval(interval);
  }
};

// REPLACE WITH (Real API)
export const metricsService = {
  subscribe: (callback: (data: MetricsData) => void) => {
    const ws = new WebSocket('ws://localhost:3000/metrics');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };
    return () => ws.close();
  }
};
```

**Endpoint suggestion:** `ws://your-backend/metrics`

---

### **2. AI Chat (OptiPanel AI)**
**File:** `src/components/app/AIChatPanel.tsx`  
**Function:** `generateMockResponse()` (line ~350)  
**Current:** Returns hardcoded responses  
**Replace with:** POST to AI backend

```typescript
// CURRENT (Mock)
function generateMockResponse(query: string): Message {
  // Hardcoded responses based on keywords
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: 'Mock response...',
    chart: { /* mock chart data */ }
  };
}

// REPLACE WITH (Real API)
async function getAIResponse(query: string): Promise<Message> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  
  return {
    id: data.id,
    role: 'assistant',
    content: data.content,
    chart: data.chart,
    timestamp: new Date(),
  };
}
```

**Endpoint suggestion:** `POST /api/ai/chat`  
**Payload:** `{ query: string, context?: any }`  
**Response:** `{ id: string, content: string, chart?: {...} }`

---

### **3. Executive Dashboard**
**File:** `src/components/app/ExecutiveDashboard.tsx`  
**Current:** Hardcoded chart data  
**Replace with:** Dashboard API endpoint

```typescript
// REPLACE WITH
const [dashboardData, setDashboardData] = useState(null);

useEffect(() => {
  async function fetchDashboard() {
    const response = await fetch('/api/dashboard/executive');
    const data = await response.json();
    setDashboardData(data);
  }
  fetchDashboard();
}, []);
```

**Endpoint suggestion:** `GET /api/dashboard/executive`

---

### **4. Funnels**
**File:** `src/components/app/FunnelsPage.tsx`  
**Current:** Static funnel data  
**Replace with:** Funnels CRUD API

**Endpoints needed:**
- `GET /api/funnels` - List all funnels
- `POST /api/funnels` - Create funnel
- `GET /api/funnels/:id` - Get funnel data
- `PUT /api/funnels/:id` - Update funnel
- `DELETE /api/funnels/:id` - Delete funnel

---

### **5. Cohorts**
**File:** `src/components/app/CohortsPage.tsx`  
**Endpoint suggestion:** `GET /api/cohorts`

---

### **6. Revenue & P/L**
**File:** `src/components/app/RevenuePage.tsx`  
**Endpoint suggestion:** `GET /api/revenue`

---

### **7. User Flows**
**File:** `src/components/app/FlowsPage.tsx`  
**Endpoint suggestion:** `GET /api/flows`

---

## 🔐 Authentication Integration

### **Current State**
No authentication - all users see the same data.

### **Add Authentication**

**1. Create auth service** (`src/services/auth.ts`):
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) throw new Error('Login failed');
  
  const { user, token } = await response.json();
  localStorage.setItem('authToken', token);
  return user;
}

export async function logout(): Promise<void> {
  localStorage.removeItem('authToken');
  await fetch('/api/auth/logout', { method: 'POST' });
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}
```

**2. Create auth context** (`src/contexts/AuthContext.tsx`):
```typescript
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, login as apiLogin, logout as apiLogout } from '../services/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const user = await apiLogin(email, password);
    setUser(user);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**3. Update App.tsx:**
```typescript
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DndProvider backend={HTML5Backend}>
          {/* existing app code */}
        </DndProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

---

## 🌐 API Client Setup

### **Create centralized API client** (`src/services/apiClient.ts`):

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
```

### **Usage example:**
```typescript
import { apiClient } from '../services/apiClient';

// In your component
const dashboard = await apiClient.get('/dashboard/executive');
const newFunnel = await apiClient.post('/funnels', { name: 'Signup Flow' });
```

---

## 🔄 WebSocket Integration

### **For Live Metrics** (`src/contexts/MetricsContext.tsx`):

```typescript
import { createContext, useContext, useEffect, useState } from 'react';

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
    const ws = new WebSocket(`${wsUrl}/metrics`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    return () => ws.close();
  }, []);

  return (
    <MetricsContext.Provider value={{ metrics, isConnected }}>
      {children}
    </MetricsContext.Provider>
  );
}
```

---

## 🚀 Deployment Options

### **Option 1: Separate Deployments**
- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront
- **Backend:** Heroku, Railway, AWS EC2, DigitalOcean
- **Communication:** CORS enabled, API calls via fetch

**CORS setup (Backend):**
```javascript
// Express.js example
const cors = require('cors');
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true,
}));
```

---

### **Option 2: Backend Serves Frontend**

**Build frontend:**
```bash
cd frontend
npm run build
# Creates dist/ folder
```

**Serve from backend (Express.js example):**
```javascript
const express = require('express');
const path = require('path');
const app = express();

// API routes
app.use('/api', apiRouter);

// Serve static frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(3000);
```

---

### **Option 3: Vite Proxy (Development)**

**Update `vite.config.ts`:**
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true,
      },
    },
  },
});
```

Now frontend calls to `/api/*` are proxied to backend at `:3000`.

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  React Frontend │
│  (Port 5173)    │
└────────┬────────┘
         │
         │ HTTP/WS
         ▼
┌─────────────────┐
│   Backend API   │
│  (Port 3000)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Database     │
│ (PostgreSQL/    │
│  MongoDB/etc)   │
└─────────────────┘
```

---

## 🧪 Testing Backend Integration

### **1. Test API Connection**
```typescript
// src/services/__tests__/api.test.ts
async function testConnection() {
  try {
    const response = await fetch('/api/health');
    console.log('Backend connected:', response.ok);
  } catch (error) {
    console.error('Backend not reachable:', error);
  }
}
```

### **2. Test WebSocket**
```typescript
function testWebSocket() {
  const ws = new WebSocket('ws://localhost:3000/metrics');
  ws.onopen = () => console.log('WS connected');
  ws.onmessage = (e) => console.log('WS message:', e.data);
  ws.onerror = (e) => console.error('WS error:', e);
}
```

---

## 💡 AI Integration Tips

**Prompt for AI to help integrate:**

```
I have a React frontend with mock data in these locations:
1. src/services/metricsService.ts - Live metrics (currently generates random data)
2. src/components/app/AIChatPanel.tsx - AI chat (generateMockResponse function)
3. src/components/app/ExecutiveDashboard.tsx - Dashboard charts

My backend is [Express.js/FastAPI/etc.] running on port 3000.

Help me:
1. Create an API client service (src/services/apiClient.ts)
2. Replace mock data with API calls
3. Add WebSocket for live metrics
4. Add authentication with JWT
5. Set up CORS or proxy configuration
```

Provide this guide + your backend API documentation for best results.

---

## ✅ Integration Checklist

- [ ] Created `src/services/apiClient.ts`
- [ ] Created `src/services/auth.ts`
- [ ] Created `src/contexts/AuthContext.tsx`
- [ ] Replaced mock data in `metricsService.ts`
- [ ] Replaced `generateMockResponse()` in `AIChatPanel.tsx`
- [ ] Updated dashboard to fetch from API
- [ ] Added WebSocket for live metrics
- [ ] Configured CORS or Vite proxy
- [ ] Set up environment variables (`.env.local`)
- [ ] Tested API connection
- [ ] Tested WebSocket connection
- [ ] Tested authentication flow
- [ ] Updated all pages to use real data
- [ ] Error handling added
- [ ] Loading states added

---

## 📚 API Endpoint Summary

| Feature | Method | Endpoint | Purpose |
|---------|--------|----------|---------|
| Auth | POST | `/api/auth/login` | User login |
| Auth | POST | `/api/auth/logout` | User logout |
| Dashboard | GET | `/api/dashboard/executive` | Main dashboard data |
| Metrics | WS | `/ws/metrics` | Live metrics stream |
| AI Chat | POST | `/api/ai/chat` | AI query |
| Funnels | GET | `/api/funnels` | List funnels |
| Funnels | POST | `/api/funnels` | Create funnel |
| Cohorts | GET | `/api/cohorts` | Cohort analysis |
| Revenue | GET | `/api/revenue` | Revenue & P/L |
| Flows | GET | `/api/flows` | User flows |

---

**Last Updated:** October 26, 2025  
**Related:** See `SETUP_INSTRUCTIONS.md` for installation
