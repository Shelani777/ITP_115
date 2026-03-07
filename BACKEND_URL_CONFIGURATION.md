# 🔗 Backend URL Configuration in Frontend

## 📍 Where Backend URL is Configured

The backend URL is configured in your frontend at:

```
frontend/src/services/api.js
```

---

## 🎯 Current Configuration (Line 3-7)

```javascript
// frontend/src/services/api.js

const rawApiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_URL = rawApiUrl.endsWith("/api")
  ? rawApiUrl
  : `${rawApiUrl.replace(/\/$/, "")}/api`;
```

### What This Does:

1. **Checks for Environment Variable:**

   ```javascript
   process.env.REACT_APP_API_URL;
   ```

   - In production (Render): Uses environment variable
   - In development (localhost): Falls back to default

2. **Default Value for Localhost:**

   ```javascript
   || "http://localhost:5000"
   ```

   - If no environment variable is set, uses: `http://localhost:5000`

3. **Ensures `/api` Suffix:**
   ```javascript
   : `${rawApiUrl.replace(/\/$/, "")}/api`
   ```
   - Final URL becomes: `http://localhost:5000/api`

---

## 📊 How Backend URL Changes

### ✅ For Local Development (Localhost)

**File:** `frontend/.env.local` (optional, if you create it)

```properties
REACT_APP_API_URL=http://localhost:5000
```

**Or leave it empty** - defaults to `http://localhost:5000`

**Result:**

```
Frontend: http://localhost:3000
Backend: http://localhost:5000/api
```

---

### 🌐 For Production (Render)

**File:** Render Dashboard → Frontend Service → Environment

```
REACT_APP_API_URL = https://millanium-werksatt-backend.onrender.com
```

**Result:**

```
Frontend: https://millanium-werksatt-frontend.onrender.com
Backend: https://millanium-werksatt-backend.onrender.com/api
```

---

## 🔍 Complete Flow

### 1. How Frontend Uses This URL

```javascript
// In api.js - Line 8-11
const api = axios.create({
  baseURL: API_URL, // This is "http://localhost:5000/api"
});
```

### 2. When You Make API Calls

Example from `frontend/src/services/api.js`:

```javascript
// Get customer dashboard
export const dashboardAPI = {
  getCustomerDashboard: () => api.get("/dashboard/customer"),
};
```

**What Actually Happens:**

```
axios.get("/dashboard/customer")
  ↓
baseURL: "http://localhost:5000/api"
  ↓
Full URL: "http://localhost:5000/api/dashboard/customer"
  ↓
Backend receives request at: /api/dashboard/customer
```

---

## 📝 All API Endpoints (20+ Endpoints)

From your `frontend/src/services/api.js`:

### Dashboard

```javascript
GET / api / dashboard / customer;
GET / api / dashboard / admin;
GET / api / dashboard / employee;
```

### Jobs

```javascript
GET    /api/jobs/customer
GET    /api/jobs/employee
GET    /api/jobs
GET    /api/jobs/:jobId
POST   /api/jobs
PUT    /api/jobs/:jobId
PUT    /api/jobs/:jobId/status
PATCH  /api/jobs/employee/:jobId
DELETE /api/jobs/:jobId
DELETE /api/jobs/employee/:jobId/allocations/:allocationId
```

### Appointments

```javascript
GET  /api/appointments/customer
GET  /api/appointments
POST /api/appointments
PUT  /api/appointments/:appointmentId
DELETE /api/appointments/:appointmentId
GET  /api/appointments/available-slots?date=...
```

### Users

```javascript
GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/auth/change-password
GET    /api/users/customers
GET    /api/users/customers/:customerId/vehicles
POST   /api/users/customers
PUT    /api/users/customers/:customerId
DELETE /api/users/customers/:customerId
POST   /api/users/customers/:customerId/vehicles
POST   /api/auth/profile/vehicles
PUT    /api/auth/profile/vehicles/:vehicleId
DELETE /api/auth/profile/vehicles/:vehicleId
```

### Employees

```javascript
GET  /api/employees
GET  /api/employees/:employeeId
GET  /api/employees/for-assignment
POST /api/employees
PUT  /api/employees/:employeeId
DELETE /api/employees/:employeeId
```

### Inventory

```javascript
GET  /api/inventory
GET  /api/inventory/all
GET  /api/inventory/:id
GET  /api/inventory/categories/list
GET  /api/inventory/alerts/low-stock
GET  /api/inventory/analytics/summary
POST /api/inventory
POST /api/inventory/:id/use
POST /api/inventory/:id/restock
PUT  /api/inventory/:id
DELETE /api/inventory/:id
```

