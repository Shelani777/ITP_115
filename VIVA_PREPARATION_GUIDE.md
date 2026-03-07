# VIVA PREPARATION GUIDE
## ITP Project - Authentication & User Management Module

**Your Module Components:**
1. JWT Authentication
2. Role-Based Access Control
3. User Management (Admin, Customer, Employee)
4. Vehicle Management linked with Customer

---

## 1. JWT AUTHENTICATION

### 1.1 What is JWT and Why Did You Use It?

**Answer:**
JWT (JSON Web Token) is a stateless authentication mechanism that doesn't require server-side session storage. I chose JWT because:
- **Stateless**: No need to store sessions in the database, reducing server load
- **Scalable**: Works well with multiple servers/microservices
- **Self-contained**: Token contains all necessary user information
- **Cross-domain**: Can be used across different domains/APIs

### 1.2 How JWT Works in Your System

**Token Generation Flow:**
```
User Login → Validate Credentials → Generate JWT Token → Send to Client
```

**Code Explanation:**
```javascript
// Location: backend/routes/auth.js
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE, // e.g., "7d" for 7 days
  });
};
```

**Key Points:**
- Token contains user ID as payload
- Signed with `JWT_SECRET` (environment variable for security)
- Has expiration time (configurable, e.g., 7 days)
- Token structure: `header.payload.signature`

### 1.3 How JWT is Verified

**Token Verification Flow:**
```
Client Request with Token → Extract Token from Header → Verify Signature → 
Decode Payload → Find User → Attach to Request → Continue
```

**Code Explanation:**
```javascript
// Location: backend/middleware/auth.js
const protect = async (req, res, next) => {
  let token;
  
  // 1. Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Get token after "Bearer "
  }

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // 3. Verify token signature and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Get user from database using decoded ID
    req.user = await User.findById(decoded.id).select('-password');
    
    // 5. Check if user is active
    if (!req.user.isActive) {
      return res.status(401).json({ message: 'Account is inactive' });
    }
    
    next(); // Proceed to next middleware/route
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
```

**Key Security Points:**
- Token sent as: `Authorization: Bearer <token>`
- Verified using same secret key
- Invalid/expired tokens are rejected
- User must be active to proceed

---

## 2. ROLE-BASED ACCESS CONTROL (RBAC)

### 2.1 What is RBAC and Why Implement It?

**Answer:**
RBAC restricts system access based on user roles. I implemented it to:
- **Security**: Prevent unauthorized access to admin/employee functions
- **Separation of Concerns**: Different users have different permissions
- **Data Protection**: Customers can only access their own data

### 2.2 Three Roles in Your System

| Role | Access Level | Key Permissions |
|------|-------------|-----------------|
| **Admin** | Full access | Manage all users, employees, vehicles, appointments, jobs, inventory |
| **Employee** | Limited admin | Manage jobs, appointments, vehicles (no user management) |
| **Customer** | Personal only | View/manage own vehicles, appointments, jobs |

### 2.3 How RBAC is Implemented

**Admin-Only Middleware:**
```javascript
// Location: backend/middleware/auth.js
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Allow access
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};
```

**Customer or Admin Middleware:**
```javascript
const customerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'customer' || req.user.role === 'admin')) {
    next(); // Allow access
  } else {
    res.status(403).json({ message: 'Not authorized' });
  }
};
```

**Usage Example:**
```javascript
// Admin-only route
router.get('/api/users', protect, admin, getAllUsers);

// Customer or Admin route
router.get('/api/vehicles/:id', protect, customerOrAdmin, getVehicle);

// Any authenticated user route
router.get('/api/auth/me', protect, getCurrentUser);
```

**Key Points:**
- `protect` middleware runs first (validates JWT)
- Role middleware runs second (checks user role)
- Return 401 for authentication failure, 403 for authorization failure

---

## 3. USER MANAGEMENT

### 3.1 User Schema Structure

