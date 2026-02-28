import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Orthodontist login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      `SELECT o.*, p.name as practice_name, p.practice_code
       FROM orthodontists o
       JOIN practices p ON o.practice_id = p.id
       WHERE o.email = $1 AND o.password_hash = $2`,
      [email, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const ortho = result.rows[0];
    res.json({
      id: ortho.id,
      name: ortho.name,
      email: ortho.email,
      practiceId: ortho.practice_id,
      practiceName: ortho.practice_name,
      practiceCode: ortho.practice_code,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Orthodontist signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, practiceCode } = req.body;
    
    // Validate practice code format
    if (!/^[A-Z0-9]{3,20}$/.test(practiceCode)) {
      return res.status(400).json({ 
        error: 'Practice code must be 3-20 uppercase letters/numbers' 
      });
    }
    
    // Check if practice code already exists
    const existingPractice = await pool.query(
      'SELECT id FROM practices WHERE practice_code = $1',
      [practiceCode]
    );
    
    if (existingPractice.rows.length > 0) {
      return res.status(400).json({ error: 'Practice code already exists' });
    }
    
    // Check if email already exists
    const existingEmail = await pool.query(
      'SELECT id FROM orthodontists WHERE email = $1',
      [email]
    );
    
    if (existingEmail.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Create practice
    const practiceResult = await pool.query(
      'INSERT INTO practices (name, practice_code) VALUES ($1, $2) RETURNING id',
      [`${name}'s Practice`, practiceCode]
    );
    
    const practiceId = practiceResult.rows[0].id;
    
    // Create orthodontist
    const orthoResult = await pool.query(
      `INSERT INTO orthodontists (practice_id, name, email, phone, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email`,
      [practiceId, name, email, phone, password]
    );
    
    res.status(201).json({
      id: orthoResult.rows[0].id,
      name: orthoResult.rows[0].name,
      email: orthoResult.rows[0].email,
      practiceId,
      practiceCode,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Patient signup (for mobile app)
router.post('/patients/signup', async (req, res) => {
  try {
    const { practiceCode, name, email, password, phone, dob } = req.body;
    
    // Find practice by code
    const practiceResult = await pool.query(
      'SELECT id FROM practices WHERE practice_code = $1',
      [practiceCode.toUpperCase()]
    );
    
    if (practiceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Practice not found' });
    }
    
    const practiceId = practiceResult.rows[0].id;
    
    // Create patient
    const patientResult = await pool.query(
      `INSERT INTO patients (practice_id, name, email, phone, password_hash, dob)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email`,
      [practiceId, name, email, phone, password, dob]
    );
    
    res.status(201).json({
      id: patientResult.rows[0].id,
      name: patientResult.rows[0].name,
      email: patientResult.rows[0].email,
      practiceId,
    });
  } catch (error) {
    console.error('Patient signup error:', error);
    res.status(500).json({ error: 'Patient signup failed' });
  }
});

// Patient login (for mobile app)
router.post('/patients/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query(
      `SELECT p.*, pr.name as practice_name
       FROM patients p
       JOIN practices pr ON p.practice_id = pr.id
       WHERE p.email = $1 AND p.password_hash = $2`,
      [email, password]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const patient = result.rows[0];
    res.json({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      practiceId: patient.practice_id,
      practiceName: patient.practice_name,
    });
  } catch (error) {
    console.error('Patient login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
