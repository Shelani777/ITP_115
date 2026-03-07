# 🚀 Quick Deployment Checklist

## Pre-Deployment

- [ ] Code is working locally
- [ ] `.gitignore` file exists and includes `.env`, `node_modules`
- [ ] All sensitive data is in environment variables, not hardcoded
- [ ] MongoDB Atlas database is set up and accessible
- [ ] Gmail App Password is generated
- [ ] Cloudinary account is set up
- [ ] PayPal sandbox credentials are ready
- [ ] Code is pushed to GitHub repository

## Backend Deployment (Render)

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Configure:
  - Name: `millanium-werksatt-backend`
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
- [ ] Add all environment variables (see list below)
- [ ] Deploy and copy backend URL

## Frontend Deployment (Render)

- [ ] Create new Static Site on Render
- [ ] Connect same GitHub repository
- [ ] Configure:
  - Name: `millanium-werksatt-frontend`
  - Root Directory: `frontend`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `build`
- [ ] Add environment variable: `REACT_APP_API_URL`
- [ ] Deploy and copy frontend URL

## Post-Deployment Configuration

- [ ] Update backend `FRONTEND_URL` with actual frontend URL
- [ ] Wait for backend to redeploy
- [ ] Test backend health: `https://your-backend.onrender.com/api/health`
- [ ] Test frontend is loading
- [ ] Test registration
- [ ] Test login
- [ ] Test main features
- [ ] Check logs for errors

## Environment Variables Required

### Backend (.env)

```
NODE_ENV=production
PORT=5000
MONGODB_URI=<from MongoDB Atlas>
JWT_SECRET=<long random string>
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=<from Cloudinary>
CLOUDINARY_API_KEY=<from Cloudinary>
CLOUDINARY_API_SECRET=<from Cloudinary>
SMTP_USER=<your gmail>
SMTP_PASS=<gmail app password>
ADMIN_EMAIL=<admin email>
FRONTEND_URL=<your frontend Render URL>
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=<from PayPal>
PAYPAL_CLIENT_SECRET=<from PayPal>
```

### Frontend (.env)

```
REACT_APP_API_URL=<your backend Render URL>
```

## Quick Commands

### Push to GitHub

```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

### Get Gmail App Password

1. Google Account → Security
2. Enable 2-Step Verification
3. Generate App Password
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password

### Get MongoDB URI

1. MongoDB Atlas → Database → Connect
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password

### Get Cloudinary Credentials

1. Cloudinary Dashboard
2. Copy Cloud Name, API Key, API Secret

### Get PayPal Credentials

1. PayPal Developer Dashboard
2. My Apps & Credentials
3. Create App (if needed)
4. Copy Client ID and Secret

## Common Issues

| Issue                        | Solution                                               |
| ---------------------------- | ------------------------------------------------------ |
| Backend not connecting to DB | Check MongoDB URI and whitelist Render IPs (0.0.0.0/0) |
| CORS errors                  | Verify FRONTEND_URL matches actual frontend URL        |
| API calls failing            | Check REACT_APP_API_URL in frontend                    |
| Service sleeping             | Free tier limitation, first request takes 30-60s       |
| Email not sending            | Use Gmail App Password, not regular password           |

## Support

- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Full Guide: See `DEPLOYMENT_GUIDE.md`

---

**Deployment Time:** ~20-30 minutes total
