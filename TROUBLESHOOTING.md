# 🔧 Common Deployment Errors & Solutions

## Database Connection Errors

### Error: `MongoServerError: bad auth`

```
Error connecting to MongoDB: MongoServerError: bad auth
```

**Causes:**

- Wrong username or password
- Special characters in password not URL-encoded
- Database user doesn't have proper permissions

**Solutions:**

1. Verify credentials in MongoDB Atlas
2. URL-encode password if it contains special characters
3. Create new database user:
   - MongoDB Atlas → Database Access
   - Add New Database User
   - Set read/write permissions
   - Use simple password or URL-encode special chars

---

### Error: `MongooseServerSelectionError: connection timed out`

```
MongooseServerSelectionError: connect ETIMEDOUT
```

**Causes:**

- IP not whitelisted in MongoDB Atlas
- Wrong connection string
- Network issues

**Solutions:**

1. **Whitelist all IPs:**
   - MongoDB Atlas → Network Access
   - Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
   - Confirm
2. **Verify connection string format:**

   ```
   mongodb+srv://username:password@cluster.mongodb.net/database
   ```

3. **Check cluster status:**
   - Make sure cluster isn't paused (free tier auto-pauses)

---

## CORS Errors

### Error: `blocked by CORS policy`

```
Access to XMLHttpRequest at 'https://backend.onrender.com/api/...'
from origin 'https://frontend.onrender.com' has been blocked by CORS policy
```

**Causes:**

- FRONTEND_URL not set correctly in backend
- CORS not configured for production domain

**Solutions:**

1. **Update backend environment variable:**
   ```
   FRONTEND_URL=https://your-actual-frontend.onrender.com
   ```
2. **Verify CORS configuration in server.js:**

   - Should accept FRONTEND_URL from environment
   - Save changes and redeploy

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## API Connection Errors

### Error: `Network Error` or `Failed to fetch`

```
AxiosError: Network Error
or
TypeError: Failed to fetch
```

**Causes:**

- Wrong API URL in frontend
- Backend not running
- HTTPS/HTTP mismatch

**Solutions:**

1. **Check REACT_APP_API_URL:**

   - Must be your actual backend URL
   - Example: `https://millanium-werksatt-backend.onrender.com`
   - Should NOT include `/api` suffix

2. **Verify backend is running:**

   - Test: `https://your-backend.onrender.com/api/health`
   - Should return: `{"status": "OK", ...}`

3. **Check protocol:**
   - Both frontend and backend should use HTTPS (automatic on Render)

---

## Build Errors

### Error: `npm ERR! code ELIFECYCLE`

```
npm ERR! code ELIFECYCLE
npm ERR! errno 1
```

**Causes:**

- Missing dependencies
- Build script errors
- Node version mismatch

**Solutions:**

1. **Check build command:**

   - Backend: `npm install`
   - Frontend: `npm install && npm run build`

2. **Verify package.json scripts:**

   ```json
   {
     "scripts": {
       "start": "node server.js",
       "build": "react-scripts build"
     }
   }
   ```

3. **Check logs for specific error:**
   - Render Dashboard → Logs
   - Fix the specific missing dependency or error

---

### Error: `Module not found`

```
Error: Cannot find module 'express'
```

**Causes:**

- Dependencies not installed
- package.json missing dependency

**Solutions:**

1. **Add missing dependency:**

   - Locally: `npm install express`
   - Commit and push: `git add . && git commit -m "Add dependency" && git push`

2. **Verify package.json has the dependency:**
   ```json
   {
     "dependencies": {
       "express": "^4.18.2"
     }
   }
   ```

---

## Email Service Errors

### Error: `Invalid login: Username and Password not accepted`

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

**Causes:**

- Using regular Gmail password instead of App Password
- 2-Factor Authentication not enabled
- Wrong credentials

**Solutions:**

1. **Generate Gmail App Password:**
   - Go to Google Account → Security
   - Enable 2-Step Verification (if not enabled)
   - Search "App Passwords"
   - Select "Mail" and "Windows Computer"
   - Copy 16-character password
2. **Update environment variables:**

   ```
   SMTP_USER=your.email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx (16-char app password)
   ```

3. **Don't use your regular Gmail password!**

---

## PayPal Integration Errors

### Error: `PayPal order creation failed`

```
Error: PayPal order creation failed: Authentication failed
```

**Causes:**

- Wrong PayPal credentials
- Sandbox mode misconfiguration

**Solutions:**

1. **Verify PayPal credentials:**

   - Go to https://developer.paypal.com
   - My Apps & Credentials
   - Copy Client ID and Secret from Sandbox

2. **Update environment variables:**

   ```
   PAYPAL_MODE=sandbox
   PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_CLIENT_SECRET=your_secret
   ```

3. **For production:**
   - Switch to Live credentials
   - Change PAYPAL_MODE=live

---

## Cloudinary Upload Errors

### Error: `Cloudinary upload failed`

```
Error: Upload failed: Invalid API Key
```

**Causes:**

