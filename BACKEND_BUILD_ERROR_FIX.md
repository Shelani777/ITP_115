# 🔧 Fix Backend "Missing script: build" Error on Render

## ❌ The Exact Error You Got:

```
==> Running build command 'npm install; npm run build'...
added 484 packages in 7s
npm error Missing script: "build"
==> Build failed 😞
```

## 🎯 Root Cause (100% Sure):

Your **Backend Web Service on Render** doesn't have **Root Directory** set to `backend`.

**What's happening:**

1. Render clones your repo ✅
2. Tries to run: `npm install; npm run build` ❌
3. Looks in ROOT `package.json` for "build" script ❌
4. Root package.json has: `"build": "cd frontend && npm run build"` ❌
5. But you're deploying BACKEND, not frontend ❌
6. ERROR: "Missing script: build" ❌

---

## ✅ SOLUTION (2 Minutes)

### Step 1: Go to Render Backend Service

1. Log in to **[render.com](https://render.com)**
2. Go to **Dashboard**
3. Click on **Backend Service** (Web Service, not Static Site)
4. Click **Settings** tab

### Step 2: Fix Root Directory

Find the **Root Directory** field and change it:

```
FROM: (empty) or / or something else
TO:   backend
```

**IMPORTANT:** Write it EXACTLY as: `backend` (no slashes!)

### Step 3: Verify Build Command

Make sure Build Command is:

```
npm install
```

(NOT: `npm install; npm run build`)

### Step 4: Verify Start Command

Make sure Start Command is:

```
npm start
```

### Step 5: Deploy

1. Scroll to bottom
2. Click **"Manual Deploy"**
3. Choose **"Clear build cache & deploy"**
4. Wait 5-7 minutes ⏳

---

## 📋 Correct Backend Configuration

```
Service Name:          millanium-werksatt-backend
Type:                  Web Service (not Static Site!)
Repository:            AuthnSapuarachchi/ITP-Project
Branch:                main (or Authn's-Branch)

✅ Root Directory:     backend          ← THIS IS THE FIX!
✅ Build Command:      npm install      ← NOT "build"
✅ Start Command:      npm start        ← MUST BE THIS
```

---

## 🎬 Step-by-Step on Render Dashboard

### Location of Root Directory Field:

```
Your Backend Service Dashboard
    ↓
Click "Settings" tab (top right)
    ↓
Scroll down, find these fields:
    ├─ Name: millanium-werksatt-backend
    ├─ Root Directory: (empty or wrong value) ← CHANGE THIS
    ├─ Build Command: npm install
    ├─ Start Command: npm start
    └─ Environment: (section below)
```

### What to Change:

```
BEFORE:
┌─────────────────────────┐
│ Root Directory: /       │  ← WRONG!
│ Build Command: npm... . │
│ Start Command: npm s... │
└─────────────────────────┘

AFTER:
┌─────────────────────────┐
│ Root Directory: backend │  ← CORRECT!
│ Build Command: npm... . │
│ Start Command: npm s... │
└─────────────────────────┘
```

---

## ✨ Why This Fixes It

**Before (Wrong):**

```
Render runs from ROOT directory:
  /ITP-Project/
    └─ package.json (has "build" but for frontend)
    └─ backend/
       └─ package.json (has no "build" script)

When Render tries: npm run build
It looks at root/package.json
Sees: "build": "cd frontend && npm run build"
But you're in backend folder context
ERROR! ❌
```

**After (Correct):**

```
Render runs from BACKEND directory:
  /ITP-Project/backend/
    └─ package.json (has "start" script)

When Render tries: npm start
It uses: backend/package.json
Sees: "start": "node server.js"
SUCCESS! ✅
```

---

## 🚀 Expected Success Message

After fix and rebuild, you should see:

```
==> Cloning from https://github.com/AuthnSapuarachchi/ITP-Project
==> Checking out commit 5817ae4943cddc79e48628b7ed7bf08f843dafd3
==> Using Node.js version 22.16.0
==> Running build command 'npm install'...
added 484 packages in 7s

✓ npm packages installed successfully
✓ Build succeeded
✓ Starting server...
✓ Server running on port 5000
✓ Connected to MongoDB
✓ Backend service is LIVE at: https://millanium-werksatt-backend.onrender.com
```

---

## ✅ Checklist After Fix

- [ ] Root Directory set to: `backend`
- [ ] Build Command is: `npm install`
- [ ] Start Command is: `npm start`
- [ ] All environment variables added (14 total)
- [ ] Clicked "Manual Deploy"
- [ ] Build logs show success
- [ ] Service shows as "Live"
- [ ] Can access: https://millanium-werksatt-backend.onrender.com/api/health

---

## 🐛 Troubleshooting

### Still Getting "Missing script: build"?

1. **Verify you're editing BACKEND service:**

   - Should say "Web Service" (not "Static Site")
   - Click the correct service name

2. **Check Root Directory is set correctly:**

   - Value should be: `backend`
   - NOT: `/backend/` or `backend/` or `/backend`
   - Just: `backend`

3. **Try this:**

   - Click "Clear build cache & deploy"
   - This forces complete rebuild

4. **If still failing:**
   - Delete the service
   - Create new Web Service
   - Very carefully set Root Directory to: `backend`

### Build Succeeds But Server Crashes?

1. Check environment variables are all set
2. Especially: `MONGODB_URI`, `JWT_SECRET`
3. Check logs for specific error message
4. Add them if missing

### Can't Find Root Directory Field?

1. Make sure you're in Backend Service (Web Service)
2. Click "Settings" tab
3. Should be in top section with other fields
4. If not visible, scroll up/down
5. Screenshot and I can help pinpoint it

---

## 📊 Your Current Problem

```
Error Location:    Backend Service Build
Error Type:        npm Missing script: build
Root Cause:        Root Directory not set to "backend"
Severity:          HIGH - Blocking deployment
Solution:          Change Root Directory setting
Time to Fix:       2 minutes
```

---

## 🎯 DO THIS NOW:

1. Open [render.com/dashboard](https://render.com/dashboard)
2. Click your **Backend Service**
3. Click **Settings**
4. Find **Root Directory** field
5. Change it to: **backend**
6. Scroll down and click **"Manual Deploy"**
7. Wait 5-7 minutes
8. Check if it says "✓ Deploy successful"
9. If yes → BACKEND IS LIVE! 🎉
10. If no → Send me the new error

**Do this right now and let me know when backend is fixed! 💪**
