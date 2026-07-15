import api from './api';

export const authService = {
  register: (name, email, password, role) =>
    api.post('/auth/register', { name, email, password, role }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  logout: (refreshToken) =>
    api.post('/auth/logout', { refreshToken }),

  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (resetToken, password, confirmPassword) =>
    api.post(`/auth/reset-password/${resetToken}`, { password, confirmPassword }),

  refreshToken: (refreshToken) =>
    api.post('/auth/refresh-token', { refreshToken }),
};
