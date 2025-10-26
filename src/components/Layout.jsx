import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import backgroundImage from '../assets/skyline1.jpg';
import { ArrowUp } from 'lucide-react';

export default function Layout() {
  const [showScroll, setShowScroll] = useState(false);

  // Show the scroll button after scrolling 300px
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-950 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Main content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar always on top */}
        <Navbar />

        {/* Main content expands and pushes footer down */}
        <main className="flex-grow flex justify-center items-start py-8 px-4">
          <div className="w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Footer always sticks to bottom */}
        <Footer />
      </div>

      {/* Scroll To Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 animate-fade-in"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
