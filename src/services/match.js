// src/services/match.js
import api from './api';

export const matchService = {
  getMatchSuggestions: () => api.get('/api/match/suggestions'),
  getPendingMatches: () => api.get('/api/match/pending'),
  getMatchHistory: () => api.get('/api/match/history'),
  acceptMatch: (data) => api.post('/api/match/accept', data),
  rejectMatch: (data) => api.post('/api/match/reject', data),
  unmatchUser: (data) => api.post('/api/match/unmatch', data),
  refreshMatches: () => api.post('/api/match/refresh'),
};
