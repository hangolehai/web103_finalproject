const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { pool } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

// Get all listings
app.get('/api/listings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT listings.*, users.username AS owner_name, users.neighborhood
      FROM listings
      JOIN users ON users.id = listings.owner_id
      ORDER BY listings.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get one listing and its current reservations for the details page.
app.get('/api/listings/:id', async (req, res) => {
  try {
    const listingResult = await pool.query(`
      SELECT listings.*, users.username AS owner_name, users.neighborhood
      FROM listings
      JOIN users ON users.id = listings.owner_id
      WHERE listings.id = $1
    `, [req.params.id]);

    if (listingResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Listing not found' });
    }

    const reservationsResult = await pool.query(`
      SELECT reservations.*, users.username AS borrower_name
      FROM reservations
      JOIN users ON users.id = reservations.borrower_id
      WHERE listing_id = $1 AND status IN ('pending', 'approved')
      ORDER BY start_date
    `, [req.params.id]);

    res.json({ ...listingResult.rows[0], reservations: reservationsResult.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new listing
app.post('/api/listings', async (req, res) => {
  try {
    const { owner_id, title, description, type, category, availability_status } = req.body;
    const result = await pool.query(
      'INSERT INTO listings (owner_id, title, description, type, category, availability_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [owner_id || 1, title, description, type, category, availability_status !== undefined ? availability_status : true]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a listing
app.patch('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, category, availability_status } = req.body;
    const result = await pool.query(
      'UPDATE listings SET title = $1, description = $2, type = $3, category = $4, availability_status = $5 WHERE id = $6 RETURNING *',
      [title, description, type, category, availability_status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a listing
app.delete('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM listings WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Listing not found' });
    }
    res.json({ msg: 'Listing deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Request a reservation. An overlapping pending or approved reservation blocks the dates.
app.post('/api/listings/:id/reservations', async (req, res) => {
  try {
    const { start_date, end_date, borrower_id = 2 } = req.body;
    const { id: listingId } = req.params;

    if (!start_date || !end_date) {
      return res.status(400).json({ msg: 'Choose both a start and end date.' });
    }

    const today = new Date().toISOString().slice(0, 10);
    if (start_date < today || end_date < start_date) {
      return res.status(400).json({ msg: 'Choose a valid date range that starts today or later.' });
    }

    const listingResult = await pool.query(
      'SELECT id FROM listings WHERE id = $1 AND availability_status = true',
      [listingId]
    );
    if (listingResult.rows.length === 0) {
      return res.status(404).json({ msg: 'This listing is unavailable.' });
    }

    const conflictResult = await pool.query(`
      SELECT id FROM reservations
      WHERE listing_id = $1
        AND status IN ('pending', 'approved')
        AND start_date <= $3::date
        AND end_date >= $2::date
    `, [listingId, start_date, end_date]);
    if (conflictResult.rows.length > 0) {
      return res.status(409).json({ msg: 'Those dates overlap with an existing reservation.' });
    }

    const result = await pool.query(`
      INSERT INTO reservations (listing_id, borrower_id, start_date, end_date, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *
    `, [listingId, borrower_id, start_date, end_date]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Development/demo helper: restore the schema and sample data.
app.post('/api/admin/reset', async (_req, res) => {
  try {
    const seedQuery = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), 'utf8');
    await pool.query(seedQuery);
    res.json({ msg: 'Database reset to sample data.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
