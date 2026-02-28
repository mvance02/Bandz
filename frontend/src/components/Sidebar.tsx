import { NavLink } from 'react-router-dom';
import { Home, BarChart3, Calendar, Users, ClipboardCheck, Settings, LogOut } from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/insight', label: 'Insight', icon: BarChart3 },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/review', label: 'Review', icon: ClipboardCheck },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-[180px] min-h-screen bg-bg-secondary flex flex-col">
      {/* Logo - pushed down from top */}
      <div style={{ paddingTop: '20px', paddingBottom: '28px', paddingLeft: '33px' }}>
        <img
          src="/BANDZLOGO.jpg"
          alt="BANDZ"
          className="h-12 w-auto object-contain mix-blend-screen"
        />
      </div>

      {/* Navigation - with gap from logo */}
      <nav className="flex-1" style={{ paddingLeft: '12px', paddingRight: '25px' }}>
        <ul className="flex flex-col gap-5">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 pl-16 pr-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-green-primary text-black font-medium'
                      : 'text-white/85 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} strokeWidth={1.5} />
                <span className="text-[0.9375rem]">{item.label}</span>
              </NavLink>
            </li>
          ))}
          {/* Logout - same styling and gap-5 as other nav items */}
          <li>
            <button
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-white/85 hover:bg-white/5 hover:text-white w-full"
            >
              <LogOut size={20} strokeWidth={1.5} />
              <span className="text-[0.9375rem]">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
