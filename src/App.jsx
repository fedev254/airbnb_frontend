// src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import { GoogleOAuthProvider } from '@react-oauth/google';

// ✅ Pull client ID from environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Layout>
        <Outlet /> {/* Nested routes render here */}
      </Layout>
    </GoogleOAuthProvider>
  );
}
