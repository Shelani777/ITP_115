# 🔒 Deploying Private Repository to Render

## ✅ Good News!

Your repository (`ITP-Project`) is already private on GitHub, and Render **fully supports private repos**. This guide shows you exactly how.

---

## 🚀 Step-by-Step: Deploying Private Repo to Render

### **Option 1: Using GitHub Integration (RECOMMENDED - Easiest)**

#### 1. Connect Render to Your GitHub Account

1. Go to **[render.com](https://render.com)**
2. Sign in with GitHub (or Sign up)
3. Click **"Connect GitHub Account"** if not already connected
4. Authorize Render to access your repositories
   - ✅ Allow access to private repos
   - ✅ Grant necessary permissions

#### 2. Create Backend Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect a Repository"**
3. You'll see your private repo: `AuthnSapuarachchi/ITP-Project`
4. Select it and click **"Connect"**

#### 3. Configure Backend Service

```
Name:              millanium-werksatt-backend
Environment:       Node
Root Directory:    backend
Build Command:     npm install
Start Command:     npm start
Plan:              Free (or Starter)
```

#### 4. Add Environment Variables

Click **"Environment"** tab and add:

```
NODE_ENV                 = production
PORT                     = 5000
MONGODB_URI              = mongodb+srv://itpProject:itpProject@clusteritp.wd1qzuc.mongodb.net/?retryWrites=true&w=majority&appName=ClusterITP
JWT_SECRET               = your_super_secret_jwt_key_here_make_it_very_long_and_complex
JWT_EXPIRE               = 30d
CLOUDINARY_CLOUD_NAME    = (your actual value)
CLOUDINARY_API_KEY       = (your actual value)
CLOUDINARY_API_SECRET    = (your actual value)
SMTP_USER                = yomalravinga.cr@gmail.com
SMTP_PASS                = yckr aqou vivs ifkd
ADMIN_EMAIL              = yomalravinga.cr@gmail.com
PAYPAL_MODE              = sandbox
PAYPAL_CLIENT_ID         = AQh3UDE9GlAEnFYBLKM4x6YB6U77rMRGpizAviaYbDnMvmODkpRqHvgUbkcT-id88anKpQpaTvac2eT7
PAYPAL_CLIENT_SECRET     = EP8yPNJkdmdaZgz_7wrkta2D8VsZGZ1t0Wmkeu8UU8djPNcyiXUx2m8N4ZnJm_GJbjJNW_KQC9iIx6jv
FRONTEND_URL             = (will update after frontend deployed)
```

#### 5. Deploy!

1. Click **"Create Web Service"**
2. Watch the build happen automatically
3. When complete, you get a URL: `https://millanium-werksatt-backend.onrender.com`

---

### **Option 2: Using Personal Access Token (If GitHub Connection Fails)**

#### 1. Generate GitHub Personal Access Token

1. Go to GitHub → Settings → **Developer settings** → **Personal access tokens**
2. Click **"Generate new token (classic)"**
3. Name it: `render-deployment`
4. Select scopes:
   - ✅ `repo` (full control of private repos)
   - ✅ `read:user`
5. Click **"Generate token"**
6. **COPY IT** (you won't see it again!)

#### 2. In Render Dashboard

1. Click **"New +"** → **"Web Service"**
2. Paste your GitHub URL: `https://github.com/AuthnSapuarachchi/ITP-Project.git`
3. Render will ask for authentication:
   - Choose **"Use GitHub Token"**
   - Paste the token you just generated
4. Continue with configuration

---

### **Option 3: Using Git HTTPS with Token (Alternative)**

If direct GitHub integration doesn't work:

1. Generate GitHub Personal Access Token (see Option 2, steps 1)
2. In Render, use this URL format:

```
https://[TOKEN]@github.com/AuthnSapuarachchi/ITP-Project.git
```

Example:

```
https://ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@github.com/AuthnSapuarachchi/ITP-Project.git
```

⚠️ **Security Note:** Don't commit this anywhere - only use in Render environment variables

---

## ⚡ Complete Backend Deployment Checklist

- [ ] GitHub connected to Render account
- [ ] Private repo selected: `ITP-Project`
- [ ] Root Directory set to: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] All 14 environment variables added
- [ ] MongoDB URI is correct
- [ ] Email credentials valid
- [ ] PayPal credentials correct (Sandbox mode)
- [ ] Deploy button clicked
- [ ] Build succeeds (watch logs)
- [ ] Service running on port 5000
- [ ] Test `/api/health` endpoint

---

## 📝 After Backend Deploys Successfully

### Create Frontend Service

1. Click **"New +"** → **"Static Site"**
2. Connect same private repo: `ITP-Project`
3. Configure:

```
Name:                    millanium-werksatt-frontend
Root Directory:          frontend
Build Command:           npm install && npm run build
Publish Directory:       build
```

4. Environment Variables:

```
REACT_APP_API_URL = https://millanium-werksatt-backend.onrender.com
```

5. Deploy!

---

## 🔐 Security Best Practices

### ✅ DO:

- Keep your GitHub token in Render (encrypted)
- Use environment variables for secrets
- Add `.env` to `.gitignore` (already done!)
- Rotate tokens periodically
- Use HTTPS everywhere (Render does this by default)

### ❌ DON'T:

- Commit `.env` file to GitHub
- Share personal access tokens
- Hardcode secrets in code
- Use production credentials for testing

---

## 🐛 Troubleshooting Private Repo Deployment

### Problem: "Repository not found"

**Solution:**

- Verify GitHub token has `repo` scope
- Check repo name is correct: `AuthnSapuarachchi/ITP-Project`
- Verify you have access to the repo on GitHub
- Try re-authorizing Render on GitHub

### Problem: "Permission denied (publickey)"

**Solution:**

- Delete current service in Render
- Go to Render Dashboard → GitHub connections
- Click **"Re-authorize"**
- Try deploying again

### Problem: "Build fails with dependency errors"

**Solution:**

- Check `backend/package.json` exists
- Verify all dependencies are in `package.json`
- Check Node version compatibility
- Review build logs for specific errors

### Problem: Can't see private repo in Render's repo list

**Solution:**

- Ensure Render has permission to private repos:
  1. Go to render.com/dashboard
  2. Click your profile → Settings
  3. Go to GitHub section
  4. Click **"Manage GitHub connection"**
  5. Authorize access to all repositories

---

## 🎯 Your Current Setup

```
GitHub:
  ✅ Repository: Private (ITP-Project)
  ✅ Owner: AuthnSapuarachchi
  ✅ Branch: Authn's-Branch
  ✅ Git Remote: https://github.com/AuthnSapuarachchi/ITP-Project.git

Render (To Be Set Up):
  - Backend Service (Root: backend)
  - Frontend Service (Root: frontend)
  - Environment Variables (from your .env file)
  - Database: MongoDB Atlas (already connected)
```

---

## ⏱️ Deployment Timeline

| Step                      | Time         | Status            |
| ------------------------- | ------------ | ----------------- |
| GitHub connection         | 2 min        | ⏳ Do this first  |
| Backend service creation  | 1 min        | ⏳ Select repo    |
| Environment variables     | 3 min        | ⏳ Copy from .env |
| Backend build             | 5-7 min      | 🚀 Automated      |
| Frontend service creation | 1 min        | ⏳ After backend  |
| Frontend build            | 5-7 min      | 🚀 Automated      |
| **Total**                 | **~25 mins** | ⏳ Ready to test  |

---

## ✨ Quick Commands to Verify Everything

After deployment:

```bash
# Test backend health
curl https://millanium-werksatt-backend.onrender.com/api/health

# Test frontend loads
curl https://millanium-werksatt-frontend.onrender.com

# Check backend logs
# (In Render Dashboard → Backend Service → Logs)
```

---

## 🎉 You're Ready!

Your private repo can absolutely be deployed to Render. Just follow the steps above and you'll have both services running in ~25 minutes!

**Questions?** Check the troubleshooting section or review the Render deployment logs for specific errors.

**NEXT STEP: Go to render.com and start creating your Web Service! 🚀**
