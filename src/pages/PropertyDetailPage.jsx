// src/pages/PropertyDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/apiService'; // 👈 use central api instance
import localPlaceholder from '../assets/interior4.png';
import BookingModal from '../components/BookingModal';

// --- Reusable UnitCard Component ---
function UnitCard({ unit, property, onBookNowClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth(); // 👈 Access logged-in user
  const images = unit.images && unit.images.length > 0 ? unit.images : [];

  // Rotate images every 4s
  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [images.length]);

  // 👇 Hide Book button if the logged-in user owns this property
  const isOwner = user && user.user_id === property.owner.id;

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden md:flex">
      <div className="md:w-1/3 h-64 md:h-auto relative">
        {images.length > 0 ? (
          images.map((image, index) => (
            <img
              key={image.id}
              src={image.image}
              alt={image.caption || unit.unit_name_or_number}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))
        ) : (
          <img src={localPlaceholder} alt="Placeholder" className="w-full h-full object-cover" />
        )}
      </div>

      <div className="p-6 flex flex-col justify-between w-full md:w-2/3">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{unit.unit_name_or_number}</h3>
          <p className="mt-2 text-gray-600">
            {unit.bedrooms} Bedroom(s) &middot; {unit.bathrooms} Bathroom(s) &middot; Max Guests: {unit.max_guests}
          </p>
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700">Amenities:</h4>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
              {unit.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 md:flex md:justify-between md:items-center">
          <p className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">KES {unit.price_per_night} / night</p>

          {isOwner ? (
            <span className="text-gray-500 italic">This is your property</span>
          ) : (
            <button
              onClick={() => onBookNowClick(unit)}
              className="block w-full md:w-auto text-center bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function PropertyDetailPage() {
  const { propertyId } = useParams();
  const { user } = useAuth(); // Get user state from AuthContext
  const navigate = useNavigate();
  const location = useLocation();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  // "Book Now" handler
  const handleBookNowClick = (unit) => {
    if (user) {
      setSelectedUnit(unit);
      setIsModalOpen(true);
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  useEffect(() => {
    setLoading(true);
    api
      .get(`/properties/${propertyId}/`) // 👈 use central api instance
      .then((response) => {
        setProperty(response.data);
        setError(null);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setError(`Property with ID ${propertyId} could not be found.`);
        } else {
          setError('An error occurred while fetching property details.');
        }
        console.error('API Error fetching property details:', err);
      })
      .finally(() => setLoading(false));
  }, [propertyId]);

  if (loading) return <p className="text-center text-white text-xl mt-10">Loading details...</p>;
  if (error) return <p className="text-center text-red-400 text-xl mt-10">{error}</p>;
  if (!property) return <p className="text-center text-white text-xl mt-10">Property not found.</p>;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{property.title}</h1>
            <p className="mt-2 text-lg text-gray-600">
              {property.address}, {property.city}
            </p>
          </div>

          <div className="prose lg:prose-xl max-w-none mb-12">
            <p className="text-gray-700">{property.description}</p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Available Units</h2>
            <div className="space-y-8">
              {property.units && property.units.length > 0 ? (
                property.units.map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    property={property} // 👈 Pass the whole property down
                    onBookNowClick={handleBookNowClick}
                  />
                ))
              ) : (
                <p className="text-gray-600">No units are currently available for this property.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} unit={selectedUnit} />
    </div>
  );
}