**User Model Fields:**
```javascript
// Location: backend/models/User.js
{
  // Personal Information
  firstName: String (required, max 50 chars)
  lastName: String (required, max 50 chars)
  email: String (required, unique, lowercase)
  password: String (required, hashed)
  phone: String (required)
  avatar: String (URL, optional)
  
  // Address
  address: {
    street: String
    city: String
    state: String
    zipCode: String
    country: String (default: 'Sri Lanka')
  }
  
  // Role & Status
  role: String (enum: ['customer', 'admin', 'employee'], default: 'customer')
  isActive: Boolean (default: true)
  employeeId: String (only for employees)
  
  // Security
  passwordHistory: [{ password, createdAt }] // Last 5 passwords
  accountSecurity: {
    failedLoginAttempts: Number
    lockUntil: Date
    lastFailedLogin: Date
    loginHistory: [{ timestamp, ip, userAgent, success }] // Last 20 attempts
  }
  passwordChangedAt: Date
  passwordResetToken: String
  passwordResetExpire: Date
  lastLogin: Date
  
  // Vehicles (embedded)
  vehicles: [{
    make, model, year, licensePlate, vin, 
    color, mileage, notes, createdAt, updatedAt
  }]
  
  // Timestamps
  createdAt, updatedAt (automatic)
}
```

### 3.2 Password Security Implementation

**A. Password Hashing**
```javascript
// Pre-save middleware - runs before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password not changed
  
  const salt = await bcrypt.genSalt(12); // Generate salt (12 rounds)
  this.password = await bcrypt.hash(this.password, salt); // Hash password
  next();
});
```

**Key Points:**
- Uses bcrypt with 12 salt rounds (strong security)
- Only hashes when password is new/modified
- Original password is never stored

**B. Password Comparison**
```javascript
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

**C. Password Policy**
```javascript
userSchema.methods.validatePasswordStrength = function (password) {
  const errors = [];
  
  // Check length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  // Check for special characters
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for personal info (firstName, lastName, email)
  const personalInfo = [
    this.firstName?.toLowerCase(),
    this.lastName?.toLowerCase(),
    this.email?.split('@')[0]?.toLowerCase()
  ];
  
  if (personalInfo.some(info => info && password.toLowerCase().includes(info))) {
    errors.push('Password cannot contain personal information');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: errors.length === 0 ? 'Strong' : 'Weak'
  };
};
```

**D. Password History (Prevent Reuse)**
```javascript
// Check if password was used before
userSchema.methods.checkPasswordHistory = async function (newPassword) {
  const history = this.passwordHistory || [];
  
  for (const oldPassword of history) {
    const isMatch = await bcrypt.compare(newPassword, oldPassword.password);
    if (isMatch) {
      return false; // Password was used before
    }
  }
  return true; // New password
};

// Store password in history
this.passwordHistory = this.passwordHistory || [];
this.passwordHistory.unshift({
  password: this.password, // Hashed password
  createdAt: new Date()
});
this.passwordHistory = this.passwordHistory.slice(0, 5); // Keep only last 5
```

**Constants:**
```javascript
const PASSWORD_HISTORY_LIMIT = 5; // Remember last 5 passwords
```

### 3.3 Account Lockout Mechanism

**Purpose:** Prevent brute force attacks

**Configuration:**
```javascript
const MAX_LOGIN_ATTEMPTS = 5; // Lock after 5 failed attempts
const LOCK_TIME = 30 * 60 * 1000; // Lock for 30 minutes
```

**A. Virtual Property - Check if Account is Locked**
```javascript
userSchema.virtual('isLocked').get(function () {
  return !!(this.accountSecurity?.lockUntil && this.accountSecurity.lockUntil > Date.now());
});
```

**B. Increment Failed Login Attempts**
```javascript
userSchema.methods.incLoginAttempts = async function (ip, userAgent) {
  // Initialize if not exists
  if (!this.accountSecurity) {
    this.accountSecurity = {
      failedLoginAttempts: 0,
      loginHistory: []
    };
  }
  
  // If lock expired, reset
  if (this.accountSecurity.lockUntil && this.accountSecurity.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { 'accountSecurity.failedLoginAttempts': 1 },
      $unset: { 'accountSecurity.lockUntil': 1 }
    });
  }
  
  // Increment failed attempts
  const updates = { 
    $inc: { 'accountSecurity.failedLoginAttempts': 1 },
    $set: { 'accountSecurity.lastFailedLogin': new Date() }
  };
  
  // Lock account if max attempts reached
  if (this.accountSecurity.failedLoginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
    updates.$set['accountSecurity.lockUntil'] = new Date(Date.now() + LOCK_TIME);
  }
  
  // Track login attempt
  updates.$push = {
    'accountSecurity.loginHistory': {
      $each: [{
        timestamp: new Date(),
        ip,
        userAgent,
        success: false
      }],
      $slice: -20 // Keep only last 20 attempts
    }
  };
  
  return this.updateOne(updates);
};
```

**C. Reset on Successful Login**
```javascript
userSchema.methods.resetLoginAttempts = async function (ip, userAgent) {
  return this.updateOne({
    $set: { 
      'accountSecurity.failedLoginAttempts': 0,
      lastLogin: new Date()
    },
    $unset: { 'accountSecurity.lockUntil': 1 },
    $push: {
      'accountSecurity.loginHistory': {
        $each: [{
          timestamp: new Date(),
          ip,
          userAgent,
          success: true
        }],
        $slice: -20
      }
    }
  });
};
```

**Login Flow with Account Lockout:**
```
1. User submits credentials
2. Middleware checks if account is locked
   → If locked, return 403 "Account temporarily locked"
