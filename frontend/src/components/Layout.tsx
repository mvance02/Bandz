import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/insight': 'Insights',
  '/schedule': 'Schedule',
  '/patients': 'Patients',
  '/settings': 'Settings',
};

export default function Layout() {
  const location = useLocation();
  
  // Get title, handling dynamic routes
  let title = pageTitles[location.pathname] || 'Dashboard';
  if (location.pathname.startsWith('/patients/') && location.pathname.includes('/review')) {
    title = 'Review Photos';
  } else if (location.pathname.startsWith('/patients/') && location.pathname !== '/patients') {
    title = 'Patient Profile';
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      {/* 40px black gap between sidebar and content */}
      <div className="w-[40px] bg-black flex-shrink-0" />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 pt-10 px-10 pb-10 overflow-auto bg-bg-primary">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
