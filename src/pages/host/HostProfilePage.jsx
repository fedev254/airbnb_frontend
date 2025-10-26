// In src/pages/host/HostProfilePage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/apiService';

export default function HostProfilePage() {
    const { user } = useAuth(); // 'user' from context has username, email, role
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch full user details on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                setLoading(true);
                try {
                    const response = await api.get('/auth/user/');
                    setFormData({
                        first_name: response.data.first_name || '',
                        last_name: response.data.last_name || '',
                        phone_number: response.data.phone_number || '',
                    });
                } catch (err) {
                    setError('Failed to load your profile details.');
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
        setSuccess(null);
        setError(null);
        try {
            await api.patch('/auth/user/', formData);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update your profile. Please try again.');
        }
    };

    if (loading) return <p className="text-white text-center py-10">Loading Profile...</p>;

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white/95 rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">My Host Profile</h1>
                
                {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username (Read-only) */}
                    <div>
                        <label className="text-sm font-bold text-gray-500">Username</label>
                        <p className="mt-1 p-2 bg-gray-100 rounded">{user?.username}</p>
                    </div>
                    {/* Email (Read-only) */}
                    <div>
                        <label className="text-sm font-bold text-gray-500">Email Address</label>
                        <p className="mt-1 p-2 bg-gray-100 rounded">{user?.email}</p>
                    </div>
                    
                    {/* Editable fields */}
                    <div>
                        <label htmlFor="first_name" className="block text-sm font-bold">First Name</label>
                        <input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full border p-2 rounded mt-1"/>
                    </div>
                    <div>
                        <label htmlFor="last_name" className="block text-sm font-bold">Last Name</label>
                        <input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full border p-2 rounded mt-1"/>
                    </div>
                    <div>
                        <label htmlFor="phone_number" className="block text-sm font-bold">Phone Number</label>
                        <input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full border p-2 rounded mt-1"/>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                            Save Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}