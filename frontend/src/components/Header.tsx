import { useState } from 'react';
import { Search, Bell, MessageSquare, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { mockNotifications } from '../data/mockData';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotifIcon = ({ type }: { type: string }) => {
    if (type === 'warning') return <AlertTriangle size={14} className="text-yellow-400" />;
    if (type === 'success') return <CheckCircle size={14} className="text-green-primary" />;
    return <Info size={14} className="text-blue-400" />;
  };

  return (
    <header className="h-[5.5rem] bg-bg-primary flex items-center justify-between px-10 border-b border-border">
      {/* Title */}
      <div className="flex-1">
        <h1 className="font-display text-[2rem] font-semibold text-text-primary tracking-tight">{title}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="w-11 h-11 rounded-xl bg-bg-secondary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all">
          <MessageSquare size={18} />
        </button>

        {/* Bell with notifications dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(v => !v)}
            className="w-11 h-11 rounded-xl bg-bg-secondary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-all relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-green-primary rounded-full flex items-center justify-center text-[10px] font-bold text-black px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 w-[360px] bg-bg-secondary border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Panel header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display font-semibold text-text-primary">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="bg-green-primary text-black text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-text-muted hover:text-green-primary transition-colors font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications list */}
                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                      <Bell size={28} className="mb-3 opacity-40" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-5 py-4 border-b border-border last:border-0 transition-colors ${
                          !n.read ? 'bg-white/[0.02]' : ''
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          <NotifIcon type={n.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${n.read ? 'text-text-secondary' : 'text-text-primary font-medium'}`}>
                            {n.message}
                          </p>
                          <p className="text-xs text-text-muted mt-1">{n.time}</p>
                        </div>
                        {!n.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-green-primary mt-2 flex-shrink-0" />
                        )}
                        <button
                          onClick={() => dismiss(n.id)}
                          className="text-text-muted hover:text-text-secondary transition-colors flex-shrink-0 mt-0.5"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Search */}
        <div className="relative ml-2">
          <input
            type="text"
            placeholder="Search Here"
            className="bg-bg-secondary border border-border rounded-xl pl-5 pr-12 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-green-primary/50 w-56 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center">
            <Search size={14} className="text-text-muted" />
          </div>
        </div>

        {/* Avatar */}
        <div className="w-11 h-11 rounded-xl bg-bg-tertiary overflow-hidden border border-border ml-2">
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face"
            alt="Dr. Edwin Bennion"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
