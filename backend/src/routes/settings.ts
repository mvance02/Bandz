import { Router } from 'express';

const router = Router();

// Get settings (read-only for MVP)
router.get('/', async (req, res) => {
  res.json({
    photoWindows: {
      morning: { start: '08:00', end: '10:00', label: '8:00 AM – 10:00 AM' },
      midday: { start: '12:00', end: '15:00', label: '12:00 PM – 3:00 PM' },
      evening: { start: '19:00', end: '21:00', label: '7:00 PM – 9:00 PM' },
    },
    onTimeThresholdMinutes: 5,
  });
});

export default router;
