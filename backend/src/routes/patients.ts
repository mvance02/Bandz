import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get all patients for practice
router.get('/', async (req, res) => {
  try {
    const practiceId = req.headers['x-practice-id'] || 1;
    
    const result = await pool.query(
      `SELECT 
         p.*,
         array_agg(DISTINCT pt.tag) FILTER (WHERE pt.tag IS NOT NULL) as tags
       FROM patients p
       LEFT JOIN patient_tags pt ON p.id = pt.patient_id
       WHERE p.practice_id = $1
       GROUP BY p.id
       ORDER BY p.name`,
      [practiceId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Get single patient with metrics
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get patient info
    const patientResult = await pool.query(
      `SELECT 
         p.*,
         pr.name as practice_name,
         array_agg(DISTINCT pt.tag) FILTER (WHERE pt.tag IS NOT NULL) as tags
       FROM patients p
       JOIN practices pr ON p.practice_id = pr.id
       LEFT JOIN patient_tags pt ON p.id = pt.patient_id
       WHERE p.id = $1
       GROUP BY p.id, pr.name`,
      [id]
    );
    
    if (patientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Get 7-day metrics
    const sevenDayMetrics = await pool.query(
      `SELECT 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE ps.is_on_time = true) as on_time,
         COUNT(*) FILTER (WHERE ps.band_present = true) as band_present,
         COUNT(*) FILTER (WHERE ps.reviewed_by IS NOT NULL) as reviewed
       FROM daily_prompts dp
       LEFT JOIN photo_submissions ps ON dp.id = ps.daily_prompt_id
       WHERE dp.patient_id = $1
       AND dp.date >= NOW() - INTERVAL '7 days'`,
      [id]
    );
    
    // Get 30-day metrics
    const thirtyDayMetrics = await pool.query(
      `SELECT 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE ps.is_on_time = true) as on_time,
         COUNT(*) FILTER (WHERE ps.band_present = true) as band_present,
         COUNT(*) FILTER (WHERE ps.reviewed_by IS NOT NULL) as reviewed
       FROM daily_prompts dp
       LEFT JOIN photo_submissions ps ON dp.id = ps.daily_prompt_id
       WHERE dp.patient_id = $1
       AND dp.date >= NOW() - INTERVAL '30 days'`,
      [id]
    );
    
    const patient = patientResult.rows[0];
    const m7 = sevenDayMetrics.rows[0];
    const m30 = thirtyDayMetrics.rows[0];
    
    res.json({
      ...patient,
      metrics: {
        last7Days: {
          compliancePct: parseInt(m7.reviewed) > 0 
            ? Math.round((parseInt(m7.band_present) / parseInt(m7.reviewed)) * 100) 
            : 0,
          onTimePct: parseInt(m7.total) > 0 
            ? Math.round((parseInt(m7.on_time) / parseInt(m7.total)) * 100) 
            : 0,
        },
        last30Days: {
          compliancePct: parseInt(m30.reviewed) > 0 
            ? Math.round((parseInt(m30.band_present) / parseInt(m30.reviewed)) * 100) 
            : 0,
          onTimePct: parseInt(m30.total) > 0 
            ? Math.round((parseInt(m30.on_time) / parseInt(m30.total)) * 100) 
            : 0,
          missing: 90 - parseInt(m30.total), // 3 per day * 30 days
        },
      },
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Get review data for patient on specific date
router.get('/:id/review', async (req, res) => {
  try {
    const { id } = req.params;
    const date = req.query.date || new Date().toISOString().split('T')[0];
    
    const result = await pool.query(
      `SELECT 
         dp.id as prompt_id,
         dp.slot,
         dp.notification_sent_at,
         dp.submission_deadline_at,
         ps.id as submission_id,
         ps.image_url,
         ps.submitted_at,
         ps.is_on_time,
         ps.band_present,
         ps.review_note,
         ps.reviewed_by
       FROM daily_prompts dp
       LEFT JOIN photo_submissions ps ON dp.id = ps.daily_prompt_id
       WHERE dp.patient_id = $1 AND dp.date = $2
       ORDER BY dp.slot`,
      [id, date]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get review data error:', error);
    res.status(500).json({ error: 'Failed to fetch review data' });
  }
});

// Update patient status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['active', 'paused'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await pool.query(
      'UPDATE patients SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update patient status error:', error);
    res.status(500).json({ error: 'Failed to update patient status' });
  }
});

// Patient submits photo (for mobile app)
router.post('/photo', async (req, res) => {
  try {
    const { promptId, imageUrl } = req.body;
    
    // Get prompt details
    const promptResult = await pool.query(
      'SELECT * FROM daily_prompts WHERE id = $1',
      [promptId]
    );
    
    if (promptResult.rows.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    
    const prompt = promptResult.rows[0];
    const now = new Date();
    const isOnTime = prompt.submission_deadline_at 
      ? now <= new Date(prompt.submission_deadline_at)
      : true;
    
    const result = await pool.query(
      `INSERT INTO photo_submissions (daily_prompt_id, image_url, is_on_time)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [promptId, imageUrl, isOnTime]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Photo submission error:', error);
    res.status(500).json({ error: 'Failed to submit photo' });
  }
});

export default router;
