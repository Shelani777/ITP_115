# 🚀 Vercel Deployment Guide - GearMaster MERN Stack

This guide will help you deploy the GearMaster application to Vercel as a **single monorepo deployment**. The application includes both frontend (React) and backend (Node.js/Express) in one unified project.

---

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **MongoDB Atlas**: Database should be set up and accessible
4. **Environment Variables**: Have all your API keys and secrets ready

---

## 🎯 Deployment Overview

- **Single Vercel Project**: Both frontend and backend deployed together
- **Frontend**: React app served as static files
- **Backend**: Node.js/Express API at `/api/*` routes
- **Database**: MongoDB Atlas (already configured)

---

## 📦 Step 1: Prepare Your Project

### 1.1 Push to GitHub

Make sure your project is pushed to GitHub:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for Vercel monorepo deployment"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/GearMaster.git

# Push to GitHub
git push -u origin main
```

### 1.2 Verify Configuration Files

The following files have been created for you:

✅ `vercel.json` - Monorepo deployment configuration (handles both frontend & backend)
✅ `.gitignore` - Prevents sensitive files from being committed
✅ `backend/.env.example` - Template for backend environment variables
✅ `frontend/.env.example` - Template for frontend environment variables

---

## 🔧 Step 2: Deploy to Vercel (Single Project)

### 2.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Configure the project:
   - **Project Name**: `gearmaster` (or your preferred name)
   - **Framework Preset**: Other
   - **Root Directory**: `.` (leave as root, don't select frontend or backend)
   - **Build Command**: `npm run vercel-build` (or leave default)
   - **Output Directory**: Leave empty
   - **Install Command**: Leave default

### 2.2 Configure Environment Variables

In Vercel project settings, add **ALL** these environment variables:

**Backend Variables:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=30d
FRONTEND_URL=https://your-project-name.vercel.app
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
ADMIN_EMAIL=admin_email@gmail.com
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Frontend Variables:**
```
REACT_APP_API_URL=https://your-project-name.vercel.app/api
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
```

**Important Notes:**
- Replace `your-project-name` with your actual Vercel project name
- Generate a strong JWT_SECRET (use a random string generator)
- FRONTEND_URL should match your Vercel deployment URL
- For Gmail: Use an [App-Specific Password](https://support.google.com/accounts/answer/185833)
- Both frontend and backend use the **same domain**!

### 2.3 Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete (may take 2-5 minutes)
3. Your app will be live at: `https://your-project-name.vercel.app`
   - Frontend: `https://your-project-name.vercel.app`
   - Backend API: `https://your-project-name.vercel.app/api/*`

---

## 🔄 Step 3: Update Environment Variables (If Needed)

If you need to update the URLs after seeing your actual deployment URL:

1. Go to **Settings** → **Environment Variables**
2. Update `FRONTEND_URL` and `REACT_APP_API_URL` if needed
3. Go to **Deployments** tab
4. Click the three dots on the latest deployment
5. Click **"Redeploy"** to apply the changes

---

## 🔐 Step 4: Configure MongoDB Atlas Network Access

Your MongoDB Atlas needs to allow Vercel's IP addresses:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is necessary because Vercel uses dynamic IPs
   - Ensure you have strong database authentication
5. Click **"Confirm"**

---

## ✅ Step 5: Test Your Deployment

### 5.1 Test Backend API

Open your browser or use curl:
```
https://your-project-name.vercel.app/api/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "2025-12-08T...",
  "service": "Millanium Werksatt API"
}
```

### 5.2 Test Frontend

1. Visit your deployment URL: `https://your-project-name.vercel.app`
2. Try logging in
3. Test creating appointments, viewing dashboards, etc.
4. Verify all API calls work correctly

---

## 🔧 Common Issues & Solutions

### Issue 1: Backend API Returns 404
**Solution**: 
- Check that `vercel.json` is in the root directory
- Verify API routes start with `/api/` in your code
- Check Vercel deployment logs for routing issues

### Issue 2: CORS Errors
**Solution**: 
- Ensure `FRONTEND_URL` matches your Vercel deployment URL exactly (no trailing slash)
- Since frontend and backend share the same domain, CORS should not be an issue
- Redeploy after updating environment variables

### Issue 3: MongoDB Connection Timeout
**Solution**:
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Verify `MONGODB_URI` environment variable is correct
- Check MongoDB Atlas cluster is running

### Issue 4: Build Fails - Module Not Found
**Solution**:
- Make sure all dependencies are in `package.json`
- Delete `node_modules` and run `npm install` locally to verify
- Check for case-sensitive file imports

### Issue 5: Environment Variables Not Working
**Solution**:
- Verify all required environment variables are set in Vercel
- Redeploy after adding/changing environment variables
- For React: Variables must start with `REACT_APP_`

---

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

1. Make changes to your code
2. Commit and push to GitHub:
   ```powershell
   git add .
   git commit -m "Update feature"
   git push
   ```
3. Vercel automatically detects changes and redeploys

---

## 📊 Monitoring Your Application

### Vercel Dashboard

- **Analytics**: View traffic and performance metrics
- **Logs**: Check runtime logs for errors
- **Speed Insights**: Monitor page load times

### Access Logs

1. Go to your project in Vercel
2. Click on a deployment
3. Click **"Logs"** to view real-time logs
4. Use logs to debug issues

---

## 🚀 Performance Optimization

### Frontend Optimizations

1. **Image Optimization**: Vercel automatically optimizes images
2. **Caching**: Static assets are cached at the edge
3. **Code Splitting**: React automatically splits code

### Backend Optimizations

1. **Database Indexing**: Ensure MongoDB indexes are properly set
2. **Connection Pooling**: MongoDB driver handles this automatically
3. **Rate Limiting**: Already configured in `server.js`

---

## 🔒 Security Checklist

- ✅ All sensitive data is in environment variables
- ✅ `.env` files are in `.gitignore`
- ✅ CORS is properly configured
- ✅ JWT secrets are strong and unique
- ✅ MongoDB Atlas uses strong authentication
- ✅ Network access is configured correctly
- ✅ Rate limiting is enabled
- ✅ Helmet security headers are enabled

---

## 📝 Quick Reference

### Single Deployment URL
```
Frontend: https://your-project-name.vercel.app
Backend API: https://your-project-name.vercel.app/api/[endpoint]
```

### Advantages of Monorepo Deployment
- ✅ Single deployment process
- ✅ No CORS issues (same domain)
- ✅ Easier to manage
- ✅ Automatic coordinated deployments
- ✅ One set of environment variables

### Update Environment Variables
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add/Edit variables
3. Redeploy to apply changes

### View Logs
1. Vercel Dashboard → Project → Deployments
2. Click on deployment
3. View logs

---

## 🆘 Need Help?

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **MongoDB Atlas Support**: [support.mongodb.com](https://support.mongodb.com)

---

## 🎉 Deployment Complete!

Your GearMaster application is now live on Vercel! 

**Important**: Save your deployment URLs and update any documentation or configuration files with the production URLs.

### Next Steps:
1. Share the frontend URL with users
2. Monitor logs for any issues
3. Set up custom domain (optional)
4. Configure backups for MongoDB
5. Set up monitoring/alerting

---

**Last Updated**: December 8, 2025
