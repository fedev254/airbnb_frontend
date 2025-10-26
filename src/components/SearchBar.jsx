// In src/components/SearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    // Only add params if they have a value
    if (searchTerm) params.append('search', searchTerm);
    if (checkIn) params.append('check_in', checkIn);
    if (checkOut) params.append('check_out', checkOut);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg -mt-24 z-20 relative max-w-4xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
        {/* Main Search Input */}
        <div className="flex-grow w-full">
          <label htmlFor="search-term" className="sr-only">Search</label>
          <input 
            id="search-term"
            type="text" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            placeholder="Search by city or property name..." 
            className="w-full border-gray-300 rounded-md shadow-sm p-3 text-lg" 
          />
        </div>
        
        {/* Optional Date Inputs */}
        <div className="flex w-full md:w-auto gap-4">
          <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm p-3"/>
          <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm p-3"/>
        </div>
        
        <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 h-full">
          Search
        </button>
      </form>
    </div>
  );
}