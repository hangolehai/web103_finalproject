import React from 'react';
import { BrowserRouter as Router, NavLink, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import ListingDetails from './pages/ListingDetails';

function App() {
  return (
    <Router>
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">LocalLoop</NavLink>
        <div className="navbar-links">
          <NavLink to="/">Explore</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Explore />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
