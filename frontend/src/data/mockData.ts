// Mock data for BANDZ demo

export type BandsType = 'Class I' | 'Class II' | 'Class III' | 'Vertical' | 'Cross' | 'Box' | 'Triangle' | 'Midline';
export type BandsSize = '1/8"' | '3/16"' | '1/4"' | '5/16"' | '3/8"';

export const BANDS_TYPES: BandsType[] = ['Class I', 'Class II', 'Class III', 'Vertical', 'Cross', 'Box', 'Triangle', 'Midline'];
export const BANDS_SIZES: BandsSize[] = ['1/8"', '3/16"', '1/4"', '5/16"', '3/8"'];

export interface Patient {
  id: string;
  name: string;
  avatar: string;
  treatmentDays: number;
  bandsType: BandsType;
  bandsSize: BandsSize;
  tags: string[];
  captureUrl: string | null;
  consistency: number;
  status: 'active' | 'paused';
  startDate: string;
  dob: string;
}

export interface DailyStats {
  week: string;
  dateRange: string;
  morning: number;
  noon: number;
  night: number;
}

export interface ScheduleSlot {
  day: string;
  date: number;
  times: string[];
}

export const practice = {
  id: 'p1',
  name: 'Bennion Orthodontics',
  code: 'BennionOrtho',
};

export const doctor = {
  id: 'd1',
  name: 'Dr. Edwin Bennion',
  practiceCode: 'BennionOrtho',
  status: 'Active',
  patientsActivated: 176,
  avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
};

export const patients: Patient[] = [
  {
    id: '1',
    name: 'Bryce Peterson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    treatmentDays: 246,
    bandsType: 'Triangle',
    bandsSize: '1/4"',
    tags: ['Sports'],
    captureUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop',
    consistency: 93,
    status: 'active',
    startDate: '2025-06-15',
    dob: '2010-03-22',
  },
  {
    id: '2',
    name: 'Emilu Cho',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    treatmentDays: 450,
    bandsType: 'Cross',
    bandsSize: '3/16"',
    tags: [],
    captureUrl: null,
    consistency: 55,
    status: 'active',
    startDate: '2024-11-03',
    dob: '2009-08-14',
  },
  {
    id: '3',
    name: 'Kenzie Schwartz',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    treatmentDays: 98,
    bandsType: 'Class II',
    bandsSize: '1/4"',
    tags: ['Night Owl'],
    captureUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop',
    consistency: 78,
    status: 'active',
    startDate: '2025-11-20',
    dob: '2011-05-30',
  },
  {
    id: '4',
    name: 'Claudia Merrill',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    treatmentDays: 702,
    bandsType: 'Box',
    bandsSize: '3/8"',
    tags: ['Night Owl'],
    captureUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop',
    consistency: 100,
    status: 'active',
    startDate: '2024-03-28',
    dob: '2008-12-05',
  },
  {
    id: '5',
    name: 'Kevin Wu',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    treatmentDays: 345,
    bandsType: 'Triangle',
    bandsSize: '1/4"',
    tags: ['Sports'],
    captureUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop',
    consistency: 93,
    status: 'active',
    startDate: '2025-04-18',
    dob: '2010-07-11',
  },
  {
    id: '6',
    name: 'Calvin Davis',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    treatmentDays: 267,
    bandsType: 'Class III',
    bandsSize: '5/16"',
    tags: [],
    captureUrl: null,
    consistency: 45,
    status: 'active',
    startDate: '2025-06-05',
    dob: '2009-02-28',
  },
  {
    id: '7',
    name: 'Angela Brace',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
    treatmentDays: 123,
    bandsType: 'Class I',
    bandsSize: '1/8"',
    tags: ['Early Riser'],
    captureUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop',
    consistency: 88,
    status: 'paused',
    startDate: '2025-10-26',
    dob: '2011-09-17',
  },
  {
    id: '8',
    name: 'Terrance Gray',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    treatmentDays: 543,
    bandsType: 'Vertical',
    bandsSize: '3/16"',
    tags: [],
    captureUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop',
    consistency: 81,
    status: 'active',
    startDate: '2024-08-29',
    dob: '2010-01-03',
  },
  {
    id: '9',
    name: 'Rachel Grundvig',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
    treatmentDays: 122,
    bandsType: 'Midline',
    bandsSize: '1/4"',
    tags: [],
    captureUrl: null,
    consistency: 31,
    status: 'active',
    startDate: '2025-10-28',
    dob: '2012-04-19',
  },
  {
    id: '10',
    name: 'Marcus Johnson',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face',
    treatmentDays: 89,
    bandsType: 'Box',
    bandsSize: '5/16"',
    tags: ['Sports'],
    captureUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=100&h=100&fit=crop',
    consistency: 95,
    status: 'active',
    startDate: '2025-11-30',
    dob: '2011-11-08',
  },
];

