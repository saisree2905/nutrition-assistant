# Nutrition Assistant - Full Stack MERN Application

A comprehensive nutrition management platform built with the MERN stack (MongoDB, Express, React, Node.js) that enables users, dietitians, and administrators to manage meal plans, track nutrition, and monitor health progress.

## Features

### User Features
- User authentication (Register, Login, Logout, Password Reset)
- Profile management with BMI calculation
- Track daily calorie and macro intake
- View assigned meal plans
- Monitor progress with charts
- Water intake tracking
- Daily reminders
- Export progress reports

### Dietitian Features
- Manage assigned clients
- Create and update meal plans
- Monitor client progress
- Generate nutrition recommendations
- View client analytics
- Track adherence metrics

### Admin Features
- User management
- Approve dietitian registrations
- View platform analytics
- System dashboard
- Manage all data

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Bootstrap 5 & React Bootstrap
- Chart.js & React ChartJS 2
- Context API for state management
- Responsive design

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password encryption
- Input validation with express-validator
- Security: Helmet, CORS
- Logging with Morgan
- File uploads with Multer

### Database
- MongoDB Atlas

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Git

### Backend Setup

1. Navigate to server directory:
```bash
cd nutrition-assistant/server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in server directory:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutrition-assistant
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=30d
NODE_ENV=development
SMTP_SERVICE=gmail
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=nutrition-assistant@example.com
```

4. Start backend server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd nutrition-assistant/client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in client directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start frontend development server:
```bash
npm start
```

Frontend runs on `http://localhost:3000`

## Project Structure

### Server Structure
```
server/
├── config/
│   ├── database.js
│   └── email.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── clientController.js
│   ├── mealPlanController.js
│   ├── progressController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── validation.js
│   └── roleCheck.js
├── models/
│   ├── User.js
│   ├── Client.js
│   ├── MealPlan.js
│   └── Progress.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── clientRoutes.js
│   ├── mealPlanRoutes.js
│   ├── progressRoutes.js
│   └── adminRoutes.js
├── utils/
│   ├── emailService.js
│   ├── validators.js
│   ├── bmiCalculator.js
│   └── errorResponse.js
├── validators/
│   └── inputValidators.js
├── uploads/
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

### Client Structure
```
client/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Toast.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── MealCard.jsx
│   │   └── ProgressChart.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── UserDashboard.jsx
│   │   ├── DietitianDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Profile.jsx
│   │   ├── EditProfile.jsx
│   │   ├── Clients.jsx
│   │   ├── MealPlans.jsx
│   │   ├── Progress.jsx
│   │   ├── Analytics.jsx
│   │   ├── NotFound.jsx
│   │   └── Unauthorized.jsx
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   └── AuthLayout.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── clientService.js
│   │   ├── mealPlanService.js
│   │   └── progressService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   └── useNotification.js
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── styles/
│   │   ├── index.css
│   │   ├── dashboard.css
│   │   └── responsive.css
│   ├── App.jsx
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── public/
    └── index.html
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/refresh-token` - Refresh JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-image` - Upload profile image
- `GET /api/users/stats` - Get user statistics

### Clients (Dietitian)
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Meal Plans
- `GET /api/meal-plans` - Get meal plans
- `POST /api/meal-plans` - Create meal plan
- `GET /api/meal-plans/:id` - Get meal plan details
- `PUT /api/meal-plans/:id` - Update meal plan
- `DELETE /api/meal-plans/:id` - Delete meal plan

### Progress
- `GET /api/progress` - Get progress records
- `POST /api/progress` - Log progress
- `GET /api/progress/:id` - Get progress details
- `PUT /api/progress/:id` - Update progress

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/users` - Get all users
- `GET /api/admin/dietitians` - Get all dietitians
- `PUT /api/admin/approve-dietitian/:id` - Approve dietitian
- `DELETE /api/admin/users/:id` - Delete user

## Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user, dietitian, admin),
  phone: String,
  gender: String,
  age: Number,
  height: Number,
  weight: Number,
  BMI: Number,
  allergies: [String],
  medicalConditions: [String],
  goals: [String],
  activityLevel: String,
  profileImage: String,
  isApproved: Boolean (for dietitians),
  createdAt: Date
}
```

### Client Model
```javascript
{
  userId: ObjectId (reference to User),
  assignedDietitian: ObjectId,
  targetCalories: Number,
  targetProtein: Number,
  targetCarbs: Number,
  targetFat: Number,
  notes: String,
  createdAt: Date
}
```

### MealPlan Model
```javascript
{
  clientId: ObjectId,
  breakfast: [String],
  lunch: [String],
  dinner: [String],
  snacks: [String],
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  createdBy: ObjectId,
  date: Date,
  createdAt: Date
}
```

### Progress Model
```javascript
{
  clientId: ObjectId,
  weight: Number,
  caloriesConsumed: Number,
  waterIntake: Number,
  exerciseMinutes: Number,
  adherencePercentage: Number,
  notes: String,
  date: Date,
  createdAt: Date
}
```

## Running the Application

1. Start MongoDB (Atlas or local)
2. Start backend: `cd server && npm run dev`
3. Start frontend: `cd client && npm start`
4. Access at `http://localhost:3000`

## Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from create-react-app

## Environment Variables

See `.env.example` files in both server and client directories for required variables.

## Security Features

- JWT authentication with refresh tokens
- bcrypt password hashing
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Role-based access control
- Protected API endpoints
- Secure MongoDB connection
- Environment variable protection

## Performance Optimizations

- Code splitting in React
- Lazy loading of routes
- React.memo for component optimization
- Pagination for large datasets
- Optimized MongoDB queries
- Caching strategies

## Testing

Postman collection available in `/docs` folder for API testing.

## Support & Documentation

For detailed API documentation, refer to the API_DOCUMENTATION.md file.

## License

MIT License

## Author

Nutrition Assistant Team
