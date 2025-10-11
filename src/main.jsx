// In src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import PropertyDetailPage from './pages/PropertyDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage';
import HostDashboardPage from './pages/HostDashboardPage'; // 👈 Import the Host Dashboard
import './index.css';

// --- Define our application's routes ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App is now the main layout (e.g., for a navbar)
    children: [
      {
        path: "/",
        element: <HomePage />, // The component to show at the root URL
      },
      {
        path: "properties/:propertyId", // A dynamic URL for details
        element: <PropertyDetailPage />,
      },
      { 
        path: "login", 
        element: <LoginPage /> 
      },
      { 
        path: "register", 
        element: <RegisterPage /> 
      },
      { 
        path: 'my-bookings', 
        element: <MyBookingsPage /> 
      },
      { 
        path: 'host/dashboard',  // 👈 Add the Host Dashboard route
        element: <HostDashboardPage /> 
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