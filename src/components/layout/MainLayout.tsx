import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import DailyMessagePopup from '../DailyMessagePopup';
import itouraLogo from '../../assets/ABLE/logo.png';

interface NavItemData {
  path: string;
  label: string;
  description: string;
}

export default function MainLayout() {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

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
      path: '/chat',
      label: 'Chat Companion',
      description: 'Your safe space to vent and process feelings 24/7',
    },
    {
      path: '/tools',
      label: 'Wellness Tools',
      description: 'Box breathing, grounding, & mindful exercises',
    },
    {
      path: '/progress',
      label: 'Progress & Insights',
      description: '7-day mood trends, top themes, & reflections',
    },
    {
      path: '/journal',
      label: 'Private Journal',
      description: 'Encrypted local journal entries & reflections',
    },
    {
      path: '/mood',
      label: 'Mood Tracker',
      description: 'Quick emotional check-in and daily mood history',
    },
    {
      path: '/faq',
      label: 'Help & FAQ',
      description: 'Everything you need to know about Itoura',
    },
    {
      path: '/settings',
      label: 'Settings',
      description: 'Data privacy controls & app preferences',
    },
  ];

  const currentCategory = navCategories.find((c) => c.path === location.pathname) || navCategories[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#C4B4E2] relative font-sans text-[#532E60] selection:bg-[#532E60] selection:text-white">
      <DailyMessagePopup />

      {/* Deep Plum Responsive Header */}
      <header className="sticky top-0 z-50 w-full px-3 sm:px-6 md:px-12 py-3 md:py-4 bg-[#532E60] backdrop-blur-xl border-b-2 border-white/20 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
          
          {/* Logo & Category Dropdown Button */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8 min-w-0">
            <Link to="/" className="flex items-center gap-2 group shrink-0" title="Go to Welcome Page">
              <img 
                src={itouraLogo} 
                alt="Itoura" 
                className="h-8 sm:h-10 md:h-11 object-contain transition-transform group-hover:scale-105 filter brightness-110" 
              />
            </Link>

            {/* Pastel Lilac Category Dropdown Button */}
            <div className="relative min-w-0" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 sm:gap-3.5 px-3.5 sm:px-6 md:px-7 py-2 sm:py-2.5 bg-[#C4B4E2] hover:bg-[#D4C8EC] text-[#532E60] font-black text-xs sm:text-sm md:text-base rounded-full border-2 border-white/80 shadow-xl transition-all cursor-pointer whitespace-nowrap overflow-hidden"
                aria-expanded={isDropdownOpen}
              >
                <span className="font-black text-[#532E60] truncate max-w-[130px] sm:max-w-none">{currentCategory.label}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-[#532E60] shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Deep Plum Dropdown Modal */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-[calc(100vw-2rem)] max-w-[340px] sm:max-w-none sm:w-80 md:w-88 bg-[#532E60] backdrop-blur-2xl border-2 border-[#C4B4E2] rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-white/20 mb-2 flex justify-between items-center">
                    <span className="text-xs font-black tracking-wider text-white uppercase">
                      Select Section
                    </span>
                    <span className="text-[11px] font-black bg-[#C4B4E2] text-[#532E60] px-3 py-1 rounded-full shadow-sm">
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
                          className={`flex flex-col p-3 sm:p-3.5 rounded-2xl transition-all ${
                            selected
                              ? 'bg-[#C4B4E2] text-[#532E60] font-black shadow-lg border border-white'
                              : 'text-white hover:bg-[#613B6E] font-bold'
                          }`}
                        >
                          <span className="font-black text-sm block truncate">{item.label}</span>
                          <p className={`text-xs mt-0.5 line-clamp-1 ${selected ? 'text-[#532E60] font-bold' : 'text-[#E8DCF8]/80'}`}>
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
          <div className="flex items-center shrink-0">
            <Link to="/" title="Go to Welcome Page">
              <span className="font-serif text-lg sm:text-2xl md:text-3xl font-black tracking-tight text-white hover:text-[#C4B4E2] transition-colors drop-shadow-md">
                Itoura
              </span>
            </Link>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-24 md:pb-12">
        <div className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6">
          <Outlet />
        </div>
      </main>

      {/* Deep Plum Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#532E60] backdrop-blur-xl border-t-2 border-white/20 px-2 sm:px-3 py-2.5 shadow-2xl flex justify-around items-center">
        {navCategories.slice(0, 5).map((item) => {
          const selected = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                selected 
                  ? 'bg-[#C4B4E2] text-[#532E60] shadow-md border border-white scale-105' 
                  : 'text-[#E8DCF8] hover:text-white'
              }`}
            >
              <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
