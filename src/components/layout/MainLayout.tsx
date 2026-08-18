import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useLanguageStore } from '../../i18n';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import LanguageSelector from '../LanguageSelector';
import PaywallModal from '../paywall/PaywallModal';
import DailyMessagePopup from '../DailyMessagePopup';
import itouraLogo from '../../assets/ABLE/logo.png';
import { ChevronDown } from 'lucide-react';

export default function MainLayout() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { t } = useLanguageStore();
  const { status, responseCount, maxFreeResponses } = useSubscriptionStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navCategories = [
    {
      path: '/chat',
      label: t('nav.chat'),
      description: 'AI companion chat, empathetic venting, & reflection',
    },
    {
      path: '/group',
      label: t('nav.group'),
      description: 'Shared real-time group sessions for families & friends',
    },
    {
      path: '/tools',
      label: t('nav.tools'),
      description: 'Box breathing, grounding, & mindful exercises',
    },
    {
      path: '/progress',
      label: t('nav.progress'),
      description: '7-day mood trends, top themes, & reflections',
    },
    {
      path: '/journal',
      label: t('nav.journal'),
      description: 'Encrypted local journal entries & reflections',
    },
    {
      path: '/mood',
      label: t('nav.mood'),
      description: 'Quick emotional check-in and daily mood history',
    },
    {
      path: '/faq',
      label: t('nav.faq'),
      description: 'Everything you need to know about Itoura',
    },
    {
      path: '/settings',
      label: t('nav.settings'),
      description: 'Data privacy controls & app preferences',
    },
  ];

  const currentCategory = navCategories.find((c) => c.path === location.pathname) || navCategories[0];
  const remainingResponses = Math.max(0, maxFreeResponses - responseCount);

  return (
    <div className="h-screen h-[100dvh] flex flex-col bg-[#C4B4E2] relative font-sans text-[#532E60] selection:bg-[#532E60] selection:text-white overflow-hidden touch-manipulation">
      <DailyMessagePopup />
      <PaywallModal />

      {/* Header with Prominent Category Dropdown */}
      <header className="sticky top-0 z-50 w-full px-3 sm:px-6 md:px-12 py-2.5 sm:py-3.5 bg-[#532E60] backdrop-blur-xl border-b-2 border-white/20 shadow-xl shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Logo & Top Category Dropdown */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8 min-w-0">
            <Link to="/" className="flex items-center gap-1.5 group shrink-0" title="Go to Welcome Page">
              <img 
                src={itouraLogo} 
                alt="Itoura" 
                className="h-8 sm:h-10 md:h-11 object-contain transition-transform group-hover:scale-105 filter brightness-110" 
              />
            </Link>

            {/* Category Dropdown Navigation Menu */}
            <div className="relative min-w-0" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3.5 sm:px-6 md:px-7 py-2 sm:py-2.5 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-xs sm:text-sm md:text-base rounded-full border-2 border-white shadow-lg transition-all cursor-pointer whitespace-nowrap overflow-hidden"
                aria-expanded={isDropdownOpen}
              >
                <span className="font-black text-[#532E60] truncate max-w-[130px] xs:max-w-[170px] sm:max-w-none text-xs sm:text-sm md:text-base">{currentCategory.label}</span>
                <ChevronDown 
                  size={16} 
                  className={`text-[#532E60] shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu Modal */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2.5 w-[calc(100vw-2rem)] max-w-[340px] sm:max-w-none sm:w-88 md:w-96 bg-[#532E60] border-2 border-white/80 rounded-3xl p-3 sm:p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-white/20 mb-2 flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-black tracking-wider text-white uppercase">
                      Select Section
                    </span>
                    <span className="text-xs font-black bg-[#C4B4E2] text-[#532E60] px-3 py-1 rounded-full shadow-sm">
                      8 Sections
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
                    {navCategories.map((item) => {
                      const selected = isActive(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsDropdownOpen(false)}
                          className={`flex flex-col p-3.5 sm:p-4 rounded-2xl transition-all ${
                            selected 
                              ? 'bg-[#C4B4E2] text-[#532E60] font-black shadow-md border-2 border-white' 
                              : 'hover:bg-[#613B6E] text-white hover:text-white'
                          }`}
                        >
                          <span className="text-sm sm:text-base font-black flex items-center justify-between">
                            {item.label}
                            {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#532E60]" />}
                          </span>
                          <span className={`text-xs sm:text-sm mt-1 font-bold ${selected ? 'text-[#532E60]/80' : 'text-[#E8DCF8]'}`}>
                            {item.description}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {status === 'free' && (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#613B6E] text-white text-xs font-black rounded-full border border-white/30 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t('paywall.replies_left', { count: remainingResponses })}
              </span>
            )}
            <LanguageSelector />
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 md:p-8 flex flex-col overflow-y-auto min-h-0">
        <Outlet />
      </main>
    </div>
  );
}
