# BANDZ - Orthodontic Rubber Band Compliance Tracking

BANDZ is an orthodontic rubber band compliance tracking system that helps orthodontists monitor their patients' rubber band wear through photo submissions.

## Overview

The system works by:
1. Sending patients 3 push notifications per day at randomized times
2. Patients have 5 minutes to take a photo of their mouth showing the rubber bands
3. Orthodontists review photos in a web dashboard and mark whether "rubber band is present"
4. The system tracks on-time submission rates and compliance rates

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + React Router
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (optional for demo mode)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The API will start at `http://localhost:3001`

### Database Setup (Optional)

1. Create a PostgreSQL database named `bandz`
2. Run the schema file:

```bash
psql -d bandz -f backend/src/db/schema.sql
```

3. Set the `DATABASE_URL` environment variable:

```bash
export DATABASE_URL=postgresql://user:password@localhost:5432/bandz
```

## Demo Mode

The frontend includes comprehensive mock data and works without a backend connection. This is perfect for demos and development.

Demo credentials (when backend is connected):
- Email: `dr.bennion@bandz.demo`
- Password: `demo`

## Project Structure

```
/Bandz
├── frontend/                 # React web application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── data/             # Mock data
│   │   └── index.css         # Global styles
├── backend/                  # Express API server
│   ├── src/
│   │   ├── routes/           # API route handlers
│   │   └── db/               # Database connection and schema
└── README.md
```

## Key Features

### Dashboard
- Practice-level statistics
- Weekly participation metrics
- Active/Inactive patient breakdown
- Low participation patient alerts

### Insights
- Time-based analysis (Morning/Noon/Night)
- Performance trends over time
- Top and low performer insights

### Schedule
- Weekly notification schedule view
- Randomize schedule functionality
- Edit individual time slots

### Patients
- Full patient list with search
- Treatment time tracking
- Band type and tags management
- Compliance consistency tracking

### Settings
- Photo window configurations
- On-time threshold settings

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login | Orthodontist login |
| POST | /api/signup | Orthodontist registration |
| GET | /api/dashboard/stats | Practice statistics |
| GET | /api/dashboard/patients | Patient list with metrics |
| GET | /api/patients | All patients |
| GET | /api/patients/:id | Single patient details |
| GET | /api/patients/:id/review | Review data for patient |
| POST | /api/review | Save band present review |
| GET | /api/schedule | Weekly schedule |
| POST | /api/schedule/randomize | Randomize schedule |
| GET | /api/reports/practice | Practice report |
| GET | /api/reports/patient/:id | Patient report |
| GET | /api/settings | App settings |

## License

Proprietary - All rights reserved