3. Find user by email
4. Compare password
   → If wrong: increment failed attempts, return 401
   → If correct: reset failed attempts, generate token, return 200
```

### 3.4 User CRUD Operations

**A. Register (Create User)**
```javascript
// Route: POST /api/auth/register
// Validation: firstName, lastName, email, password, phone
// Steps:
1. Validate input fields
2. Check if email already exists
3. Validate password strength
4. Create user (password automatically hashed)
5. Generate JWT token
6. Return user info + token
```

**B. Get All Users (Admin Only)**
```javascript
// Route: GET /api/users
// Protected: protect, admin middleware
// Features:
- Search by name/email
- Filter by role
- Pagination
- Sort by createdAt
```

**C. Update User (Admin)**
```javascript
// Route: PUT /api/users/:id
// Protected: protect, admin
// Allowed updates: firstName, lastName, phone, address, role, isActive
// Password update requires separate endpoint for security
```

**D. Delete User (Admin)**
```javascript
// Route: DELETE /api/users/:id
// Protected: protect, admin
// Soft delete: Set isActive = false (preserves data)
// Hard delete: Remove from database (permanent)
```

---

## 4. VEHICLE MANAGEMENT LINKED WITH CUSTOMER

### 4.1 Design Decision: Embedded vs Separate Collection

**You chose EMBEDDED approach (vehicles array in User document)**

**Why Embedded?**
- **1:N Relationship**: One customer has multiple vehicles
- **Always accessed together**: When viewing customer, always need their vehicles
- **Better performance**: Single query instead of join/populate
- **Atomic updates**: Update user and vehicles in one transaction

**Alternative (Separate Collection) - Why NOT chosen:**
- Would require populate/join operations
- More complex queries
- Two separate database operations for user + vehicles

### 4.2 Vehicle Schema (Embedded in User)

```javascript
vehicles: [{
  make: { type: String, required: true },        // e.g., "Toyota"
  model: { type: String, required: true },       // e.g., "Corolla"
  year: { type: Number, required: true },        // e.g., 2020
  licensePlate: { type: String, required: true, unique: true }, // e.g., "ABC-1234"
  vin: { type: String, required: true, unique: true },          // Vehicle ID Number
  color: String,                                 // e.g., "Blue"
  mileage: Number,                               // e.g., 50000
  notes: String,                                 // Additional info
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
}]
```

### 4.3 Vehicle Operations

**A. Add Vehicle to Customer**
```javascript
// Route: POST /api/users/:userId/vehicles
// Protected: protect, admin or customerOrAdmin
// Steps:
1. Find user by ID
2. Validate vehicle data (licensePlate unique, year valid)
3. Push vehicle to user.vehicles array
4. Save user document
5. Return updated user with vehicles
```

**B. Get Customer Vehicles**
```javascript
// Route: GET /api/users/:userId/vehicles
// Protected: protect, customerOrAdmin
// Access control:
- Admin: Can view any customer's vehicles
- Customer: Can only view own vehicles
  if (req.user.role === 'customer' && req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }
