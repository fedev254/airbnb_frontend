// In src/App.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './components/Layout'; // 👈 Import the Layout

function App() {
  return (
    // Wrap the page content (Outlet) in the Layout component
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default App;