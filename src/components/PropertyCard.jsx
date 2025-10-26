// src/components/PropertyCard.jsx

import React, { useEffect, useState } from "react";

// The base URL for your Django media files during development
const MEDIA_BASE_URL = "http://127.0.0.1:8000";

function PropertyCard({ property }) {
  // Collect all available images from units or property.images
  const allImages = [];

  // 1️⃣ If property.images exist (direct property images)
  if (property.images && property.images.length > 0) {
    property.images.forEach((img) => allImages.push(`${MEDIA_BASE_URL}${img.image}`));
  }

  // 2️⃣ Otherwise, fallback to unit images
  if (allImages.length === 0 && property.units) {
    property.units.forEach((unit) => {
      if (unit.images && unit.images.length > 0) {
        unit.images.forEach((img) => allImages.push(`${MEDIA_BASE_URL}${img.image}`));
      }
    });
  }

  // 3️⃣ Final fallback placeholder
  if (allImages.length === 0) {
    allImages.push("https://via.placeholder.com/400x250.png?text=No+Image+Available");
  }

  // 4️⃣ Handle image rotation
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, 4000); // ⏱ 4 seconds
      return () => clearInterval(interval);
    }
  }, [allImages]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img
        src={allImages[currentIndex]}
        alt={`View of ${property.title}`}
        className="w-full h-56 object-cover"
      />

      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 truncate">{property.title}</h3>
        <p className="text-gray-600 mt-1">
          {property.city}, {property.country}
        </p>
      </div>
    </div>
  );
}

export default PropertyCard;
