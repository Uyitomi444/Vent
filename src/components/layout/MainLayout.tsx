import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { 
  Home, 
  Book, 
  Smile, 
  Compass, 
  Settings, 
  HelpCircle, 
  LineChart, 
  ChevronDown, 
  Sparkles, 
  Layers
} from 'lucide-react';
import DailyMessagePopup from '../DailyMessagePopup';
import itouraLogo from '../../assets/ABLE/logo.png';

interface NavItemData {
  path: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('itoura-has-seen-onboarding');
    if (!hasSeenOnboarding) {
      navigate('/welcome');
    }
  }, [navigate]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const navCategories: NavItemData[] = [
    {
      path: '/',
      label: 'Chat Companion',
      description: 'Your safe space to vent and process feelings 24/7',
      icon: <Home size={20} className="text-purple-600" />,
      badge: 'Active'
    },
    {
      path: '/tools',
      label: 'Wellness Tools',
      description: 'Box breathing, grounding, & mindful exercises',
      icon: <Compass size={20} className="text-purple-600" />,
      badge: '4 Tools'
    },
    {
      path: '/progress',
      label: 'Progress & Insights',
      description: '7-day mood trends, top themes, & weekly reflections',
      icon: <LineChart size={20} className="text-purple-600" />,
      badge: 'Updated'
    },
    {
      path: '/journal',
      label: 'Private Journal',
      description: 'Encrypted local journal entries & reflections',
      icon: <Book size={20} className="text-purple-600" />,
    },
    {
      path: '/mood',
      label: 'Mood Tracker',
      description: 'Quick emotional check-in and daily mood history',
      icon: <Smile size={20} className="text-purple-600" />,
    },
    {
      path: '/faq',
      label: 'Help & FAQ',
      description: 'Everything you need to know about Itoura',
      icon: <HelpCircle size={20} className="text-purple-600" />,
    },
    {
      path: '/settings',
      label: 'Settings',
      description: 'Data privacy controls & app preferences',
      icon: <Settings size={20} className="text-purple-600" />,
    },
  ];

  const currentCategory = navCategories.find((c) => c.path === location.pathname) || navCategories[0];

  return (
    <div className="flex flex-col min-h-screen bg-itoura-surface relative font-sans text-purple-950 selection:bg-purple-600 selection:text-white">
      <DailyMessagePopup />

      {/* Top Floating Glassmorphism Header */}
      <header className="sticky top-0 z-50 w-full px-4 md:px-8 py-3 bg-purple-900/80 backdrop-blur-xl border-b border-purple-500/30 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Dropdown Trigger */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img 
                src={itouraLogo} 
                alt="Itoura" 
                className="h-10 md:h-12 object-contain transition-transform group-hover:scale-105" 
              />
            </Link>

            {/* Category Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 px-4 py-2 bg-purple-950/80 hover:bg-purple-800/90 text-white font-bold text-sm md:text-base rounded-2xl border-2 border-purple-400/50 shadow-md hover:shadow-purple-500/20 transition-all cursor-pointer"
                aria-expanded={isDropdownOpen}
              >
                <div className="p-1 bg-purple-600 rounded-lg text-white">
                  <Layers size={16} />
                </div>
                <span className="hidden sm:inline font-bold">Category:</span>
                <span className="text-purple-200 font-extrabold truncate max-w-[120px] sm:max-w-none">
                  {currentCategory.label}
                </span>
                <ChevronDown 
                  size={18} 
                  className={`text-purple-300 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu Modal */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 md:w-96 bg-purple-950/95 backdrop-blur-2xl border-2 border-purple-400/50 rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-purple-800/80 mb-2 flex justify-between items-center">
                    <span className="text-xs font-black tracking-widest text-purple-300 uppercase flex items-center gap-1.5">
                      <Sparkles size={14} className="text-purple-400" />
                      Select Section
                    </span>
                    <span className="text-[11px] font-bold bg-purple-800 text-purple-200 px-2 py-0.5 rounded-full">
                      7 Categories
                    </span>
                  </div>

                  <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
                    {navCategories.map((item) => {
                      const selected = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`flex items-start gap-3.5 p-3 rounded-2xl transition-all ${
                            selected
                              ? 'bg-purple-600 text-white font-bold shadow-lg ring-2 ring-purple-300'
                              : 'text-purple-100 hover:bg-purple-800/60 hover:text-white'
                          }`}
                        >
                          <div className={`p-2.5 rounded-xl shrink-0 ${selected ? 'bg-white text-purple-900' : 'bg-purple-900 text-purple-300'}`}>
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-sm truncate">{item.label}</span>
                              {item.badge && (
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${selected ? 'bg-purple-900 text-purple-200' : 'bg-purple-800 text-purple-300'}`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className={`text-xs mt-0.5 line-clamp-1 ${selected ? 'text-purple-100' : 'text-purple-300/80'}`}>
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Quick Nav Pill Bar */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-purple-950/70 p-1.5 rounded-2xl border border-purple-500/30">
            {navCategories.map((item) => {
              const selected = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
                    selected
                      ? 'bg-purple-600 text-white shadow-md font-extrabold scale-105'
                      : 'text-purple-200 hover:bg-purple-800/50 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

        </div>
      </header>

      {/* Main Full-Width Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-24 md:pb-12">
        <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Bar navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-purple-950/95 backdrop-blur-xl border-t border-purple-500/40 px-2 py-2 shadow-2xl flex justify-around items-center">
        {navCategories.slice(0, 5).map((item) => {
          const selected = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
                selected ? 'text-purple-300 font-bold scale-105' : 'text-purple-400/80 hover:text-purple-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${selected ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent'}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
