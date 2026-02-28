import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.js';
import patientsRoutes from './routes/patients.js';
import scheduleRoutes from './routes/schedule.js';
import reportsRoutes from './routes/reports.js';
import settingsRoutes from './routes/settings.js';
import authRoutes from './routes/auth.js';
import reviewRoutes from './routes/review.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/patients', patientsRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/review', reviewRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`BANDZ API server running on port ${PORT}`);
});
