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

// Get patient stats for mobile app
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get patient info with practice
    const patientResult = await pool.query(
      `SELECT p.*, pr.id as practice_id, pr.name as practice_name
       FROM patients p
       JOIN practices pr ON p.practice_id = pr.id
       WHERE p.id = $1`,
      [id]
    );
    
    if (patientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const patient = patientResult.rows[0];
    
    // Calculate on-time percentage (all time)
    const onTimeResult = await pool.query(
      `SELECT 
         COUNT(*) as total_snaps,
         COUNT(*) FILTER (WHERE ps.is_on_time = true) as on_time_snaps
       FROM photo_submissions ps
       JOIN daily_prompts dp ON ps.daily_prompt_id = dp.id
       WHERE dp.patient_id = $1`,
      [id]
    );
    
    // Calculate total days enrolled
    const daysEnrolled = await pool.query(
      `SELECT EXTRACT(DAY FROM NOW() - created_at)::int as days
       FROM patients WHERE id = $1`,
      [id]
    );
    
    // Calculate ranking within practice (by on-time percentage)
    const rankingResult = await pool.query(
      `WITH patient_stats AS (
         SELECT 
           dp.patient_id,
           COUNT(ps.id) as total,
           COUNT(*) FILTER (WHERE ps.is_on_time = true) as on_time,
           CASE WHEN COUNT(ps.id) > 0 
             THEN (COUNT(*) FILTER (WHERE ps.is_on_time = true)::float / COUNT(ps.id) * 100)
             ELSE 0 
           END as pct
         FROM daily_prompts dp
         LEFT JOIN photo_submissions ps ON dp.id = ps.daily_prompt_id
         JOIN patients p ON dp.patient_id = p.id
         WHERE p.practice_id = $1
         GROUP BY dp.patient_id
       ),
       ranked AS (
         SELECT 
           patient_id,
           pct,
           PERCENT_RANK() OVER (ORDER BY pct DESC) * 100 as ranking
         FROM patient_stats
       )
       SELECT COALESCE(ranking, 50)::int as ranking FROM ranked WHERE patient_id = $2`,
      [patient.practice_id, id]
    );
    
    // Week-over-week change calculation
    const wowResult = await pool.query(
      `WITH this_week AS (
         SELECT COUNT(*) FILTER (WHERE ps.is_on_time = true)::float / NULLIF(COUNT(*), 0) * 100 as pct
         FROM photo_submissions ps
         JOIN daily_prompts dp ON ps.daily_prompt_id = dp.id
         WHERE dp.patient_id = $1 AND dp.date >= NOW() - INTERVAL '7 days'
       ),
       last_week AS (
         SELECT COUNT(*) FILTER (WHERE ps.is_on_time = true)::float / NULLIF(COUNT(*), 0) * 100 as pct
         FROM photo_submissions ps
         JOIN daily_prompts dp ON ps.daily_prompt_id = dp.id
         WHERE dp.patient_id = $1 
           AND dp.date >= NOW() - INTERVAL '14 days' 
           AND dp.date < NOW() - INTERVAL '7 days'
       )
       SELECT 
         COALESCE(this_week.pct, 0) - COALESCE(last_week.pct, 0) as change
       FROM this_week, last_week`,
      [id]
    );
    
    const stats = onTimeResult.rows[0];
    const totalSnaps = parseInt(stats.total_snaps) || 0;
    const onTimeSnaps = parseInt(stats.on_time_snaps) || 0;
    const onTimePct = totalSnaps > 0 ? Math.round((onTimeSnaps / totalSnaps) * 100) : 0;
    const days = parseInt(daysEnrolled.rows[0]?.days) || 1;
    const ranking = parseInt(rankingResult.rows[0]?.ranking) || 50;
    const wowChange = Math.round(parseFloat(wowResult.rows[0]?.change) || 0);
    
    res.json({
      patient: {
        id: patient.id,
        name: patient.name,
        practice: patient.practice_name,
      },
      stats: {
        onTimeSnaps: onTimePct,
        onTimeChange: wowChange >= 0 ? `+${wowChange}%` : `${wowChange}%`,
        totalSnaps,
        totalDays: days,
        ranking: 100 - ranking, // Invert so lower is better (top 10% = ranking of 10)
      },
    });
  } catch (error) {
    console.error('Get patient stats error:', error);
    res.status(500).json({ error: 'Failed to fetch patient stats' });
  }
});

// Get today's prompts for patient (mobile app)
router.get('/:id/prompts/today', async (req, res) => {
  try {
    const { id } = req.params;
    const today = new Date().toISOString().split('T')[0];
    
    // Check if prompts exist for today, if not create them
    const existingPrompts = await pool.query(
      'SELECT * FROM daily_prompts WHERE patient_id = $1 AND date = $2 ORDER BY slot',
      [id, today]
    );
    
    let prompts = existingPrompts.rows;
    
    // If no prompts for today, create them with random times
    if (prompts.length === 0) {
      const timeWindows = [
        { slot: 1, startHour: 8, endHour: 10 },   // Morning: 8-10 AM
        { slot: 2, startHour: 12, endHour: 15 },  // Midday: 12-3 PM
        { slot: 3, startHour: 19, endHour: 21 },  // Evening: 7-9 PM
      ];
      
      for (const window of timeWindows) {
        // Generate random time within window
        const randomHour = window.startHour + Math.random() * (window.endHour - window.startHour);
        const hour = Math.floor(randomHour);
        const minute = Math.floor((randomHour - hour) * 60);
        
        const notificationTime = new Date(today);
        notificationTime.setHours(hour, minute, 0, 0);
        
        // Deadline is 2 minutes after notification
        const deadlineTime = new Date(notificationTime.getTime() + 2 * 60 * 1000);
        
        await pool.query(
          `INSERT INTO daily_prompts (patient_id, date, slot, notification_sent_at, submission_deadline_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [id, today, window.slot, notificationTime.toISOString(), deadlineTime.toISOString()]
        );
      }
      
      // Fetch the newly created prompts
      const newPrompts = await pool.query(
        'SELECT * FROM daily_prompts WHERE patient_id = $1 AND date = $2 ORDER BY slot',
        [id, today]
      );
      prompts = newPrompts.rows;
    }
    
    // Get submissions for these prompts
    const promptIds = prompts.map(p => p.id);
    const submissions = await pool.query(
      `SELECT * FROM photo_submissions WHERE daily_prompt_id = ANY($1)`,
      [promptIds]
    );
    
    // Combine prompts with their submissions
    const result = prompts.map(prompt => {
      const submission = submissions.rows.find(s => s.daily_prompt_id === prompt.id);
      return {
        ...prompt,
        submission: submission || null,
      };
    });
    
    res.json(result);
  } catch (error) {
    console.error('Get today prompts error:', error);
    res.status(500).json({ error: 'Failed to fetch today prompts' });
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
