// In src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHost = user && (user.role === 'HOST' || user.role === 'ADMIN');
  const isCustomer = user && user.role === 'CUSTOMER';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Airbnb Platform
        </Link>
        <div className="flex items-center space-x-4">
          
          {/* Always show Home Link */}
          <Link to="/" className="text-gray-600 hover:text-gray-800">Home</Link>
          
          {isCustomer && (
            // --- Customer-specific links ---
            <Link to="/my-bookings" className="text-gray-600 hover:text-gray-800">My Bookings</Link>
          )}

          {isHost && (
            // --- Host-specific links ---
            <Link to="/host/dashboard" className="font-semibold text-blue-600 hover:text-blue-800">Host Dashboard</Link>
          )}

          {user ? (
            // --- Links for any logged-in user ---
            <>
              <span className="text-gray-700">Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            // --- Links for logged-out users ---
            <>
              <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
              <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}