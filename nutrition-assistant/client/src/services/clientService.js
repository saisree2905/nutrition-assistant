import api from './api';

export const clientService = {
  getAllClients: (page = 1, limit = 10, search = '') =>
    api.get('/clients', { params: { page, limit, search } }),

  getClientById: (id) =>
    api.get(`/clients/${id}`),

  createClient: (data) =>
    api.post('/clients', data),

  updateClient: (id, data) =>
    api.put(`/clients/${id}`, data),

  deleteClient: (id) =>
    api.delete(`/clients/${id}`),
};
