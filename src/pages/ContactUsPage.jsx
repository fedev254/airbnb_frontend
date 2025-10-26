// In src/pages/ContactUsPage.jsx
import React from 'react';

export default function ContactUsPage() {
  return (
    <div className="relative bg-white">
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50" />
      </div>
      <div className="relative max-w-7xl mx-auto lg:grid lg:grid-cols-5">
        <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:col-span-2 lg:px-8 lg:py-24 xl:pr-12">
          <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Get in touch</h2>
            <p className="mt-3 text-lg leading-6 text-gray-500">
              We'd love to hear from you! Whether you have a question about our properties, need assistance with a booking, or you're a host interested in joining us, please feel free to reach out.
            </p>
            <dl className="mt-8 text-base text-gray-500">
              {/* Your contact info from the footer */}
            </dl>
          </div>
        </div>
        <div className="bg-white py-16 px-4 sm:px-6 lg:col-span-3 lg:py-24 lg:px-8 xl:pl-12">
          <div className="max-w-lg mx-auto lg:max-w-none">
            <form action="#" method="POST" className="grid grid-cols-1 gap-y-6">
              {/* ... A standard form with inputs for Name, Email, Phone, Message ... */}
              <div>
                <button type="submit" className="w-full ...">Send Message</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}