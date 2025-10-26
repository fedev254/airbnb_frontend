// src/pages/HostDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/apiService';
import RevenueChart from '../components/RevenueChart';

export default function HostDashboardPage() {
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Fetch host properties
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

  // 🔹 Fetch host bookings
  useEffect(() => {
    if (user) {
      const fetchHostBookings = async () => {
        try {
          const response = await api.get('/host/dashboard/my_bookings/');
          setBookings(response.data.results || response.data);
        } catch (err) {
          console.error("Failed to fetch host bookings:", err);
        }
      };
      fetchHostBookings();
    }
  }, [user]);

  // 🔹 Fetch analytics/stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      setLoadingStats(true);
      try {
        const response = await api.get('/host/analytics/');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user]);

  // Derived values from bookings
  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + parseFloat(b.total_price), 0);

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

        {/* --- UPDATED Quick Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm uppercase font-semibold">
              Total Properties
            </p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {loadingStats ? '...' : stats?.total_properties ?? properties.length}
            </p>
          </div>

          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm uppercase font-semibold">
              Active Bookings
            </p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {loadingStats ? '...' : stats?.active_bookings_count ?? activeBookings}
            </p>
          </div>

          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm uppercase font-semibold">
              Total Revenue
            </p>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              KES{' '}
              {loadingStats
                ? '...'
                : (stats?.total_revenue ?? totalRevenue).toLocaleString()}
            </p>
          </div>

          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-6 text-center">
            <p className="text-gray-500 text-sm uppercase font-semibold">
              Average Rating
            </p>
            <p className="text-4xl font-bold text-yellow-500 mt-2">
              {loadingStats ? '...' : `${stats?.average_rating ?? 0} ★`}
            </p>
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
        {/* --- ADD CHART SECTION --- */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Monthly Revenue Overview</h2>
                    <div className="h-96"> {/* Give the chart container a fixed height */}
                      {loadingStats ? (
                        <p>Loading chart data...</p>
                      ) : (
                        // 👇 2. Render the chart, passing in the data from our API
                        <RevenueChart chartData={stats?.monthly_revenue_chart} />
                      )}
                    </div>
                </div>
      </div>
    </div>
  );
}
