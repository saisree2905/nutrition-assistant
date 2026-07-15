# 🥗 Nutrition Assistant

<div align="center">

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

A modern **Full Stack MERN Nutrition Management Platform** that helps users and dietitians create, manage, and monitor personalized nutrition plans with secure authentication, interactive dashboards, and progress tracking.

</div>

---

# 📖 Table of Contents

- Overview
- Features
- Tech Stack
- System Architecture
- Project Structure
- Screenshots
- Installation
- Environment Variables
- API Endpoints
- User Roles
- Future Enhancements
- Author

---

# 📌 Overview

Nutrition Assistant is a comprehensive web application developed using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**.

The system enables users to maintain healthy nutrition habits while allowing dietitians to manage multiple clients and meal plans efficiently. Administrators oversee the platform through role-based access control and analytics dashboards.

The application focuses on:

- Personalized Nutrition Management
- Meal Planning
- Progress Tracking
- Role-Based Authentication
- Interactive Dashboards
- Secure REST APIs
- Modern Responsive UI

---

# ✨ Features

## 👤 User

- User Registration & Login
- JWT Authentication
- Secure Password Encryption
- Edit Profile
- BMI Calculator
- Meal Plan Tracking
- Daily Calorie Tracking
- Nutrition Dashboard
- Progress Monitoring
- Weight History
- Responsive Dashboard

---

## 🩺 Dietitian

- Manage Clients
- Create Meal Plans
- Update Meal Plans
- Delete Meal Plans
- View Client Progress
- Nutrition Recommendations
- Dashboard Analytics

---

## 👨‍💼 Admin

- Manage Users
- Manage Dietitians
- Platform Analytics
- User Approval
- System Dashboard
- Database Management

---

# 🛠 Tech Stack

## Frontend

- React 18
- React Router DOM
- Axios
- Bootstrap 5
- React Bootstrap
- Chart.js
- React Context API

---

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt
- Express Validator
- Multer
- Nodemailer

---

## Database

- MongoDB Atlas

Collections:

- Users
- Clients
- Meal Plans
- Progress

---

# 🏗 System Architecture

```
React Frontend
       │
       ▼
Axios API Calls
       │
       ▼
Express.js Backend
       │
JWT Authentication
       │
       ▼
MongoDB Atlas
```

---

# 📂 Project Structure

```
nutrition-assistant/

│

├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── contexts/
│ │ ├── hooks/
│ │ ├── layouts/
│ │ ├── pages/
│ │ ├── services/
│ │ └── styles/
│
├── server/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── uploads/
│ ├── utils/
│ └── validators/
│
├── README.md
└── package.json
```

---

# 📸 Screenshots

## 🏠 Home Page

```
<img width="1600" height="900" alt="Screenshot (263)" src="https://github.com/user-attachments/assets/94b140ee-ee1d-4581-9da5-bac5fa66cbf9" />

```

---

## 🔐 Login Page

```
<img width="1600" height="900" alt="Screenshot (267)" src="https://github.com/user-attachments/assets/8655533e-8503-4596-abb0-71cba396ec65" />

```

---

## 📝 Registration

```
<img width="1600" height="900" alt="Screenshot (269)" src="https://github.com/user-attachments/assets/d0f2a7ec-51b3-4ba5-abd0-a33d47a332ba" />

```

---

## 👤 User Dashboard

```
<img width="1600" height="900" alt="Screenshot (265)" src="https://github.com/user-attachments/assets/04e953fc-aeb7-448a-9893-4f14e627ea0e" />

```

---

## 🩺 Dietitian Dashboard

```
<img width="1600" height="900" alt="Screenshot (271)" src="https://github.com/user-attachments/assets/9e1d9e4a-1e2f-4a12-84b3-43615a2fe1d1" />

```

---


## 📊 Analytics

```
<img width="1600" height="900" alt="Screenshot (266)" src="https://github.com/user-attachments/assets/a1955880-f118-4399-9d3f-14d14520e554" />

```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/saisree2905/nutrition-assistant.git
```

---

## Backend Setup

```bash
cd nutrition-assistant/server

npm install

npm run dev
```

---

## Frontend Setup

```bash
cd nutrition-assistant/client

npm install

npm start
```

---

# 🔑 Environment Variables

## Server (.env)

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

REFRESH_TOKEN_SECRET=YOUR_REFRESH_SECRET

CLIENT_URL=http://localhost:3000
```

---

## Client (.env.local)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

# 🔗 REST API

## Authentication

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh-token

---

## Users

- GET /api/users/profile
- PUT /api/users/profile

---

## Clients

- GET /api/clients
- POST /api/clients
- PUT /api/clients/:id
- DELETE /api/clients/:id

---

## Meal Plans

- GET /api/mealplans
- POST /api/mealplans
- PUT /api/mealplans/:id
- DELETE /api/mealplans/:id

---

## Progress

- GET /api/progress
- POST /api/progress
- PUT /api/progress/:id
- DELETE /api/progress/:id

---

# 🔒 Authentication

- JWT Authentication
- Refresh Tokens
- Password Hashing using bcrypt
- Protected Routes
- Role Based Authorization

---

# 👥 User Roles

| Role | Access |
|-------|--------|
| User | Profile, Meal Plans, Progress |
| Dietitian | Client Management, Meal Planning |
| Admin | Complete System Management |

---

# 🚀 Future Enhancements

- AI Nutrition Recommendations
- Chatbot Assistant
- Barcode Food Scanner
- Mobile Application
- Google Fit Integration
- Smart Notifications
- Wearable Device Integration
- AI Meal Suggestions

---

# 🤝 Contributing

Contributions are welcome.

Fork the repository

Create a feature branch

Commit your changes

Push your branch

Open a Pull Request

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

---

# 📄 License

This project is developed for educational and portfolio purposes.

---

# 👩‍💻 Author

## **M Saisree**

GitHub:
https://github.com/saisree2905

---

<div align="center">

### ⭐ Thank You for Visiting ⭐

Made with ❤️ using the MERN Stack

</div>
