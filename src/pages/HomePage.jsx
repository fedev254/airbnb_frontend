// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import placeholderImage from '../assets/livingroom2.jpg';

const MEDIA_BASE_URL = 'http://127.0.0.1:8000';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW REDIRECT LOGIC ---
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'HOST' || user.role === 'ADMIN') {
        navigate('/host/dashboard');
      }
    }
  }, [user, authLoading, navigate]);

  // Fetch public properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/properties/');
        const data = response.data.results ? response.data.results : response.data;

        console.log('Data received from API:', data);
        setProperties(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch properties...');
        console.error('API Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // --- Do not render homepage while redirecting ---
  if ((user?.role === 'HOST' || user?.role === 'ADMIN') && !authLoading) {
    return (
      <div className="text-center text-white py-20">
        Redirecting to your dashboard...
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Find Your Next Stay
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Unforgettable properties at your fingertips.
          </p>
        </header>

        <main>
          {loading && (
            <p className="text-center text-gray-600 text-lg">
              Loading properties...
            </p>
          )}

          {error && (
            <p className="text-center text-red-500 text-lg">{error}</p>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {properties.map((property) => {
                const imageUrl = placeholderImage;

                return (
                  <Link
                    to={`/properties/${property.id}`}
                    key={property.id}
                    className="block"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                      <img
                        src={imageUrl}
                        alt={`View of ${property.title}`}
                        className="w-full h-56 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-800 truncate">
                          {property.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {property.city}, {property.country}
                        </p>
                        {property.description && (
                          <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                            {property.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {!loading && !error && properties.length === 0 && (
            <p className="text-center text-gray-500 text-lg">
              No properties available at the moment.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
