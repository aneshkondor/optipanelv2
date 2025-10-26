# ✅ FIXED - How to Run Everything

## The Problem
Your **frontend was running on port 3000**, and the backend also wanted port 3000, causing a conflict.

## The Solution
- **Frontend**: Runs on `http://localhost:3000` (Vite dev server)
- **Backend**: Now runs on `http://localhost:3001` (Express API server)

## Step-by-Step to Get It Working

### 1. Start Backend Server

Open a **NEW terminal** and run:

```bash
cd /Users/aryankhandelwal/Desktop/calhacks
npm start
```

OR use the script:

```bash
./START_BACKEND.sh
```

You should see:
```
🚀 Revenue Optimization Server Started
📍 Port: 3001
🌐 Health check: http://localhost:3001/health
```

**✅ KEEP THIS RUNNING!**

### 2. Verify Backend is Working

Open browser: **http://localhost:3001/health**

You should see:
```json
{"status":"ok","timestamp":"2025-..."}
```

### 3. Your Frontend is Already Running

Your frontend is on: **http://localhost:3000**

(That's the Vite server you already have running)

### 4. Test the Call!

1. Go to **http://localhost:3000** (your frontend)
2. Navigate to **AI Engagement Monitor**
3. Click on **Sarah Chen** → "Initiate AI Outreach"
4. Click **"Start Call Now"**
5. **Answer your phone at +14155797753!**

## Quick Test

Run this in another terminal to verify backend is responding:

```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok","timestamp":"..."}`

## What Changed

### Backend (.env)
```env
PORT=3001  # Changed from 3000 to 3001
```

### Frontend (EngagementMonitor.tsx)
```typescript
fetch('http://localhost:3001/api/frontend/analyze-user', {  // Changed from 3000 to 3001
```

### Test Script (test-frontend-integration.js)
If you use the test script, update this line:
```javascript
const API_URL = 'http://localhost:3001';  // Change from 3000 to 3001
```

## Port Summary

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 3000 | http://localhost:3000 |
| Backend (Express) | 3001 | http://localhost:3001 |
| Vapi API | N/A | External service |

## Troubleshooting

### "Backend not responding"

Check if backend is running:
```bash
lsof -i :3001
```

If nothing shows up, backend isn't running. Start it:
```bash
cd /Users/aryankhandelwal/Desktop/calhacks
npm start
```

### "Port 3001 already in use"

Kill the process using port 3001:
```bash
lsof -ti :3001 | xargs kill -9
```

Then start backend again.

### "Frontend can't connect"

Make sure frontend is calling **http://localhost:3001** (not 3000).

Check browser console (F12) for the fetch URL.

### "Still getting errors"

1. Stop everything (Ctrl+C in all terminals)
2. Start backend first:
   ```bash
   cd /Users/aryankhandelwal/Desktop/calhacks
   npm start
   ```
3. Start frontend second:
   ```bash
   cd frontend
   npm run dev
   ```

## Success Checklist

- ✅ Backend running on port 3001
- ✅ Frontend running on port 3000
- ✅ http://localhost:3001/health returns JSON
- ✅ http://localhost:3000 shows your dashboard
- ✅ "Start Call Now" button works
- ✅ Phone rings at +14155797753

## Common Commands

```bash
# Start backend
cd /Users/aryankhandelwal/Desktop/calhacks
npm start

# Start frontend (if not running)
cd /Users/aryankhandelwal/Desktop/calhacks/frontend
npm run dev

# Test backend
curl http://localhost:3001/health

# Test call (command line)
curl -X POST http://localhost:3001/api/frontend/analyze-user \
  -H "Content-Type: application/json" \
  -d '{"id":"test","name":"Test","company":"Test","plan":"Pro","engagementScore":30,"previousScore":85,"status":"critical","metrics":{"dailyActiveUse":20,"weeklyActiveUse":30,"monthlyActiveUse":40,"featureAdoption":25,"dataQuality":60,"teamCollaboration":15},"engagementTrend":[{"date":"Oct 1","score":85},{"date":"Oct 25","score":30}]}'
```

## That's It!

Now when you click "Start Call Now":
1. Frontend (port 3000) calls → Backend (port 3001)
2. Backend analyzes data
3. Backend calls Vapi API
4. Vapi calls +14155797753
5. You answer and talk to AI!

🎉 Everything should work now!
