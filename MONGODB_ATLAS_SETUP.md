# 🔒 MongoDB Atlas Configuration for Render

When deploying to Render, you need to allow Render's servers to connect to your MongoDB Atlas database.

## Steps to Configure MongoDB Atlas

### 1. Login to MongoDB Atlas

Go to https://cloud.mongodb.com and login

### 2. Navigate to Network Access

- Click on "Network Access" in the left sidebar
- Click "Add IP Address"

### 3. Allow Access from Anywhere (Recommended for Render)

Since Render uses dynamic IPs, the easiest solution is:

1. Click **"Allow Access from Anywhere"**
2. This will add `0.0.0.0/0` to your IP whitelist
3. Click **"Confirm"**

**Note:** This is safe because:

- Your database still requires username and password
- Connection string includes authentication
- MongoDB Atlas has built-in security features

### 4. Alternative: Add Specific Render IP Ranges (More Secure)

If you prefer more security, add these Render IP ranges:

For **Oregon (US West)** region:

```
35.160.186.188/32
54.186.204.205/32
52.40.4.217/32
```

For **Singapore** region:

```
52.77.224.88/32
54.251.140.56/32
13.229.187.59/32
```

For **Frankfurt** region:

```
18.195.58.239/32
3.127.73.28/32
52.59.231.190/32
```

**Note:** Add all IPs for your selected region. Render may use any of these IPs.

### 5. Verify Connection String

Your connection string should look like:

```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database?retryWrites=true&w=majority
```

Make sure:

- Replace `username` with your database user
- Replace `password` with your database password (no special characters or URL-encode them)
- Replace `database` with your database name
- Keep the connection options at the end

### 6. Test Connection

After deployment, check your Render backend logs to verify:

```
✅ Connected to MongoDB Atlas
✅ Database: your-database-name
```

## Troubleshooting MongoDB Connection Issues

### Issue: "MongoServerError: bad auth"

**Solution:**

- Verify database username and password
- Make sure password doesn't contain special characters (or URL-encode them)
- Check that user has read/write permissions

### Issue: "MongoTimeoutError: Server selection timed out"

**Solution:**

- Add `0.0.0.0/0` to MongoDB Atlas Network Access
- Verify connection string format
- Check if MongoDB Atlas cluster is running

### Issue: "ENOTFOUND" error

**Solution:**

- Verify cluster URL in connection string
- Check for typos in the connection string
- Ensure cluster is not paused (free tier auto-pauses after inactivity)

## Security Best Practices

1. **Use Strong Passwords**

   - Generate complex database passwords
   - Avoid special characters that need URL encoding

2. **Create Dedicated Database User**

   - Don't use the admin user
   - Create a specific user for your application
   - Grant only necessary permissions

3. **Monitor Access**

   - Check MongoDB Atlas logs regularly
   - Set up alerts for unusual activity

4. **Backup Your Data**
   - Enable automatic backups in MongoDB Atlas
   - Test restore procedures

## Creating a Database User

1. In MongoDB Atlas, go to **Database Access**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username: `itpProject` (or your preferred name)
5. Generate a strong password (or use existing: `itpProject`)
6. Set privileges: **"Read and write to any database"**
7. Click **"Add User"**

## Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority&appName=<appname>
```

**Example:**

```
mongodb+srv://itpProject:itpProject@clusteritp.wd1qzuc.mongodb.net/millanium-werksatt?retryWrites=true&w=majority&appName=ClusterITP
```

---

## Quick Setup Summary

1. ✅ Login to MongoDB Atlas
2. ✅ Network Access → Add IP → Allow Access from Anywhere (0.0.0.0/0)
3. ✅ Database Access → Verify user exists with read/write permissions
4. ✅ Copy connection string
5. ✅ Add to Render backend environment variables as `MONGODB_URI`
6. ✅ Deploy and check logs

---

**Your MongoDB Atlas is now ready for Render deployment! 🎉**
