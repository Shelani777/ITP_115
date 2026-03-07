# Email Troubleshooting - Quick Checklist

## ✅ Email Service Status: WORKING!

Your test email was sent successfully! This confirms:

- ✅ SMTP credentials are correct
- ✅ Gmail connection is working
- ✅ Email service can send emails

## 🔍 Why emails might not work in your app:

### **Reason 1: Backend server not restarted**

The backend server needs to be restarted after changing `.env` file.

**Solution:**

```bash
# Stop all node processes
taskkill /F /IM node.exe

# Restart backend
cd backend
npm start
```

### **Reason 2: Frontend not calling the API correctly**

Let me check your frontend API configuration...

### **Reason 3: Using old backend URL**

If your frontend is calling the deployed backend on Render instead of localhost, the Render backend still has the OLD configuration with wrong `FRONTEND_URL`.

**Check frontend/.env or api.js:**

- Should use: `http://localhost:5000` for local testing
- Or update Render backend environment variables

---

## 🚀 Quick Fix Steps:

### Step 1: Stop all Node processes

```powershell
taskkill /F /IM node.exe
```

### Step 2: Start backend fresh

```bash
cd backend
npm start
```

### Step 3: Check backend logs

You should see:

```
✅ Email service is ready to send messages
```

### Step 4: Test forgot password

1. Go to: http://localhost:3000/forgot-password
2. Enter your email: yomalravinga.cr@gmail.com
3. Click "Send Reset Link"
4. Check backend console for logs

**Expected logs:**

```
=== SENDING PASSWORD RESET EMAIL ===
Recipient email: yomalravinga.cr@gmail.com
Reset URL: http://localhost:3000/reset-password/...
Frontend URL: http://localhost:3000
✅ Password reset email sent successfully
```

### Step 5: Check your email

- Check inbox
- Check spam/junk folder
- Email should arrive within 1-2 minutes

---

---

## ✅ SOLUTION FOUND!

### **Problem Identified:**

Your frontend was calling the **Render backend** (production) instead of your local backend.

The Render backend has the OLD configuration where `FRONTEND_URL` was wrong.

### **Fix Applied:**

Updated `frontend/.env` to use localhost backend:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## � Complete Fix Procedure:

### Step 1: Kill all Node processes

```powershell
taskkill /F /IM node.exe
```

### Step 2: Start Backend Server

```bash
cd backend
npm start
```

**Look for this in console:**

```
✅ Email service is ready to send messages
Server running on port 5000
```

### Step 3: Start Frontend Server (NEW TERMINAL)

```bash
cd frontend
npm start
```

**Frontend will open at:** http://localhost:3000

### Step 4: Test Email Functionality

#### A. Test Forgot Password:

1. Go to: http://localhost:3000/forgot-password
2. Enter email: `yomalravinga.cr@gmail.com`
3. Click "Send Reset Link"

#### B. Check Backend Console:

You should see:

```
=== SENDING PASSWORD RESET EMAIL ===
Recipient email: yomalravinga.cr@gmail.com
Reset URL: http://localhost:3000/reset-password/abc123...
Frontend URL: http://localhost:3000
✅ Password reset email sent successfully
```

#### C. Check Your Email:

- Open Gmail inbox
- Check spam/junk folder
- Email should arrive in 1-2 minutes
- Click the reset link (should go to http://localhost:3000/reset-password/...)

---

## 🌐 For Production (Render):

### Backend on Render needs updating:

1. Go to your backend service on Render
2. Go to "Environment" tab
3. Update this variable:

   ```
   FRONTEND_URL=https://your-frontend-app.onrender.com
   ```

   **CRITICAL:** Use your ACTUAL frontend URL from Render!

4. Click "Manual Deploy" → "Clear build cache & deploy"

5. Wait for deployment to complete

6. Test on production site

### Frontend for Production:

When deploying frontend to production, update `frontend/.env`:

```env
REACT_APP_API_URL=https://itp-project-backend-new-01.onrender.com
```

---

## 📊 Test Results Summary:

✅ **SMTP Connection:** Working (tested successfully)
✅ **Email Sending:** Working (test email sent)
✅ **Backend .env:** Correctly configured
✅ **Frontend .env:** Fixed to use localhost
❓ **Backend Server:** Needs restart
❓ **Frontend Server:** Needs restart

---

## 🔍 Common Errors & Solutions:

### Error: "Network Error" or "Connection Refused"

**Cause:** Backend not running or wrong URL

**Solution:**

- Make sure backend is running on port 5000
- Check frontend is using `http://localhost:5000`

### Error: Email sent but link doesn't work

**Cause:** Wrong `FRONTEND_URL` in backend

**Solution:**

- Verify `FRONTEND_URL=http://localhost:3000` in backend/.env
- Restart backend server

### Error: "Failed to send email"

**Cause:** Backend using old configuration

**Solution:**

- Kill all node processes
- Restart backend fresh
- Check for "Email service is ready" message

---

## 📝 Final Checklist:

For **LOCAL TESTING:**

- [ ] Backend `.env` has `FRONTEND_URL=http://localhost:3000`
- [ ] Frontend `.env` has `REACT_APP_API_URL=http://localhost:5000`
- [ ] All node processes killed and restarted
- [ ] Backend shows "Email service is ready"
- [ ] Frontend opens at http://localhost:3000
- [ ] Forgot password sends email successfully
- [ ] Email reset link points to localhost:3000

For **PRODUCTION (Render):**

- [ ] Backend environment has `FRONTEND_URL=https://your-frontend.onrender.com`
- [ ] Frontend `.env` has Render backend URL
- [ ] Both services deployed
- [ ] Test forgot password on production
- [ ] Email link points to production frontend

---

## 🎉 Expected Result:

After following these steps:

1. ✅ Test email works (already confirmed)
2. ✅ Forgot password emails send successfully
3. ✅ Password reset links work correctly
4. ✅ All email features functional

---

**Status:** Ready to test! Follow the steps above. 🚀
