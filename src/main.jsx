// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import * as Sentry from "@sentry/react";
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import PropertyDetailPage from './pages/PropertyDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SearchResultsPage from './pages/SearchResultsPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';

// --- Customer Dashboard Imports ---
import CustomerDashboardLayout from './components/CustomerDashboardLayout.jsx';
import MyBookingsTab from './pages/customer/MyBookingsTab.jsx';
import MyProfileTab from './pages/customer/MyProfileTab.jsx';
import HostProfilePage from './pages/host/HostProfilePage.jsx';

// --- Host Pages ---
import HostDashboardPage from './pages/HostDashboardPage.jsx';
import HostBookingsPage from './pages/HostBookingsPage.jsx';
import HostReviewsPage from './pages/host/HostReviewsPage.jsx';
import CreatePropertyPage from './pages/CreatePropertyPage.jsx';
import ManagePropertyPage from './pages/ManagePropertyPage.jsx';

import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

// --- Load environment variables ---
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

console.log("Google Client ID:", googleClientId);
console.log("Sentry DSN:", sentryDsn);

// --- 🧠 Sentry Initialization ---
Sentry.init({
  dsn: sentryDsn,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0, // Capture 100% of transactions for tracing
  replaysSessionSampleRate: 0.1, // Capture 10% of session replays
  replaysOnErrorSampleRate: 1.0, // Capture all sessions with errors
});

// --- 404 Not Found Component ---
const NotFoundPage = () => (
  <div className="py-12 bg-gray-900 min-h-screen flex flex-col items-center justify-center text-center text-white">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-2xl mb-6">Page Not Found</p>
    <a
      href="/"
      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
    >
      Go Home
    </a>
  </div>
);

// --- Router Setup ---
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<NotFoundPage />}>
      {/* --- Public Routes --- */}
      <Route index element={<HomePage />} />
      <Route path="search" element={<SearchResultsPage />} />
      <Route path="properties/:propertyId" element={<PropertyDetailPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />

      {/* --- CUSTOMER DASHBOARD ROUTE --- */}
      <Route
        path="my-account"
        element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}
      >
        <Route element={<CustomerDashboardLayout />}>
          <Route index element={<Navigate to="bookings" replace />} />
          <Route path="bookings" element={<MyBookingsTab />} />
          <Route path="profile" element={<MyProfileTab />} />
        </Route>
      </Route>

      {/* --- HOST ROUTES --- */}
      <Route
        path="host"
        element={<ProtectedRoute allowedRoles={['HOST', 'ADMIN']} />}
      >
        <Route path="dashboard" element={<HostDashboardPage />} />
        <Route path="bookings" element={<HostBookingsPage />} />
        <Route path="properties/create" element={<CreatePropertyPage />} />
        <Route
          path="properties/:propertyId/manage"
          element={<ManagePropertyPage />}
        />
        <Route path="profile" element={<HostProfilePage />} />
        <Route path="reviews" element={<HostReviewsPage />} />
      </Route>

      {/* --- Catch-All 404 --- */}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

// --- Render App ---
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
