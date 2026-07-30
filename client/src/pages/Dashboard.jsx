import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ListingForm from '../components/ListingForm';

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch listings from backend
  const fetchListings = async () => {
    try {
      const response = await fetch('/api/listings');
      if (response.ok) {
        const data = await response.json();
        setListings(data);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleOpenModal = (listing = null) => {
    setEditingListing(listing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingListing(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    try {
      const url = editingListing 
        ? `/api/listings/${editingListing.id}` 
        : '/api/listings';
      const method = editingListing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchListings();
        handleCloseModal();
      } else {
        console.error('Unable to save listing');
      }
    } catch (error) {
      console.error('Error saving listing:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const response = await fetch(`/api/listings/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchListings();
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Maplewood neighborhood</p>
          <h1>My listings</h1>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> List a New Tool/Skill
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    You haven't listed anything yet! Click the button above to get started.
                  </td>
                </tr>
              ) : (
                listings.map((listing) => (
                  <tr key={listing.id}>
                    <td style={{ fontWeight: 500 }}>{listing.title}</td>
                    <td>{listing.category}</td>
                    <td style={{ textTransform: 'capitalize' }}>{listing.type}</td>
                    <td>
                      <span className={`status-badge ${listing.availability_status ? 'status-active' : 'status-inactive'}`}>
                        {listing.availability_status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" onClick={() => handleOpenModal(listing)}>
                          <Edit2 size={16} /> Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(listing.id)}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ListingForm 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSubmit={handleSubmit}
        initialData={editingListing}
      />
    </div>
  );
};

export default Dashboard;
