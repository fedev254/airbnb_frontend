// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/apiService'; // 👈 Use the centralized axios instance

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true); // 👈 1. Add loading state

  useEffect(() => {
    try {
      if (authToken) {
        const decodedUser = jwtDecode(authToken);
        setUser(decodedUser);

        // 👇 Configure the default api instance with the Authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      }
    } catch (error) {
      console.error("Token validation failed:", error);

      // 👇 Clear invalid/expired token
      localStorage.removeItem('authToken');
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false); // 👈 Always stop loading phase
    }
  }, [authToken]);

  // --- Login Function ---
  const login = async (username, password) => {
    const response = await api.post('/auth/token/', {
      username,
      password,
    });

    const token = response.data.access;
    localStorage.setItem('authToken', token);
    setAuthToken(token);

    const decodedUser = jwtDecode(token);
    setUser(decodedUser);

    // 👇 Update our axios instance header immediately
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return decodedUser;
  };

  // --- Logout Function ---
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setAuthToken(null);
    delete api.defaults.headers.common['Authorization'];
  };

  // --- Context Value ---
  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
