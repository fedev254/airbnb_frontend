// In src/pages/CreatePropertyPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/apiService';

export default function CreatePropertyPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    country: 'Kenya', // Default value
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/properties/', formData);
      navigate(`/host/properties/${newProperty.id}/manage`); // Go to dashboard on success
    } catch (err) {
      setError('Failed to create property. Please check all fields and try again.');
      console.error('Create Property Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white bg-opacity-95 rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-4">Create a New Property</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-1">
              Property Title
            </label>
            <input 
              type="text" 
              name="title" 
              id="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., Beachfront Villa in Watamu"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea 
              name="description" 
              id="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="4" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Describe what makes your property special."
            ></textarea>
          </div>
          
          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-bold text-gray-700 mb-1">
              Street Address
            </label>
            <input 
              type="text" 
              name="address" 
              id="address" 
              value={formData.address} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          {/* City & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-bold text-gray-700 mb-1">City</label>
              <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-bold text-gray-700 mb-1">Country</label>
              <input type="text" name="country" id="country" value={formData.country} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Saving Property...' : 'Save and Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}