// In src/pages/customer/MyProfileTab.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/apiService';

export default function MyProfileTab() {
    const { user } = useAuth(); // The 'user' from context has basic info from the token
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch the full user details when the component mounts
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                setLoading(true);
                try {
                    const response = await api.get('/auth/user/');
                    setFormData({
                        first_name: response.data.first_name,
                        last_name: response.data.last_name,
                        phone_number: response.data.phone_number || '',
                    });
                } catch (err) {
                    setError('Failed to load profile.');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUserProfile();
    }, [user]);
    
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            await api.patch('/auth/user/', formData); // PATCH sends only updated fields
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        }
    };

    if (loading) return <p>Loading your profile...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

            {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div>
                    <label className="block text-sm font-bold">First Name</label>
                    <input name="first_name" value={formData.first_name} onChange={handleChange} className="w-full border p-2 rounded mt-1"/>
                </div>
                <div>
                    <label className="block text-sm font-bold">Last Name</label>
                    <input name="last_name" value={formData.last_name} onChange={handleChange} className="w-full border p-2 rounded mt-1"/>
                </div>
                <div>
                    <label className="block text-sm font-bold">Phone Number</label>
                    <input name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full border p-2 rounded mt-1"/>
                </div>
                {/* Email and Username are usually not editable */}
                <div className="pt-2">
                  <p className="text-sm font-bold text-gray-500">Username</p>
                  <p className="text-gray-700 bg-gray-100 p-2 rounded">{user?.username}</p>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-bold text-gray-500">Email</p>
                  <p className="text-gray-700 bg-gray-100 p-2 rounded">{user?.email}</p>
                </div>
                <div className="pt-4">
                    <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}