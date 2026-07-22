const fs = require('fs');
const path = require('path');
const { pool } = require('./config/database');

const setupDatabase = async () => {
  try {
    const seedQuery = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), { encoding: 'utf8' });
    
    console.log('Running seed script...');
    await pool.query(seedQuery);
    console.log('Database setup complete! Seed data inserted.');
    
  } catch (error) {
    console.error('Error setting up the database:', error);
  } finally {
    pool.end();
  }
};

setupDatabase();
