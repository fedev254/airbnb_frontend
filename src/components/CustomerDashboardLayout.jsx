// In src/components/CustomerDashboardLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function CustomerDashboardLayout() {
  // Style for the active tab
  const activeLinkClass = 'bg-blue-500 text-white';
  const inactiveLinkClass = 'text-gray-600 hover:bg-gray-200';

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="bg-white/95 rounded-xl shadow-lg md:flex">
        {/* Sidebar Navigation */}
        <nav className="md:w-1/4 p-6 border-r">
          <h2 className="text-xl font-bold mb-4">My Account</h2>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/my-account/bookings"
                end // Use 'end' to prevent it from matching child routes
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                My Bookings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/my-account/profile"
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${isActive ? activeLinkClass : inactiveLinkClass}`
                }
              >
                My Profile
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <div className="md:w-3/4 p-6">
          <Outlet /> {/* Child routes will render here (Bookings or Profile) */}
        </div>
      </div>
    </div>
  );
}