```

**C. Update Vehicle**
```javascript
// Route: PUT /api/users/:userId/vehicles/:vehicleId
// Protected: protect, admin or owner
// Steps:
1. Find user
2. Find vehicle in vehicles array by _id
3. Update vehicle fields
4. Set updatedAt timestamp
5. Save user document
```

**D. Delete Vehicle**
```javascript
// Route: DELETE /api/users/:userId/vehicles/:vehicleId
// Protected: protect, admin or owner
// Steps:
1. Find user
2. Filter out vehicle from array
3. Save user document
```

**Code Example:**
```javascript
// Add vehicle
user.vehicles.push({
  make: 'Toyota',
  model: 'Corolla',
  year: 2020,
  licensePlate: 'ABC-1234',
  vin: '1HGBH41JXMN109186',
  color: 'Blue',
  mileage: 50000
});
await user.save();

// Find vehicle
const vehicle = user.vehicles.id(vehicleId); // Mongoose subdocument method

// Update vehicle
vehicle.make = 'Honda';
vehicle.updatedAt = new Date();
await user.save();

// Delete vehicle
user.vehicles.pull(vehicleId); // or user.vehicles.id(vehicleId).remove();
await user.save();
```

### 4.4 Frontend Vehicle Management

**Admin View (AdminVehiclePage.js):**
- View ALL customers' vehicles in a table
- Columns: Owner (avatar + name), Make, Model, Year, License Plate, VIN, Color, Mileage, Notes, Actions
- Actions: 3-dot menu with Edit and Delete options
- Create new vehicle: Select customer from dropdown

**Customer View (MyVehiclePage.js):**
- View only OWN vehicles
- Add/Edit/Delete own vehicles
- Cannot see other customers' vehicles

---

## 5. COMMON VIVA QUESTIONS & ANSWERS

### Q1: Why did you choose JWT over session-based authentication?

**Answer:**
I chose JWT because:
1. **Stateless**: No need to store sessions in database, reducing server load and complexity
2. **Scalable**: Works perfectly with multiple servers or microservices without session synchronization
3. **Modern standard**: Industry-standard for REST APIs and SPAs
4. **Cross-domain**: Can authenticate across different domains/services
5. **Mobile-friendly**: Easy to implement in mobile apps (no cookie management)

**Trade-off acknowledged**: JWTs cannot be invalidated before expiry (unless you implement a blacklist), but we mitigate this with short expiration times.

---

### Q2: How do you prevent JWT token theft?

**Answer:**
We implement multiple security measures:
1. **HTTPS Only**: Tokens transmitted over encrypted connection (production requirement)
2. **Short expiration**: Token expires in 7 days (configurable)
3. **Secure storage**: Frontend stores token in localStorage (not cookies to avoid CSRF)
4. **Active user check**: Even with valid token, user must be active in database
5. **Account lockout**: Prevents brute force attacks even if token is compromised

**Additional measures we could add**: Refresh tokens, token blacklist, IP validation

---

### Q3: Explain the difference between Authentication and Authorization in your system.

**Answer:**

**Authentication** = "Who are you?"
- JWT token verification (`protect` middleware)
- Validates user identity
- Returns 401 (Unauthorized) if fails

**Authorization** = "What can you do?"
- Role-based access control (`admin`, `customerOrAdmin` middleware)
- Validates user permissions
- Returns 403 (Forbidden) if fails

**Example:**
```javascript
// Authentication only - any logged-in user can access
router.get('/api/auth/me', protect, getCurrentUser);

