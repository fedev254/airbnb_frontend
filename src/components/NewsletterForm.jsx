// In src/components/NewsletterForm.jsx
import React, { useState } from 'react';
import api from '../services/apiService';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/blog/subscribe/', { email });
            setMessage('Thanks for subscribing!');
            setEmail('');
        } catch (err) {
            setMessage('This email is already subscribed or invalid.');
        }
    };

    return (
        <div>
            <h3 className="font-bold mb-4">Join our Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">Get updates on new properties and special offers.</p>
            <form onSubmit={handleSubmit} className="flex">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Your email" className="p-2 rounded-l-md text-gray-800 w-full" />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-md">Subscribe</button>
            </form>
            {message && <p className="text-sm text-green-400 mt-2">{message}</p>}
        </div>
    );
}