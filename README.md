# 🚗 Millanium Werksatt - Garage Management System

This is an Industry Level Web Application built using the MERN Stack for the ITP Project.

## 🌟 Features

- **Customer Management**: Register, login, manage vehicles and appointments
- **Job Management**: Create, track, and manage service jobs
- **Employee Management**: Assign jobs to employees and track progress
- **Inventory Management**: Track parts and supplies
- **Appointment Scheduling**: Book and manage service appointments
- **Payment Processing**: PayPal integration for secure payments
- **Email Notifications**: Automated email notifications for various events
- **Feedback System**: Customer feedback and reviews
- **Newsletter System**: Subscribe and send bulk emails
- **Admin Dashboard**: Comprehensive dashboard with analytics

## 🛠️ Tech Stack

### Frontend

- React.js
- Material-UI (MUI)
- React Router
- Axios
- Recharts (for analytics)
- jsPDF (for PDF generation)

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer (email service)
- PayPal SDK
- Cloudinary (image uploads)

## 📦 Project Structure

```
├── frontend/          # React frontend application
├── backend/           # Node.js/Express backend API
├── docs/             # Documentation files
└── [config files]    # Various configuration files
```

## 🚀 Deployment

This application is ready to be deployed on Render. For detailed deployment instructions, see:

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete step-by-step deployment guide
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Quick reference checklist
- **[MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)** - MongoDB Atlas configuration

## 🏃‍♂️ Running Locally

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Gmail account for email service
- Cloudinary account for image uploads
- PayPal developer account

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file (use `.env.example` as template):

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`

5. Start the server:

```bash
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📝 Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
SMTP_USER=your_email
SMTP_PASS=your_email_app_password
ADMIN_EMAIL=admin_email
FRONTEND_URL=http://localhost:3000
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
```

### Frontend

The frontend uses `proxy` in `package.json` for local development. For production, set:

```
REACT_APP_API_URL=your_backend_url
```

## 🧪 Testing

Backend tests can be run with:

```bash
cd backend
npm test
```

## 📄 License

MIT License

## 👥 Authors

ITP Project Team - SLIIT

## 🆘 Support

For deployment issues or questions, refer to the deployment guides or check the troubleshooting sections.
