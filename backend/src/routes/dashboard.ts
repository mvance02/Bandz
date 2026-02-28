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

// Get weekly statistics for bar chart
router.get('/weekly-stats', async (req, res) => {
  try {
    const practiceId = req.headers['x-practice-id'] || 1;
    
    const result = await pool.query(
      `WITH weeks AS (
        SELECT 
          date_trunc('week', dp.date)::date as week_start,
          dp.slot,
          COUNT(ps.id) as submissions
        FROM daily_prompts dp
        LEFT JOIN photo_submissions ps ON dp.id = ps.daily_prompt_id
        JOIN patients p ON dp.patient_id = p.id
        WHERE p.practice_id = $1
        AND dp.date >= CURRENT_DATE - INTERVAL '28 days'
        GROUP BY date_trunc('week', dp.date), dp.slot
      )
      SELECT 
        week_start,
        TO_CHAR(week_start, 'Mon DD') || '-' || TO_CHAR(week_start + INTERVAL '6 days', 'DD') as date_range,
        COALESCE(SUM(submissions) FILTER (WHERE slot = 1), 0) as morning,
        COALESCE(SUM(submissions) FILTER (WHERE slot = 2), 0) as noon,
        COALESCE(SUM(submissions) FILTER (WHERE slot = 3), 0) as night
      FROM weeks
      GROUP BY week_start
      ORDER BY week_start`,
      [practiceId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Weekly stats error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly stats' });
  }
});

// Get activity stats for donut chart
router.get('/activity-stats', async (req, res) => {
  try {
    const practiceId = req.headers['x-practice-id'] || 1;
    
    const result = await pool.query(
      `SELECT 
        COUNT(*) FILTER (WHERE status = 'active') as active_count,
        COUNT(*) FILTER (WHERE status = 'paused') as paused_count,
        COUNT(*) as total
      FROM patients
      WHERE practice_id = $1`,
      [practiceId]
    );
    
    const { active_count, paused_count, total } = result.rows[0];
    const activePercent = total > 0 ? Math.round((parseInt(active_count) / parseInt(total)) * 100 * 10) / 10 : 0;
    const inactivePercent = total > 0 ? Math.round((parseInt(paused_count) / parseInt(total)) * 100 * 10) / 10 : 0;
    
    res.json({
      activePercent,
      inactivePercent,
      activeCount: parseInt(active_count),
      inactiveCount: parseInt(paused_count),
      total: parseInt(total)
    });
  } catch (error) {
    console.error('Activity stats error:', error);
    res.status(500).json({ error: 'Failed to fetch activity stats' });
  }
});

// Get low participation patients
router.get('/low-participation', async (req, res) => {
  try {
    const practiceId = req.headers['x-practice-id'] || 1;
    
    const result = await pool.query(
      `WITH patient_stats AS (
        SELECT 
          p.id,
          p.name,
          COUNT(DISTINCT dp.id) as total_prompts,
          COUNT(DISTINCT ps.id) as total_submissions
        FROM patients p
        LEFT JOIN daily_prompts dp ON p.id = dp.patient_id AND dp.date >= CURRENT_DATE - INTERVAL '14 days'
        LEFT JOIN photo_submissions ps ON dp.id = ps.daily_prompt_id
        WHERE p.practice_id = $1 AND p.status = 'active'
        GROUP BY p.id, p.name
      )
      SELECT 
        id,
        name,
        CASE WHEN total_prompts > 0 
          THEN ROUND((total_submissions::numeric / total_prompts) * 100)
          ELSE 0 
        END as consistency
      FROM patient_stats
      WHERE total_prompts > 0
      ORDER BY consistency ASC
      LIMIT 10`,
      [practiceId]
    );
    
    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name.split(' ')[0], // First name only
      consistency: parseInt(row.consistency),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.name}`
    })));
  } catch (error) {
    console.error('Low participation error:', error);
    res.status(500).json({ error: 'Failed to fetch low participation patients' });
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
