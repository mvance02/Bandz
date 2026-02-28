import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Insights from './pages/Insights'
import Schedule from './pages/Schedule'
import Patients from './pages/Patients'
import PatientProfile from './pages/PatientProfile'
import PatientReview from './pages/PatientReview'
import ReviewQueue from './pages/ReviewQueue'
import Settings from './pages/Settings'

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="insight" element={<Insights />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="patients" element={<Patients />} />
            <Route path="patients/:patientId" element={<PatientProfile />} />
            <Route path="patients/:patientId/review" element={<PatientReview />} />
            <Route path="review" element={<ReviewQueue />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
