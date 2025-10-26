# Super Simple Guide

## How It Works Now

Click "Start Call Now" → Call is made to +14155797753

That's it. No popups, no verifications, just a direct call.

## Setup (One Time)

Backend is already running on port 3001 ✅

If it's not, run:
```bash
cd /Users/aryankhandelwal/Desktop/calhacks
npm start
```

## To Make a Call

1. Open your frontend (http://localhost:3000)
2. Go to "AI Engagement Monitor"
3. Click on any user → "Initiate AI Outreach"
4. Click "Start Call Now"
5. Done - phone will ring at +14155797753

## What Phone Number Gets Called?

All calls go to: **+14155797753**

To change it, edit `/Users/aryankhandelwal/Desktop/calhacks/.env`:
```env
DEFAULT_CALL_NUMBER=+1YOUR_NUMBER_HERE
```

Then restart backend.

## Troubleshooting

**Button doesn't work:**
- Check browser console (F12) for errors
- Make sure backend is running on port 3001

**Backend not running:**
```bash
cd /Users/aryankhandelwal/Desktop/calhacks
npm start
```

That's it!
