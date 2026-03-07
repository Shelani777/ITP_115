# 🔧 Backend Deployment Error - Let's Fix It

## ❓ What Error Did You Get?

You mentioned backend deployment has an error. Common errors include:

### 1️⃣ "Missing script: build"

```
npm error Missing script: "build"
npm error   npm run
```

**Cause:** Root Directory not set correctly in Render
**Fix:** Set Root Directory to `backend`

### 2️⃣ MongoDB Connection Error

```
MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017
```

**Cause:** MongoDB credentials not set in environment variables
**Fix:** Add MONGODB_URI to Render environment

### 3️⃣ Missing Environment Variables

```
Error: MONGODB_URI is not defined
Error: JWT_SECRET is not defined
```

**Cause:** Environment variables not added to Render
**Fix:** Add all 14 environment variables

### 4️⃣ Port Already in Use

```
Error: listen EADDRINUSE :::5000
```

**Cause:** Port conflict
**Fix:** Render uses port 5000, should be fine

### 5️⃣ npm install Fails

```
npm error code ERESOLVE
npm error ERESOLVE unable to resolve dependency tree
```

**Cause:** Dependency conflicts
**Fix:** Update dependencies or use `npm install --legacy-peer-deps`

---

## 🎯 To Help You Fix It, I Need:

**Please copy and paste the EXACT error message you got from Render logs:**

```
(Send the full error text from Render dashboard)
```

---

## ⚡ Quick Backend Setup (Reference)

### Render Backend Settings Should Be:

```
Name:              millanium-werksatt-backend
Environment:       Node
Repository:        AuthnSapuarachchi/ITP-Project
Branch:            main (or Authn's-Branch)

✅ Root Directory: backend
✅ Build Command:  npm install
✅ Start Command:  npm start
```

### Environment Variables (14 Total):

```
NODE_ENV = production
PORT = 5000
MONGODB_URI = mongodb+srv://itpProject:itpProject@clusteritp.wd1qzuc.mongodb.net/?retryWrites=true&w=majority&appName=ClusterITP
JWT_SECRET = your_super_secret_jwt_key_here_make_it_very_long_and_complex
JWT_EXPIRE = 30d
CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret
SMTP_USER = yomalravinga.cr@gmail.com
SMTP_PASS = yckr aqou vivs ifkd
ADMIN_EMAIL = yomalravinga.cr@gmail.com
PAYPAL_MODE = sandbox
PAYPAL_CLIENT_ID = AQh3UDE9GlAEnFYBLKM4x6YB6U77rMRGpizAviaYbDnMvmODkpRqHvgUbkcT-id88anKpQpaTvac2eT7
PAYPAL_CLIENT_SECRET = EP8yPNJkdmdaZgz_7wrkta2D8VsZGZ1t0Wmkeu8UU8djPNcyiXUx2m8N4ZnJm_GJbjJNW_KQC9iIx6jv
FRONTEND_URL = http://localhost:3000 (update after frontend deployed)
```

---

## 📋 Backend Setup Checklist

- [ ] Repository connected: AuthnSapuarachchi/ITP-Project
- [ ] Root Directory set to: `backend`
- [ ] Build Command is: `npm install`
- [ ] Start Command is: `npm start`
- [ ] All 14 environment variables added
- [ ] MONGODB_URI is correct
- [ ] JWT_SECRET is set (strong value)
- [ ] Email credentials valid
- [ ] PayPal credentials valid

---

## 🚀 Next Steps

**Please send me:**

1. The exact error message from Render logs
2. A screenshot of your Render backend settings
3. Or tell me which error number above matches yours

Then I can give you the exact fix! 💪
