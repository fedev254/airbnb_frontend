// In src/pages/HostBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/apiService';
import { Link } from 'react-router-dom';

export default function HostBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await api.get('/host/dashboard/my_bookings/');
            setBookings(response.data.results || response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch bookings.');
            console.error('Failed to fetch bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user]);

    // --- NEW: Function to handle status updates ---
    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await api.patch(`/host/manage-bookings/${bookingId}/`, { status: newStatus });
            fetchBookings(); // Re-fetch the bookings list to show the change
        } catch (error) {
            console.error(`Failed to update booking ${bookingId} to ${newStatus}`, error);
            // Optionally, you could set an error state here to show a message to the user
            alert('Failed to update booking status. Please try again.');
        }
    };
    
    if (loading) return <p className="text-white text-center py-10">Loading bookings...</p>;
    if (error) return <p className="text-red-400 text-center py-10">{error}</p>;

    return (
        <div className="py-12">
            <div className="container mx-auto px-4">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Incoming Bookings</h1>
                            <p className="text-gray-600 mt-2">Manage all bookings for your properties</p>
                        </div>
                        <Link
                            to="/host/dashboard"
                            className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded hover:bg-gray-300 transition"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>

                    {/* Bookings Table */}
                    {bookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Unit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Guest
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Dates
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bookings.map(booking => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {booking.unit.unit_name_or_number}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {booking.unit.property.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {booking.user.username}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {booking.user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(booking.check_in).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    to {new Date(booking.check_out).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {booking.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                                KES {booking.total_price?.toLocaleString() || 'N/A'}
                                            </td>
                                            
                                            {/* 👇 NEW: Actions Cell */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    {booking.status === 'pending' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(booking.id, 'confirmed')} 
                                                            className="text-green-600 hover:text-green-900 font-semibold transition"
                                                        >
                                                            Confirm
                                                        </button>
                                                    )}
                                                    {booking.status === 'confirmed' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(booking.id, 'completed')} 
                                                            className="text-blue-600 hover:text-blue-900 font-semibold transition"
                                                        >
                                                            Mark Completed
                                                        </button>
                                                    )}
                                                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(booking.id, 'cancelled')} 
                                                            className="text-red-600 hover:text-red-900 font-semibold transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <svg 
                                className="mx-auto h-16 w-16 text-gray-400 mb-4" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                                />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
                            <p className="text-gray-500">You don't have any bookings for your properties yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}