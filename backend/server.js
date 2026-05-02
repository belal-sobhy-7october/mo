const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

// =====================================================
// CLIENTS API ENDPOINTS
// =====================================================

// GET all clients
app.get('/api/clients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET client by ID
app.get('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching client:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new client
app.post('/api/clients', async (req, res) => {
  try {
    const {
      name, age, height, starting_weight, gender, marital_status,
      training_level, goal, injury_history, smoking, alcohol, sleep_hours
    } = req.body;

    const result = await pool.query(
      `INSERT INTO clients 
       (name, age, height, starting_weight, gender, marital_status, training_level, 
        goal, injury_history, smoking, alcohol, sleep_hours)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [name, age, height, starting_weight, gender, marital_status, training_level,
       goal, injury_history, smoking, alcohol, sleep_hours]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update client
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, age, height, starting_weight, gender, marital_status,
      training_level, goal, injury_history, smoking, alcohol, sleep_hours
    } = req.body;

    const result = await pool.query(
      `UPDATE clients 
       SET name = $1, age = $2, height = $3, starting_weight = $4, gender = $5,
           marital_status = $6, training_level = $7, goal = $8, injury_history = $9,
           smoking = $10, alcohol = $11, sleep_hours = $12
       WHERE id = $13
       RETURNING *`,
      [name, age, height, starting_weight, gender, marital_status, training_level,
       goal, injury_history, smoking, alcohol, sleep_hours, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// SESSIONS API ENDPOINTS
// =====================================================

// GET all sessions
app.get('/api/sessions', async (req, res) => {
  try {
    const { clientId } = req.query;
    let query = 'SELECT * FROM sessions';
    let params = [];

    if (clientId) {
      query += ' WHERE client_id = $1 ORDER BY session_date DESC';
      params = [clientId];
    } else {
      query += ' ORDER BY session_date DESC';
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET session by ID
app.get('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM sessions WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST new session
app.post('/api/sessions', async (req, res) => {
  try {
    const {
      client_id, session_date, pain_level, sleep_quality, general_condition,
      weight, body_fat, muscle_mass, waist, hips, chest, thigh, arm, calf, shoulders,
      photo_front, photo_side, photo_back
    } = req.body;

    const result = await pool.query(
      `INSERT INTO sessions 
       (client_id, session_date, pain_level, sleep_quality, general_condition,
        weight, body_fat, muscle_mass, waist, hips, chest, thigh, arm, calf, shoulders,
        photo_front, photo_side, photo_back)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING *`,
      [client_id, session_date, pain_level, sleep_quality, general_condition,
       weight, body_fat, muscle_mass, waist, hips, chest, thigh, arm, calf, shoulders,
       photo_front, photo_side, photo_back]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update session
app.put('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      client_id, session_date, pain_level, sleep_quality, general_condition,
      weight, body_fat, muscle_mass, waist, hips, chest, thigh, arm, calf, shoulders,
      photo_front, photo_side, photo_back
    } = req.body;

    const result = await pool.query(
      `UPDATE sessions 
       SET client_id = $1, session_date = $2, pain_level = $3, sleep_quality = $4, general_condition = $5,
           weight = $6, body_fat = $7, muscle_mass = $8, waist = $9, hips = $10, chest = $11,
           thigh = $12, arm = $13, calf = $14, shoulders = $15, photo_front = $16, photo_side = $17, photo_back = $18
       WHERE id = $19
       RETURNING *`,
      [client_id, session_date, pain_level, sleep_quality, general_condition,
       weight, body_fat, muscle_mass, waist, hips, chest, thigh, arm, calf, shoulders,
       photo_front, photo_side, photo_back, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE session
app.delete('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM sessions WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    console.error('Error deleting session:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// MOBILITY TESTS API ENDPOINTS
// =====================================================

// GET mobility tests for a session
app.get('/api/sessions/:sessionId/mobility', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await pool.query(
      'SELECT * FROM mobility_tests WHERE session_id = $1 ORDER BY category, exercise_name',
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching mobility tests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST mobility tests for a session
app.post('/api/sessions/:sessionId/mobility', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { tests } = req.body;

    // Delete existing mobility tests for this session
    await pool.query('DELETE FROM mobility_tests WHERE session_id = $1', [sessionId]);

    // Insert new mobility tests
    const insertPromises = tests.map(test => 
      pool.query(
        'INSERT INTO mobility_tests (session_id, category, exercise_name, exercise_description, result, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [sessionId, test.category, test.exercise_name, test.exercise_description, test.result, test.notes]
      )
    );

    const results = await Promise.all(insertPromises);
    res.status(201).json(results.map(r => r.rows[0]));
  } catch (err) {
    console.error('Error creating mobility tests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// STABILITY TESTS API ENDPOINTS
// =====================================================

// GET stability tests for a session
app.get('/api/sessions/:sessionId/stability', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await pool.query(
      'SELECT * FROM stability_tests WHERE session_id = $1 ORDER BY exercise_name',
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching stability tests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST stability tests for a session
app.post('/api/sessions/:sessionId/stability', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { tests } = req.body;

    // Delete existing stability tests for this session
    await pool.query('DELETE FROM stability_tests WHERE session_id = $1', [sessionId]);

    // Insert new stability tests
    const insertPromises = tests.map(test => 
      pool.query(
        'INSERT INTO stability_tests (session_id, exercise_name, exercise_description, result, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [sessionId, test.exercise_name, test.exercise_description, test.result, test.notes]
      )
    );

    const results = await Promise.all(insertPromises);
    res.status(201).json(results.map(r => r.rows[0]));
  } catch (err) {
    console.error('Error creating stability tests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// STRENGTH TESTS API ENDPOINTS
// =====================================================

// GET strength tests for a session
app.get('/api/sessions/:sessionId/strength', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await pool.query(
      'SELECT * FROM strength_tests WHERE session_id = $1 ORDER BY category, exercise_name',
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching strength tests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST strength tests for a session
app.post('/api/sessions/:sessionId/strength', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { tests } = req.body;

    // Delete existing strength tests for this session
    await pool.query('DELETE FROM strength_tests WHERE session_id = $1', [sessionId]);

    // Insert new strength tests
    const insertPromises = tests.map(test => 
      pool.query(
        'INSERT INTO strength_tests (session_id, category, exercise_name, exercise_description, weight, reps, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [sessionId, test.category, test.exercise_name, test.exercise_description, test.weight, test.reps, test.notes]
      )
    );

    const results = await Promise.all(insertPromises);
    res.status(201).json(results.map(r => r.rows[0]));
  } catch (err) {
    console.error('Error creating strength tests:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// STRENGTH BENCHMARKS API ENDPOINTS
// =====================================================

// GET strength benchmarks for a session
app.get('/api/sessions/:sessionId/benchmarks', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await pool.query(
      'SELECT * FROM strength_benchmarks WHERE session_id = $1 ORDER BY exercise',
      [sessionId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching strength benchmarks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST strength benchmarks for a session
app.post('/api/sessions/:sessionId/benchmarks', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { benchmarks } = req.body;

    // Delete existing benchmarks for this session
    await pool.query('DELETE FROM strength_benchmarks WHERE session_id = $1', [sessionId]);

    // Insert new benchmarks
    const insertPromises = benchmarks.map(benchmark => 
      pool.query(
        'INSERT INTO strength_benchmarks (session_id, exercise, weight, reps, score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [sessionId, benchmark.exercise, benchmark.weight, benchmark.reps, benchmark.score]
      )
    );

    const results = await Promise.all(insertPromises);
    res.status(201).json(results.map(r => r.rows[0]));
  } catch (err) {
    console.error('Error creating strength benchmarks:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// ANALYTICS API ENDPOINTS
// =====================================================

// GET client analytics
app.get('/api/clients/:clientId/analytics', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { metric = 'weight' } = req.query;

    let query = '';
    let params = [clientId];

    if (metric === 'weight') {
      query = `
        SELECT 
          session_date as date,
          weight,
          body_fat,
          muscle_mass
        FROM sessions 
        WHERE client_id = $1 AND weight IS NOT NULL
        ORDER BY session_date ASC
      `;
    } else if (metric === 'measurements') {
      query = `
        SELECT 
          session_date as date,
          waist,
          hips,
          chest,
          thigh,
          arm
        FROM sessions 
        WHERE client_id = $1 AND waist IS NOT NULL
        ORDER BY session_date ASC
      `;
    } else if (metric === 'benchmarks') {
      query = `
        SELECT 
          s.session_date as date,
          sb.exercise,
          sb.weight,
          sb.reps,
          sb.score
        FROM sessions s
        JOIN strength_benchmarks sb ON s.id = sb.session_id
        WHERE s.client_id = $1
        ORDER BY s.session_date ASC, sb.exercise
      `;
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/api/health', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: dbCheck.rows[0].now
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: err.message
    });
  }
});

// =====================================================
// SERVE REACT APP
// =====================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API available at http://localhost:${port}/api`);
});
