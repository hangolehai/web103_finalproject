import React, { useState, useEffect } from 'react';

const ListingForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'tool',
    category: '',
    availability_status: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'tool',
        category: 'Power Tools',
        availability_status: true
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Listing' : 'List a New Tool/Skill'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              name="title" 
              className="form-control" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              className="form-control" 
              rows="3" 
              value={formData.description} 
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Type</label>
            <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
              <option value="tool">Physical Tool</option>
              <option value="skill">Practical Skill</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" className="form-control" value={formData.category} onChange={handleChange}>
              <option value="Power Tools">Power Tools</option>
              <option value="Gardening">Gardening</option>
              <option value="Automotive">Automotive</option>
              <option value="Home Skills">Home Skills</option>
              <option value="Kitchen">Kitchen</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input 
              type="checkbox" 
              name="availability_status" 
              checked={formData.availability_status} 
              onChange={handleChange} 
            />
            <label style={{ margin: 0 }}>Available for borrowing</label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Save Changes' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;
