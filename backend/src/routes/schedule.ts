import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

// Helper to generate random time within window
function randomTime(startHour: number, endHour: number): string {
  const hour = startHour + Math.floor(Math.random() * (endHour - startHour));
  const minute = Math.floor(Math.random() * 60);
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
}

// Get schedule for a week
router.get('/', async (req, res) => {
  try {
    const practiceId = req.headers['x-practice-id'] || 1;
    const weekStart = req.query.weekStart as string || new Date().toISOString().split('T')[0];
    
    // Get 7 days of schedule starting from weekStart
    const endDate = new Date(weekStart);
    endDate.setDate(endDate.getDate() + 7);
    
    const result = await pool.query(
      `SELECT date, slot, notification_time
       FROM schedule_slots
       WHERE practice_id = $1
       AND date >= $2
       AND date < $3
       ORDER BY date, slot`,
      [practiceId, weekStart, endDate.toISOString().split('T')[0]]
    );
    
    // If no schedule exists for this week, generate it
    if (result.rows.length === 0) {
      const scheduleData = [];
      const currentDate = new Date(weekStart);
      
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Morning: 8-10 AM
        scheduleData.push({
          date: dateStr,
          slot: 1,
          time: randomTime(8, 10),
        });
        
        // Midday: 12-3 PM
        scheduleData.push({
          date: dateStr,
          slot: 2,
          time: randomTime(12, 15),
        });
        
        // Evening: 7-9 PM
        scheduleData.push({
          date: dateStr,
          slot: 3,
          time: randomTime(19, 21),
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Insert generated schedule
      for (const slot of scheduleData) {
        await pool.query(
          `INSERT INTO schedule_slots (practice_id, date, slot, notification_time)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (practice_id, date, slot) DO NOTHING`,
          [practiceId, slot.date, slot.slot, slot.time]
        );
      }
      
      // Fetch the newly created schedule
      const newResult = await pool.query(
        `SELECT date, slot, notification_time
         FROM schedule_slots
         WHERE practice_id = $1
         AND date >= $2
         AND date < $3
         ORDER BY date, slot`,
        [practiceId, weekStart, endDate.toISOString().split('T')[0]]
      );
      
      return res.json(newResult.rows);
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Randomize schedule for a week
router.post('/randomize', async (req, res) => {
  try {
    const practiceId = req.headers['x-practice-id'] || 1;
    const { weekStart } = req.body;
    
    if (!weekStart) {
      return res.status(400).json({ error: 'weekStart is required' });
    }
    
    const endDate = new Date(weekStart);
    endDate.setDate(endDate.getDate() + 7);
    
    // Delete existing schedule for this week
    await pool.query(
      `DELETE FROM schedule_slots
       WHERE practice_id = $1
       AND date >= $2
       AND date < $3`,
      [practiceId, weekStart, endDate.toISOString().split('T')[0]]
    );
    
    // Generate new random schedule
    const currentDate = new Date(weekStart);
    
    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Morning: 8-10 AM
      await pool.query(
        `INSERT INTO schedule_slots (practice_id, date, slot, notification_time)
         VALUES ($1, $2, 1, $3)`,
        [practiceId, dateStr, randomTime(8, 10)]
      );
      
      // Midday: 12-3 PM
      await pool.query(
        `INSERT INTO schedule_slots (practice_id, date, slot, notification_time)
         VALUES ($1, $2, 2, $3)`,
        [practiceId, dateStr, randomTime(12, 15)]
      );
      
      // Evening: 7-9 PM
      await pool.query(
        `INSERT INTO schedule_slots (practice_id, date, slot, notification_time)
         VALUES ($1, $2, 3, $3)`,
        [practiceId, dateStr, randomTime(19, 21)]
      );
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Fetch and return new schedule
    const result = await pool.query(
      `SELECT date, slot, notification_time
       FROM schedule_slots
       WHERE practice_id = $1
       AND date >= $2
       AND date < $3
       ORDER BY date, slot`,
      [practiceId, weekStart, endDate.toISOString().split('T')[0]]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Randomize schedule error:', error);
    res.status(500).json({ error: 'Failed to randomize schedule' });
  }
});

// Update single slot time
router.put('/slot', async (req, res) => {
  try {
    const practiceId = req.headers['x-practice-id'] || 1;
    const { date, slot, time } = req.body;
    
    if (!date || !slot || !time) {
      return res.status(400).json({ error: 'date, slot, and time are required' });
    }
    
    const result = await pool.query(
      `UPDATE schedule_slots
       SET notification_time = $1
       WHERE practice_id = $2 AND date = $3 AND slot = $4
       RETURNING *`,
      [time, practiceId, date, slot]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Schedule slot not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update slot error:', error);
    res.status(500).json({ error: 'Failed to update slot' });
  }
});

export default router;
