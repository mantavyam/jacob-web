-- WomenRise Complaints Database Schema
-- SQLite Database for storing complaint submissions

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    address TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    pin TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    gender TEXT NOT NULL,
    religion TEXT,
    caste TEXT,
    complaint TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_submission_date ON complaints(submission_date DESC);
CREATE INDEX IF NOT EXISTS idx_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_state ON complaints(state);
CREATE INDEX IF NOT EXISTS idx_email ON complaints(email);

-- Create admin_sessions table for basic session management (optional)
CREATE TABLE IF NOT EXISTS admin_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_token TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL
);

-- Insert sample data for testing (optional - remove in production)
-- INSERT INTO complaints (
--     username, date_of_birth, address, state, district, pin, email, mobile, 
--     gender, religion, caste, complaint, status
-- ) VALUES (
--     'Test User', '1990-01-01', '123 Test Street', 'Maharashtra', 'Mumbai', 
--     '400001', 'test@example.com', '9876543210', 'Female', 'Hinduism', 
--     'General', 'This is a test complaint for verification purposes.', 'Pending'
-- );
