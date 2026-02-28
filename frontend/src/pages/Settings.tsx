import { Clock, Timer, Bell, Info, User, Shield, Palette, Mail, Smartphone, Globe, Save } from 'lucide-react';
import { photoWindows, onTimeThreshold, doctor, practice } from '../data/mockData';

export default function Settings() {
  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      {/* Left Column */}
      <div className="col-span-8 flex flex-col gap-8">
        {/* Profile Section */}
        <div className="card">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-green-primary/20 flex items-center justify-center">
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
                className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-green-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-2">Email Address</label>
              <input
                type="email"
                defaultValue="dr.bennion@orthodontics.com"
                className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-green-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue="(555) 123-4567"
                className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-green-primary/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-2">Practice Name</label>
              <input
                type="text"
                defaultValue={practice.name}
                className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-green-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>

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
      </div>

      {/* Right Column */}
      <div className="col-span-4 flex flex-col gap-8">
        {/* Notification Preferences */}
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-primary/20 flex items-center justify-center">
              <Mail className="text-green-primary" size={22} />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Notifications</h2>
              <p className="text-sm text-text-muted mt-1">Manage alerts</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Mail className="text-text-muted" size={18} />
                <span className="text-sm font-medium">Email Alerts</span>
              </div>
              <div className="w-12 h-6 bg-green-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Smartphone className="text-text-muted" size={18} />
                <span className="text-sm font-medium">Push Notifications</span>
              </div>
              <div className="w-12 h-6 bg-green-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Bell className="text-text-muted" size={18} />
                <span className="text-sm font-medium">Weekly Reports</span>
              </div>
              <div className="w-12 h-6 bg-green-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-primary/20 flex items-center justify-center">
              <Shield className="text-green-primary" size={22} />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Security</h2>
              <p className="text-sm text-text-muted mt-1">Account protection</p>
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between py-3 border-b border-border hover:text-green-primary transition-colors">
              <span className="text-sm font-medium">Change Password</span>
              <span className="text-text-muted">→</span>
            </button>

            <button className="w-full flex items-center justify-between py-3 border-b border-border hover:text-green-primary transition-colors">
              <span className="text-sm font-medium">Two-Factor Authentication</span>
              <span className="text-xs text-green-primary font-medium">Enabled</span>
            </button>

            <button className="w-full flex items-center justify-between py-3 hover:text-green-primary transition-colors">
              <span className="text-sm font-medium">Active Sessions</span>
              <span className="text-text-muted text-sm">3 devices</span>
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="card flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-primary/20 flex items-center justify-center">
              <Palette className="text-green-primary" size={22} />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Preferences</h2>
              <p className="text-sm text-text-muted mt-1">Customize your experience</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Palette className="text-text-muted" size={18} />
                <span className="text-sm font-medium">Theme</span>
              </div>
              <span className="text-sm text-text-secondary">Dark</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Globe className="text-text-muted" size={18} />
                <span className="text-sm font-medium">Language</span>
              </div>
              <span className="text-sm text-text-secondary">English</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Clock className="text-text-muted" size={18} />
                <span className="text-sm font-medium">Timezone</span>
              </div>
              <span className="text-sm text-text-secondary">MST</span>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-4 py-4">
          <Info className="text-text-muted mt-0.5 flex-shrink-0" size={18} />
          <p className="text-xs text-text-muted leading-relaxed">
            Some settings are managed by your organization. Contact support to request changes.
          </p>
        </div>

        {/* Save Button */}
        <button className="btn-primary w-full flex items-center justify-center gap-2">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
