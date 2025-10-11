// src/pages/HostDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/apiService'; // ✅ Use the pre-configured axios instance

export default function HostDashboardPage() {
  // --- All hooks are now at the top level ---
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- useEffect handles data fetching safely ---
  useEffect(() => {
    const fetchHostProperties = async () => {
      if (!user) {
        setLoading(false);
        setError('Please log in to view your dashboard.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/host/dashboard/');
        console.log('Dashboard API Response:', response.data);

        const propertiesData =
          response.data.results || response.data.properties || response.data;

        setProperties(Array.isArray(propertiesData) ? propertiesData : []);
      } catch (err) {
        console.error('Dashboard Fetch Error:', err);

        if (err.response?.status === 401) {
          setError('Please log in to view your dashboard.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to access the host dashboard.');
        } else if (err.response?.status === 404) {
          setError(
            'Host dashboard endpoint not found. Please check your backend configuration.'
          );
        } else {
          setError('Failed to fetch your properties. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHostProperties();
  }, [user]);

  // --- Conditional rendering AFTER hooks ---
  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-xl">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <Link
              to="/"
              className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Host Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your properties and bookings
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm uppercase font-semibold">
              Total Properties
            </p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {properties.length}
            </p>
          </div>
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm uppercase font-semibold">
              Active Bookings
            </p>
            <p className="text-4xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm uppercase font-semibold">
              Total Revenue
            </p>
            <p className="text-4xl font-bold text-purple-600 mt-2">KES 0</p>
          </div>
        </div>

        {/* My Properties Section */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Properties</h2>
            <Link
              to="/host/properties/create"
              className="bg-blue-500 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              + Add New Property
            </Link>
          </div>

          {properties.length > 0 ? (
            <div className="space-y-4">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  className="border border-gray-200 p-6 rounded-lg flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {prop.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {prop.address}, {prop.city}, {prop.country}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {prop.units?.length || 0} unit(s)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/properties/${prop.id}`}
                      className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded hover:bg-gray-300 transition"
                    >
                      View
                    </Link>
                    <Link
                      to={`/host/properties/${prop.id}/manage`}
                      className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded hover:bg-blue-200 transition"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Properties Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't created any properties yet. Start by adding your
                first property!
              </p>
              <Link
                to="/host/properties/create"
                className="inline-block bg-blue-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-600 transition"
              >
                + Add Your First Property
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
