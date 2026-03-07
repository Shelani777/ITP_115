# 🔧 Fix Render Frontend "Missing script: build" Error

## ❌ The Error You Got:

```
==> Running build command 'npm install; npm run build'...
added 484 packages in 7s
npm error Missing script: "build"
==> Build failed 😞
```

## 🎯 Root Cause:

Your Render Frontend Static Site didn't have **Root Directory** set to `frontend`. It tried to build from the root directory instead of the frontend directory.

---

## ✅ SOLUTION: Fix Render Settings

### Step 1: Go to Your Render Frontend Service

1. Log in to **[render.com](https://render.com)**
2. Go to your **Frontend Service Dashboard**
3. Click the **"Settings"** tab

### Step 2: Update These 4 Settings

| Setting               | Current                      | Should Be                         |
| --------------------- | ---------------------------- | --------------------------------- |
| **Root Directory**    | (empty)                      | `frontend` ✅                     |
| **Build Command**     | `npm install; npm run build` | `npm install && npm run build` ✅ |
| **Publish Directory** | `build`                      | `build` ✅                        |
| **Environment**       | Check                        | Add `REACT_APP_API_URL` ✅        |

### Step 3: Add/Check Environment Variables

In the **Environment** section, add:

```
REACT_APP_API_URL = https://your-backend-url.onrender.com
```

Or keep it empty for now if backend not deployed yet.

### Step 4: Manual Deploy

1. Click **"Manual Deploy"** button
2. Choose **"Clear build cache & deploy"**
3. Watch the logs - should succeed now!

---

## 📋 Complete Frontend Configuration on Render

```
Name:                   millanium-werksatt-frontend
Environment:            Static Site
Repository:             AuthnSapuarachchi/ITP-Project
Branch:                 main (or your branch)

✅ ROOT DIRECTORY:      frontend          ← MOST IMPORTANT!
✅ BUILD COMMAND:       npm install && npm run build
✅ PUBLISH DIRECTORY:   build
✅ ENVIRONMENT VAR:     REACT_APP_API_URL = (backend URL)
```

---

## 🚀 Why This Happens

**What went wrong:**

```
Render tries to run from ROOT directory:
  /ITP-Project/
    └─ package.json (root - doesn't have build script for static site)
    └─ frontend/
       └─ package.json (HAS build script but wasn't used)

Result: "Missing script: build" ❌
```

**What should happen:**

```
Render should run from FRONTEND directory:
  /ITP-Project/
    └─ frontend/
       └─ package.json (HAS build script) ✅

Result: Build succeeds! ✅
```

---

## ✨ Files That Matter

```
✅ frontend/package.json  → HAS "build" script
✅ Root package.json      → Has "build": "cd frontend && npm run build"

For Render:
✅ Root Directory must be: "frontend"
✅ Then Render will find: frontend/package.json
✅ And can run: npm run build
```

---

## ⏱️ Time to Fix

- 1 minute: Go to Render settings
- 30 seconds: Change Root Directory to "frontend"
- 30 seconds: Update Build Command
- 5-7 minutes: Render rebuilds
- **Total: ~8 minutes**

---

## 🎯 Step-by-Step Screenshots (What to Do)

### In Render Dashboard:

1. **Click Settings Tab**

   ```
   Dashboard → Frontend Service → Settings
   ```

2. **Find "Root Directory" field**

   ```
   Change FROM: (empty or /)
   Change TO:   frontend
   ```

3. **Find "Build Command" field**

   ```
   Change FROM: npm install; npm run build
   Change TO:   npm install && npm run build
   ```

4. **Scroll Down & Click "Manual Deploy"**

   ```
   → "Clear build cache & deploy"
   → Wait 5-7 minutes
   ```

5. **Check Logs**
   ```
   Should see:
   ✓ npm packages installed
   ✓ react-scripts build
   ✓ Build succeeded
   ✓ Deploy successful
   ```

---

## ✅ Verification Checklist

After fixing:

- [ ] Root Directory set to: `frontend`
- [ ] Build Command shows: `npm install && npm run build`
- [ ] Publish Directory is: `build`
- [ ] Manual Deploy clicked
- [ ] Build logs show no errors
- [ ] Service URL shows "Live"
- [ ] Frontend loads when you visit the URL
- [ ] Frontend can reach backend API

---

## 🐛 If Still Getting Error

**Try these:**

1. **Clear Cache & Deploy**

   - Settings → Click "Clear build cache & deploy"
   - This forces a complete rebuild

2. **Check You're Editing RIGHT Service**

   - Make sure you're in Frontend Service (Static Site)
   - NOT Backend Service (Web Service)

3. **Verify Root Directory is Set**

   ```
   ❌ WRONG: (empty) or / or frontend/ or /frontend/
   ✅ RIGHT: frontend
   ```

4. **Use && Not ;**

   ```
   ❌ WRONG: npm install; npm run build
   ✅ RIGHT: npm install && npm run build
   ```

5. **Check Branch Name**
   - Is your code on `main` branch?
   - Or `Authn's-Branch`?
   - Set the correct branch in Render settings

---

## 📝 Current Repository Info

```
Repository:     ITP-Project
Owner:          AuthnSapuarachchi
Current Branch: Authn's-Branch
Remote:         https://github.com/AuthnSapuarachchi/ITP-Project.git

Frontend Package.json:  ✅ HAS build script
Root Package.json:      ✅ Has build command for frontend
Node Version:           22.16.0 (Render default - OK)

What was wrong:
❌ Root Directory not set in Render Static Site settings
```

---

## 🎉 Expected Result

After applying fix:

```
==> Running build command 'npm install && npm run build'...
added 484 packages in 7s

> react-scripts build
Creating an optimized production build...
The build folder is ready to be deployed.

==> Build succeeded! ✅
==> Deploying...
==> Frontend live at: https://millanium-werksatt-frontend.onrender.com
```

---

## 💡 Remember

The error **"Missing script: build"** happens because:

1. Render didn't know to look in `frontend/` directory
2. So it looked at root `package.json`
3. Root package.json doesn't have a standalone build script
4. It tells frontend to build: `"build": "cd frontend && npm run build"`

**But Render was running in root, not from a script that could do `cd frontend`**

Setting **Root Directory: frontend** tells Render: "Hey, start from the frontend folder, so when I run `npm run build`, I use `frontend/package.json`"

---

## 🚀 DO THIS NOW:

1. Go to render.com/dashboard
2. Click your Frontend Service (Static Site)
3. Click Settings tab
4. Set Root Directory to: **frontend**
5. Update Build Command to: **npm install && npm run build**
6. Scroll down and click: **"Manual Deploy"**
7. Wait 5-7 minutes
8. Check if deployment succeeds
9. If yes → celebrate! 🎉
10. If no → send me the error from the logs

**Let me know when you've made these changes and we'll test it!**