// Authentication + Authorization - only admin can access
router.get('/api/users', protect, admin, getAllUsers);
```

---

### Q4: Why did you hash passwords with bcrypt instead of using SHA-256?

**Answer:**
Bcrypt is specifically designed for password hashing because:
1. **Slow by design**: Takes time to compute (prevents brute force)
2. **Salted**: Each password gets unique salt (prevents rainbow table attacks)
3. **Adaptive**: Can increase rounds as computers get faster (future-proof)
4. **Industry standard**: Used by major companies (GitHub, Facebook, etc.)

SHA-256 is fast (designed for data integrity), which is BAD for passwords. An attacker can try billions of SHA-256 hashes per second, but only thousands of bcrypt hashes.

**Our implementation**: 12 salt rounds (recommended: 10-12)

---

### Q5: How does your account lockout mechanism prevent brute force attacks?

**Answer:**
We implement a progressive lockout system:

1. **Tracking**: Track every failed login attempt with IP and user agent
2. **Threshold**: After 5 failed attempts, account locks for 30 minutes
3. **Automatic unlock**: Lock expires after 30 minutes (no admin intervention needed)
4. **Login history**: Store last 20 login attempts (success/failure) for audit

**Key security features:**
- Can't bypass by using different browsers (tracks by email)
- Admin can manually unlock if needed
- Failed attempts reset on successful login
- User sees remaining attempts (UX feedback)

**Flow:**
```
Attempt 1-4: Track failed attempt, return 401 with remaining attempts
Attempt 5: Lock account for 30 minutes, return 403
After 30 min: Automatic unlock
Successful login: Reset counter to 0
```

---

### Q6: Why did you embed vehicles in User model instead of creating a separate Vehicle collection?

**Answer:**
I chose embedded approach because:

**Pros of Embedding:**
1. **Single query**: Get user and all vehicles in one operation
2. **Atomic updates**: Update user and vehicles together (data consistency)
3. **Better performance**: No need for populate/join operations
4. **Simple queries**: user.vehicles gives all vehicles immediately

**When would you use separate collection?**
- If vehicles need to be accessed independently (without user context)
- If vehicles have many-to-many relationships
- If vehicle documents are very large (MongoDB has 16MB limit)

**Our case**: Vehicles always accessed in context of owner (customer), so embedding makes sense.

---

### Q7: How do you handle password changes securely?

**Answer:**
We implement comprehensive password change security:

1. **Current password verification**: Must provide current password (prevents unauthorized changes)
2. **Password strength validation**: Enforce same policy as registration
3. **Password history check**: Block reuse of last 5 passwords
4. **Personal info check**: Password cannot contain name/email
5. **Timestamp tracking**: Update `passwordChangedAt` field
6. **Auto-logout**: Could invalidate existing tokens (force re-login)

**Code flow:**
```javascript
1. Verify current password
2. Validate new password strength
3. Check new password not in history
4. Check new password doesn't contain personal info
5. Hash new password (pre-save hook)
6. Add old password to history (keep last 5)
7. Update passwordChangedAt timestamp
8. Save user
```

---

### Q8: What is the role of middleware in your authentication system?

**Answer:**
Middleware functions run BEFORE route handlers and provide reusable authentication/authorization logic:

**Middleware Chain:**
```javascript
router.get('/api/users', protect, admin, getAllUsers);
// Execution order: protect → admin → getAllUsers
```

**1. protect Middleware** (Authentication):
- Extracts JWT from Authorization header
- Verifies token signature
- Loads user from database
- Checks user is active
- Attaches user to `req.user`

**2. admin Middleware** (Authorization):
- Checks `req.user.role === 'admin'`
- Returns 403 if not admin

**3. customerOrAdmin Middleware** (Flexible Authorization):
- Allows both admin and customer roles
- Used for routes where customer can access own data

**Benefits:**
- Code reusability (write once, use everywhere)
- Separation of concerns (auth logic separate from business logic)
- Easy to maintain (change in one place applies everywhere)
- Composition (combine multiple middleware for complex access control)

---

### Q9: How would you explain your entire authentication flow from login to accessing protected resources?

**Answer:**
Let me walk you through the complete flow:

**STEP 1: User Login (POST /api/auth/login)**
```
1. Client sends { email, password }
2. Server validates input
3. Middleware checks if account is locked
4. Find user by email
5. Compare password using bcrypt
   → If wrong: increment failed attempts, return 401
   → If correct: continue
6. Check if password expired (needs change)
7. Reset failed login attempts
8. Generate JWT token with user ID
9. Update lastLogin timestamp
10. Track successful login in history
11. Return { user info, token }
```

**STEP 2: Client Stores Token**
```
Client receives token and stores in localStorage
Every subsequent request includes: Authorization: Bearer <token>
```

**STEP 3: Access Protected Resource (GET /api/users)**
```
1. Client sends request with Authorization header
2. protect middleware:
   a. Extract token from "Bearer <token>"
   b. Verify token signature with JWT_SECRET
   c. Decode payload to get user ID
   d. Find user in database
   e. Check user.isActive === true
   f. Attach user to req.user
