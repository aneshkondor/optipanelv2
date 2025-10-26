# 🚀 Quick Deployment Guide

## Deploy in 15 Minutes

### Step 1: Deploy Backend (Railway) - 5 minutes

1. Go to https://railway.app and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add environment variables (click **Variables** tab):
   ```
   VAPI_API_KEY=your_key_here
   VAPI_PHONE_NUMBER_ID=your_id_here
   CLAUDE_API_KEY=your_key_here
   DEFAULT_CALL_NUMBER=+1234567890
   COMPANY_NAME=YourCompany
   PORT=3001
   NODE_ENV=production
   ```
5. Railway auto-detects Node.js and deploys!
6. **Copy your Railway URL** (looks like: `https://your-app.up.railway.app`)

---

### Step 2: Deploy Frontend Dashboard (Vercel) - 5 minutes

1. Go to https://vercel.com and sign up with GitHub
2. Click **"New Project"** → Import your repo
3. **IMPORTANT:** Set **Root Directory** to `frontend02`
4. Framework will auto-detect as **Vite**
5. Add environment variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-app.up.railway.app` (from Step 1)
6. Click **Deploy**!

---

### Step 3: Deploy Demo E-commerce Site (Vercel) - 5 minutes

1. In Vercel, create **another** new project
2. Import same GitHub repo
3. **IMPORTANT:** Set **Root Directory** to `dummy_website`
4. Framework auto-detects as **Vite**
5. Add environment variable:
   - Name: `VITE_BACKEND_URL`
   - Value: `https://your-app.up.railway.app` (from Step 1)
6. Click **Deploy**!

---

## ✅ That's It!

You now have:
- ✅ Backend running on Railway
- ✅ Dashboard running on Vercel
- ✅ Demo site running on Vercel

### Testing Your Deployment:

1. **Visit your demo e-commerce site** (Vercel URL from Step 3)
2. Browse products, add to cart
3. Remove items from cart **3 times**
4. Check backend logs in Railway - should trigger a call!
5. Visit your dashboard (Vercel URL from Step 2)
6. Try the AI Chat panel

---

## Troubleshooting

### Frontend can't connect to backend?
- Check that `VITE_API_URL` in Vercel matches your Railway URL exactly
- Make sure Railway URL includes `https://` and has NO trailing slash

### Backend not starting?
- Check Railway logs for errors
- Verify all environment variables are set
- Make sure VAPI and Claude API keys are valid

### Calls not working?
- Check Railway logs - look for `📞 Initiating call...`
- Verify VAPI_API_KEY and VAPI_PHONE_NUMBER_ID are correct
- Check DEFAULT_CALL_NUMBER is a valid phone number with country code

---

## Cost

| Service | Cost |
|---------|------|
| Railway (Backend) | $5/month credits (FREE) |
| Vercel (Both Frontends) | FREE forever |
| **Total** | **$0/month** |

---

## Need Help?

Check the full [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions and alternatives.