### Vehicles

```javascript
GET    /api/vehicles
GET    /api/vehicles/:id
POST   /api/vehicles
PUT    /api/vehicles/:id
DELETE /api/vehicles/:id
```

### Auth

```javascript
POST / api / auth / login;
POST / api / auth / register;
POST / api / auth / logout;
POST / api / auth / forgot - password;
POST / api / auth / reset - password;
```

### Payments

```javascript
GET  /api/payments/pending
POST /api/payments/advance
GET  /api/payments/job/:jobId
POST /api/payments/invoice
GET  /api/payments/invoice/:jobId
POST /api/payments/invoice/:invoiceId/pay
POST /api/payments/paypal/create-order
POST /api/payments/paypal/capture-payment
POST /api/payments/customer/submit
POST /api/payments/manual
PUT  /api/payments/:paymentId/status
```

### Feedback

```javascript
POST   /api/feedback
GET    /api/feedback
GET    /api/feedback/homepage
GET    /api/feedback/:id
PATCH  /api/feedback/:id/approve
PATCH  /api/feedback/:id/push-to-homepage
PATCH  /api/feedback/:id/remove-from-homepage
DELETE /api/feedback/:id
```

### Contacts

```javascript
POST   /api/contacts
GET    /api/contacts
GET    /api/contacts/:id
PATCH  /api/contacts/:id/reply
PATCH  /api/contacts/:id/status
PATCH  /api/contacts/:id/notes
DELETE /api/contacts/:id
```

### Newsletter

```javascript
POST   /api/newsletter/subscribe
POST   /api/newsletter/unsubscribe
GET    /api/newsletter
POST   /api/newsletter/bulk-email
DELETE /api/newsletter/:id
```

---

## 🔧 How to Change Backend URL for Development

### Option 1: Create `.env.local` file (Recommended)

Create file: `frontend/.env.local`

```properties
# For localhost development
REACT_APP_API_URL=http://localhost:5000

# OR for production
# REACT_APP_API_URL=https://your-render-backend-url.onrender.com
```

Then restart React dev server:

```bash
npm start
```

### Option 2: Modify `.env` file

Edit: `frontend/.env` (if exists)

```properties
REACT_APP_API_URL=http://localhost:5000
```

### Option 3: System Environment Variable

```bash
# On Windows PowerShell
$env:REACT_APP_API_URL="http://localhost:5000"
npm start

# On Mac/Linux
export REACT_APP_API_URL="http://localhost:5000"
npm start
```

---

## ✅ For Production Deployment on Render

### 1. After Backend is Live

Get your backend URL from Render Dashboard:

```
https://millanium-werksatt-backend.onrender.com
```

### 2. Add to Frontend Service

In Render Dashboard → Frontend Service → Settings → Environment:

```
REACT_APP_API_URL = https://millanium-werksatt-backend.onrender.com
```

### 3. Redeploy Frontend

Click "Manual Deploy"

### 4. Frontend Will Automatically Use

```javascript
const API_URL = "https://millanium-werksatt-backend.onrender.com/api";
```

---

## 📋 Verification

### Check if Frontend is Using Correct Backend URL

1. **Open browser DevTools:**

   - Press: `F12` or `Ctrl+Shift+I`

2. **Go to Console tab**

3. **Check for logs like:**

   ```
   API Request: GET http://localhost:5000/api/dashboard/customer
   Full URL: http://localhost:5000/api/dashboard/customer
   ```

4. **Or check Network tab:**
   - Click on any request
   - Look at URL in Request Headers

### Example Console Output:

```
API Request: GET /dashboard/customer
Full URL: http://localhost:5000/api/dashboard/customer
API Response: 200 /dashboard/customer
```

---

## 🎯 Summary

| Environment             | Backend URL                                       | Configuration               |
| ----------------------- | ------------------------------------------------- | --------------------------- |
| **Local Development**   | `http://localhost:5000`                           | Default (or `.env.local`)   |
| **Production (Render)** | `https://millanium-werksatt-backend.onrender.com` | Render Environment Variable |

**File Location:** `frontend/src/services/api.js` (Line 3-7)

**All API calls go through this file** - so changing one URL affects the entire app!

---

## 🚀 Next Steps

1. **For localhost development:**

   - Keep backend running on port 5000
   - Frontend automatically uses: `http://localhost:5000`
   - Everything works!

2. **For Render production:**
   - Deploy backend to Render
   - Get backend URL
   - Add REACT_APP_API_URL to frontend environment
   - Redeploy frontend
   - Everything works!

**All set! Your frontend knows exactly where to find the backend! 🎉**
