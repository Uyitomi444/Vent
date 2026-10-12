import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { useLanguageStore } from '../../i18n';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useAuthStore } from '../../store/authStore';
import PaywallModal from '../paywall/PaywallModal';
import DailyMessagePopup from '../DailyMessagePopup';
import AmbientSoundMixer from '../audio/AmbientSoundMixer';
import { useSoundStore } from '../../store/soundStore';
import itouraLogo from '../../assets/ABLE/logo.png';
import { ChevronDown, LogOut, Settings, User, Music } from 'lucide-react';

export default function MainLayout() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { t } = useLanguageStore();
  const { status, responseCount, maxFreeResponses } = useSubscriptionStore();
  const { currentUser, logout, isAuthenticated } = useAuthStore();
  const { isPlayingAll, tracks, toggleMixer } = useSoundStore();
  const activeTrackCount = tracks.filter((t) => t.isPlaying).length;

  if (!isAuthenticated || !currentUser?.username || !currentUser?.email) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
    navigate('/', { replace: true });
  };

  const navCategories = [
    {
      path: '/chat',
      label: t('nav.chat'),
      description: 'AI companion chat, voice notes, & reflections',
    },
    {
      path: '/group',
      label: t('nav.group'),
      description: 'Shared real-time group sessions for families & friends',
    },
    {
      path: '/ocean',
      label: 'Bottled Ocean',
      description: 'Anonymous bottled messages & empathy reactions',
    },
    {
      path: '/tools',
      label: t('nav.tools'),
      description: 'Vent Lab, Burn Worry, Bubble Wrap, & box breathing',
    },
    {
      path: '/progress',
      label: t('nav.progress'),
      description: '7-day mood trends, insights & reflection',
    },
    {
      path: '/journal',
      label: t('nav.journal'),
      description: 'PIN encrypted local journal entries & reflections',
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
    <div className="h-screen h-[100dvh] w-full flex flex-col bg-[#C4B4E2] relative font-sans text-[#532E60] selection:bg-[#532E60] selection:text-white overflow-hidden touch-manipulation">
      <DailyMessagePopup />
      <PaywallModal />
      <AmbientSoundMixer />

      {/* Top Header - Permanent Flex Child */}
      <header 
        style={{ paddingTop: 'calc(0.5rem + env(safe-area-inset-top, 0px))' }}
        className="w-full shrink-0 relative z-50 px-2.5 sm:px-6 md:px-12 pb-2 sm:pb-3.5 bg-[#532E60] border-b-2 border-white/20 shadow-xl"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Logo & Category Dropdown */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8 min-w-0">
            <Link to="/" className="flex items-center gap-1.5 group shrink-0" title="Go to Welcome Page">
              <img 
                src={itouraLogo} 
                alt="Itoura" 
                className="h-7 sm:h-10 md:h-11 object-contain transition-transform group-hover:scale-105 filter brightness-110" 
              />
            </Link>

            {/* Category Dropdown Navigation Menu */}
            <div className="relative min-w-0" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 md:px-7 py-1.5 sm:py-2.5 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-xs sm:text-sm md:text-base rounded-full border-2 border-white shadow-lg transition-all cursor-pointer whitespace-nowrap overflow-hidden"
                aria-expanded={isDropdownOpen}
              >
                <span className="font-black text-[#532E60] truncate max-w-[120px] xs:max-w-[170px] sm:max-w-none text-xs sm:text-sm md:text-base">{currentCategory.label}</span>
                <ChevronDown 
                  size={15} 
                  className={`text-[#532E60] shrink-0 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu Modal */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2.5 w-[calc(100vw-1.5rem)] max-w-[340px] sm:max-w-none sm:w-88 md:w-96 bg-[#532E60] border-2 border-white/80 rounded-3xl p-3 sm:p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-3 py-2 border-b border-white/20 mb-2 flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-black tracking-wider text-white uppercase">
                      Select Section
                    </span>
                    <span className="text-xs font-black bg-[#C4B4E2] text-[#532E60] px-3 py-1 rounded-full shadow-sm">
                      9 Sections
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
                          className={`flex flex-col p-3 sm:p-4 rounded-2xl transition-all ${
                            selected 
                              ? 'bg-[#C4B4E2] text-[#532E60] font-black shadow-md border-2 border-white' 
                              : 'hover:bg-[#613B6E] text-white hover:text-white'
                          }`}
                        >
                          <span className="text-sm sm:text-base font-black flex items-center justify-between">
                            {item.label}
                            {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#532E60]" />}
                          </span>
                          <span className={`text-xs sm:text-sm mt-0.5 font-bold ${selected ? 'text-[#532E60]/80' : 'text-[#E8DCF8]'}`}>
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

            {/* Ambient Soundscapes Header Button */}
            <button
              type="button"
              onClick={toggleMixer}
              className={`flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-full border transition-all cursor-pointer shadow-md ${
                isPlayingAll && activeTrackCount > 0
                  ? 'bg-[#613B6E] border-emerald-400 text-white shadow-emerald-500/20'
                  : 'bg-[#613B6E] hover:bg-[#6c427b] border-white/30 text-white'
              }`}
              title="Ambient Soundscape Mixer"
              aria-label="Ambient Soundscape Mixer"
            >
              {isPlayingAll && activeTrackCount > 0 ? (
                <div className="flex items-center gap-0.5 px-0.5">
                  <span className="w-1 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1 h-3.5 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" />
                </div>
              ) : (
                <Music size={16} className="text-[#C4B4E2]" />
              )}
              <span className="hidden md:inline font-black text-xs text-[#E8DCF8]">
                {activeTrackCount > 0 ? `${activeTrackCount} Active` : 'Soundscapes'}
              </span>
            </button>

            {/* User Account Button & Dropdown */}
            {currentUser && (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pr-3 bg-[#613B6E] hover:bg-[#6c427b] text-white rounded-full border border-white/30 transition-all cursor-pointer shadow-md"
                  title={`Signed in as @${currentUser.username}`}
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.displayName}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white/50"
                  />
                  <span className="hidden md:inline font-black text-xs sm:text-sm max-w-[100px] truncate text-white">
                    @{currentUser.username}
                  </span>
                  <ChevronDown size={14} className={`text-[#C4B4E2] transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Account Menu Popover */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#532E60] border-2 border-white/60 rounded-3xl p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-white">
                    <div className="p-3 border-b border-white/20 mb-2 flex items-center gap-3">
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.displayName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-sm text-white truncate">
                          {currentUser.displayName}
                        </div>
                        <div className="font-mono text-xs text-[#E8DCF8] truncate">
                          @{currentUser.username}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#613B6E] text-sm font-bold text-white transition-colors"
                      >
                        <Settings size={16} className="text-[#C4B4E2]" />
                        <span>Profile & Settings</span>
                      </Link>

                      <Link
                        to="/auth?mode=register&force=true"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#613B6E] text-sm font-bold text-white transition-colors"
                      >
                        <User size={16} className="text-[#C4B4E2]" />
                        <span>Switch / Register New</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-sm font-bold transition-colors text-left cursor-pointer"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </header>

      {/* Main Page Body Container - Internal Scroll Only */}
      <main 
        id="main-scroll-container"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
        className="flex-1 w-full max-w-7xl mx-auto p-2 sm:p-6 md:p-8 flex flex-col overflow-y-auto min-h-0"
      >
        <Outlet />
      </main>
    </div>
  );
}
