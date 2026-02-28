import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Set band_present for one prompt
router.post('/', async (req, res) => {
  try {
    const orthoId = req.headers['x-ortho-id'] || 1;
    const { dailyPromptId, bandPresent, note } = req.body;
    
    if (dailyPromptId === undefined || bandPresent === undefined) {
      return res.status(400).json({ error: 'dailyPromptId and bandPresent are required' });
    }
    
    // Check if submission exists for this prompt
    const submissionResult = await pool.query(
      'SELECT id FROM photo_submissions WHERE daily_prompt_id = $1',
      [dailyPromptId]
    );
    
    if (submissionResult.rows.length === 0) {
      return res.status(404).json({ error: 'No submission found for this prompt' });
    }
    
    const submissionId = submissionResult.rows[0].id;
    
    // Update the submission with review
    const result = await pool.query(
      `UPDATE photo_submissions
       SET band_present = $1, reviewed_by = $2, review_note = $3, reviewed_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [bandPresent, orthoId, note || null, submissionId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: 'Failed to save review' });
  }
});

// Mark all prompts reviewed for patient on a specific date
router.post('/mark-all', async (req, res) => {
  try {
    const orthoId = req.headers['x-ortho-id'] || 1;
    const { patientId, date } = req.body;
    
    if (!patientId || !date) {
      return res.status(400).json({ error: 'patientId and date are required' });
    }
    
    // Get all prompts for this patient on this date
    const promptsResult = await pool.query(
      `SELECT dp.id as prompt_id, ps.id as submission_id
       FROM daily_prompts dp
       LEFT JOIN photo_submissions ps ON dp.id = ps.daily_prompt_id
       WHERE dp.patient_id = $1 AND dp.date = $2`,
      [patientId, date]
    );
    
    // Update all submissions that haven't been reviewed yet
    for (const row of promptsResult.rows) {
      if (row.submission_id) {
        await pool.query(
          `UPDATE photo_submissions
           SET reviewed_by = $1, reviewed_at = NOW()
           WHERE id = $2 AND reviewed_by IS NULL`,
          [orthoId, row.submission_id]
        );
      }
    }
    
    res.json({ success: true, marked: promptsResult.rows.length });
  } catch (error) {
    console.error('Mark all reviewed error:', error);
    res.status(500).json({ error: 'Failed to mark all as reviewed' });
  }
});

export default router;
