// In src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import PropertyDetailPage from './pages/PropertyDetailPage.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import HostDashboardPage from './pages/HostDashboardPage.jsx';
import './index.css';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';

// --- Define our application's routes ---
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // The main layout (e.g., contains Navbar, Footer, etc.)
    children: [
      // Public routes
      { path: '/', element: <HomePage /> },
      { path: 'properties/:propertyId', element: <PropertyDetailPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'my-bookings', element: <MyBookingsPage /> },

      // --- NEW: Host-Specific Protected Routes ---
      {
        path: 'host',
        element: <ProtectedRoute allowedRoles={['HOST', 'ADMIN']} />, // Protect all host routes
        children: [
          {
            path: 'dashboard', // /host/dashboard
            element: <HostDashboardPage />,
          },
          // You can add more protected host routes here later
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
