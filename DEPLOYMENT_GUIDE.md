# 🚀 Deployment Guide for Millanium Werksatt - Render Platform

This guide will help you deploy your MERN stack application (Millanium Werksatt Garage Management System) to Render.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Prepare Your Repository](#step-1-prepare-your-repository)
3. [Step 2: Create Render Account](#step-2-create-render-account)
4. [Step 3: Deploy Backend Service](#step-3-deploy-backend-service)
5. [Step 4: Deploy Frontend Service](#step-4-deploy-frontend-service)
6. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
7. [Step 6: Update CORS and API URLs](#step-6-update-cors-and-api-urls)
8. [Step 7: Test Your Deployment](#step-7-test-your-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before starting, make sure you have:

- ✅ A GitHub account
- ✅ Your code pushed to a GitHub repository
- ✅ MongoDB Atlas database (already configured)
- ✅ Cloudinary account (for image uploads)
- ✅ PayPal developer account (for payments)
- ✅ Gmail account with App Password (for emails)

---

## Step 1: Prepare Your Repository

### 1.1 Push Your Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit for deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 1.2 Verify Important Files

Make sure these files exist in your repository:

- ✅ `.gitignore` (to exclude `.env` and `node_modules`)
- ✅ `backend/.env.example` (template for environment variables)
- ✅ `render.yaml` (Render configuration - optional but helpful)

---

## Step 2: Create Render Account

1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up using your GitHub account (recommended for easy integration)
4. Verify your email address

---

## Step 3: Deploy Backend Service

### 3.1 Create New Web Service

1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository from the list

### 3.2 Configure Backend Service

Fill in the following details:

| Field              | Value                                                  |
| ------------------ | ------------------------------------------------------ |
| **Name**           | `millanium-werksatt-backend` (or your preferred name)  |
| **Region**         | Choose closest to your users (e.g., Oregon, Singapore) |
| **Branch**         | `main`                                                 |
| **Root Directory** | `backend`                                              |
| **Runtime**        | `Node`                                                 |
| **Build Command**  | `npm install`                                          |
| **Start Command**  | `npm start`                                            |
| **Instance Type**  | `Free`                                                 |

### 3.3 Add Environment Variables for Backend

Click **"Advanced"** and add these environment variables:

```plaintext
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-super-secret-jwt-key>
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
SMTP_USER=<your-gmail-address>
SMTP_PASS=<your-gmail-app-password>
ADMIN_EMAIL=<admin-email-address>
FRONTEND_URL=https://millanium-werksatt-frontend.onrender.com
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=<your-paypal-client-id>
PAYPAL_CLIENT_SECRET=<your-paypal-secret>
```

**Important Notes:**

- Replace all `<placeholder>` values with your actual credentials
- For `FRONTEND_URL`, use the URL that will be generated for your frontend (we'll update this later)
- Keep your `JWT_SECRET` long and complex
- Use your Gmail App Password (not your regular password) for `SMTP_PASS`

### 3.4 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for the deployment to complete (5-10 minutes)
3. Once deployed, copy your backend URL: `https://millanium-werksatt-backend.onrender.com`

---

## Step 4: Deploy Frontend Service

### 4.1 Create New Static Site

1. From Render Dashboard, click **"New +"** → **"Static Site"**
2. Select your repository again

### 4.2 Configure Frontend Service

Fill in the following details:

| Field                 | Value                          |
| --------------------- | ------------------------------ |
| **Name**              | `millanium-werksatt-frontend`  |
| **Region**            | Same as backend                |
| **Branch**            | `main`                         |
| **Root Directory**    | `frontend`                     |
| **Build Command**     | `npm install && npm run build` |
| **Publish Directory** | `build`                        |

### 4.3 Add Environment Variable for Frontend

Add this environment variable:

```plaintext
REACT_APP_API_URL=https://millanium-werksatt-backend.onrender.com
```

Replace with your actual backend URL from Step 3.4.

### 4.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your frontend URL: `https://millanium-werksatt-frontend.onrender.com`

---

## Step 5: Configure Environment Variables

### 5.1 Update Backend Environment Variables

1. Go to your **Backend Service** on Render
2. Click **"Environment"** in the left sidebar
3. Update the `FRONTEND_URL` variable with your actual frontend URL:

```plaintext
FRONTEND_URL=https://millanium-werksatt-frontend.onrender.com
```

4. Click **"Save Changes"**
5. Your backend will automatically redeploy

---

## Step 6: Update CORS and API URLs

### 6.1 Verify Backend CORS Configuration

The backend `server.js` is already configured to accept the `FRONTEND_URL` from environment variables. The deployment should work automatically.

### 6.2 Test API Connection

Open your frontend URL in a browser and check the browser console for any CORS or API connection errors.

---

## Step 7: Test Your Deployment

### 7.1 Test Backend Health Check

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:

```json
{
  "status": "OK",
  "timestamp": "2024-...",
  "service": "Millanium Werksatt API"
}
```

### 7.2 Test Frontend

1. Open your frontend URL
2. Try to:
   - Register a new account
   - Login
   - Navigate through different pages
   - Test key features

### 7.3 Test Database Connection

Check your backend logs on Render to confirm MongoDB connection:

```
Connected to MongoDB Atlas
Database: millanium-werksatt
```

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:** Verify your `MONGODB_URI` in backend environment variables. Make sure it's the correct connection string from MongoDB Atlas.

### Issue: "CORS Error"

**Solution:**

1. Check that `FRONTEND_URL` in backend matches your actual frontend URL
2. Verify the CORS configuration in `backend/server.js`

### Issue: "API calls failing"

**Solution:**

1. Check `REACT_APP_API_URL` in frontend environment variables
2. Make sure it points to your backend URL (without `/api` suffix)
3. Check browser console for error details

### Issue: "Email not sending"

**Solution:**

1. Make sure you're using a Gmail App Password, not your regular password
2. Enable 2-Factor Authentication on Gmail
3. Generate App Password: Google Account → Security → 2-Step Verification → App passwords

### Issue: "PayPal payments not working"

**Solution:**

1. Verify `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`
2. Make sure `PAYPAL_MODE` is set to `sandbox` for testing
3. Check PayPal developer dashboard for API credentials

### Issue: "Images not uploading"

**Solution:**

1. Verify Cloudinary credentials
2. Check Cloudinary dashboard for upload limits
3. Review backend logs for upload errors

### Issue: "Free tier service sleeping"

**Solution:**

- Render free tier services sleep after 15 minutes of inactivity
- First request after sleeping takes 30-60 seconds to wake up
- Consider upgrading to paid plan for production use

---

## Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] Database connection is working
- [ ] User registration works
- [ ] User login works
- [ ] Email notifications are being sent
- [ ] PayPal payments are functional (test in sandbox mode)
- [ ] Image uploads work (Cloudinary)
- [ ] All major features are tested
- [ ] HTTPS is working (automatic with Render)
- [ ] Environment variables are secured

---

## Important Notes

### Free Tier Limitations

- Services sleep after 15 minutes of inactivity
- 750 hours/month for free web services
- 100 GB bandwidth/month
- Slower cold starts after sleep

### Security Best Practices

- ✅ Never commit `.env` files to GitHub
- ✅ Use strong, unique `JWT_SECRET`
- ✅ Use App Passwords for email services
- ✅ Keep API keys and secrets secure
- ✅ Regularly rotate credentials
- ✅ Monitor usage and logs

### Performance Tips

- Use Render's auto-deploy feature (deploys on git push)
- Monitor logs regularly from Render dashboard
- Set up health checks (already configured in `server.js`)
- Consider upgrading to paid tier for production

---

## Updating Your Deployment

### When you make code changes:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main
```

Render will automatically detect the changes and redeploy both services!

---

## Getting Help

- **Render Documentation:** https://render.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
- **Cloudinary:** https://cloudinary.com/documentation
- **PayPal Developer:** https://developer.paypal.com/docs/

---

## Summary

You now have:

- ✅ Backend API deployed on Render
- ✅ Frontend React app deployed on Render
- ✅ MongoDB Atlas database connected
- ✅ Email service configured
- ✅ PayPal payments integrated
- ✅ Image uploads via Cloudinary
- ✅ Automatic deployments on git push

**Your app is live! 🎉**

Frontend: `https://your-frontend-name.onrender.com`  
Backend: `https://your-backend-name.onrender.com`

---

**Need help?** Check the logs in your Render dashboard for detailed error messages.