3. admin middleware:
   a. Check req.user.role === 'admin'
   b. If not, return 403
4. Route handler:
   a. Execute business logic
   b. Return response
```

**STEP 4: Token Expiration**
```
After 7 days (JWT_EXPIRE):
- Token becomes invalid
- jwt.verify() throws error
- protect middleware returns 401
- Client redirects to login page
```

**Key Points:**
- Token is self-contained (no database lookup for token itself)
- User data is verified on every request (checks isActive)
- Middleware chain ensures both authentication AND authorization
- Failed requests don't expose sensitive information

---

### Q10: What security vulnerabilities did you consider and how did you mitigate them?

**Answer:**

| Vulnerability | Mitigation |
|---------------|-----------|
| **Brute Force Attacks** | Account lockout (5 attempts, 30 min), rate limiting on login endpoint |
| **Password Cracking** | Bcrypt with 12 rounds, password strength requirements |
| **Token Theft** | HTTPS only, short expiration, active user check |
| **SQL Injection** | MongoDB (NoSQL), Mongoose sanitization, input validation |
| **XSS Attacks** | Input sanitization, Content-Security-Policy headers |
| **CSRF Attacks** | JWT in header (not cookies), SameSite cookie attribute |
| **Password Reuse** | Password history (block last 5), force password change |
| **Personal Info in Password** | Validate password doesn't contain name/email |
| **Unauthorized Access** | Role-based middleware, owner verification |
| **Account Enumeration** | Generic error messages ("Invalid credentials" not "Email not found") |

**Additional Security Measures:**
- Input validation with express-validator
- Email normalization (lowercase)
- Password trimming (remove spaces)
- Login history tracking (audit trail)
- Failed login notifications (could email user)
- Two-factor authentication (future enhancement)

---

## 6. DEMONSTRATION SCRIPT

### Demo 1: JWT Authentication Flow

**Scenario**: Show login, token generation, and protected route access

**Steps:**
1. Open Postman/Thunder Client
2. **POST** `http://localhost:5000/api/auth/login`
   ```json
   {
     "email": "customer@test.com",
     "password": "Password@123"
   }
   ```
3. Show response with token
4. Copy token
5. **GET** `http://localhost:5000/api/auth/me`
   - Headers: `Authorization: Bearer <token>`
6. Show user data returned
7. Try without token → Show 401 error
8. Try with invalid token → Show 401 error

---

### Demo 2: Role-Based Access Control

**Scenario**: Show admin can access user management, customer cannot

**Steps:**
1. Login as customer → Get token
2. **GET** `http://localhost:5000/api/users` with customer token
   - Show 403 Forbidden error
3. Login as admin → Get token
4. **GET** `http://localhost:5000/api/users` with admin token
   - Show list of all users
5. Explain: Same endpoint, different results based on role

---

### Demo 3: Account Lockout

**Scenario**: Show brute force protection

**Steps:**
1. Login with wrong password
2. Show response: "Invalid credentials, remaining attempts: 4"
3. Repeat 4 more times
4. On 5th attempt, show: "Account locked for 30 minutes"
5. Try with correct password → Still locked
6. Show in database: `accountSecurity.lockUntil` timestamp
7. Manually unlock by setting `lockUntil` to past date
8. Login successfully

---

### Demo 4: Password Security

**Scenario**: Show password validation and history

**Steps:**
1. **POST** `/api/auth/register` with weak password
   - "password" → Show error: "Must contain special character"
2. Try password with name in it
   - "john123@" → Show error: "Cannot contain personal info"
3. Try valid password
   - "SecurePass@123" → Success
4. Change password to same password
   - Show error: "Cannot reuse recent password"

---

### Demo 5: Vehicle Management

**Scenario**: Show customer vehicle CRUD operations

**Steps:**
1. Login as customer → Get token
2. **GET** `/api/users/{userId}/vehicles`
   - Show customer's vehicles
3. **POST** `/api/users/{userId}/vehicles`
   ```json
   {
     "make": "Toyota",
     "model": "Corolla",
     "year": 2020,
     "licensePlate": "ABC-1234",
     "vin": "1HGBH41JXMN109186",
     "color": "Blue",
     "mileage": 50000
   }
   ```
