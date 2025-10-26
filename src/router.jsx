// In src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import PropertyDetailPage from './pages/PropertyDetailPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CustomerDashboardLayout from './components/CustomerDashboardLayout.jsx';
import MyBookingsTab from './pages/customer/MyBookingsTab.jsx';
import MyProfileTab from './pages/customer/MyProfileTab.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HostDashboardPage from './pages/HostDashboardPage.jsx';
import CreatePropertyPage from './pages/CreatePropertyPage.jsx';
import ManagePropertyPage from './pages/ManagePropertyPage.jsx';
import HostBookingsPage from './pages/HostBookingsPage.jsx';
import HostProfilePage from './pages/host/HostProfilePage.jsx';
import SearchResultsPage from './pages/SearchResultsPage';
import './index.css';
import HostReviewsPage from './pages/host/HostReviewsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import BlogPage from './pages/BlogPage';
import PostDetailPage from './pages/PostDetailPage';
// A dedicated 404 Not Found Component
const NotFoundPage = () => (
  <div className="py-12">
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-6xl font-bold text-white mb-4">404</h1>
      <p className="text-2xl text-white mb-6">Page Not Found</p>
      <a 
        href="/" 
        className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
      >
        Go Home
      </a>
    </div>
  </div>
);

// --- New, more explicit way of creating routes ---
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<NotFoundPage />}>
      
      {/* Public Routes */}
      <Route index element={<HomePage />} />
      <Route path="search" element={<SearchResultsPage />} />
      <Route path="properties/:propertyId" element={<PropertyDetailPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="about" element={<AboutUsPage />} />
      <Route path="contact" element={<ContactUsPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password/:uid/:token" element={<ResetPasswordPage />} />
      <Route path="blog" element={<BlogPage />} />
      <Route path="blog/:slug" element={<PostDetailPage />} />
      <Route index element={<Navigate to="bookings" replace />} />
      <Route path="bookings" element={<MyBookingsTab />} />
      <Route path="reviews" element={<HostReviewsPage />} />
      <Route path="profile" element={<MyProfileTab />} />

      {/* Host Protected Routes */}
      <Route path="host" element={<ProtectedRoute allowedRoles={['HOST', 'ADMIN']} />}>
        <Route path="dashboard" element={<HostDashboardPage />} />
        <Route path="bookings" element={<HostBookingsPage />} />
        <Route path="properties/create" element={<CreatePropertyPage />} />
        {/* Future route for managing individual properties */}
        {/* <Route path="properties/:propertyId/manage" element={<ManagePropertyPage />} /> */}
        <Route path="properties/:propertyId/manage" element={<ManagePropertyPage />} />
        <Route path="profile" element={<HostProfilePage />} />
        <Route path="reviews" element={<HostReviewsPage />} />
      </Route>
      
      {/* Catch-all 404 for any other route */}
      <Route path="*" element={<NotFoundPage />} />

    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);