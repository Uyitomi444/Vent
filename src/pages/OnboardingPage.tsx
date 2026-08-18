import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import itouraBrand from '../assets/ABLE/itoura-brand.jpeg';
import MascotPose from '../components/MascotPose';
import { useLanguageStore } from '../i18n';

export default function OnboardingPage() {
  const { t } = useLanguageStore();

  return (
    <div className="min-h-screen bg-[#C4B4E2] font-sans text-[#532E60] overflow-x-hidden">
      
      {/* 1. HERO */}
      <section className="pt-16 pb-16 px-6 md:pt-28 md:pb-24 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 bg-[#532E60] text-white text-xs font-black rounded-full uppercase tracking-widest shadow-md">
            {t('onboarding.badge')}
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-[#532E60] font-black tracking-tight leading-tight">
            {t('onboarding.hero_title')}{' '}
            <span className="text-white italic font-normal">{t('onboarding.hero_title_italic')}</span>
          </h1>

          <p className="text-lg md:text-xl text-[#532E60]/90 font-bold max-w-2xl leading-relaxed">
            {t('onboarding.hero_desc')}
          </p>

          <div className="pt-2">
            <Link 
              to="/chat" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#532E60] text-white rounded-full font-black text-lg shadow-xl hover:bg-[#3D2048] hover:scale-105 transition-all border border-[#532E60] cursor-pointer"
            >
              {t('onboarding.get_started')} <ArrowRight size={22} />
            </Link>
          </div>
        </div>
        
        <div className="flex-1 relative w-full max-w-md md:max-w-none">
          <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full"></div>
          <img 
            src={itouraBrand} 
            alt="Itoura Interface Preview" 
            className="relative z-10 w-full h-auto rounded-[2.5rem] shadow-2xl border-4 border-white"
          />
        </div>
      </section>

      {/* 2. FEATURE EXPLAINER */}
      <section className="py-20 bg-[#532E60] text-white border-y-2 border-white/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl text-white font-black">{t('onboarding.supports_title')}</h2>
            <p className="text-base md:text-lg text-[#E8DCF8] font-bold">{t('onboarding.supports_desc')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#613B6E] p-8 rounded-3xl shadow-xl border border-white/10 flex flex-col">
              <span className="text-xs font-black text-[#C4B4E2] uppercase tracking-widest mb-3">STEP 01</span>
              <h3 className="text-xl font-serif font-black text-white mb-3">{t('onboarding.step1_title')}</h3>
              <p className="text-[#E8DCF8] leading-relaxed font-bold text-sm">
                {t('onboarding.step1_desc')}
              </p>
            </div>
            
            <div className="bg-[#613B6E] p-8 rounded-3xl shadow-xl border border-white/10 flex flex-col">
              <span className="text-xs font-black text-[#C4B4E2] uppercase tracking-widest mb-3">STEP 02</span>
              <h3 className="text-xl font-serif font-black text-white mb-3">{t('onboarding.step2_title')}</h3>
              <p className="text-[#E8DCF8] leading-relaxed font-bold text-sm">
                {t('onboarding.step2_desc')}
              </p>
            </div>
            
            <div className="bg-[#613B6E] p-8 rounded-3xl shadow-xl border border-white/10 flex flex-col">
              <span className="text-xs font-black text-[#C4B4E2] uppercase tracking-widest mb-3">STEP 03</span>
              <h3 className="text-xl font-serif font-black text-white mb-3">{t('onboarding.step3_title')}</h3>
              <p className="text-[#E8DCF8] leading-relaxed font-bold text-sm">
                {t('onboarding.step3_desc')}
              </p>
            </div>
            
            <div className="bg-[#613B6E] p-8 rounded-3xl shadow-xl border border-white/10 flex flex-col">
              <span className="text-xs font-black text-[#C4B4E2] uppercase tracking-widest mb-3">STEP 04</span>
              <h3 className="text-xl font-serif font-black text-white mb-3">{t('onboarding.step4_title')}</h3>
              <p className="text-[#E8DCF8] leading-relaxed font-bold text-sm">
                {t('onboarding.step4_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Demonstration Section */}
      <section className="relative -mt-12 mb-12 z-20 px-6 max-w-4xl mx-auto">
        <div className="bg-[#532E60] border-4 border-white rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <video 
            className="w-full h-auto object-cover block"
            autoPlay 
            loop 
            muted 
            playsInline
            controls
          >
            <source src="/Mascot_walks_into_frame_waves_202608181447.mov" type="video/quicktime" />
            <source src="/Mascot_walks_into_frame_waves_202608181447.mov" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* 3. PRIVACY SECTION */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl text-[#532E60] font-black">{t('onboarding.privacy_title')}</h2>
            <p className="text-base text-[#532E60]/90 font-bold">{t('onboarding.privacy_desc')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white text-[#532E60] p-8 rounded-3xl shadow-xl border-2 border-white relative overflow-hidden">
              <h3 className="text-xl font-serif font-black text-[#532E60] mb-3">{t('onboarding.p1_title')}</h3>
              <p className="text-[#532E60]/80 leading-relaxed text-sm font-bold">
                {t('onboarding.p1_desc')}
              </p>
            </div>

            <div className="bg-white text-[#532E60] p-8 rounded-3xl shadow-xl border-2 border-white relative overflow-hidden">
              <h3 className="text-xl font-serif font-black text-[#532E60] mb-3">{t('onboarding.p2_title')}</h3>
              <p className="text-[#532E60]/80 leading-relaxed text-sm font-bold">
                {t('onboarding.p2_desc')}
              </p>
            </div>

            <div className="bg-white text-[#532E60] p-8 rounded-3xl shadow-xl border-2 border-white relative overflow-hidden">
              <h3 className="text-xl font-serif font-black text-[#532E60] mb-3">{t('onboarding.p3_title')}</h3>
              <p className="text-[#532E60]/80 leading-relaxed text-sm font-bold">
                {t('onboarding.p3_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLOSING CTA */}
      <section className="py-20 bg-[#532E60] text-white border-t-2 border-white/20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 flex flex-col items-center">
          <MascotPose pose="cheering" className="w-32 h-32 mb-2 drop-shadow-md brightness-110" />
          <h2 className="font-serif text-4xl md:text-5xl text-white font-black">
            {t('onboarding.ready_title')}
          </h2>
          <p className="text-lg md:text-xl text-[#E8DCF8] font-bold max-w-2xl mx-auto">
            {t('onboarding.ready_desc')}
          </p>
          <div className="pt-2">
            <Link 
              to="/chat" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#532E60] rounded-full font-black text-lg shadow-xl hover:bg-[#E8DCF8] hover:scale-105 transition-all border border-white cursor-pointer"
            >
              {t('onboarding.get_started')} <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-[#3A1F45] text-[#E8DCF8] py-16 px-6 border-t border-[#532E60]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-2">
            <h3 className="font-serif text-3xl text-white font-black mb-4">Itoura</h3>
            <p className="text-sm max-w-xs leading-relaxed font-bold text-[#E8DCF8]">
              Your dedicated space to vent, process, and untangle the day. A quiet place for your loudest thoughts.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-black mb-4 uppercase tracking-wider text-xs">Navigation</h4>
            <ul className="space-y-3 text-sm font-bold">
              <li><Link to="/chat" className="hover:text-white transition-colors">{t('nav.chat')}</Link></li>
              <li><Link to="/tools" className="hover:text-white transition-colors">{t('nav.tools')}</Link></li>
              <li><Link to="/progress" className="hover:text-white transition-colors">{t('nav.progress')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-black mb-4 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-3 text-sm font-bold">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-black mb-4 uppercase tracking-wider text-xs">Explore</h4>
            <ul className="space-y-3 text-sm font-bold">
              <li><Link to="/faq" className="hover:text-white transition-colors">{t('nav.faq')}</Link></li>
              <li><Link to="/settings" className="hover:text-white transition-colors">{t('nav.settings')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto border-t border-[#532E60] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-[#E8DCF8]">
          <p>© {new Date().getFullYear()} Itoura. All rights reserved.</p>
          <p>
            Itoura is not a replacement for professional therapy. If you are in crisis, please seek immediate help.
          </p>
        </div>
      </footer>
    </div>
  );
}
