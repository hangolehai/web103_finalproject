import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetch('/api/listings')
      .then((response) => response.json())
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = ['All', ...new Set(listings.map((listing) => listing.category).filter(Boolean))];
  const visibleListings = useMemo(() => listings
    .filter((listing) => category === 'All' || listing.category === category)
    .sort((a, b) => sortBy === 'title'
      ? a.title.localeCompare(b.title)
      : new Date(b.created_at) - new Date(a.created_at)), [listings, category, sortBy]);

  return (
    <main className="container">
      <section className="page-heading">
        <p className="eyebrow">Share locally, use more thoughtfully</p>
        <h1>Explore your neighborhood</h1>
        <p>Borrow practical tools and book help from people close by.</p>
      </section>

      <section className="catalog-toolbar" aria-label="Listing filters">
        <label>Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="newest">Newest</option>
            <option value="title">Title A-Z</option>
          </select>
        </label>
      </section>

      {isLoading ? <p className="loading-copy">Loading listings...</p> : (
        <section className="listing-grid">
          {visibleListings.map((listing) => (
            <article className="listing-card" key={listing.id}>
              <div className="listing-icon" aria-hidden="true">{listing.type === 'skill' ? 'Skill' : 'Tool'}</div>
              <div className="listing-card-body">
                <p className="eyebrow">{listing.category}</p>
                <h2>{listing.title}</h2>
                <p>{listing.description}</p>
                <div className="listing-meta"><span>{listing.owner_name}</span><span>{listing.neighborhood}</span></div>
                <Link className="text-link" to={`/listings/${listing.id}`}>View details</Link>
              </div>
            </article>
          ))}
          {visibleListings.length === 0 && <p>No listings match this category yet.</p>}
        </section>
      )}
    </main>
  );
};

export default Explore;
