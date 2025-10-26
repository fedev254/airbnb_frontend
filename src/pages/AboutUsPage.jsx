// In src/pages/AboutUsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutUsPage() {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
          <div className="md:w-5/12 lg:w-5/12">
            <img 
              src="C:\Users\hp\Documents\airbnb-frontend\src\assets\livingroom.jpg" // Using an image from the 'public' folder
              alt="Team at StayEase" 
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-7/12 lg:w-6/12">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              About StayEase
            </h2>
            <p className="mt-6 text-gray-700">
              Welcome to StayEase, your premier destination for finding comfort, ease, and unforgettable experiences. Our mission is to connect travelers with beautiful, verified homes hosted by trusted individuals. We believe that a great stay starts with a seamless booking experience and a place that feels like home.
            </p>
            <p className="mt-4 text-gray-700">
              Founded in 2025, StayEase was born from a passion for travel and hospitality. We meticulously vet each property to ensure it meets our high standards of quality, safety, and comfort. Whether you're traveling for business or pleasure, our platform provides a curated selection of properties to suit your needs, all in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}