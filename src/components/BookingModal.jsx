// In src/components/BookingModal.jsx

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/apiService';
import axios from 'axios';

export default function BookingModal({ isOpen, setIsOpen, unit }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (checkIn && checkOut && unit?.price_per_night) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const nightCount = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (nightCount > 0) {
        setTotalPrice(nightCount * unit.price_per_night);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  }, [checkIn, checkOut, unit?.price_per_night]);

  // In src/components/BookingModal.jsx

const handleBooking = async () => {
  setError(null);

  // --- Frontend Validation ---
  if (!checkIn || !checkOut) {
    setError("Please select both a check-in and check-out date.");
    return;
  }
  if (new Date(checkOut) <= new Date(checkIn)) {
    setError("Check-out date must be after the check-in date.");
    return;
  }
  // -----------------------------

  setLoading(true);

  try {
    const response = await api.post('/bookings/', {
      unit_id: unit.id,
      check_in: checkIn,
      check_out: checkOut,
      guests: guests,
    });

    if (response.status === 201) {
      setIsOpen(false);
      navigate('/my-bookings?success=true');
    }

  } catch (err) {
    console.error("Booking error:", err.response);
    
    const errorData = err.response?.data;
    if (errorData) {
      // --- Flatten DRF validation errors into a readable string ---
      const messages = [];
      for (const key in errorData) {
        if (Array.isArray(errorData[key])) {
          messages.push(`${key}: ${errorData[key].join(', ')}`);
        } else if (typeof errorData[key] === 'string') {
          messages.push(`${key}: ${errorData[key]}`);
        }
      }

      if (messages.length > 0) {
        setError(messages.join(' '));
      } else if (errorData.detail) {
        setError(errorData.detail);
      } else {
        setError("Booking failed. Please check your selections.");
      }
    } else {
      setError("Could not connect to the server. Please try again later.");
    }
  } finally {
    setLoading(false);
  }
};


  if (!unit) return null;

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6">
          <Dialog.Title className="text-2xl font-bold text-gray-800">
            Book: {unit.unit_name_or_number}
          </Dialog.Title>

          <div className="mt-6">
            {error && (
              <div className="text-red-600 mb-4 bg-red-100 p-3 rounded">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="checkin" className="block text-sm font-bold text-gray-700">
                  Check-in
                </label>
                <input 
                  type="date" 
                  id="checkin" 
                  value={checkIn} 
                  onChange={(e) => setCheckIn(e.target.value)} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                />
              </div>
              <div>
                <label htmlFor="checkout" className="block text-sm font-bold text-gray-700">
                  Check-out
                </label>
                <input 
                  type="date" 
                  id="checkout" 
                  value={checkOut} 
                  onChange={(e) => setCheckOut(e.target.value)} 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="guests" className="block text-sm font-bold text-gray-700">
                Guests (Max: {unit.max_guests})
              </label>
              <input 
                type="number" 
                id="guests" 
                min="1" 
                max={unit.max_guests} 
                value={guests} 
                onChange={(e) => setGuests(e.target.value)} 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
              />
            </div>
            
            {/* Display the calculated price */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-sm text-gray-600">Total Estimated Price:</p>
              <p className="text-2xl font-bold text-gray-900">
                KES {totalPrice.toLocaleString()}
              </p>
            </div>
            
            <div className="mt-6 space-y-2">
              <button 
                onClick={handleBooking}
                disabled={loading || totalPrice <= 0}
                className="w-full rounded-lg bg-blue-500 px-4 py-3 text-white font-bold hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Confirming...' : `Confirm & Book for KES ${totalPrice.toLocaleString()}`}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full rounded-lg bg-gray-200 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}