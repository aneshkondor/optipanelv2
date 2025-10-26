# Deployment Guide

## Backend Deployment (Railway - Recommended)

### Why Railway?
- ✅ Free tier with $5/month credit
- ✅ Perfect for Node.js Express servers
- ✅ Auto-deploys from GitHub
- ✅ Persistent connections for webhooks
- ✅ Environment variables management
- ✅ Custom domains

### Steps to Deploy Backend on Railway:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select this repository

3. **Configure Environment Variables**
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add all environment variables from `.env`:
     ```
     VAPI_API_KEY=your_vapi_key
     VAPI_PHONE_NUMBER_ID=your_phone_id
     CLAUDE_API_KEY=your_claude_key
     PORT=3001
     NODE_ENV=production
     DEFAULT_CALL_NUMBER=+1234567890
     COMPANY_NAME=Your Company
     ```

4. **Deploy**
   - Railway will auto-detect your Node.js app
   - It will automatically run `npm install` and start your server
   - You'll get a public URL like: `https://your-app.up.railway.app`

5. **Update Webhook URLs**
   - In Vapi dashboard, update webhook URL to: `https://your-app.up.railway.app/api/webhooks/vapi`

### Railway Configuration (Optional)

Create `railway.json` in project root for custom settings:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node src/index.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## Frontend Deployment (Vercel - Perfect!)

### Why Vercel for Frontend?
- ✅ FREE for static sites
- ✅ Perfect for React/Vite apps
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy custom domains

### Steps to Deploy Frontend on Vercel:

1. **Prepare Frontend for Deployment**

   Update API URLs to use environment variable. Create `.env.production` in `frontend02/`:
   ```
   VITE_API_URL=https://your-backend.up.railway.app
   ```

2. **Update Frontend Code**

   Replace hardcoded `http://localhost:3001` with environment variable:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

   // Then use:
   fetch(`${API_URL}/api/ai/chat`, ...)
   ```

3. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend02` directory as root
   - Configure:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

4. **Add Environment Variable**
   - In Vercel project settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.up.railway.app`

5. **Deploy**
   - Click "Deploy"
   - You'll get a URL like: `https://your-app.vercel.app`

---

## Alternative Backend Options

### Option 2: Render (Also Great)
- Similar to Railway
- Free tier available
- https://render.com
- Steps are nearly identical to Railway

### Option 3: Fly.io (More Advanced)
- Free tier with 3 small VMs
- Global deployment
- Requires Docker knowledge
- https://fly.io

### Option 4: DigitalOcean App Platform
- $5/month
- Very reliable
- Good for production
- https://www.digitalocean.com/products/app-platform

---

## Dummy Website Deployment (Vercel)

The `dummy_website` can also be deployed on Vercel separately:

1. Deploy as separate Vercel project
2. Select `dummy_website` as root directory
3. Framework: Vite
4. Add environment variable:
   ```
   VITE_BACKEND_URL=https://your-backend.up.railway.app
   ```

---

## Complete Architecture After Deployment

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  dummy_website.vercel.app (E-commerce Demo)        │
│  ↓ sends metrics to                                │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  backend.up.railway.app (Node.js + Express)         │
│  - Receives metrics                                 │
│  - Analyzes with Claude AI                          │
│  - Triggers Vapi calls                              │
│  - Serves AI chat API                               │
│  ↓ makes calls via                                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Vapi.ai (Voice Call Service)                       │
│  - Makes actual phone calls                         │
│  - Realistic voice agent                            │
│  ↓ webhooks back to                                 │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  frontend02.vercel.app (Dashboard)                  │
│  - Metrics visualization                            │
│  - AI Chat with Claude                              │
│  - Engagement Monitor                               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Quick Deploy Checklist

### Backend (Railway):
- [ ] Push code to GitHub
- [ ] Create Railway account
- [ ] Create new project from GitHub repo
- [ ] Add all environment variables
- [ ] Verify deployment successful
- [ ] Copy deployed URL

### Frontend (Vercel):
- [ ] Update API URLs to use environment variable
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Select `frontend02` as root
- [ ] Add `VITE_API_URL` environment variable
- [ ] Deploy

### Dummy Website (Vercel):
- [ ] Create separate Vercel project
- [ ] Select `dummy_website` as root
- [ ] Add `VITE_BACKEND_URL` environment variable
- [ ] Deploy

---

## Testing Deployed Apps

1. **Test Backend**:
   ```bash
   curl https://your-backend.up.railway.app/health
   ```

2. **Test Frontend**:
   - Visit your Vercel URL
   - Open AI Chat
   - Try a query
   - Check that it calls backend successfully

3. **Test Integration**:
   - Visit dummy website
   - Browse products, add to cart
   - Remove items 3 times
   - Check backend logs for call trigger

---

## Troubleshooting

### Backend Issues:
- Check Railway logs in dashboard
- Verify all environment variables are set
- Ensure PORT is set correctly (Railway auto-assigns)

### Frontend Issues:
- Check browser console for API errors
- Verify VITE_API_URL is correct
- Ensure CORS is enabled on backend (already configured)

### CORS Issues:
If you get CORS errors, your backend already has CORS enabled (`app.use(cors())`), but you can make it more specific:
```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-dummy-website.vercel.app',
    'http://localhost:5173' // for local dev
  ]
}));
```

---

## Cost Summary

| Service | Free Tier | Paid |
|---------|-----------|------|
| Railway (Backend) | $5/month credits | $5/month after credits |
| Vercel (Frontend + Dummy) | Unlimited | Free for personal projects |
| Total | **~$0-5/month** | **$5/month** |

**All of this fits within free tiers for MVP/demo purposes!**