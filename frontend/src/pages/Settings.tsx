import { Clock, Timer, Bell, Info } from 'lucide-react';
import { photoWindows, onTimeThreshold } from '../data/mockData';

export default function Settings() {
  return (
    <div className="max-w-4xl space-y-8">
      {/* Photo Windows Section */}
      <div className="card">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-green-primary/20 flex items-center justify-center">
            <Clock className="text-green-primary" size={22} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">Photo Windows</h2>
            <p className="text-sm text-text-muted mt-1">
              Time windows when patients receive notifications
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Morning */}
          <div className="flex items-center justify-between p-5 bg-bg-tertiary rounded-xl border border-border">
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

          {/* Midday */}
          <div className="flex items-center justify-between p-5 bg-bg-tertiary rounded-xl border border-border">
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

          {/* Evening */}
          <div className="flex items-center justify-between p-5 bg-bg-tertiary rounded-xl border border-border">
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
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-green-primary/20 flex items-center justify-center">
            <Timer className="text-green-primary" size={22} />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">On-Time Threshold</h2>
            <p className="text-sm text-text-muted mt-1">
              Time allowed for patients to submit photos after notification
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-5 bg-bg-tertiary rounded-xl border border-border">
          <div className="flex items-center gap-4">
            <Clock className="text-green-primary" size={20} />
            <span className="font-medium text-lg">Submission Window</span>
          </div>
          <div className="text-text-primary font-bold text-2xl">
            {onTimeThreshold} minutes
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-4 p-5 bg-bg-secondary rounded-xl border border-border">
        <Info className="text-text-muted mt-0.5 flex-shrink-0" size={20} />
        <p className="text-sm text-text-muted leading-relaxed">
          Settings are currently read-only. Contact support to modify photo windows or
          on-time thresholds for your practice.
        </p>
      </div>
    </div>
  );
}
