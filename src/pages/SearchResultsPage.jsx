// In src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/apiService';
import localPlaceholder from '../assets/interior1.jpg'; // We can use this as a fallback

// --- NEW Property Result Card (re-usable) ---
const PropertyResultCard = ({ property }) => {
    // Find a thumbnail from the first available unit image
    const unitWithImage = property.units?.find(unit => unit.images?.length > 0);
    const imageUrl = unitWithImage ? unitWithImage.images[0].image : localPlaceholder;
    
    return (
        <Link to={`/properties/${property.id}`} className="block group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform group-hover:-translate-y-1 transition-transform">
                <img src={imageUrl} alt={property.title} className="w-full h-48 object-cover"/>
                <div className="p-4">
                    <h3 className="font-bold text-lg truncate">{property.title}</h3>
                    <p className="text-sm text-gray-600">{property.city}, {property.country}</p>
                    <p className="text-xs text-gray-500 mt-2">{property.units?.length || 0} unit(s) available</p>
                </div>
            </div>
        </Link>
    );
};


export default function SearchResultsPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchParams = location.search;

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                // 👇 THE CRUCIAL CHANGE: Call the '/properties/' endpoint
                const response = await api.get(`/properties/${searchParams}`);
                setProperties(response.data.results || []);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [searchParams]);

    // Construct a readable title from the search query
    const searchTitle = new URLSearchParams(searchParams).get('search');

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="bg-white/95 rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6">
                    Search Results {searchTitle && <span className="text-gray-600 font-normal">for "{searchTitle}"</span>}
                </h1>
                {loading ? <p>Searching for properties...</p> : (
                    <>
                        <p className="text-sm text-gray-600 mb-4">{properties.length} property(s) found.</p>
                        {properties.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* 👇 Displaying Property cards instead of Unit cards */}
                                {properties.map(prop => (
                                    <PropertyResultCard key={prop.id} property={prop} />
                                ))}
                            </div>
                        ) : (
                            <p>No properties found matching your criteria. Please try a different search.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}