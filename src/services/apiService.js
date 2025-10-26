// src/services/apiService.js
import axios from 'axios';

// 🌍 Dynamically set the backend API base URL.
// If you have a .env file, make sure it contains:
// VITE_API_BASE_URL=http://127.0.0.1:8000/api
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// 🧩 Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Intercept requests to attach the Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⚠️ Optional: Log all responses (only in development)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (import.meta.env.DEV) {
      console.error('API Error:', error);
    }
    return Promise.reject(error);
  }
);

export default api;
