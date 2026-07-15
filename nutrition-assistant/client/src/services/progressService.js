import api from './api';

export const progressService = {
  getProgress: (params = {}) =>
    api.get('/progress', { params }),

  getProgressById: (id) =>
    api.get(`/progress/${id}`),

  createProgress: (data) =>
    api.post('/progress', data),

  updateProgress: (id, data) =>
    api.put(`/progress/${id}`, data),

  deleteProgress: (id) =>
    api.delete(`/progress/${id}`),

  getProgressStats: (clientId, days = 30) =>
    api.get('/progress/stats/summary', { params: { clientId, days } }),
};
