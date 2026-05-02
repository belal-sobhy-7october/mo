const { Pool } = require('@neondatabase/serverless');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

// Schema migration queries
const migrations = [
  // Enable UUID extension
  'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
  
  // Clients table
  `CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
    height DECIMAL(5,2) NOT NULL CHECK (height > 0),
    starting_weight DECIMAL(5,2) NOT NULL CHECK (starting_weight > 0),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    marital_status VARCHAR(20) NOT NULL CHECK (marital_status IN ('single', 'married', 'divorced')),
    training_level VARCHAR(20) NOT NULL CHECK (training_level IN ('beginner', 'intermediate', 'advanced')),
    goal TEXT NOT NULL,
    injury_history TEXT,
    smoking BOOLEAN NOT NULL DEFAULT FALSE,
    alcohol BOOLEAN NOT NULL DEFAULT FALSE,
    sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,
  
  // Sessions table
  `CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,
  
  // Body composition table
  `CREATE TABLE IF NOT EXISTS body_composition (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    weight DECIMAL(5,2) CHECK (weight > 0),
    body_fat_percentage DECIMAL(5,2) CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100),
    muscle_mass DECIMAL(5,2) CHECK (muscle_mass >= 0),
    water_percentage DECIMAL(5,2) CHECK (water_percentage >= 0 AND water_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,
  
  // Measurements table
  `CREATE TABLE IF NOT EXISTS measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    chest DECIMAL(5,2) CHECK (chest > 0),
    waist DECIMAL(5,2) CHECK (waist > 0),
    hips DECIMAL(5,2) CHECK (hips > 0),
    arms DECIMAL(5,2) CHECK (arms > 0),
    thighs DECIMAL(5,2) CHECK (thighs > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,
  
  // Mobility tests table
  `CREATE TABLE IF NOT EXISTS mobility_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    shoulder_flexibility_left INTEGER CHECK (shoulder_flexibility_left >= 0),
    shoulder_flexibility_right INTEGER CHECK (shoulder_flexibility_right >= 0),
    hip_flexibility_left INTEGER CHECK (hip_flexibility_left >= 0),
    hip_flexibility_right INTEGER CHECK (hip_flexibility_right >= 0),
    spinal_flexibility INTEGER CHECK (spinal_flexibility >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,
  
  // Stability tests table
  `CREATE TABLE IF NOT EXISTS stability_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    balance_test_left INTEGER CHECK (balance_test_left >= 0),
    balance_test_right INTEGER CHECK (balance_test_right >= 0),
    core_stability INTEGER CHECK (core_stability >= 0),
    posture_score INTEGER CHECK (posture_score >= 0 AND posture_score <= 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,
  
  // Strength tests table
  `CREATE TABLE IF NOT EXISTS strength_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    bench_press DECIMAL(6,2) CHECK (bench_press > 0),
    squat DECIMAL(6,2) CHECK (squat > 0),
    deadlift DECIMAL(6,2) CHECK (deadlift > 0),
    overhead_press DECIMAL(6,2) CHECK (overhead_press > 0),
    pull_ups INTEGER CHECK (pull_ups >= 0),
    push_ups INTEGER CHECK (push_ups >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,
  
  // Strength benchmarks table
  `CREATE TABLE IF NOT EXISTS strength_benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    exercise VARCHAR(50) NOT NULL,
    target_weight DECIMAL(6,2) CHECK (target_weight > 0),
    current_weight DECIMAL(6,2) CHECK (current_weight >= 0),
    target_date DATE,
    achieved BOOLEAN NOT NULL DEFAULT FALSE,
    achieved_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,
];

async function runMigrations() {
  console.log('Starting database migrations...');
  
  try {
    for (let i = 0; i < migrations.length; i++) {
      const query = migrations[i];
      console.log(`Running migration ${i + 1}/${migrations.length}...`);
      
      await pool.query(query);
      console.log(`Migration ${i + 1} completed successfully`);
    }
    
    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigrations };
