// In src/pages/BlogPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/apiService';
import localPlaceholder from '../assets/skyline2.jpg'; // Using one of your assets

const PostCard = ({ post }) => {
    const imageUrl = post.featured_image || localPlaceholder;
    return (
        <Link to={`/blog/${post.slug}`} className="block group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform group-hover:-translate-y-1 transition-transform">
                <img src={imageUrl} alt={post.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">{post.title}</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        {new Date(post.created_on).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/blog/posts/')
            .then(res => setPosts(res.data.results || res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    
    if (loading) return <p className="text-center text-white py-20">Loading articles...</p>;

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="bg-white/95 rounded-xl shadow-lg p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">From the Blog</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => <PostCard key={post.slug} post={post} />)}
                </div>
            </div>
        </div>
    );
}