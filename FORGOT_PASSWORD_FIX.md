# Forgot Password Email Not Sending - Fix Guide

## Problem

When users enter their email on the forgot password page, the password reset email is not being sent.

## Root Causes & Solutions

### 1. **SMTP Configuration Issues** (Most Likely)

The email service might not be properly configured. Check the following:

#### Backend Environment Variables (.env file)

Ensure these are set in `backend/.env`:

```env
# Email Configuration
SMTP_USER=yomalravinga.cr@gmail.com
SMTP_PASS=yckr aqou vivs ifkd
ADMIN_EMAIL=yomalravinga.cr@gmail.com

# Frontend URL (IMPORTANT!)
FRONTEND_URL=https://your-frontend-url.onrender.com
```

**⚠️ CRITICAL**: The `FRONTEND_URL` must be your deployed frontend URL, not the backend URL!

#### For Render Deployment:

1. Go to your backend service on Render
2. Navigate to "Environment"
3. Add/Update these variables:
   - `SMTP_USER`: Your Gmail address
   - `SMTP_PASS`: Your Gmail app password
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://itp-project-frontend.onrender.com`)
   - `ADMIN_EMAIL`: Admin email address

---

### 2. **Gmail App Password Required**

If using Gmail, you MUST use an "App Password", not your regular Gmail password.

#### How to Generate Gmail App Password:

1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" if not already enabled
3. Search for "App Passwords"
4. Create new app password for "Mail"
5. Copy the 16-character password
6. Update `SMTP_PASS` in your `.env` file

---

### 3. **Firewall/Security Blocking**

Some hosting providers block outgoing SMTP connections.

#### For Render:

- Render allows SMTP on port 587 ✅
- No special configuration needed

#### Alternative: Use SendGrid or Mailgun

If Gmail SMTP doesn't work, consider using:

- **SendGrid**: Free tier (100 emails/day)
- **Mailgun**: Free tier (5,000 emails/month)

---

### 4. **Frontend URL Misconfiguration**

The password reset link includes your frontend URL. If it's wrong, the email might fail or the link won't work.

**Check in `backend/routes/auth.js` line ~488:**

```javascript
const frontendURL = process.env.FRONTEND_URL || "http://localhost:3000";
const resetURL = `${frontendURL}/reset-password/${resetToken}`;
```

**Testing Locally:**

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

**Production (Render):**

- Frontend: `https://itp-project-frontend.onrender.com`
- Backend: `https://itp-project-backend-new-01.onrender.com`

---

## Testing Steps

### 1. Test Email Service Connection

Add this test endpoint to `backend/routes/auth.js`:

```javascript
// Test email endpoint (REMOVE IN PRODUCTION!)
router.post("/test-email", async (req, res) => {
  try {
    const result = await emailService.sendPasswordResetEmail(
      "your-test-email@gmail.com",
      "Test User",
      {
        resetUrl: "http://localhost:3000/reset-password/test-token-123",
        expirationTime: "10 minutes",
      }
    );

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error,
    });
  }
});
```

Test with:

```bash
curl -X POST http://localhost:5000/api/auth/test-email
```

### 2. Check Backend Logs

When a user submits the forgot password form, you should see:

```
=== SENDING PASSWORD RESET EMAIL ===
Recipient email: user@example.com
Reset URL: https://your-frontend.com/reset-password/abc123...
Frontend URL: https://your-frontend.com
✅ Password reset email sent successfully
```

If you see:

```
❌ Password reset email failed: [error message]
```

This tells you the exact problem.

---

## Common Errors & Solutions

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution**: Use Gmail App Password, not regular password

### Error: "Connection timeout"

**Solution**:

- Check firewall settings
- Verify SMTP_USER and SMTP_PASS are correct
- Try port 465 with `secure: true` instead of port 587

### Error: "self signed certificate in certificate chain"

**Solution**: Already handled in EmailService.js with:

```javascript
tls: {
  rejectUnauthorized: false;
}
```

### No error, but email not received

**Solution**:

1. Check spam/junk folder
2. Verify email address is correct
3. Check Gmail "Sent" folder (if using Gmail SMTP)
4. Wait a few minutes (sometimes delayed)

---

## Updated Code Changes

I've already made these improvements:

### 1. **Enhanced Error Logging** (`backend/routes/auth.js`)

- Added detailed console logs
- Shows exact error messages
- Logs reset URL being generated

### 2. **Email Service Verification** (`backend/services/EmailService.js`)

- Already includes connection verification on startup
- Shows ✅ or ⚠️ in console when server starts

---

## Quick Fix Checklist

- [ ] Verify `SMTP_USER` and `SMTP_PASS` in backend `.env`
- [ ] Use Gmail App Password (not regular password)
- [ ] Set `FRONTEND_URL` to your deployed frontend URL
- [ ] Restart backend server after .env changes
- [ ] Check backend console logs when testing
- [ ] Verify email arrives (check spam folder)
- [ ] Test with your own email first

---

## For Deployment on Render

### Backend Environment Variables:

```
SMTP_USER=yomalravinga.cr@gmail.com
SMTP_PASS=yckr aqou vivs ifkd
FRONTEND_URL=https://your-frontend-app.onrender.com
ADMIN_EMAIL=yomalravinga.cr@gmail.com
```

### After Setting Variables:

1. Click "Manual Deploy" → "Clear build cache & deploy"
2. Wait for deployment
3. Check logs for email service status:
   - Look for: `✅ Email service is ready to send messages`
   - Or: `⚠️  Email service connection warning`

---

## Testing the Fix

1. **Start backend**: `cd backend && npm start`
2. **Start frontend**: `cd frontend && npm start`
3. **Navigate to**: http://localhost:3000/forgot-password
4. **Enter your email**
5. **Check backend console** for logs
6. **Check your email inbox** (and spam folder)

---

## Need More Help?

If emails still aren't sending, check:

1. **Backend console output** - Look for error messages
2. **Gmail account** - Ensure "Less secure app access" is enabled OR you're using App Password
3. **Email service logs** - Check if `transporter.verify()` succeeds on startup
4. **Network issues** - Try a different SMTP service (SendGrid, Mailgun)

---

## Alternative: Use SendGrid (Recommended for Production)

If Gmail SMTP continues to have issues:

```javascript
// In EmailService.js
this.transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

SendGrid is more reliable for production applications and has a free tier.

---

**Last Updated**: After implementing enhanced error logging
**Status**: Ready to debug - Check backend console logs when testing
