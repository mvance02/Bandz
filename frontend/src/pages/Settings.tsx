import { Clock, Timer, Bell, User, Save } from 'lucide-react';
import { photoWindows, onTimeThreshold, doctor, practice } from '../data/mockData';

export default function Settings() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* Profile Section */}
      <div className="card">
        <div className="flex items-start gap-4" style={{ marginBottom: '1.75rem' }}>
          <div className="w-12 h-12 rounded-xl bg-green-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="text-green-primary" size={22} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">Profile Settings</h2>
            <p className="text-sm text-text-muted mt-1">
              Manage your personal information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-muted mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={doctor.name}
              className="w-full bg-bg-secondary border border-border rounded-md text-text-primary focus:outline-none focus:border-green-primary/50 transition-colors"
              style={{ padding: '0.5rem 1rem' }}
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-2">Email Address</label>
            <input
              type="email"
              defaultValue="dr.bennion@orthodontics.com"
              className="w-full bg-bg-secondary border border-border rounded-md text-text-primary focus:outline-none focus:border-green-primary/50 transition-colors"
              style={{ padding: '0.5rem 1rem' }}
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="(555) 123-4567"
              className="w-full bg-bg-secondary border border-border rounded-md text-text-primary focus:outline-none focus:border-green-primary/50 transition-colors"
              style={{ padding: '0.5rem 1rem' }}
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-2">Practice Name</label>
            <input
              type="text"
              defaultValue={practice.name}
              className="w-full bg-bg-secondary border border-border rounded-md text-text-primary focus:outline-none focus:border-green-primary/50 transition-colors"
              style={{ padding: '0.5rem 1rem' }}
            />
          </div>
          <div>
            <label className="block text-sm text-text-muted mb-2">Practice Code</label>
            <input
              type="text"
              defaultValue={practice.code}
              className="w-full bg-bg-secondary border border-border rounded-md text-text-primary focus:outline-none focus:border-green-primary/50 transition-colors"
              style={{ padding: '0.5rem 1rem' }}
            />
          </div>
        </div>
      </div>

      {/* Photo Windows Section */}
      <div className="card">
        <div className="flex items-start gap-4" style={{ marginBottom: '1.75rem' }}>
          <div className="w-12 h-12 rounded-xl bg-green-primary/20 flex items-center justify-center flex-shrink-0">
            <Clock className="text-green-primary" size={22} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">Photo Windows</h2>
            <p className="text-sm text-text-muted mt-1">
              Time windows when patients receive notifications
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between py-4 border-b border-border">
            <div className="flex items-center gap-4">
              <Bell className="text-green-primary" size={20} />
              <span className="font-medium text-lg">Morning</span>
            </div>
            <div className="text-text-secondary">
              Random between{' '}
              <span className="text-text-primary font-semibold">
                {photoWindows.morning.start}
              </span>{' '}
              –{' '}
              <span className="text-text-primary font-semibold">
                {photoWindows.morning.end}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 border-b border-border">
            <div className="flex items-center gap-4">
              <Bell className="text-green-primary" size={20} />
              <span className="font-medium text-lg">Midday</span>
            </div>
            <div className="text-text-secondary">
              Random between{' '}
              <span className="text-text-primary font-semibold">
                {photoWindows.midday.start}
              </span>{' '}
              –{' '}
              <span className="text-text-primary font-semibold">
                {photoWindows.midday.end}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Bell className="text-green-primary" size={20} />
              <span className="font-medium text-lg">Evening</span>
            </div>
            <div className="text-text-secondary">
              Random between{' '}
              <span className="text-text-primary font-semibold">
                {photoWindows.evening.start}
              </span>{' '}
              –{' '}
              <span className="text-text-primary font-semibold">
                {photoWindows.evening.end}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* On-Time Threshold Section */}
      <div className="card">
        <div className="flex items-start gap-4" style={{ marginBottom: '1.75rem' }}>
          <div className="w-12 h-12 rounded-xl bg-green-primary/20 flex items-center justify-center flex-shrink-0">
            <Timer className="text-green-primary" size={22} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">On-Time Threshold</h2>
            <p className="text-sm text-text-muted mt-1">
              Time allowed for patients to submit photos after notification
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Clock className="text-green-primary" size={20} />
            <span className="font-medium text-lg">Submission Window</span>
          </div>
          <div className="text-text-primary font-bold text-2xl">
            {onTimeThreshold} minutes
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button className="btn-primary w-fit flex items-center justify-center gap-2">
        <Save size={18} />
        Save Changes
      </button>
    </div>
  );
}
