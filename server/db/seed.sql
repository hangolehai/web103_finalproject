DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE listings (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    category VARCHAR(50),
    availability_status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
    borrower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data
INSERT INTO users (username, email, password_hash, neighborhood) VALUES
('johndoe', 'john@example.com', 'hashed_pw_1', 'Maplewood'),
('janedoe', 'jane@example.com', 'hashed_pw_2', 'Oakridge');

INSERT INTO listings (owner_id, title, description, type, category, availability_status) VALUES
(1, 'Cordless Power Drill', 'Dewalt 20V Max cordless drill with battery and charger.', 'tool', 'Power Tools', true),
(2, 'Wheelbarrow', 'Heavy duty steel wheelbarrow. Great for yard work.', 'tool', 'Gardening', true),
(1, 'Basic Plumbing Skills', 'I can help fix leaky faucets or install new fixtures.', 'skill', 'Home Skills', true);

INSERT INTO reservations (listing_id, borrower_id, start_date, end_date, status) VALUES
(1, 2, '2026-08-01', '2026-08-03', 'approved');
