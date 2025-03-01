import api from './api';

export const ventService = {
  createVent: (ventData) => api.post('/api/vent/create', ventData),
  getVents: (params) => api.get('/api/vent/all', { params }),
  reactToVent: (data) => api.post('/api/vent/react', data),
  deleteVent: (ventId) => api.delete(`/api/vent/${ventId}`),
  searchVents: (query) => api.get('/api/vent/search', { params: query }),
  getVentFeed: (params) => api.get('/api/vent/feed', { params }),
  reportVent: (data) => api.post('/api/vent/report', data),
};
