// src/services/apiService.js

import axios from 'axios';

// ✅ Create Axios instance with base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Change to production API URL when deploying
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===============================
// 🔐 Request Interceptor
// Automatically attach the access token if available
// ===============================
api.interceptors.request.use(
  (config) => {
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      const { access } = JSON.parse(storedTokens);
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// ♻️ Response Interceptor
// Automatically refresh token if expired (401 Unauthorized)
// ===============================
api.interceptors.response.use(
  (response) => response, // Return the response if OK
  async (error) => {
    const originalRequest = error.config;

    // Handle expired or invalid token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const storedTokens = localStorage.getItem('authTokens');
      if (!storedTokens) {
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { refresh } = JSON.parse(storedTokens);

        // Attempt to refresh the token
        const refreshResponse = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
          refresh,
        });

        const newTokens = {
          access: refreshResponse.data.access,
          refresh,
        };

        // Save new tokens
        localStorage.setItem('authTokens', JSON.stringify(newTokens));

        // Update Authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed — log user out
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('authTokens');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ===============================
// 🌍 Exported API methods
// ===============================

// 🔹 Properties
export const getProperties = () => api.get('/properties/');
export const getPropertyDetails = (id) => api.get(`/properties/${id}/`);

// 🔹 Bookings
export const getMyBookings = () => api.get('/my-bookings/');
export const createBooking = (bookingData) => api.post('/bookings/', bookingData);

// 🔹 Host Dashboard
export const getHostDashboard = () => api.get('/host/dashboard/');

// 🔹 Auth (Optional utility)
export const loginUser = (credentials) => api.post('/auth/login/', credentials);
export const registerUser = (data) => api.post('/auth/register/', data);

// ✅ Default export
export default api;
