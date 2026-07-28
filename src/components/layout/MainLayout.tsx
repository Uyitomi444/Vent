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
  ChevronDown
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
      icon: <Home size={18} className="text-purple-300" />,
    },
    {
      path: '/tools',
      label: 'Wellness Tools',
      description: 'Box breathing, grounding, & mindful exercises',
      icon: <Compass size={18} className="text-purple-300" />,
    },
    {
      path: '/progress',
      label: 'Progress & Insights',
      description: '7-day mood trends, top themes, & reflections',
      icon: <LineChart size={18} className="text-purple-300" />,
    },
    {
      path: '/journal',
      label: 'Private Journal',
      description: 'Encrypted local journal entries & reflections',
      icon: <Book size={18} className="text-purple-300" />,
    },
    {
      path: '/mood',
      label: 'Mood Tracker',
      description: 'Quick emotional check-in and daily mood history',
      icon: <Smile size={18} className="text-purple-300" />,
    },
    {
      path: '/faq',
      label: 'Help & FAQ',
      description: 'Everything you need to know about Itoura',
      icon: <HelpCircle size={18} className="text-purple-300" />,
    },
    {
      path: '/settings',
      label: 'Settings',
      description: 'Data privacy controls & app preferences',
      icon: <Settings size={18} className="text-purple-300" />,
    },
  ];

  const currentCategory = navCategories.find((c) => c.path === location.pathname) || navCategories[0];

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative font-sans text-purple-100 selection:bg-purple-500 selection:text-white">
      <DailyMessagePopup />

      {/* Header with Vibrant Violet Palette */}
      <header className="sticky top-0 z-50 w-full px-6 md:px-12 py-4 bg-[#7C3AED] backdrop-blur-xl border-b-2 border-purple-400/60 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
          {/* Logo & Category Dropdown Button */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img 
                src={itouraLogo} 
                alt="Itoura" 
                className="h-10 md:h-11 object-contain transition-transform group-hover:scale-105 filter brightness-110" 
              />
            </Link>

            {/* Roomier & Longer Category Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3.5 px-6 md:px-7 py-2.5 bg-[#1E0542] hover:bg-[#2E0B5E] text-[#C8B6FF] font-black text-sm md:text-base rounded-full border-2 border-[#C8B6FF]/90 shadow-xl transition-all cursor-pointer whitespace-nowrap"
                aria-expanded={isDropdownOpen}
              >
                <span className="font-black text-white">{currentCategory.label}</span>
                <ChevronDown 
                  size={18} 
                  className={`text-[#C8B6FF] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Clean Category Dropdown Modal */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 md:w-88 bg-[#7C3AED] backdrop-blur-2xl border-2 border-[#C8B6FF] rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-purple-300/50 mb-2 flex justify-between items-center">
                    <span className="text-xs font-black tracking-wider text-white uppercase">
                      Select Section
                    </span>
                    <span className="text-[11px] font-black bg-[#1E0542] text-[#C8B6FF] px-3 py-1 rounded-full border border-[#C8B6FF]/50 shadow-sm">
                      7 Categories
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
                    {navCategories.map((item) => {
                      const selected = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`flex flex-col p-3.5 rounded-2xl transition-all ${
                            selected
                              ? 'bg-[#C8B6FF] text-[#1E0542] font-black shadow-lg border border-white'
                              : 'text-white hover:bg-[#6D28D9] font-bold'
                          }`}
                        >
                          <span className="font-black text-sm block truncate">{item.label}</span>
                          <p className={`text-xs mt-0.5 line-clamp-1 ${selected ? 'text-[#1E0542] font-bold' : 'text-purple-100/80'}`}>
                            {item.description}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Aligned Clean and Minimalist Itoura Text */}
          <div className="flex items-center">
            <Link to="/">
              <span className="font-serif text-2xl md:text-3xl font-black tracking-tight text-white hover:text-purple-200 transition-colors drop-shadow-md">
                Itoura
              </span>
            </Link>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-24 md:pb-12">
        <div className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#7C3AED] backdrop-blur-xl border-t-2 border-purple-400/60 px-3 py-2 shadow-2xl flex justify-around items-center">
        {navCategories.slice(0, 5).map((item) => {
          const selected = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
                selected ? 'text-white font-bold scale-105' : 'text-purple-200 hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-full ${selected ? 'bg-[#1E0542] text-[#C8B6FF] shadow-md' : 'bg-transparent'}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-extrabold truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
