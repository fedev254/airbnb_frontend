// src/pages/host/HostReviewsPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';

export default function HostReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchReviews = async () => {
        try {
          const res = await api.get('/host/dashboard/my_reviews/');
          const reviewData = res.data.results || res.data;

          const enhancedReviews = await Promise.all(
            reviewData.map(async (review) => {
              let propertyTitle = 'Unknown Property';
              let unitName = '—';

              try {
                // ✅ CASE 1: property is an object
                if (typeof review.property === 'object') {
                  propertyTitle = review.property.title || review.property.name;
                  if (review.property.units?.length > 0) {
                    // Get correct unit
                    const found = review.property.units.find(
                      (u) =>
                        u.id === review.unit ||
                        u.id === review.unit_id ||
                        u.unit_name_or_number === review.unit
                    );
                    unitName =
                      found?.unit_name_or_number ||
                      found?.name ||
                      found?.title ||
                      'Unnamed Unit';
                  }
                }

                // ✅ CASE 2: property is just an ID → fetch it
                else if (review.property) {
                  const propRes = await api.get(`/properties/${review.property}/`);
                  propertyTitle = propRes.data.title || propRes.data.name;

                  // Try to match unit if ID provided
                  if (review.unit && propRes.data.units?.length > 0) {
                    const found = propRes.data.units.find(
                      (u) =>
                        u.id === review.unit ||
                        u.id === review.unit_id
                    );
                    unitName =
                      found?.unit_name_or_number ||
                      found?.name ||
                      found?.title ||
                      'Unnamed Unit';
                  }
                }
              } catch (err) {
                console.warn('Property or unit not found for review:', review.id);
              }

              return { ...review, propertyTitle, unitName };
            })
          );

          setReviews(enhancedReviews);
        } catch (err) {
          console.error('Error loading reviews:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchReviews();
    }
  }, [user]);

  const handleMarkAsRead = async (reviewId) => {
  try {
    const response = await api.patch(`/host/reviews/${reviewId}/mark_as_read/`);
    console.log('Marked as read:', response.data);

    setReviews((prevReviews) =>
      prevReviews.map((r) =>
        r.id === reviewId ? { ...r, read: true } : r
      )
    );
  } catch (err) {
    console.error('Error marking as read:', err);
  }
};



  if (loading) return <p className="text-white text-center">Loading reviews...</p>;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="bg-white/95 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Guest Reviews</h1>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`border-b pb-4 transition-all duration-300 ease-in-out ${
                  review.read ? 'opacity-80' : 'opacity-100'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <StarRating rating={review.rating} />
                    <p className="font-bold mt-1 text-gray-900">
                      {review.guest?.username ||
                        review.user?.username ||
                        'Guest'}
                    </p>

                    <p className="text-gray-600 mt-1 text-sm">
                      Property: <strong>{review.propertyTitle}</strong>
                    </p>
                    <p className="text-gray-600 text-sm">
                      Unit: {review.unitName}
                    </p>

                    {/* 👇 Bold when unread, normal when read */}
                    <p
                      className={`mt-3 transition-all duration-300 ${
                        review.read
                          ? 'font-normal text-gray-800'
                          : 'font-semibold text-gray-900'
                      }`}
                    >
                      {review.comment}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {!review.read && (
                    <button
                      onClick={() => handleMarkAsRead(review.id)}
                      disabled={marking === review.id}
                      className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {marking === review.id ? 'Marking...' : 'Mark as Read'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-700 text-center">You have no reviews yet.</p>
        )}
      </div>
    </div>
  );
}
