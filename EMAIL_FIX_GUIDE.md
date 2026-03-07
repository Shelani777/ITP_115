# Email Not Sending - Complete Fix Guide

## Issue Found
Your `FRONTEND_URL` was incorrectly set to the backend URL instead of the frontend URL.

**Wrong (in your .env):**
```
FRONTEND_URL=https://itp-project-backend-new-01.onrender.com
```

**Correct:**
```
# For local development
FRONTEND_URL=http://localhost:3000

# For production (when deployed)
FRONTEND_URL=https://your-frontend-app.onrender.com
```

---

## Step-by-Step Fix

### 1. Fix Environment Variables

Edit `backend/.env`:

```env
# Email Configuration
SMTP_USER=yomalravinga.cr@gmail.com
SMTP_PASS=yckr aqou vivs ifkd
ADMIN_EMAIL=yomalravinga.cr@gmail.com

# Frontend URL - MUST BE YOUR FRONTEND URL!
FRONTEND_URL=http://localhost:3000  # For local testing
# FRONTEND_URL=https://your-frontend.onrender.com  # For production
```

### 2. Use Gmail App Password (CRITICAL!)

The password `yckr aqou vivs ifkd` looks like a Gmail App Password (correct format).

**To verify or create a new one:**

1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" (required for App Passwords)
3. Search for "App passwords" or go to https://myaccount.google.com/apppasswords
4. Click "Select app" → Choose "Mail"
5. Click "Select device" → Choose "Other" → Type "Millanium Werksatt"
6. Click "Generate"
7. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
8. Update `SMTP_PASS` in your `.env` file

**Important:** Remove spaces when copying: `abcdefghijklmnop`

### 3. Test Email Service

I've created a test script for you. Run it:

```bash
cd backend
node test-email.js
```

**Expected output if working:**
```
=== Testing Email Configuration ===

Checking environment variables...
SMTP_USER: yomalravinga.cr@gmail.com
SMTP_PASS: ✅ SET
FRONTEND_URL: http://localhost:3000

Creating email transporter...
Verifying connection to SMTP server...
✅ SMTP connection verified successfully!

Sending test email...
✅ Test email sent successfully!
Message ID: <...@gmail.com>

📧 Check your inbox (and spam folder) at: yomalravinga.cr@gmail.com

✅ Email service is working correctly!
```

**If you see errors:**
- Check the error message for specific issues
- Verify App Password is correct
- Check Gmail security settings

---

## Common Issues & Solutions

### Issue 1: "Invalid login" or "Username and Password not accepted"

**Cause:** Not using Gmail App Password or wrong password

**Solution:**
1. Generate new Gmail App Password (see above)
2. Update `SMTP_PASS` in `.env`
3. Remove all spaces from the password
4. Restart backend server

### Issue 2: "Connection timeout" or "ETIMEDOUT"

**Cause:** Firewall blocking SMTP port 587

**Solution:**
- Check your firewall settings
- Try using port 465 with SSL instead
- For Render: This shouldn't be an issue (port 587 is open)

### Issue 3: Password reset email links don't work

**Cause:** Wrong `FRONTEND_URL` (pointing to backend)

**Solution:**
- Set `FRONTEND_URL` to your actual frontend URL
- Local: `http://localhost:3000`
- Production: `https://your-frontend.onrender.com`

### Issue 4: "Less secure app access"

**Cause:** Old Gmail security setting (deprecated)

**Solution:**
- This setting is no longer available
- You MUST use App Password with 2FA enabled
- Cannot use regular Gmail password anymore

---

## Testing Different Email Features

### Test Forgot Password Email

1. Start backend: `npm start` (in backend folder)
2. Start frontend: `npm start` (in frontend folder)
3. Go to: http://localhost:3000/forgot-password
4. Enter your email: `yomalravinga.cr@gmail.com`
5. Click "Send Reset Link"
6. Check console logs for errors
7. Check email inbox (and spam)

**Backend logs should show:**
```
=== SENDING PASSWORD RESET EMAIL ===
Recipient email: yomalravinga.cr@gmail.com
Reset URL: http://localhost:3000/reset-password/abc123...
Frontend URL: http://localhost:3000
✅ Password reset email sent successfully
```

### Test Welcome Email (New User Registration)

1. Go to: http://localhost:3000/register
2. Create a new account with your email
3. Check email for welcome message

### Test Job Notification Email

1. Create a job in admin dashboard
2. Assign it to a customer
3. Customer should receive email notification

---

## For Production (Render Deployment)

### Backend Environment Variables on Render:

Go to your backend service → Environment → Add/Update:

```
SMTP_USER=yomalravinga.cr@gmail.com
SMTP_PASS=yckraqouvivsifkd
ADMIN_EMAIL=yomalravinga.cr@gmail.com
FRONTEND_URL=https://your-actual-frontend-url.onrender.com
```

**CRITICAL:** 
- `FRONTEND_URL` must be your FRONTEND Render URL, not backend!
- Example: `https://itp-project-frontend.onrender.com`

### After Setting Variables:

1. Click "Manual Deploy"
2. Select "Clear build cache & deploy"
3. Wait for deployment to complete
4. Check deployment logs for:
   ```
   ✅ Email service is ready to send messages
   ```

### Verify Production Email:

1. Use forgot password feature on production site
2. Check if email arrives
3. Click reset link - should redirect to production frontend
4. Check backend logs on Render for any errors

---

## Troubleshooting Commands

### Check backend logs:
```bash
# Local
npm start

# Render
View Logs in Render Dashboard
```

### Test SMTP connection:
```bash
cd backend
node test-email.js
```

### Check environment variables:
```bash
cd backend
node -e "require('dotenv').config(); console.log(process.env.SMTP_USER, process.env.FRONTEND_URL)"
```

---

## Email Service Status Checklist

After following this guide, verify:

- [ ] `SMTP_USER` is set correctly
- [ ] `SMTP_PASS` is a Gmail App Password (not regular password)
- [ ] `FRONTEND_URL` points to frontend (not backend)
- [ ] 2-Factor Authentication enabled on Gmail account
- [ ] App Password generated for Gmail
- [ ] Test email script runs successfully
- [ ] Backend logs show "Email service is ready"
- [ ] Forgot password email arrives in inbox
- [ ] Reset link points to correct frontend URL
- [ ] Email arrives within 1-2 minutes

---

## Alternative: Use SendGrid (If Gmail Fails)

If Gmail continues to have issues, consider using SendGrid:

### 1. Sign up for SendGrid
- Free tier: 100 emails/day
- https://sendgrid.com/

### 2. Get API Key
- Go to Settings → API Keys
- Create new API key
- Copy the key

### 3. Update EmailService.js

```javascript
// In backend/services/EmailService.js
this.transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

### 4. Update .env
```env
SENDGRID_API_KEY=SG.your-api-key-here
SMTP_USER=your-verified-sender@domain.com
```

SendGrid is more reliable for production and handles high email volumes better.

---

## Quick Fix Summary

1. **Fix `.env` file:**
   - Change `FRONTEND_URL` to point to frontend
   - Verify Gmail App Password is correct

2. **Test locally:**
   ```bash
   cd backend
   node test-email.js
   ```

3. **If test passes:**
   - Emails should work in your app
   - Test forgot password feature

4. **If test fails:**
   - Check error message
   - Verify Gmail App Password
   - Try generating new App Password

5. **For production:**
   - Update Render environment variables
   - Set correct `FRONTEND_URL`
   - Redeploy backend

---

**Need more help?** Check the backend console logs when testing - they now show detailed error information!
