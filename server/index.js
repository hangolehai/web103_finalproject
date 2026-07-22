const express = require('express');
const cors = require('cors');
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
    const result = await pool.query('SELECT * FROM listings ORDER BY created_at DESC');
    res.json(result.rows);
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
app.put('/api/listings/:id', async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
