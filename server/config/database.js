const { Pool } = require('pg');
require('dotenv').config();

// We'll set up a default connection to a local 'localloop' database if no connection string is provided.
const connectionString = process.env.DATABASE_URL || (process.env.PGHOST
  ? `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
  : 'postgresql://localhost:5432/localloop');

const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_URL || process.env.PGHOST ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  pool,
};
