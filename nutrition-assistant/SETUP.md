# Setup Instructions for Nutrition Assistant

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v16 or higher)
- npm (comes with Node.js)
- Git
- MongoDB Atlas account (free tier available)

## Project Structure

```
nutrition-assistant/
├── server/          # Backend - Node.js & Express
├── client/          # Frontend - React
├── README.md        # Main documentation
├── SETUP.md         # This file
├── API_DOCUMENTATION.md
└── .gitignore
```

## Installation Steps

### 1. Clone or Navigate to Project

```bash
cd nutrition-assistant
```

### 2. Backend Setup

#### 2.1 Navigate to server directory
```bash
cd server
```

#### 2.2 Install dependencies
```bash
npm install
```

#### 2.3 Create .env file
Create a `.env` file in the server directory with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutrition-assistant

# JWT
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here_minimum_32_characters
REFRESH_TOKEN_EXPIRE=30d

# Email Service (Gmail)
SMTP_SERVICE=gmail
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here
SMTP_FROM=nutrition-assistant@gmail.com

# Client URL
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5242880

# Admin Email
ADMIN_EMAIL=admin@nutrition-assistant.com
```

#### 2.4 MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new project
4. Create a new cluster (free tier)
5. Create a database user with username and password
6. Whitelist your IP address
7. Get your connection string
8. Replace in `.env` file:
   - Replace `username` with your database user
   - Replace `password` with your database password
   - Replace `cluster` with your cluster name

#### 2.5 Gmail App Password Setup (for email sending)

1. Enable 2-factor authentication on your Gmail account
2. Go to [Google Account Security](https://myaccount.google.com/security)
3. Select "App passwords"
4. Generate a password for "Mail" and "Windows Computer"
5. Copy the generated password and use it as `SMTP_PASSWORD` in .env

#### 2.6 Start Backend Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 3. Frontend Setup

#### 3.1 Open new terminal and navigate to client directory
```bash
cd client
```

#### 3.2 Install dependencies
```bash
npm install
```

#### 3.3 Create .env.local file
Create `.env.local` in the client directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

#### 3.4 Start Frontend Development Server
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## Verification

### Backend Verification
- Check `http://localhost:5000/api/health`
- You should see: `{ "status": "Server is running", "timestamp": "..." }`

### Frontend Verification
- Check `http://localhost:3000`
- You should see the Nutrition Assistant landing page

## Testing the Application

### 1. Create Test Accounts

#### Regular User Account
1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Select "Regular User"
4. Fill in details and create account

#### Dietitian Account
1. Go to `http://localhost:3000`
2. Click "Sign Up"
3. Select "Dietitian"
4. Fill in details and create account
5. Wait for admin approval (or use MongoDB compass to manually approve)

#### Admin Access
- Create a user and manually set role to "admin" in MongoDB
- Or contact the development team for admin credentials

### 2. Test Key Features

#### As Regular User:
- [ ] Login to dashboard
- [ ] View and edit profile
- [ ] View assigned meal plans
- [ ] Log daily progress
- [ ] View progress charts

#### As Dietitian:
- [ ] Login to dashboard
- [ ] View assigned clients
- [ ] Create/update meal plans
- [ ] Monitor client progress
- [ ] View client analytics

#### As Admin:
- [ ] View all users
- [ ] Approve dietitian registrations
- [ ] View platform analytics
- [ ] Delete users if needed

## Common Issues and Solutions

### Issue: MongoDB Connection Error
**Solution:**
- Verify MongoDB URI in .env
- Check IP whitelist in MongoDB Atlas
- Ensure database user credentials are correct
- Verify your internet connection

### Issue: Email Not Sending
**Solution:**
- Verify Gmail app password is correct
- Ensure 2-factor authentication is enabled
- Check SMTP settings in .env
- Allow less secure apps if needed

### Issue: Frontend Not Connecting to Backend
**Solution:**
- Verify `REACT_APP_API_URL` in .env.local
- Ensure backend is running on port 5000
- Check CORS settings in backend
- Clear browser cache and restart frontend

### Issue: JWT Token Errors
**Solution:**
- Verify `JWT_SECRET` length (minimum 32 characters)
- Clear browser localStorage
- Login again
- Check token expiration settings

### Issue: Port Already in Use
**Solution:**
- Backend: Change PORT in .env
- Frontend: Change port with: `PORT=3001 npm start`
- Or kill process using the port

## Project Structure Details

### Backend Structure
```
server/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── email.js         # Email configuration
├── controllers/         # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── clientController.js
│   ├── mealPlanController.js
│   ├── progressController.js
│   └── adminController.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── validation.js
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Client.js
│   ├── MealPlan.js
│   └── Progress.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── clientRoutes.js
│   ├── mealPlanRoutes.js
│   ├── progressRoutes.js
│   └── adminRoutes.js
├── utils/               # Utility functions
│   ├── bmiCalculator.js
│   └── emailService.js
├── validators/          # Input validators
│   └── inputValidators.js
├── uploads/             # User uploaded files
├── server.js            # Entry point
├── .env.example
├── package.json
└── .gitignore
```

### Frontend Structure
```
client/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Toast.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── MealCard.jsx
│   │   └── ProgressChart.jsx
│   ├── pages/           # Page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard pages
│   │   └── ...
│   ├── contexts/        # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   ├── services/        # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── clientService.js
│   │   ├── mealPlanService.js
│   │   └── progressService.js
│   ├── hooks/           # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   └── useNotification.js
│   ├── styles/          # CSS files
│   │   └── index.css
│   ├── App.jsx          # Main app component
│   ├── index.js         # Entry point
│   └── ...
├── public/
│   └── index.html
├── package.json
├── .env.example
└── .gitignore
```

## Deployment

### Backend Deployment (Heroku)
1. Create Heroku account
2. Create new app
3. Connect GitHub repository
4. Set environment variables in Heroku dashboard
5. Deploy

### Frontend Deployment (Vercel/Netlify)
1. Build frontend: `npm run build`
2. Deploy build folder to Vercel/Netlify
3. Set API URL to production backend

## Additional Documentation

- See `API_DOCUMENTATION.md` for detailed API endpoints
- See `README.md` for features and overview

## Support

For issues or questions:
1. Check this setup guide
2. Review API documentation
3. Check browser console for errors
4. Check backend logs for errors
5. Contact development team

## Next Steps

1. Customize branding and colors
2. Add more features as needed
3. Set up CI/CD pipeline
4. Add automated testing
5. Deploy to production
