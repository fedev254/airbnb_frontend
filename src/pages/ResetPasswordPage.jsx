// src/pages/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/apiService';

export default function ResetPasswordPage() {
  const { uid, token } = useParams(); // ✅ dj-rest-auth sends these as URL params
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // ✅ dj-rest-auth expects uid + token + new_password1 + new_password2
      const payload = {
        uid: uid,
        token: token,
        new_password1: password,
        new_password2: password2,
      };

      await api.post('/auth/password/reset/confirm/', payload);

      setMessage('Password has been reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error(err);
      setError('Invalid or expired reset link. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle invalid URL (missing params)
  if (!uid || !token) {
    return <p className="text-red-500 text-center mt-10">Invalid password reset link.</p>;
  }

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto bg-white/95 p-8 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Choose a New Password</h2>

        {message && <p className="text-green-600 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Confirm New Password"
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white p-2 rounded ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
