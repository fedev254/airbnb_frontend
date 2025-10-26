// In src/pages/PostDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/apiService';

export default function PostDetailPage() {
    const { slug } = useParams(); // Get the slug from the URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/blog/posts/${slug}/`)
            .then(res => setPost(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <p className="text-center text-white py-20">Loading post...</p>;
    if (!post) return <p className="text-center text-red-400 py-20">Post not found.</p>;

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white/95 rounded-xl shadow-lg p-8">
                {post.featured_image && <img src={post.featured_image} alt={post.title} className="w-full h-96 object-cover rounded-lg mb-8" />}
                <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
                <p className="text-sm text-gray-500 mt-2">
                    Posted on {new Date(post.created_on).toLocaleDateString('en-US', { dateStyle: 'long' })}
                </p>
                <div
                    className="prose lg:prose-xl mt-8 max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </div>
        </div>
    );
}