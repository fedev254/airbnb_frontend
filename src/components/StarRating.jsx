import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0 }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < rating);
  return (
    <div className="flex">
      {stars.map((filled, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${filled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}
