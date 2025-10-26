import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import placeholderImage from '../assets/livingroom2.jpg';
import SearchBar from '../components/SearchBar';


const MEDIA_BASE_URL = 'http://127.0.0.1:8000';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageIndexes, setImageIndexes] = useState({});

  // Redirect logic for host/admin
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

  // Automatically rotate property images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const newIndexes = { ...prev };
        properties.forEach((property) => {
          if (property.images && property.images.length > 0) {
            const currentIndex = prev[property.id] || 0;
            newIndexes[property.id] =
              (currentIndex + 1) % property.images.length;
          }
        });
        return newIndexes;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [properties]);

  // Do not render homepage while redirecting
  if ((user?.role === 'HOST' || user?.role === 'ADMIN') && !authLoading) {
    return (
      <div className="text-center text-white py-20">
        Redirecting to your dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      {/* Hero Header Section */}
      <header
        className="text-center pt-20 pb-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${placeholderImage})`,
        }}
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Find Your Next Stay
        </h1>
        <p className="mt-2 text-lg text-gray-300">
          Unforgettable properties at your fingertips.
        </p>

        
      </header>

      {/* Main Content Container */}
      <div className="flex-grow container mx-auto px-4">
        <SearchBar />

        {/* Properties Section */}
        <main className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Featured Properties
          </h2>

          {loading && (
            <p className="text-center text-gray-300 text-lg">
              Loading properties...
            </p>
          )}

          {error && (
            <p className="text-center text-red-400 text-lg">{error}</p>
          )}

          {!loading && !error && properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {properties.map((property) => {
                const currentIndex = imageIndexes[property.id] || 0;
                const currentImage =
                  property.images && property.images.length > 0
                    ? property.images[currentIndex].image
                    : placeholderImage;

                return (
                  <Link
                    to={`/properties/${property.id}`}
                    key={property.id}
                    className="block"
                  >
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                      <img
                        src={currentImage}
                        alt={`View of ${property.title}`}
                        className="w-full h-56 object-cover transition-all duration-1000"
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
            <p className="text-center text-gray-300 text-lg">
              No properties available at the moment.
            </p>
          )}
        </main>
      </div>

      {/* Footer (naturally attached, not detached) */}
      <div className="mt-auto">
    
      </div>
    </div>
  );
}
