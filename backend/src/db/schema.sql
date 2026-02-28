-- BANDZ Database Schema
-- PostgreSQL schema for orthodontic compliance tracking

-- Practices table
CREATE TABLE IF NOT EXISTS practices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    practice_code VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orthodontists table
CREATE TABLE IF NOT EXISTS orthodontists (
    id SERIAL PRIMARY KEY,
    practice_id INTEGER REFERENCES practices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    practice_id INTEGER REFERENCES practices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    dob DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused')),
    bands_type VARCHAR(50),
    notes TEXT,
    start_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient tags table (for Sports, Night Owl, Early Riser, etc.)
CREATE TABLE IF NOT EXISTS patient_tags (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    tag VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, tag)
);

-- Daily prompts table (3 per patient per day)
CREATE TABLE IF NOT EXISTS daily_prompts (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    slot INTEGER NOT NULL CHECK (slot BETWEEN 1 AND 3), -- 1=Morning, 2=Midday, 3=Evening
    notification_sent_at TIMESTAMP,
    submission_deadline_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, date, slot)
);

-- Photo submissions table
CREATE TABLE IF NOT EXISTS photo_submissions (
    id SERIAL PRIMARY KEY,
    daily_prompt_id INTEGER REFERENCES daily_prompts(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_on_time BOOLEAN DEFAULT FALSE,
    reviewed_by INTEGER REFERENCES orthodontists(id),
    band_present BOOLEAN,
    review_note TEXT,
    reviewed_at TIMESTAMP
);

-- Schedule slots table (randomized notification times per practice)
CREATE TABLE IF NOT EXISTS schedule_slots (
    id SERIAL PRIMARY KEY,
    practice_id INTEGER REFERENCES practices(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    slot INTEGER NOT NULL CHECK (slot BETWEEN 1 AND 3),
    notification_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(practice_id, date, slot)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_patients_practice ON patients(practice_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_daily_prompts_patient_date ON daily_prompts(patient_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_prompts_date ON daily_prompts(date);
CREATE INDEX IF NOT EXISTS idx_photo_submissions_prompt ON photo_submissions(daily_prompt_id);
CREATE INDEX IF NOT EXISTS idx_schedule_slots_practice_date ON schedule_slots(practice_id, date);

-- Insert demo data
INSERT INTO practices (name, practice_code) 
VALUES ('Bennion Orthodontics', 'BENNION')
ON CONFLICT (practice_code) DO NOTHING;

INSERT INTO orthodontists (practice_id, name, email, phone, password_hash)
VALUES (
    (SELECT id FROM practices WHERE practice_code = 'BENNION'),
    'Dr. Edwin Bennion',
    'dr.bennion@bandz.demo',
    '555-0123',
    'demo' -- In production, this would be a proper hash
)
ON CONFLICT (email) DO NOTHING;
