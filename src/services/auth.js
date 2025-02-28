import api from './api';

export const authService = {
  requestOTP: (phone) => api.post('/api/auth/request-otp', { phone }),
  verifyOTP: (phone, code) => api.post('/api/auth/verify-otp', { phone, otp: code }),
  getUserDetails: (userId) => api.get(`/api/auth/user/${userId}`),
  changeUsername: (username) => api.put('/api/auth/change-username', { newUsername: username }),
  updateUserDetails: (details) => api.put('/api/auth/update-details', details),
};
