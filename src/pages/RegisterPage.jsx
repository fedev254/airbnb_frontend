import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    password: '',
    password2: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (formData.password !== formData.password2) {
      setError({ detail: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        password: formData.password,
      };

      await axios.post('http://127.0.0.1:8000/api/auth/register/', payload);
      navigate('/login?registered=true');
    } catch (err) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        const formattedError = Object.keys(errorData)
          .map((key) => `${key}: ${errorData[key].join(', ')}`)
          .join(' | ');
        setError({ detail: formattedError });
      } else {
        setError({ detail: 'Registration failed. Please try again.' });
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 flex justify-center mt-16">
      <div className="w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Create Your Account
          </h2>

          {/* Error Display */}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error.detail}</span>
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* First & Last Name */}
          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="phoneNumber"
            >
              Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="password2"
              id="password2"
              value={formData.password2}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* --- Divider and Google Sign-Up Button --- */}
        <div className="my-4 flex items-center before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
          <p className="text-center font-semibold mx-4 mb-0 text-gray-500">OR</p>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-semibold p-3 rounded-md hover:bg-gray-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path
              fill="#4285F4"
              d="M24 9.5c3.9 0 6.8 1.6 8.4 3.1l6.3-6.3C34.9 2.8 30.1 0 24 0 14.5 0 6.6 5.5 2.7 13.5L9 18.2c1.9-5.7 7.2-9.7 13-9.7z"
            />
            <path
              fill="#34A853"
              d="M46.2 25.1c0-1.6-.1-3.2-.4-4.7H24v9h12.5c-.5 2.9-2.2 5.4-4.8 7.1l6.3 4.9c3.7-3.4 5.9-8.3 5.9-14.3z"
            />
            <path
              fill="#FBBC05"
              d="M9.8 28.1c-.6-1.8-.9-3.7-.9-5.6s.3-3.8.9-5.6l-6.3-4.9C1.1 16.6 0 20.2 0 24c0 3.8 1.1 7.4 2.9 10.5l6.9-5.4z"
            />
            <path
              fill="#EA4335"
              d="M24 48c5.6 0 10.3-1.8 13.7-4.9l-6.3-4.9c-1.9 1.3-4.3 2-7.1 2-5.8 0-10.7-3.9-12.5-9.1L2.7 34.5C6.6 42.5 14.5 48 24 48z"
            />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-blue-500 hover:text-blue-700">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
