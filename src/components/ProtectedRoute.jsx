// In src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth(); // Now we get the loading state
  const location = useLocation();

  // 1. While we're still checking if a user is logged in, show a loading state.
  // This prevents the redirect from happening too early.
  if (loading) {
    return <div className="text-center text-white py-20">Checking authentication...</div>;
  }

  // 2. Check for user and correct role
  // This now runs only after the initial auth check is complete.
  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />; // User is authenticated and authorized, show the page
  }
  
  if (user && !allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have the right role.
    // Send them to a "not authorized" page or back to home.
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // 3. If no user, redirect to login, but carry the original destination with you
  return <Navigate to="/login" state={{ from: location }} replace />;
}