import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="navbar-brand">LocalLoop</Link>
        <div className="navbar-links">
          <Link to="/">Explore</Link>
          <Link to="/">Dashboard</Link>
          <Link to="/">Messages</Link>
          <Link to="/">Profile</Link>
        </div>
      </nav>
      
      <Routes>
        {/* We'll use Dashboard as the main route for now to demonstrate CRUD */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
