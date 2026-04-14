import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      localStorage.removeItem('user');
      if (window.location.pathname.includes('/warden') || window.location.pathname.includes('/staff')) {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  wardenLogin: (credentials) => api.post('/auth/warden/login', credentials),
  staffLogin: (credentials) => api.post('/auth/staff/login', credentials),
  logout: () => api.post('/auth/logout'),
  verify: () => api.get('/auth/verify'),
};

// Plate Choice APIs
export const plateChoiceAPI = {
  submit: (data) => api.post('/plate-choices', data),
  getAll: (params) => api.get('/plate-choices', { params }),
  getById: (id) => api.get(`/plate-choices/${id}`),
  getStats: () => api.get('/plate-choices/stats/summary'),

    // NEW: Generate Plate Choice Report
  downloadReport: (date) => {
    return axios({
      url: `${API_URL}/plate-choices/report?date=${date}`,
      method: 'GET',
      responseType: 'blob',
      withCredentials: true,
    });
  },
};

// Food Parcel APIs
export const foodParcelAPI = {
  submit: (data) => api.post('/food-parcels', data),
  getAll: (params) => api.get('/food-parcels', { params }),
  getById: (id) => api.get(`/food-parcels/${id}`),
  approve: (id, wardenName) => api.patch(`/food-parcels/${id}/approve`, { wardenName }),
  getStats: () => api.get('/food-parcels/stats/summary'),
  downloadReport: (date) => {
    return axios({
      url: `${API_URL}/food-parcels/report/excel?date=${date}`,
      method: 'GET',
      responseType: 'blob',
      withCredentials: true,
    });
  },
};

// Statistics APIs
export const statisticsAPI = {
  getLanding: () => api.get('/statistics/landing'),
};

export default api;
