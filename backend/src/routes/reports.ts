import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Get practice report with all patients
router.get('/practice', async (req, res) => {
  try {
    const practiceId = req.headers['x-practice-id'] || 1;
    const days = parseInt(req.query.days as string) || 7;
    
    const result = await pool.query(
      `SELECT 
         p.id,
         p.name,
         COUNT(DISTINCT dp.id) as expected,
         COUNT(ps.id) as received,
         COUNT(ps.id) FILTER (WHERE ps.is_on_time = true) as on_time,
         COUNT(ps.id) FILTER (WHERE ps.band_present = true) as band_present,
         COUNT(ps.id) FILTER (WHERE ps.reviewed_by IS NOT NULL) as reviewed
       FROM patients p
       LEFT JOIN daily_prompts dp ON p.id = dp.patient_id 
         AND dp.date >= NOW() - INTERVAL '1 day' * $2
       LEFT JOIN photo_submissions ps ON dp.id = ps.daily_prompt_id
       WHERE p.practice_id = $1 AND p.status = 'active'
       GROUP BY p.id, p.name
       ORDER BY 
         CASE WHEN COUNT(ps.id) > 0 
           THEN COUNT(ps.id) FILTER (WHERE ps.band_present = true)::float / COUNT(ps.id) 
           ELSE 0 
         END DESC`,
      [practiceId, days]
    );
    
    const patients = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      compliancePct: parseInt(row.reviewed) > 0 
        ? Math.round((parseInt(row.band_present) / parseInt(row.reviewed)) * 100)
        : 0,
      onTimePct: parseInt(row.received) > 0
        ? Math.round((parseInt(row.on_time) / parseInt(row.received)) * 100)
        : 0,
      missing: (days * 3) - parseInt(row.received),
    }));
    
    res.json(patients);
  } catch (error) {
    console.error('Practice report error:', error);
    res.status(500).json({ error: 'Failed to fetch practice report' });
  }
});

// Get detailed patient report with daily breakdown
router.get('/patient/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days as string) || 14;
    
    const result = await pool.query(
      `SELECT 
         dp.date,
         dp.slot,
         ps.submitted_at,
         ps.is_on_time,
         ps.band_present,
         ps.reviewed_by
       FROM daily_prompts dp
       LEFT JOIN photo_submissions ps ON dp.id = ps.daily_prompt_id
       WHERE dp.patient_id = $1
       AND dp.date >= NOW() - INTERVAL '1 day' * $2
       ORDER BY dp.date DESC, dp.slot`,
      [id, days]
    );
    
    // Group by date
    const dailyData: Record<string, any> = {};
    
    for (const row of result.rows) {
      const dateStr = row.date.toISOString().split('T')[0];
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = {
          date: dateStr,
          slots: { 1: null, 2: null, 3: null },
        };
      }
      
      dailyData[dateStr].slots[row.slot] = {
        submitted: !!row.submitted_at,
        isOnTime: row.is_on_time,
        bandPresent: row.band_present,
        reviewed: !!row.reviewed_by,
      };
    }
    
    res.json(Object.values(dailyData).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));
  } catch (error) {
    console.error('Patient report error:', error);
    res.status(500).json({ error: 'Failed to fetch patient report' });
  }
});

export default router;
