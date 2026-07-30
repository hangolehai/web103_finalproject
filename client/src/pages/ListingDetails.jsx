import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const today = new Date().toISOString().slice(0, 10);

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [dates, setDates] = useState({ start_date: '', end_date: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadListing = useCallback(() => fetch(`/api/listings/${id}`)
    .then((response) => response.ok ? response.json() : Promise.reject())
    .then(setListing)
    .catch(() => setListing(false)), [id]);

  useEffect(() => { loadListing(); }, [loadListing]);

  const requestReservation = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const response = await fetch(`/api/listings/${id}/reservations`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dates)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || 'Unable to request reservation.');
      setMessage('Reservation requested. The lender can now review it.');
      setDates({ start_date: '', end_date: '' });
      loadListing();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (listing === null) return <main className="container loading-copy">Loading listing...</main>;
  if (listing === false) return <main className="container"><p>Listing not found.</p><Link to="/">Back to explore</Link></main>;

  return (
    <main className="container detail-layout">
      <section>
        <Link className="back-link" to="/">Back to explore</Link>
        <p className="eyebrow">{listing.category} · {listing.type}</p>
        <h1>{listing.title}</h1>
        <p className="detail-owner">Shared by {listing.owner_name} in {listing.neighborhood}</p>
        <div className="detail-visual">{listing.type === 'skill' ? 'Practical skill' : 'Community tool'}</div>
        <h2>About this listing</h2>
        <p className="detail-description">{listing.description || 'No description has been added.'}</p>
        <h2>Current reservations</h2>
        {listing.reservations.length === 0 ? <p>No upcoming reservations.</p> : <ul className="reservation-list">{listing.reservations.map((reservation) => <li key={reservation.id}>{reservation.start_date.slice(0, 10)} to {reservation.end_date.slice(0, 10)} · {reservation.status}</li>)}</ul>}
      </section>
      <aside className="reservation-panel">
        <h2>Request a reservation</h2>
        <form onSubmit={requestReservation}>
          <label>Start date<input type="date" min={today} required value={dates.start_date} onChange={(event) => setDates({ ...dates, start_date: event.target.value })} /></label>
          <label>End date<input type="date" min={dates.start_date || today} required value={dates.end_date} onChange={(event) => setDates({ ...dates, end_date: event.target.value })} /></label>
          <button className="btn btn-primary" disabled={isSubmitting || !listing.availability_status}>{isSubmitting ? 'Sending...' : 'Request reservation'}</button>
        </form>
        {message && <p className="form-message" role="status">{message}</p>}
        {!listing.availability_status && <p className="form-message">This listing is currently unavailable.</p>}
      </aside>
    </main>
  );
};

export default ListingDetails;
