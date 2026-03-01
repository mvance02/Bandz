import { fetchAPI } from './config';

// Types
export interface PatientProfile {
  id: number;
  name: string;
  practice: string;
}

export interface PatientStats {
  onTimeSnaps: number;
  onTimeChange: string;
  totalSnaps: number;
  totalDays: number;
  ranking: number;
}

export interface PatientStatsResponse {
  patient: PatientProfile;
  stats: PatientStats;
}

export interface DailyPrompt {
  id: number;
  patient_id: number;
  date: string;
  slot: 1 | 2 | 3;
  notification_sent_at: string;
  submission_deadline_at: string;
  submission: PhotoSubmission | null;
}

export interface PhotoSubmission {
  id: number;
  daily_prompt_id: number;
  image_url: string;
  submitted_at: string;
  is_on_time: boolean;
  band_present: boolean | null;
  reviewed_by: number | null;
}

// Patient API (for mobile app)
export const patientAPI = {
  // Get patient profile and stats
  getStats: (patientId: string | number) => 
    fetchAPI<PatientStatsResponse>(`/api/patients/${patientId}/stats`),
  
  // Get today's prompts with submission status
  getTodaysPrompts: (patientId: string | number) => 
    fetchAPI<DailyPrompt[]>(`/api/patients/${patientId}/prompts/today`),
  
  // Submit a photo
  submitPhoto: (promptId: number, imageUrl: string) => 
    fetchAPI<PhotoSubmission>('/api/patients/photo', {
      method: 'POST',
      body: JSON.stringify({ promptId, imageUrl }),
    }),
};

// Health check
export const healthAPI = {
  check: () => fetchAPI<{ status: string; timestamp: string }>('/api/health'),
};
