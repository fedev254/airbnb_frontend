// src/pages/PropertyDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/apiService';
import localPlaceholder from '../assets/interior4.png';
import BookingModal from '../components/BookingModal';
import ReviewList from '../components/ReviewList';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

// --- Reusable UnitCard Component ---
function UnitCard({ unit, property, onBookNowClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();
  const images = unit.images && unit.images.length > 0 ? unit.images : [];
  const [unavailableDates, setUnavailableDates] = useState([]); // ✅ State for booked dates

  // Rotate images every 4s
  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [images.length]);

  // ✅ Fetch unavailable dates for this unit
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await api.get(`/units/${unit.id}/availability/`);
        // Convert string dates to Date objects
        const bookedDates = response.data.map(dateStr => new Date(dateStr));
        setUnavailableDates(bookedDates);
      } catch (error) {
        console.error('Failed to fetch availability:', error);
      }
    };
    fetchAvailability();
  }, [unit.id]);

  // Hide "Book Now" if the logged-in user owns this property
  const isOwner = user && user.user_id === property.owner.id;

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden md:flex">
      {/* Image Carousel Section */}
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

      {/* Details Section */}
      <div className="p-6 flex flex-col justify-between w-full md:w-2/3">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{unit.unit_name_or_number}</h3>
          <p className="mt-2 text-gray-600">
            {unit.bedrooms} Bedroom(s) &middot; {unit.bathrooms} Bathroom(s) &middot; Max Guests: {unit.max_guests}
          </p>
          
          {/* Amenities */}
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700">Amenities:</h4>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
              {unit.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </div>

          {/* ✅ NEW: Availability Calendar */}
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-3">Availability Calendar</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <DayPicker
                mode="default"
                disabled={unavailableDates}
                modifiersClassNames={{
                  disabled: 'text-red-500 line-through opacity-50'
                }}
                numberOfMonths={1}
                showOutsideDays
                className="text-sm"
                styles={{
                  caption: { color: '#1f2937', fontWeight: 'bold' },
                  day: { fontSize: '0.875rem' }
                }}
              />
              <p className="text-xs text-gray-500 mt-2">
                <span className="inline-block w-3 h-3 bg-red-100 border border-red-300 rounded mr-1"></span>
                Unavailable dates
              </p>
            </div>
          </div>
        </div>

        {/* Price and Book Button */}
        <div className="mt-6 md:flex md:justify-between md:items-center border-t pt-4">
          <p className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
            KES {unit.price_per_night?.toLocaleString()} / night
          </p>

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

// --- Main Property Detail Page ---
export default function PropertyDetailPage() {
  const { propertyId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);

  const handleBookNowClick = (unit) => {
    if (user) {
      setSelectedUnit(unit);
      setIsModalOpen(true);
    } else {
      navigate('/login', { state: { from: location } });
    }
  };

  // Fetch property + reviews together
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const [propertyRes, reviewsRes] = await Promise.all([
          api.get(`/properties/${propertyId}/`),
          api.get(`/properties/${propertyId}/reviews/`),
        ]);
        setProperty(propertyRes.data);
        setReviews(reviewsRes.data.results || reviewsRes.data);
      } catch (err) {
        console.error('Detail page fetch error:', err);
        setError('Failed to load property details or reviews.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [propertyId]);

  if (loading) return <p className="text-center text-white text-xl mt-10">Loading details...</p>;
  if (error) return <p className="text-center text-red-400 text-xl mt-10">{error}</p>;
  if (!property) return <p className="text-center text-white text-xl mt-10">Property not found.</p>;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
          
          {/* Property Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{property.title}</h1>
            <p className="mt-2 text-lg text-gray-600">
              {property.address}, {property.city}
            </p>
          </div>

          {/* Property Description */}
          <div className="prose lg:prose-xl max-w-none mb-12">
            <p className="text-gray-700">{property.description}</p>
          </div>

          {/* Units Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Available Units</h2>
            <div className="space-y-8">
              {property.units && property.units.length > 0 ? (
                property.units.map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    property={property}
                    onBookNowClick={handleBookNowClick}
                  />
                ))
              ) : (
                <p className="text-gray-600">No units are currently available for this property.</p>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t pt-8 mt-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Guest Reviews</h2>
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} unit={selectedUnit} />
    </div>
  );
}