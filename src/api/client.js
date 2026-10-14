import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillswap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized, clear token if expired
      if (localStorage.getItem('skillswap_token')) {
        localStorage.removeItem('skillswap_token');
        localStorage.removeItem('skillswap_user');
      }
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const userApi = {
  explore: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getReviews: (userId) => api.get(`/users/${userId}/reviews`),
};

export const skillApi = {
  getAll: (category) => api.get('/skills', { params: { category } }),
  create: (data) => api.post('/skills', data),
  getMySkills: (type) => api.get('/skills/my', { params: { type } }),
  addMySkill: (data) => api.post('/skills/my', data),
  removeMySkill: (userSkillId) => api.delete(`/skills/my/${userSkillId}`),
};

export const matchApi = {
  getRecommendations: () => api.get('/match/recommendations'),
};

export const requestApi = {
  create: (data) => api.post('/requests', data),
  getSent: () => api.get('/requests/sent'),
  getReceived: () => api.get('/requests/received'),
  getAll: () => api.get('/requests/all'),
  getById: (id) => api.get(`/requests/${id}`),
  updateStatus: (id, status) => api.put(`/requests/${id}/status`, { status }),
};

export const sessionApi = {
  schedule: (requestId, data) => api.post(`/sessions/request/${requestId}`, data),
  getByRequest: (requestId) => api.get(`/sessions/request/${requestId}`),
  getMySessions: () => api.get('/sessions/my'),
  updateStatus: (sessionId, status) => api.put(`/sessions/${sessionId}/status`, null, { params: { status } }),
};

export const reviewApi = {
  submit: (requestId, data) => api.post(`/reviews/request/${requestId}`, data),
  getByRequest: (requestId) => api.get(`/reviews/request/${requestId}`),
};

export default api;
