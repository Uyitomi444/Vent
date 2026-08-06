import { useState, useRef, useEffect } from 'react';
import { useLanguageStore, SUPPORTED_LANGUAGES, type LanguageCode } from '../i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLang = SUPPORTED_LANGUAGES[currentLanguage];

  return (
    <div className="relative inline-block text-left z-30" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-xs md:text-sm rounded-full border border-white shadow-md transition-all cursor-pointer"
        title="Select Language"
      >
        <Globe size={15} className="text-[#532E60]" />
        <span>{activeLang.nativeName}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#532E60] border-2 border-white/40 rounded-2xl shadow-2xl overflow-hidden py-1 z-50">
          <div className="px-4 py-2 border-b border-white/20">
            <p className="text-[10px] font-black uppercase text-[#C4B4E2] tracking-wider">Choose Language</p>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {Object.values(SUPPORTED_LANGUAGES).map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as LanguageCode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs md:text-sm font-black transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#C4B4E2] text-[#532E60]' : 'text-white hover:bg-[#613B6E]'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] opacity-75 font-normal">{lang.englishName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {lang.status === 'DRAFT' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/30 text-yellow-200 border border-yellow-400/40">
                        DRAFT
                      </span>
                    )}
                    {isSelected && <Check size={16} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
