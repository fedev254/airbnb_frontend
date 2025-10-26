import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from 'react-router-dom';
import api from "../../services/apiService";
import ReviewModal from '../../components/ReviewModal';

// --- Reusable BookingCard Component ---
function BookingCard({ booking, onLeaveReviewClick }) {
  const imageUrl = booking.unit.images?.[0]?.image || 
    `https://via.placeholder.com/300x200.png?text=${encodeURIComponent(booking.unit.unit_name_or_number)}`;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
      <img 
        src={imageUrl} 
        alt={booking.unit.unit_name_or_number} 
        className="w-full md:w-1/3 h-48 md:h-auto object-cover"
      />
      <div className="p-6 flex flex-col justify-between w-full">
        <div>
          <div className="flex justify-between items-start mb-3">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
              booking.status === 'confirmed' ? 'bg-green-200 text-green-800' :
              booking.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
              booking.status === 'cancelled' ? 'bg-red-200 text-red-800' :
              booking.status === 'completed' ? 'bg-blue-200 text-blue-800' :
              'bg-gray-200 text-gray-800'
            }`}>
              {booking.status.toUpperCase()}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{booking.unit.unit_name_or_number}</h3>
          <p className="text-sm text-gray-600 mt-1">{booking.unit.property.title}</p>
          <p className="text-xs text-gray-500 mt-1">
            {booking.unit.property.address}, {booking.unit.property.city}
          </p>
        </div>
        <div className="mt-4 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-semibold">Check-in</p>
              <p className="text-gray-800">
                {new Date(booking.check_in).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold">Check-out</p>
              <p className="text-gray-800">
                {new Date(booking.check_out).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t">
            <div>
              <p className="text-sm text-gray-500">Guests</p>
              <p className="text-gray-800 font-semibold">{booking.guests}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-xl font-bold text-gray-900">KES {booking.total_price?.toLocaleString() || 'N/A'}</p>
            </div>
          </div>

          {/* 👇 Leave Review Button for Completed Bookings */}
          {booking.status === 'completed' && (
            <div className="mt-4 border-t pt-4">
              <button
                onClick={() => onLeaveReviewClick(booking)}
                className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Leave a Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Page Component ---
export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const location = useLocation();
  const isSuccess = new URLSearchParams(location.search).get('success') === 'true';

  const fetchBookings = async () => {
    if (user) {
      setLoading(true);
      try {
        const response = await api.get('http://127.0.0.1:8000/api/bookings/');
        const bookingsData = response.data.results || response.data;
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch your bookings.");
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleOpenReviewModal = (booking) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  if (!user) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your bookings.</p>
            <Link 
              to="/login" 
              className="inline-block bg-blue-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center text-white text-xl py-20">Loading your bookings...</p>;
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Success Message */}
        {isSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md shadow-lg animate-fade-in" role="alert">
            <p className="font-bold">✅ Booking Successful!</p>
            <p>Your booking has been confirmed. Check your email for details.</p>
          </div>
        )}

        {/* Header */}
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage all your reservations</p>
        </div>

        {/* Bookings List */}
        {bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                onLeaveReviewClick={handleOpenReviewModal} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h2>
              <p className="text-gray-600 mb-6">Start exploring amazing properties and make your first reservation!</p>
              <Link 
                to="/" 
                className="inline-block bg-blue-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-600 transition"
              >
                Find a Place to Stay
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 👇 Review Modal Integration */}
      <ReviewModal 
        isOpen={isReviewModalOpen}
        setIsOpen={setIsReviewModalOpen}
        booking={selectedBooking}
        onReviewSubmitted={() => {
          setIsReviewModalOpen(false);
          fetchBookings(); // Refresh bookings after review submission
        }}
      />
    </div>
  );
}
