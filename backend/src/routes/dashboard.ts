import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get dashboard stats for practice
router.get('/stats', async (req, res) => {
  try {
    const practiceId = req.headers['x-practice-id'] || 1;
    
    // Get total patients
    const patientsResult = await pool.query(
      'SELECT COUNT(*) as total FROM patients WHERE practice_id = $1',
      [practiceId]
    );
    
    const totalPatients = parseInt(patientsResult.rows[0].total);
    
    // Get submissions in last 7 days
    const submissionsResult = await pool.query(
      `SELECT 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE is_on_time = true) as on_time,
         COUNT(*) FILTER (WHERE band_present = true) as band_present,
         COUNT(*) FILTER (WHERE reviewed_by IS NOT NULL) as reviewed
       FROM photo_submissions ps
       JOIN daily_prompts dp ON ps.daily_prompt_id = dp.id
       JOIN patients p ON dp.patient_id = p.id
       WHERE p.practice_id = $1
       AND ps.submitted_at >= NOW() - INTERVAL '7 days'`,
      [practiceId]
    );
    
    const stats = submissionsResult.rows[0];
    const totalSubmissions = parseInt(stats.total) || 0;
    const onTimeSubmissions = parseInt(stats.on_time) || 0;
    const bandPresent = parseInt(stats.band_present) || 0;
    const reviewed = parseInt(stats.reviewed) || 0;
    
    res.json({
      patientsMonitored: totalPatients,
      compliancePct: reviewed > 0 ? Math.round((bandPresent / reviewed) * 100) : 0,
      onTimePct: totalSubmissions > 0 ? Math.round((onTimeSubmissions / totalSubmissions) * 100) : 0,
      unreviewedPhotos: totalSubmissions - reviewed,
      patientsFlagged: 0, // Would calculate based on criteria
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get patients with today's metrics
router.get('/patients', async (req, res) => {
  try {
    const practiceId = req.headers['x-practice-id'] || 1;
    const today = new Date().toISOString().split('T')[0];
    
    const result = await pool.query(
      `SELECT 
         p.id,
         p.name,
         p.status,
         COUNT(DISTINCT dp.id) FILTER (WHERE dp.date = $2) as expected_today,
         COUNT(DISTINCT ps.id) FILTER (WHERE dp.date = $2) as received_today,
         COUNT(ps.id) FILTER (WHERE dp.date = $2 AND ps.is_on_time = true) as on_time_today,
         COUNT(ps.id) FILTER (WHERE ps.reviewed_by IS NULL) as unreviewed
       FROM patients p
       LEFT JOIN daily_prompts dp ON p.id = dp.patient_id
       LEFT JOIN photo_submissions ps ON dp.id = ps.daily_prompt_id
       WHERE p.practice_id = $1 AND p.status = 'active'
       GROUP BY p.id, p.name, p.status
       ORDER BY p.name`,
      [practiceId, today]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Dashboard patients error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

export default router;