4. Show vehicle added
5. Try to access another customer's vehicles → Show 403
6. Login as admin
7. Access any customer's vehicles → Success

---

## 7. KEY TECHNICAL TERMS TO REMEMBER

- **JWT**: JSON Web Token
- **Bcrypt**: Password hashing algorithm
- **Salt**: Random data added before hashing
- **Middleware**: Function that runs before route handler
- **RBAC**: Role-Based Access Control
- **Authentication**: Verifying identity (who you are)
- **Authorization**: Verifying permissions (what you can do)
- **Stateless**: No server-side session storage
- **Token Payload**: Data encoded in JWT (user ID)
- **Token Signature**: Encrypted hash to verify integrity
- **Brute Force**: Automated attack trying many passwords
- **Rate Limiting**: Restricting number of requests
- **Account Lockout**: Temporary access suspension
- **Password Policy**: Rules for password creation
- **Embedded Document**: Subdocument stored within parent (vehicles in User)
- **Mongoose Schema**: Structure definition for MongoDB documents
- **Pre-save Hook**: Function that runs before saving to database
- **Virtual Property**: Computed field not stored in database (isLocked)

---

## 8. TIPS FOR VIVA

1. **Speak Confidently**: You built this, you understand it
2. **Use Real Examples**: Refer to your actual code
3. **Explain Trade-offs**: Every design decision has pros/cons
4. **Draw Diagrams**: Authentication flow, middleware chain, data model
5. **Admit Limitations**: If asked about something you didn't implement, explain how you would
6. **Show Code**: Have your project open, reference actual lines
7. **Connect to Theory**: Link implementation to concepts learned in class
8. **Security Focus**: Emphasize security measures (examiners love this)
9. **User Experience**: Mention UX considerations (error messages, remaining attempts)
10. **Future Enhancements**: Mention what you'd add with more time (2FA, refresh tokens, etc.)

---

## 9. POTENTIAL FOLLOW-UP QUESTIONS

**If examiner asks "What would you improve?"**

**Answer:**
1. **Refresh Tokens**: Short-lived access tokens + long-lived refresh tokens
2. **Two-Factor Authentication**: SMS/Email OTP for additional security
3. **OAuth Integration**: Allow login with Google/Facebook
4. **Token Blacklist**: Implement logout functionality
5. **Password Strength Meter**: Visual feedback during registration
6. **Email Verification**: Verify email before allowing login
7. **Suspicious Activity Detection**: IP changes, unusual login times
8. **Audit Logs**: Comprehensive logging of all user actions
9. **Role Hierarchy**: More granular permissions (super admin, manager, etc.)
10. **WebSocket Authentication**: Secure real-time communications

---

## 10. QUICK REFERENCE CHEAT SHEET

### Authentication Flow
```
Login → Validate → Generate JWT → Return Token → 
Client Stores → Include in Headers → Middleware Verifies → Grant Access
```

### Middleware Chain
```
protect → admin → Route Handler
(Authentication → Authorization → Business Logic)
```

### Password Security Layers
```
1. Strength Validation (8+ chars, special chars)
2. Personal Info Check (no name/email)
3. Password History (block last 5)
4. Bcrypt Hashing (12 rounds)
5. Account Lockout (5 failed attempts)
```

### RBAC Hierarchy
```
Admin > Employee > Customer
(Full Access > Limited Access > Personal Only)
```

### Vehicle-Customer Relationship
```
User (Customer) → vehicles: [Vehicle1, Vehicle2, ...]
(One-to-Many Embedded)
```

---

## FINAL CHECKLIST BEFORE VIVA

- [ ] Review this entire guide
- [ ] Test all authentication flows
- [ ] Practice explaining JWT in simple terms
- [ ] Draw authentication flow diagram on paper
- [ ] Prepare code examples to show
- [ ] Test account lockout mechanism
- [ ] Review password security features
- [ ] Understand RBAC middleware
- [ ] Know vehicle management design decision
- [ ] Practice speaking about security measures

**Good Luck! You've built a robust, secure authentication system with proper RBAC and user management. Be confident!** 🚀
