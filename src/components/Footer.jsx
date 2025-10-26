import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 px-6 mt-12 sticky bottom-0 w-full border-t border-gray-700">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* --- Column 1: Brand --- */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">StayEase</h2>
          <p className="text-sm leading-relaxed">
            Discover your next stay with comfort and ease. Beautiful homes,
            verified hosts, and trusted experiences — all in one place.
          </p>
        </div>

        {/* --- Column 2: Quick Links --- */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/properties" className="hover:text-white">Browse Properties</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
          </ul>
        </div>

        {/* --- Column 3: Contact Info --- */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Get in Touch</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Nairobi, Kenya
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +254 700 000 000
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> support@stayease.com
            </li>
          </ul>
        </div>

        {/* --- Column 4: Social Links --- */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white"><Facebook /></a>
            <a href="#" className="hover:text-white"><Twitter /></a>
            <a href="#" className="hover:text-white"><Instagram /></a>
          </div>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} StayEase. All rights reserved.
      </div>
    </footer>
  );
}
