import api from './api';

export const mealPlanService = {
  getMealPlans: (params = {}) =>
    api.get('/meal-plans', { params }),

  getMealPlanById: (id) =>
    api.get(`/meal-plans/${id}`),

  createMealPlan: (data) =>
    api.post('/meal-plans', data),

  updateMealPlan: (id, data) =>
    api.put(`/meal-plans/${id}`, data),

  deleteMealPlan: (id) =>
    api.delete(`/meal-plans/${id}`),
};
