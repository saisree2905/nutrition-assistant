import api from './api';

export const userService = {
  getProfile: () =>
    api.get('/users/profile'),

  updateProfile: (data) =>
    api.put('/users/profile', data),

  uploadProfileImage: (formData) =>
    api.post('/users/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getUserStats: () =>
    api.get('/users/stats'),

  changePassword: (currentPassword, newPassword) =>
    api.put('/users/change-password', { currentPassword, newPassword }),
};
