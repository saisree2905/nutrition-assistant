# Quick Start Guide - Nutrition Assistant

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js v16+
- MongoDB Atlas account (free)
- Gmail account (for email)

---

## Step 1: Clone & Setup (1 min)

```bash
# Navigate to project
cd nutrition-assistant

# Copy environment files
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

---

## Step 2: Configure Environment (2 min)

### MongoDB Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/nutrition-assistant`
4. Add to `server/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutrition-assistant
```

### JWT Secret
Add to `server/.env`:
```
JWT_SECRET=YourSecretKeyMinimum32CharactersLongForSecurity123
REFRESH_TOKEN_SECRET=YourRefreshSecretMinimum32CharactersLongForSecurity123
```

### Email (Optional, skip for now)
```
SMTP_SERVICE=gmail
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=nutrition-assistant@gmail.com
```

---

## Step 3: Install & Run Backend (1 min)

```bash
# Install server dependencies
cd server
npm install

# Start backend
npm run dev
```

✅ Backend running on `http://localhost:5000`

---

## Step 4: Install & Run Frontend (1 min)

```bash
# In new terminal, install client dependencies
cd client
npm install

# Start frontend
npm start
```

✅ Frontend running on `http://localhost:3000`

---

## Test the App 🎉

### 1. Create Account
- Go to `http://localhost:3000`
- Click "Sign Up"
- Fill in details
- Click "Sign Up"

### 2. Login
- Click "Login"
- Enter credentials
- You're in! 🎉

### 3. Explore Features
- **User**: View profile, meal plans, track progress
- **Dietitian**: Manage clients, create meal plans
- **Admin**: Manage users, view analytics

---

## Common Issues Quick Fix

### MongoDB Connection Error
```bash
# Check your connection string has:
# - Username (not email)
# - Password
# - Cluster name correct
# - IP whitelist includes your IP
```

### Port Already in Use
```bash
# Backend - Change in server/.env
PORT=5001

# Frontend - Run with different port
PORT=3001 npm start
```

### API Not Connecting
```bash
# Verify in client/.env.local
REACT_APP_API_URL=http://localhost:5000/api
```

---

## API Testing Quick Commands

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
# Use token from login response
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## File Structure Overview

```
nutrition-assistant/
├── server/
│   ├── config/          # Database, email config
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth, validation
│   ├── server.js        # Start here
│   └── .env             # Your config
│
├── client/
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable UI
│   │   ├── services/    # API calls
│   │   ├── App.jsx      # Main app
│   │   └── index.js     # Start here
│   └── .env.local       # Your config
│
└── README.md            # Full docs
```

---

## Next Steps

1. **Customize**
   - Update colors in `client/src/styles/index.css`
   - Change branding in components
   - Modify database models as needed

2. **Add Features**
   - Create new pages in `client/src/pages/`
   - Add API endpoints in `server/routes/`
   - Create controllers in `server/controllers/`

3. **Deploy**
   - Backend: Deploy to Heroku/Railway
   - Frontend: Deploy to Vercel/Netlify
   - Database: Use MongoDB Atlas (free tier)

4. **Learn More**
   - See `README.md` for full documentation
   - Check `API_DOCUMENTATION.md` for all endpoints
   - Review `SETUP.md` for detailed setup
   - Check `FEATURES.md` for complete feature list

---

## Key Commands

```bash
# Backend
cd server
npm install              # Install dependencies
npm run dev              # Start with hot reload
npm start                # Start production

# Frontend
cd client
npm install              # Install dependencies
npm start                # Start dev server
npm build                # Build for production
npm test                 # Run tests
```

---

## Default Credentials

After setup, create test accounts:
- **User**: Register through UI
- **Dietitian**: Register through UI (needs admin approval)
- **Admin**: Create in MongoDB or contact team

---

## API Health Check

```bash
curl http://localhost:5000/api/health
# Response: {"status":"Server is running"}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check MongoDB URI in .env |
| Frontend blank page | Check browser console for errors |
| Can't login | Verify user exists, check password |
| Email not sending | Add email config to .env |
| 404 on routes | Backend might not be running |

---

## Support

- Check `SETUP.md` for detailed setup
- Check `API_DOCUMENTATION.md` for API info
- Check `README.md` for features overview
- See `FEATURES.md` for complete feature list

---

## You're All Set! 🎉

Your Nutrition Assistant is ready to use. Start exploring!

**Frontend**: http://localhost:3000
**Backend**: http://localhost:5000
**API Docs**: See API_DOCUMENTATION.md
