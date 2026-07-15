import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Book, Smile, Compass, Settings } from 'lucide-react';

export default function MainLayout() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-vent-surface relative">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 bg-white/40 backdrop-blur-md border-r border-gray-200/50 p-6 z-40">
        <div className="mb-12 text-center mt-4">
          <h1 className="font-serif text-4xl text-vent-dark font-medium">Vent</h1>
        </div>
        <nav className="flex flex-col gap-3 flex-1">
          <NavItem to="/" icon={<Home size={22} strokeWidth={1.5} />} label="Chat" active={isActive('/')} desktop />
          <NavItem to="/journal" icon={<Book size={22} strokeWidth={1.5} />} label="Journal" active={isActive('/journal')} desktop />
          <NavItem to="/mood" icon={<Smile size={22} strokeWidth={1.5} />} label="Mood" active={isActive('/mood')} desktop />
          <NavItem to="/tools" icon={<Compass size={22} strokeWidth={1.5} />} label="Tools" active={isActive('/tools')} desktop />
        </nav>
        <div className="mt-auto">
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
      <nav className="md:hidden fixed bottom-0 w-full bg-vent-surface/90 backdrop-blur-md border-t border-gray-200 flex justify-around p-3 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <NavItem to="/" icon={<Home size={24} strokeWidth={1.5} />} label="Chat" active={isActive('/')} />
        <NavItem to="/journal" icon={<Book size={24} strokeWidth={1.5} />} label="Journal" active={isActive('/journal')} />
        <NavItem to="/mood" icon={<Smile size={24} strokeWidth={1.5} />} label="Mood" active={isActive('/mood')} />
        <NavItem to="/tools" icon={<Compass size={24} strokeWidth={1.5} />} label="Tools" active={isActive('/tools')} />
        <NavItem to="/settings" icon={<Settings size={24} strokeWidth={1.5} />} label="Settings" active={isActive('/settings')} />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label, active, desktop = false }: { to: string, icon: React.ReactNode, label: string, active: boolean, desktop?: boolean }) {
  if (desktop) {
    return (
      <Link to={to} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ${active ? 'bg-vent-light/80 text-vent-dark font-medium shadow-sm' : 'text-gray-500 hover:bg-white/60 hover:text-vent-dark'}`}>
        <div className={`${active ? 'text-vent-dark' : 'text-gray-400'}`}>
          {icon}
        </div>
        <span className="text-lg">{label}</span>
      </Link>
    );
  }
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-vent-dark' : 'text-gray-400 hover:text-vent-accent'}`}>
      <div className={`p-1.5 rounded-full transition-colors ${active ? 'bg-vent-light' : 'bg-transparent'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
