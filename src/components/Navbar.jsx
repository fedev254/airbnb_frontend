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
            <Link to="/my-account/bookings" className="text-gray-600 hover:text-gray-800">
              My Account
            </Link>
          )}

          {isHost && (
            // --- Host-specific links ---
            <>
              <Link 
                to="/host/dashboard" 
                className="font-semibold text-blue-600 hover:text-blue-800"
              >
                Dashboard
              </Link>
              <Link to="/host/reviews" className="text-gray-600 hover:text-gray-800">Reviews</Link>
              <Link to="/host/bookings">Bookings</Link>
              {/* 👇 NEW: My Profile link for hosts */}
              <Link 
                to="/host/profile" 
                className="text-gray-600 hover:text-gray-800"
              >
                My Profile
              </Link>
            </>
          )}

          {user ? (
            // --- Links for any logged-in user ---
            <>
              {/* Removed the "Welcome" text as the Profile link replaces it */}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            // --- Links for logged-out users ---
            <>
              <Link to="/login" className="text-gray-600 hover:text-gray-800">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}