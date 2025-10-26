// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from "../services/apiService";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRegistered = new URLSearchParams(location.search).get('registered') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (typeof errorData.detail === 'string') {
          setError({ detail: errorData.detail });
        } else {
          const formattedError = Object.keys(errorData)
            .map(key =>
              Array.isArray(errorData[key])
                ? `${key}: ${errorData[key].join(', ')}`
                : errorData[key]
            )
            .join(' | ');
          setError({ detail: formattedError });
        }
      } else {
        setError({ detail: "Login failed. Please try again." });
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    redirect_uri: 'http://localhost:5173',
    onSuccess: async (codeResponse) => {
      console.log("✅ Received code from Google:", codeResponse.code);
      try {
        const response = await api.post('/auth/google/', {
          code: codeResponse.code,
          redirect_uri: 'http://localhost:5173',
        });
        console.log("✅ Backend response:", response.data);
        const { access, refresh, user } = response.data;
        if (access) {
          localStorage.setItem('authToken', access);
          localStorage.setItem('refreshToken', refresh);
          window.location.href = '/';
        }
      } catch (error) {
        console.error("❌ Google login failed on backend:", error);
        console.error("❌ Error response:", error.response?.data);
        setError(error.response?.data?.non_field_errors?.[0] || "Could not log in with Google.");
      }
    },
    onError: (errorResponse) => {
      console.error("❌ Google login error:", errorResponse);
      setError("Google login failed.");
    },
  });

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center mt-16">
      <div className="w-full max-w-sm">
        {isRegistered && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> You've registered. Please log in.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-lg px-8 pt-6 pb-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login to Your Account
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span>{error.detail || error}</span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="text-right text-sm mb-4">
            <Link to="/forgot-password" className="font-semibold text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="my-4 flex items-center before:flex-1 before:border-t before:border-gray-300 after:flex-1 after:border-t after:border-gray-300">
          <p className="text-center font-semibold mx-4 mb-0 text-gray-500">OR</p>
        </div>

        <button
          type="button"
          onClick={() => googleLogin()}
          className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-semibold p-3 rounded-md hover:bg-gray-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M24 9.5c3.9 0 6.8 1.6 8.4 3.1l6.3-6.3C34.9 2.8 30.1 0 24 0 14.5 0 6.6 5.5 2.7 13.5L9 18.2c1.9-5.7 7.2-9.7 13-9.7z" />
            <path fill="#34A853" d="M46.2 25.1c0-1.6-.1-3.2-.4-4.7H24v9h12.5c-.5 2.9-2.2 5.4-4.8 7.1l6.3 4.9c3.7-3.4 5.9-8.3 5.9-14.3z" />
            <path fill="#FBBC05" d="M9.8 28.1c-.6-1.8-.9-3.7-.9-5.6s.3-3.8.9-5.6l-6.3-4.9C1.1 16.6 0 20.2 0 24c0 3.8 1.1 7.4 2.9 10.5l6.9-5.4z" />
            <path fill="#EA4335" d="M24 48c5.6 0 10.3-1.8 13.7-4.9l-6.3-4.9c-1.9 1.3-4.3 2-7.1 2-5.8 0-10.7-3.9-12.5-9.1L2.7 34.5C6.6 42.5 14.5 48 24 48z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-500 hover:text-blue-700">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
