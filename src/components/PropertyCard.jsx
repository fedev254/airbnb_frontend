// In src/components/PropertyCard.jsx

import React from 'react';

// The base URL for your Django media files during development
const MEDIA_BASE_URL = 'http://127.0.0.1:8000';

function PropertyCard({ property }) {
  // Find the first unit that has at least one image to use as the card's thumbnail
  const firstUnitWithImage = property.units.find(unit => unit.images && unit.images.length > 0);
  
  // Construct the full image URL by combining the base URL and the relative path from the API
  // Also provide a fallback placeholder image if no units have photos
  const imageUrl = firstUnitWithImage 
    ? `${MEDIA_BASE_URL}${firstUnitWithImage.images[0].image}`
    : 'https://via.placeholder.com/400x250.png?text=No+Image+Available';

  return (
    // We can wrap this card in a link later to go to the detail page
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img 
        src={imageUrl} 
        alt={`View of ${property.title}`}
        className="w-full h-56 object-cover" // A slightly taller image container
      />
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 truncate">{property.title}</h3>
        <p className="text-gray-600 mt-1">{property.city}, {property.country}</p>
        
        {/* We can add more info here later, like starting price */}
      </div>
    </div>
  );
}

export default PropertyCard;