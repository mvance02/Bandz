import { MoreHorizontal } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import DonutChart from '../components/DonutChart';
import BarChart from '../components/BarChart';
import { useToast } from '../components/Toast';
import {
  doctor,
  practice,
  dashboardStats,
  activityStats,
  weeklyStats,
  lowParticipationPatients,
} from '../data/mockData';

export default function Dashboard() {
  const { toast } = useToast();

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* Left section */}
      <div className="col-span-8 flex flex-col gap-8">
        {/* Statistic */}
        <div className="card flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-xl font-semibold">Statistic</h2>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>This Month</span>
              <span className="text-text-muted">▼</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <BarChart data={weeklyStats} />
            </div>
            <div className="flex justify-center items-center">
              <DonutChart
                activePercent={activityStats.activePercent}
                inactivePercent={activityStats.inactivePercent}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-3 gap-6">
          <StatsCard
            title="Weekly Participation"
            value={dashboardStats.weeklyParticipation}
            variant="green"
            trending={{ direction: 'up', positive: true, label: dashboardStats.weeklyParticipationChange }}
          />
          <StatsCard
            title="On Time Captures"
            value={dashboardStats.onTimeCaptures}
            variant="green"
            trending={{ direction: 'down', positive: false, label: dashboardStats.onTimeCapturesChange }}
          />
          <StatsCard
            title="Inactive Participants"
            value={dashboardStats.inactiveParticipants}
            variant="red"
            trending={{ direction: 'down', positive: true, label: dashboardStats.inactiveParticipantsChange }}
          />
        </div>

        {/* Low Participation Patients */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">Low Participation Patients</h2>
            <button className="text-text-muted hover:text-text-secondary transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="flex items-start gap-6 overflow-x-auto pb-2">
            {lowParticipationPatients.map((patient) => (
              <div key={patient.id} className="flex flex-col items-center min-w-[72px]">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border">
                    <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-bg-secondary border border-border rounded-full px-1.5 py-0.5">
                    <span className={`text-[0.6rem] font-bold leading-none ${
                      patient.consistency < 30 ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {patient.consistency}%
                    </span>
                  </div>
                </div>
                <span className="text-xs text-text-secondary mt-3 text-center leading-tight">{patient.name}</span>
              </div>
            ))}
          </div>

          <button
            className="btn-primary w-full"
            style={{ marginTop: '2.5rem' }}
            onClick={() => toast('Text reminders sent to 7 patients', 'success')}
          >
            Send Text Reminder?
          </button>
        </div>
      </div>

      {/* Right section */}
      <div className="col-span-4 flex flex-col gap-8">
        {/* Practice Card */}
        <div className="bg-green-primary rounded-2xl p-6 flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
              <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1 flex items-center">
            <h3 className="font-display text-black text-xl font-semibold tracking-tight">
              {practice.name}
            </h3>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="card flex-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">Doctor Info</h2>
            <button className="text-text-muted hover:text-text-secondary transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Doctor Number</span>
              <span className="text-text-primary font-medium">{doctor.number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Name</span>
              <span className="text-text-primary font-medium">{doctor.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Status</span>
              <span className="text-green-primary font-medium">{doctor.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Patients Activated</span>
              <span className="text-text-primary font-medium">{doctor.patientsActivated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Start Date</span>
              <span className="text-text-primary font-medium">{doctor.startDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
