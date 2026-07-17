import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, Book, Smile, Compass, Settings, HelpCircle } from 'lucide-react';
import DailyMessagePopup from '../DailyMessagePopup';

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('itoura-has-seen-onboarding');
    if (!hasSeenOnboarding) {
      navigate('/welcome');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-itoura-surface relative">
      <DailyMessagePopup />
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white/40 backdrop-blur-md border-r border-gray-200/50 p-6 z-40">
        <div className="mb-12 text-center mt-4">
          <h1 className="font-serif text-4xl text-itoura-dark font-medium">Itoura</h1>
        </div>
        <nav className="flex flex-col gap-3 flex-1">
          <NavItem to="/" icon={<Home size={22} strokeWidth={1.5} />} label="Chat" active={isActive('/')} desktop />
          <NavItem to="/journal" icon={<Book size={22} strokeWidth={1.5} />} label="Journal" active={isActive('/journal')} desktop />
          <NavItem to="/mood" icon={<Smile size={22} strokeWidth={1.5} />} label="Mood" active={isActive('/mood')} desktop />
          <NavItem to="/tools" icon={<Compass size={22} strokeWidth={1.5} />} label="Tools" active={isActive('/tools')} desktop />
        </nav>
        <div className="mt-auto space-y-3">
          <NavItem to="/faq" icon={<HelpCircle size={22} strokeWidth={1.5} />} label="FAQ" active={isActive('/faq')} desktop />
          <NavItem to="/settings" icon={<Settings size={22} strokeWidth={1.5} />} label="Settings" active={isActive('/settings')} desktop />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 md:pb-0 h-screen">
        <div className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-itoura-surface/90 backdrop-blur-md border-t border-gray-200 flex justify-around p-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] overflow-x-auto">
        <NavItem to="/" icon={<Home size={22} strokeWidth={1.5} />} label="Chat" active={isActive('/')} />
        <NavItem to="/journal" icon={<Book size={22} strokeWidth={1.5} />} label="Journal" active={isActive('/journal')} />
        <NavItem to="/mood" icon={<Smile size={22} strokeWidth={1.5} />} label="Mood" active={isActive('/mood')} />
        <NavItem to="/tools" icon={<Compass size={22} strokeWidth={1.5} />} label="Tools" active={isActive('/tools')} />
        <NavItem to="/faq" icon={<HelpCircle size={22} strokeWidth={1.5} />} label="FAQ" active={isActive('/faq')} />
        <NavItem to="/settings" icon={<Settings size={22} strokeWidth={1.5} />} label="Settings" active={isActive('/settings')} />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label, active, desktop = false }: { to: string, icon: React.ReactNode, label: string, active: boolean, desktop?: boolean }) {
  if (desktop) {
    return (
      <Link to={to} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${active ? 'bg-itoura-light/80 text-itoura-dark font-medium shadow-sm' : 'text-gray-500 hover:bg-white/60 hover:text-itoura-dark'}`}>
        <div className={`${active ? 'text-itoura-dark' : 'text-gray-400'}`}>
          {icon}
        </div>
        <span className="text-lg">{label}</span>
      </Link>
    );
  }
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-itoura-dark' : 'text-gray-400 hover:text-itoura-accent'}`}>
      <div className={`p-1.5 rounded-full transition-colors ${active ? 'bg-itoura-light' : 'bg-transparent'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
