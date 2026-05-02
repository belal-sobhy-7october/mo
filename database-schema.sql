-- =====================================================
-- MoMasry Fitness Assessment System - Database Schema
-- =====================================================
-- PostgreSQL Database Schema
-- Created for Railway Deployment
-- =====================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CLIENTS TABLE
-- =====================================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
    height DECIMAL(5,2) NOT NULL CHECK (height > 0), -- in cm
    starting_weight DECIMAL(5,2) NOT NULL CHECK (starting_weight > 0), -- in kg
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    marital_status VARCHAR(20) NOT NULL CHECK (marital_status IN ('single', 'married', 'divorced')),
    training_level VARCHAR(20) NOT NULL CHECK (training_level IN ('beginner', 'intermediate', 'advanced')),
    goal TEXT NOT NULL,
    injury_history TEXT,
    smoking BOOLEAN NOT NULL DEFAULT FALSE,
    alcohol BOOLEAN NOT NULL DEFAULT FALSE,
    sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    profile_image TEXT, -- Base64 encoded image URL or path
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SESSIONS TABLE
-- =====================================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Quick Check-in
    pain_level INTEGER CHECK (pain_level >= 1 AND pain_level <= 10),
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
    general_condition TEXT,
    
    -- Body Composition
    weight DECIMAL(5,2) CHECK (weight > 0), -- kg
    body_fat DECIMAL(5,2) CHECK (body_fat >= 0 AND body_fat <= 100), -- %
    muscle_mass DECIMAL(5,2) CHECK (muscle_mass >= 0 AND muscle_mass <= 100), -- %
    
    -- Body Measurements (cm)
    waist DECIMAL(5,2) CHECK (waist > 0),
    hips DECIMAL(5,2) CHECK (hips > 0),
    chest DECIMAL(5,2) CHECK (chest > 0),
    thigh DECIMAL(5,2) CHECK (thigh > 0),
    arm DECIMAL(5,2) CHECK (arm > 0),
    calf DECIMAL(5,2) CHECK (calf > 0), -- optional
    shoulders DECIMAL(5,2) CHECK (shoulders > 0), -- optional
    
    -- Photos (Base64 encoded or URLs)
    photo_front TEXT,
    photo_side TEXT,
    photo_back TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MOBILITY TESTS TABLE
-- =====================================================
CREATE TABLE mobility_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    category VARCHAR(20) NOT NULL CHECK (category IN ('hip', 'shoulder', 'ankle', 'thoracic')),
    exercise_name VARCHAR(255) NOT NULL,
    exercise_description TEXT,
    result DECIMAL(8,2), -- measurement in cm or degrees
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STABILITY TESTS TABLE
-- =====================================================
CREATE TABLE stability_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    exercise_name VARCHAR(255) NOT NULL,
    exercise_description TEXT,
    result TEXT, -- time in seconds or rating
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STRENGTH TESTS TABLE
-- =====================================================
CREATE TABLE strength_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    category VARCHAR(20) NOT NULL CHECK (category IN ('push', 'pull', 'lower', 'core')),
    exercise_name VARCHAR(255) NOT NULL,
    exercise_description TEXT,
    weight DECIMAL(6,2) CHECK (weight >= 0), -- kg
    reps INTEGER CHECK (reps > 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STRENGTH BENCHMARKS TABLE
-- =====================================================
CREATE TABLE strength_benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    exercise VARCHAR(50) NOT NULL CHECK (exercise IN ('push-up', 'pull-up', 'bench-press', 'squat', 'deadlift', 'military-press')),
    weight DECIMAL(6,2) CHECK (weight >= 0), -- kg
    reps INTEGER CHECK (reps > 0),
    score INTEGER CHECK (score >= 0), -- calculated score
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Clients indexes
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_created_at ON clients(created_at);

-- Sessions indexes
CREATE INDEX idx_sessions_client_id ON sessions(client_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_sessions_client_date ON sessions(client_id, session_date);

-- Mobility tests indexes
CREATE INDEX idx_mobility_session_id ON mobility_tests(session_id);
CREATE INDEX idx_mobility_category ON mobility_tests(category);

-- Stability tests indexes
CREATE INDEX idx_stability_session_id ON stability_tests(session_id);

-- Strength tests indexes
CREATE INDEX idx_strength_session_id ON strength_tests(session_id);
CREATE INDEX idx_strength_category ON strength_tests(category);

-- Strength benchmarks indexes
CREATE INDEX idx_benchmarks_session_id ON strength_benchmarks(session_id);
CREATE INDEX idx_benchmarks_exercise ON strength_benchmarks(exercise);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Client summary view
CREATE VIEW client_summary AS
SELECT 
    c.id,
    c.name,
    c.age,
    c.gender,
    c.training_level,
    c.created_at,
    COUNT(s.id) as total_sessions,
    MAX(s.session_date) as last_session_date
FROM clients c
LEFT JOIN sessions s ON c.id = s.client_id
GROUP BY c.id, c.name, c.age, c.gender, c.training_level, c.created_at;

-- Session progress view
CREATE VIEW session_progress AS
SELECT 
    s.id as session_id,
    s.client_id,
    c.name as client_name,
    s.session_date,
    s.weight,
    s.body_fat,
    s.muscle_mass,
    s.waist,
    s.hips,
    s.chest,
    ROW_NUMBER() OVER (PARTITION BY s.client_id ORDER BY s.session_date) as session_number
FROM sessions s
JOIN clients c ON s.client_id = c.id
ORDER BY s.client_id, s.session_date;

-- Strength benchmarks progress view
CREATE VIEW strength_progress AS
SELECT 
    sb.exercise,
    sb.session_id,
    s.client_id,
    c.name as client_name,
    s.session_date,
    sb.weight,
    sb.reps,
    sb.score,
    ROW_NUMBER() OVER (PARTITION BY s.client_id, sb.exercise ORDER BY s.session_date) as attempt_number
FROM strength_benchmarks sb
JOIN sessions s ON sb.session_id = s.id
JOIN clients c ON s.client_id = c.id
ORDER BY s.client_id, sb.exercise, s.session_date;

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample client
INSERT INTO clients (name, age, height, starting_weight, gender, marital_status, training_level, goal, injury_history, smoking, alcohol, sleep_hours)
VALUES 
    ('أحمد محمد', 25, 175.5, 80.0, 'male', 'single', 'intermediate', 'زيادة الكتلة العضلية وفقدان الدهون', 'لا يوجد', false, false, 7.5),
    ('سارة أحمد', 28, 162.0, 65.0, 'female', 'married', 'beginner', 'تحسين اللياقة وفقدان الوزن', 'إصابة قديمة في الركبة', false, false, 8.0);

-- =====================================================
-- NOTES
-- =====================================================

-- 1. All measurements use metric system (cm, kg)
-- 2. Photos stored as Base64 or URLs
-- 3. UUIDs provide better security than auto-increment
-- 4. Timestamps use UTC for consistency
-- 5. CHECK constraints ensure data integrity
-- 6. Indexes optimize common queries
-- 7. Views simplify complex reporting queries

-- =====================================================
-- BACKUP COMMANDS
-- =====================================================

-- To backup the database:
-- pg_dump -h hostname -U username -d database_name > backup.sql

-- To restore the database:
-- psql -h hostname -U username -d database_name < backup.sql
