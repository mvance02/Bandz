import { fetchAPI } from './config';

// Types
export interface DashboardStats {
  patientsMonitored: number;
  compliancePct: number;
  onTimePct: number;
  unreviewedPhotos: number;
  patientsFlagged: number;
}

export interface WeeklyStats {
  week_start: string;
  date_range: string;
  morning: number;
  noon: number;
  night: number;
}

export interface ActivityStats {
  activePercent: number;
  inactivePercent: number;
  activeCount: number;
  inactiveCount: number;
  total: number;
}

export interface LowParticipationPatient {
  id: number;
  name: string;
  consistency: number;
  avatar: string;
}

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'paused';
  dob: string | null;
  notes: string | null;
  start_date: string;
  created_at: string;
}

export interface PatientWithMetrics extends Patient {
  expected_today: number;
  received_today: number;
  on_time_today: number;
  unreviewed: number;
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => fetchAPI<DashboardStats>('/api/dashboard/stats'),
  getPatients: () => fetchAPI<PatientWithMetrics[]>('/api/dashboard/patients'),
  getWeeklyStats: () => fetchAPI<WeeklyStats[]>('/api/dashboard/weekly-stats'),
  getActivityStats: () => fetchAPI<ActivityStats>('/api/dashboard/activity-stats'),
  getLowParticipation: () => fetchAPI<LowParticipationPatient[]>('/api/dashboard/low-participation'),
};

// Patients API
export const patientsAPI = {
  getAll: () => fetchAPI<Patient[]>('/api/patients'),
  getById: (id: string) => fetchAPI<Patient>(`/api/patients/${id}`),
  create: (data: Partial<Patient>) => 
    fetchAPI<Patient>('/api/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Patient>) =>
    fetchAPI<Patient>(`/api/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Health check
export const healthAPI = {
  check: () => fetchAPI<{ status: string; timestamp: string }>('/api/health'),
};