- Wrong Cloudinary credentials
- API key not configured

**Solutions:**

1. **Get credentials from Cloudinary:**

   - Login to https://cloudinary.com
   - Dashboard → Account Details
   - Copy Cloud Name, API Key, API Secret

2. **Update environment variables:**
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## Service Sleep Issues (Free Tier)

### Issue: Slow first response (30-60 seconds)

```
First request after inactivity takes long time
```

**Cause:**

- Render free tier services sleep after 15 minutes of inactivity

**Solutions:**

1. **Expected behavior:**

   - First request wakes service (30-60 seconds)
   - Subsequent requests are fast

2. **Upgrade to paid plan:**

   - Paid plans don't sleep
   - Faster response times

3. **Use external monitoring:**
   - Set up ping service (e.g., UptimeRobot)
   - Keeps service awake (within free tier limits)

---

## Environment Variable Errors

### Error: `undefined is not a valid connection string`

```
TypeError: undefined is not a valid connection string
```

**Causes:**

- Environment variable not set
- Wrong variable name
- Typo in .env key

**Solutions:**

1. **Check variable names match:**

   - Code: `process.env.MONGODB_URI`
   - Render: Key must be `MONGODB_URI`

2. **Verify all variables are set:**

   - Render Dashboard → Service → Environment
   - Compare with required list

3. **No quotes needed in Render:**
   ```
   ✅ Correct: MONGODB_URI=mongodb+srv://...
   ❌ Wrong: MONGODB_URI="mongodb+srv://..."
   ```

---

## Port Binding Errors

### Error: `EADDRINUSE: port already in use`

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Cause:**

- Hardcoded port instead of using process.env.PORT

**Solution:**

1. **Use environment PORT:**

   ```javascript
   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

2. **Render automatically assigns PORT**
   - Don't hardcode port 5000

---

## Frontend Build Errors

### Error: `Failed to compile`

```
Failed to compile.
Module not found: Can't resolve 'react-router-dom'
```

**Causes:**

- Missing dependencies in package.json
- Import errors

**Solutions:**

1. **Install missing package locally:**

   ```bash
   cd frontend
   npm install react-router-dom
   ```

2. **Commit and push:**

   ```bash
   git add .
   git commit -m "Add missing dependency"
   git push
   ```

3. **Render will rebuild automatically**

---

## Authentication Errors

### Error: `jwt malformed` or `invalid token`

```
JsonWebTokenError: jwt malformed
```

**Causes:**

- JWT_SECRET not set
- Token format incorrect

**Solutions:**

1. **Set strong JWT_SECRET:**

   ```
   JWT_SECRET=your_super_long_random_secret_key_at_least_32_characters
   ```

2. **Use token generator:**

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Update environment variable and redeploy**

---

## Static File Serving (Frontend)

### Error: `404 on page refresh`

```
Cannot GET /dashboard/admin
```

**Cause:**

- React Router not configured for static hosting

**Solution:**

1. **Add `_redirects` file in frontend/public:**

   ```
   /*    /index.html   200
   ```

2. **Or add to package.json:**
   ```json
   {
     "homepage": "."
   }
   ```

---

## Checking Logs

### How to find error messages:

1. **Render Dashboard → Your Service → Logs**

   - Shows real-time logs
   - Scroll to find errors

2. **Look for keywords:**

   - `Error:`
   - `Failed:`
   - `MongooseError:`
   - `TypeError:`
   - `Cannot find module`

3. **Search specific error message:**
   - Copy exact error text
   - Search in this guide or Google

---

## Quick Diagnostic Checklist

When something doesn't work:

- [ ] Check Render logs for errors
- [ ] Test backend health: `/api/health`
- [ ] Verify all environment variables are set
- [ ] Check MongoDB Atlas Network Access (0.0.0.0/0)
- [ ] Verify FRONTEND_URL matches actual frontend
- [ ] Verify REACT_APP_API_URL matches actual backend
- [ ] Clear browser cache
- [ ] Check browser console for errors
- [ ] Check browser network tab for failed requests
- [ ] Verify services are deployed successfully

---

## Getting More Help

If your error isn't listed here:

1. **Check Render Status:**
   - https://status.render.com
2. **Render Community:**

   - https://community.render.com

3. **Check MongoDB Status:**

   - https://status.mongodb.com

4. **Search Error Message:**

   - Google: "render deployment [your error]"
   - Stack Overflow

5. **Check Service Logs:**
   - Most errors show detailed messages in logs

---

## Prevention Tips

1. **Test locally first:**

   - Make sure everything works locally before deploying

2. **Use .env.example:**

   - Document all required environment variables

3. **Check before committing:**

   - Never commit `.env` files
   - Verify `.gitignore` includes `.env`

4. **Gradual deployment:**

   - Deploy backend first
   - Test backend endpoints
   - Then deploy frontend

5. **Monitor logs:**
   - Watch deployment logs for warnings
   - Check runtime logs regularly

---

**Still having issues? Check the detailed logs in your Render dashboard!**