export const lowParticipationPatients = [
  { id: '1', name: 'Alfredo', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', consistency: 28 },
  { id: '2', name: 'Claudia', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', consistency: 35 },
  { id: '3', name: 'Cahaya', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', consistency: 22 },
  { id: '4', name: 'Mariana', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face', consistency: 41 },
  { id: '5', name: 'Marceline', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', consistency: 18 },
  { id: '6', name: 'Teddy', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', consistency: 47 },
  { id: '7', name: 'Yael', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', consistency: 31 },
];

// Weekly stats with actual date ranges
export const weeklyStats: DailyStats[] = [
  { week: 'Week 1', dateRange: 'Feb 3-9', morning: 45, noon: 65, night: 78 },
  { week: 'Week 2', dateRange: 'Feb 10-16', morning: 52, noon: 70, night: 62 },
  { week: 'Week 3', dateRange: 'Feb 17-23', morning: 68, noon: 55, night: 72 },
  { week: 'Week 4', dateRange: 'Feb 24-28', morning: 75, noon: 82, night: 88 },
];

export const insightLineData: DailyStats[] = [
  { week: 'Week 1', dateRange: 'Feb 3-9', morning: 45, noon: 78, night: 62 },
  { week: 'Week 2', dateRange: 'Feb 10-16', morning: 52, noon: 65, night: 75 },
  { week: 'Week 3', dateRange: 'Feb 17-23', morning: 68, noon: 58, night: 70 },
  { week: 'Week 4', dateRange: 'Feb 24-28', morning: 85, noon: 72, night: 92 },
];

export const dashboardStats = {
  weeklyParticipation: 145,
  weeklyParticipationChange: '+18% WoW',
  onTimeCaptures: '72%',
  onTimeCapturesChange: '-5% WoW',
  inactiveParticipants: 31,
  inactiveParticipantsChange: '-18% WoW',
};

export const activityStats = {
  activePercent: 82.4,
  inactivePercent: 17.6,
  activePatients: 82,
  activePatientsChange: 'An 18% increase week over week',
  inactivePatients: 18,
  inactivePatientsChange: 'A 5% decrease week over week',
  revision: 70,
  revisionNote: 'Almost done with the revisions, great job! Keep it up!',
};

// Generate schedule data
export function generateScheduleData(weekStart: Date): ScheduleSlot[] {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const schedule: ScheduleSlot[] = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + i);

    const times = [
      generateRandomTime(8, 10),   // Morning: 8-10 AM
      generateRandomTime(12, 15),  // Midday: 12-3 PM
      generateRandomTime(19, 21),  // Evening: 7-9 PM
    ];

    schedule.push({
      day: days[i],
      date: currentDate.getDate(),
      times,
    });
  }

  return schedule;
}

function generateRandomTime(startHour: number, endHour: number): string {
  const hour = startHour + Math.floor(Math.random() * (endHour - startHour));
  const minute = Math.floor(Math.random() * 60);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

export const photoWindows = {
  morning: { start: '8:00 AM', end: '10:00 AM' },
  midday: { start: '12:00 PM', end: '3:00 PM' },
  evening: { start: '7:00 PM', end: '9:00 PM' },
};

export const onTimeThreshold = 5; // minutes

export const complianceHistory = [
  { label: 'Sep', value: 58 },
  { label: 'Oct', value: 65 },
  { label: 'Nov', value: 72 },
  { label: 'Dec', value: 68 },
  { label: 'Jan', value: 79 },
  { label: 'Feb', value: 85 },
];

export type NotificationType = 'warning' | 'success' | 'info';

export const mockNotifications = [
  { id: 1, type: 'warning' as NotificationType, message: 'Emilu Cho has missed 3 consecutive submissions', time: '5m ago', read: false },
  { id: 2, type: 'warning' as NotificationType, message: 'Calvin Davis compliance dropped below 50%', time: '22m ago', read: false },
  { id: 3, type: 'info' as NotificationType, message: 'Rachel Grundvig submitted morning photo on time', time: '1h ago', read: true },
  { id: 4, type: 'success' as NotificationType, message: '12 patients submitted on time this morning', time: '3h ago', read: true },
  { id: 5, type: 'info' as NotificationType, message: 'Weekly compliance report is ready to view', time: '5h ago', read: true },
];
