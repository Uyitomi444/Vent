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

      {/* Header with Grainy Violet Palette */}
      <header className="sticky top-0 z-50 w-full px-6 md:px-12 py-4 bg-[#23074D]/90 backdrop-blur-xl border-b border-[#7C3AED]/60 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          
          {/* Logo & Category Dropdown Button (Using Second Shade #C8B6FF) */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img 
                src={itouraLogo} 
                alt="Itoura" 
                className="h-10 md:h-11 object-contain transition-transform group-hover:scale-105" 
              />
            </Link>

            {/* Inverted Category Dropdown Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4.5 py-2 bg-[#C8B6FF] hover:bg-white text-[#1E0542] font-black text-sm rounded-full border border-purple-300 shadow-md transition-all cursor-pointer"
                aria-expanded={isDropdownOpen}
              >
                <Layers size={16} className="text-[#2E0B5E]" />
                <span className="font-black text-[#1E0542]">{currentCategory.label}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-[#2E0B5E] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Inverted Dropdown Modal */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 md:w-88 bg-[#2E0B5E]/95 backdrop-blur-2xl border border-[#8A2BE2]/70 rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-purple-800/60 mb-2 flex justify-between items-center">
                    <span className="text-xs font-black tracking-wider text-purple-200 uppercase">
                      Select Section
                    </span>
                    <span className="text-[11px] font-extrabold bg-[#4C1D95] text-purple-100 px-2.5 py-0.5 rounded-full border border-[#8A2BE2]">
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
                              ? 'bg-[#C8B6FF] text-[#1E0542] font-black shadow-md'
                              : 'text-purple-100 hover:bg-[#4C1D95] hover:text-white'
                          }`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${selected ? 'bg-[#1E0542] text-purple-100' : 'bg-[#4C1D95] text-purple-300'}`}>
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-black text-sm block truncate">{item.label}</span>
                            <p className={`text-xs mt-0.5 line-clamp-1 ${selected ? 'text-[#2E0B5E] font-bold' : 'text-purple-300/70'}`}>
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

          {/* Right Aligned Clean and Minimalist Itoura Text */}
          <div className="flex items-center">
            <Link to="/">
              <span className="font-serif text-2xl md:text-3xl font-black tracking-tight text-[#C8B6FF] hover:text-white transition-colors drop-shadow-sm">
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#23074D]/95 backdrop-blur-xl border-t border-[#7C3AED]/60 px-3 py-2 shadow-2xl flex justify-around items-center">
        {navCategories.slice(0, 5).map((item) => {
          const selected = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-xl transition-all ${
                selected ? 'text-purple-100 font-bold scale-105' : 'text-purple-400 hover:text-purple-200'
              }`}
            >
              <div className={`p-1.5 rounded-full ${selected ? 'bg-[#C8B6FF] text-[#1E0542] shadow-md' : 'bg-transparent'}`}>
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
