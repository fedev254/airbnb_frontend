// src/pages/MyBookingsPage.jsx

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/apiService";

export default function MyBookingsPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get("success");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings/my-bookings/");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
      <p className="text-gray-600 mb-6">View and manage all your reservations</p>

      {/* ✅ Success Message */}
      {success && (
        <div className="mb-6 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
          ✅ Booking completed successfully!
        </div>
      )}

      {loading ? (
        <p>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 bg-white shadow-md rounded-lg flex flex-col md:flex-row justify-between items-center"
            >
              <div>
                <p className="font-bold text-lg text-gray-800">
                  {booking.unit_name || "Unit"}
                </p>
                <p className="text-gray-600">
                  Check-in: {booking.check_in} | Check-out: {booking.check_out}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  booking.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {booking.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
