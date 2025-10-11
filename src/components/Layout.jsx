// In src/components/Layout.jsx

import React from 'react';
import Navbar from './Navbar';
import backgroundImage from '../assets/skyline1.jpg';

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      <div className="relative z-10">
        <Navbar />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}