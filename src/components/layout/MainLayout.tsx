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
  Layers
} from 'lucide-react';
import DailyMessagePopup from '../DailyMessagePopup';
import itouraLogo from '../../assets/ABLE/logo.png';

interface NavItemData {
  path: string;
  label: string;
  icon: React.ReactNode;
  description: string;
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const navCategories: NavItemData[] = [
    {
      path: '/',
      label: 'Chat Companion',
      description: 'Your safe space to vent and process feelings 24/7',
      icon: <Home size={18} className="text-purple-600" />,
    },
    {
      path: '/tools',
      label: 'Wellness Tools',
      description: 'Box breathing, grounding, & mindful exercises',
      icon: <Compass size={18} className="text-purple-600" />,
    },
    {
      path: '/progress',
      label: 'Progress & Insights',
      description: '7-day mood trends, top themes, & reflections',
      icon: <LineChart size={18} className="text-purple-600" />,
    },
    {
      path: '/journal',
      label: 'Private Journal',
      description: 'Encrypted local journal entries & reflections',
      icon: <Book size={18} className="text-purple-600" />,
    },
    {
      path: '/mood',
      label: 'Mood Tracker',
      description: 'Quick emotional check-in and daily mood history',
      icon: <Smile size={18} className="text-purple-600" />,
    },
    {
      path: '/faq',
      label: 'Help & FAQ',
      description: 'Everything you need to know about Itoura',
      icon: <HelpCircle size={18} className="text-purple-600" />,
    },
    {
      path: '/settings',
      label: 'Settings',
      description: 'Data privacy controls & app preferences',
      icon: <Settings size={18} className="text-purple-600" />,
    },
  ];

  const currentCategory = navCategories.find((c) => c.path === location.pathname) || navCategories[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#F4ECFF] relative font-sans text-purple-950 selection:bg-purple-600 selection:text-white">
      <DailyMessagePopup />

      {/* Clean, Neat, Minimalist Top Header */}
      <header className="sticky top-0 z-50 w-full px-6 md:px-12 py-4 bg-white/70 backdrop-blur-xl border-b border-purple-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
          {/* Logo & Category Dropdown */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img 
                src={itouraLogo} 
                alt="Itoura" 
                className="h-10 md:h-11 object-contain transition-transform group-hover:scale-105" 
              />
            </Link>

            {/* Clean Category Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-100/80 hover:bg-purple-200 text-purple-950 font-bold text-sm rounded-full border border-purple-300 shadow-sm transition-all cursor-pointer"
                aria-expanded={isDropdownOpen}
              >
                <Layers size={16} className="text-purple-700" />
                <span className="font-extrabold text-purple-900">{currentCategory.label}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-purple-700 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Clean Dropdown Modal */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 md:w-88 bg-white/95 backdrop-blur-2xl border border-purple-200 rounded-3xl p-3 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-purple-100 mb-2 flex justify-between items-center">
                    <span className="text-xs font-bold tracking-wider text-purple-800 uppercase">
                      Select Section
                    </span>
                    <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                      7 Categories
                    </span>
                  </div>

                  <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
                    {navCategories.map((item) => {
                      const selected = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`flex items-start gap-3 p-3 rounded-2xl transition-all ${
                            selected
                              ? 'bg-purple-950 text-white font-bold shadow-md'
                              : 'text-purple-900 hover:bg-purple-100/70'
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${selected ? 'bg-purple-800 text-white' : 'bg-purple-100 text-purple-700'}`}>
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-sm block truncate">{item.label}</span>
                            <p className={`text-xs mt-0.5 line-clamp-1 ${selected ? 'text-purple-200' : 'text-purple-700/80'}`}>
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-purple-100/60 p-1.5 rounded-full border border-purple-200">
            {navCategories.map((item) => {
              const selected = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all ${
                    selected
                      ? 'bg-purple-950 text-white shadow-sm'
                      : 'text-purple-900 hover:text-purple-950 hover:bg-purple-200/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

        </div>
      </header>

      {/* Main Spacious Canvas */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-24 md:pb-12">
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-purple-200 px-3 py-2 shadow-lg flex justify-around items-center">
        {navCategories.slice(0, 5).map((item) => {
          const selected = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
                selected ? 'text-purple-950 font-bold scale-105' : 'text-purple-700/70 hover:text-purple-950'
              }`}
            >
              <div className={`p-1.5 rounded-full ${selected ? 'bg-purple-950 text-white shadow-sm' : 'bg-transparent'}`}>
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
