import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// Pages
import Landing from './pages/Landing';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import DietitianDashboard from './pages/DietitianDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Clients from './pages/Clients';
import MealPlans from './pages/MealPlans';
import Progress from './pages/Progress';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <Navbar />
            <Toast />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredRole={['user', 'dietitian', 'admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute requiredRole={['user', 'dietitian', 'admin']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute requiredRole={['user', 'dietitian', 'admin']}>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />

              {/* Dietitian Routes */}
              <Route
                path="/clients"
                element={
                  <ProtectedRoute requiredRole={['dietitian', 'admin']}>
                    <Clients />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/meal-plans"
                element={
                  <ProtectedRoute requiredRole={['user', 'dietitian', 'admin']}>
                    <MealPlans />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute requiredRole={['user', 'dietitian', 'admin']}>
                    <Progress />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute requiredRole={['admin']}>
                    <Analytics />
                  </ProtectedRoute>
                }
              />

              {/* Error Routes */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

// Dashboard Router Component
const Dashboard = () => {
  const { user } = require('./hooks/useAuth').useAuth();

  if (user?.role === 'dietitian') {
    return <DietitianDashboard />;
  } else if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }
};

export default App;
