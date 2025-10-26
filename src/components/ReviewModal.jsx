// In src/components/ReviewModal.jsx
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import api from '../services/apiService';

// Reusable StarRating component, now with interactivity
const StarRatingInput = ({ rating, setRating }) => (
    <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
                <button
                    type="button"
                    key={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    className="focus:outline-none"
                >
                    <svg className={`w-8 h-8 ${ratingValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.96c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.96a1 1 0 00-.364-1.118L2.07 9.387c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
                    </svg>
                </button>
            );
        })}
    </div>
);


export default function ReviewModal({ isOpen, setIsOpen, booking, onReviewSubmitted }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.post('/reviews/create/', {
                booking_id: booking.id,
                rating,
                comment,
            });
            setIsOpen(false);
            if (onReviewSubmitted) onReviewSubmitted(); // Notify parent to refresh data
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to submit review. You may have already reviewed this stay.");
        } finally {
            setLoading(false);
        }
    };
    
    if (!booking) return null;

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                    <Dialog.Title className="text-2xl font-bold text-gray-800">Leave a Review</Dialog.Title>
                    <p className="text-gray-600 mt-1">For your stay at {booking.unit.property.title}</p>

                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Your Rating</label>
                            <StarRatingInput rating={rating} setRating={setRating} />
                        </div>
                        <div>
                            <label htmlFor="comment" className="block text-sm font-bold text-gray-700 mb-1">Your Comments</label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                rows="5"
                                className="w-full mt-1 border p-2 rounded-md shadow-sm"
                                placeholder="How was your stay? What did you like or dislike?"
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <div className="mt-6 flex justify-end gap-4">
                        <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600 disabled:bg-gray-400">
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}