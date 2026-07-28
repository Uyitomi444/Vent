import { Link } from 'react-router-dom';
import { Shield, Lock, EyeOff, MessageSquare, BrainCircuit, LineChart, Target, ArrowRight } from 'lucide-react';
import itouraBrand from '../assets/ABLE/itoura-brand.jpeg';
import MascotPose from '../components/MascotPose';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#1E0542] font-sans text-purple-100 overflow-x-hidden">
      
      {/* 1. HERO */}
      <section className="pt-16 pb-16 px-6 md:pt-28 md:pb-24 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 bg-[#C8B6FF] text-[#1E0542] text-xs font-black rounded-full uppercase tracking-widest border border-purple-300 shadow-md">
            Welcome to Itoura
          </div>

          <h1 className="font-serif text-4xl md:text-6xl text-white font-black tracking-tight leading-tight">
            A quiet place for your <span className="text-[#C8B6FF] italic font-normal">loudest thoughts.</span>
          </h1>

          <p className="text-lg md:text-xl text-purple-200 font-bold max-w-2xl leading-relaxed">
            Meet your dedicated space to vent, process, and untangle the day. Designed for the unique rhythms of everyday workplace stress, Itoura is here whenever you need to breathe.
          </p>

          <div className="pt-2">
            <Link 
              to="/chat" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#C8B6FF] text-[#1E0542] rounded-full font-black text-lg shadow-xl hover:bg-white hover:scale-105 transition-all border border-purple-300 cursor-pointer"
            >
              Get Started <ArrowRight size={22} />
            </Link>
          </div>
        </div>
        
        <div className="flex-1 relative w-full max-w-md md:max-w-none">
          <div className="absolute inset-0 bg-[#8A2BE2]/30 blur-3xl rounded-full"></div>
          <img 
            src={itouraBrand} 
            alt="Itoura Interface Preview" 
            className="relative z-10 w-full h-auto rounded-[2.5rem] shadow-2xl border-2 border-[#7C3AED]"
          />
        </div>
      </section>

      {/* 2. FEATURE EXPLAINER */}
      <section className="py-20 bg-[#2E0B5E] border-y-2 border-[#7C3AED]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl text-white font-black">How Itoura supports you</h2>
            <p className="text-base md:text-lg text-purple-200 font-bold">A structured path from feeling overwhelmed to feeling grounded.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#1E0542] p-8 rounded-3xl shadow-xl border border-[#7C3AED]/80 flex flex-col">
              <div className="w-12 h-12 bg-[#4C1D95] rounded-2xl flex items-center justify-center text-[#C8B6FF] mb-6 border border-[#8A2BE2]">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-serif font-black text-white mb-3">1. Processing thoughts</h3>
              <p className="text-purple-200 leading-relaxed font-bold text-sm">
                Whether typing or speaking aloud, Itoura provides a non-judgmental space to vent without interruption.
              </p>
            </div>
            
            <div className="bg-[#1E0542] p-8 rounded-3xl shadow-xl border border-[#7C3AED]/80 flex flex-col">
              <div className="w-12 h-12 bg-[#4C1D95] rounded-2xl flex items-center justify-center text-[#C8B6FF] mb-6 border border-[#8A2BE2]">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-serif font-black text-white mb-3">2. Continuous memory</h3>
              <p className="text-purple-200 leading-relaxed font-bold text-sm">
                Itoura safely saves session summaries on your device so your companion picks up right where you left off.
              </p>
            </div>
            
            <div className="bg-[#1E0542] p-8 rounded-3xl shadow-xl border border-[#7C3AED]/80 flex flex-col">
              <div className="w-12 h-12 bg-[#4C1D95] rounded-2xl flex items-center justify-center text-[#C8B6FF] mb-6 border border-[#8A2BE2]">
                <LineChart size={24} />
              </div>
              <h3 className="text-xl font-serif font-black text-white mb-3">3. Pattern spotting</h3>
              <p className="text-purple-200 leading-relaxed font-bold text-sm">
                Visualize emotional trends over time to spot recurring themes and build deeper self-awareness.
              </p>
            </div>
            
            <div className="bg-[#1E0542] p-8 rounded-3xl shadow-xl border border-[#7C3AED]/80 flex flex-col">
              <div className="w-12 h-12 bg-[#4C1D95] rounded-2xl flex items-center justify-center text-[#C8B6FF] mb-6 border border-[#8A2BE2]">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-serif font-black text-white mb-3">4. Actionable steps</h3>
              <p className="text-purple-200 leading-relaxed font-bold text-sm">
                Pair insights with actionable grounding techniques, breathing exercises, and guided reflections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRIVACY SECTION */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="font-serif text-3xl md:text-4xl text-white font-black">Your safe space stays safe</h2>
            <p className="text-base text-purple-200 font-bold">Privacy is foundational at Itoura. Your reflections belong strictly to you.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#2E0B5E] text-white p-8 rounded-3xl shadow-xl border-2 border-[#7C3AED] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Lock size={100} />
              </div>
              <Shield size={32} className="text-[#C8B6FF] mb-6 relative z-10" />
              <h3 className="text-xl font-serif font-black text-white mb-3 relative z-10">Technical Protection</h3>
              <p className="text-purple-200 leading-relaxed text-sm font-bold relative z-10">
                Designed to keep data strictly on your device. Journal entries and chat memories are never saved on central servers.
              </p>
            </div>

            <div className="bg-[#2E0B5E] text-white p-8 rounded-3xl shadow-xl border-2 border-[#7C3AED] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <EyeOff size={100} />
              </div>
              <EyeOff size={32} className="text-[#C8B6FF] mb-6 relative z-10" />
              <h3 className="text-xl font-serif font-black text-white mb-3 relative z-10">Private by Default</h3>
              <p className="text-purple-200 leading-relaxed text-sm font-bold relative z-10">
                100% confidential. Your employer, HR department, and colleagues cannot read your messages or access your data.
              </p>
            </div>

            <div className="bg-[#2E0B5E] text-white p-8 rounded-3xl shadow-xl border-2 border-[#7C3AED] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Shield size={100} />
              </div>
              <Lock size={32} className="text-[#C8B6FF] mb-6 relative z-10" />
              <h3 className="text-xl font-serif font-black text-white mb-3 relative z-10">Never Sold or Shared</h3>
              <p className="text-purple-200 leading-relaxed text-sm font-bold relative z-10">
                Your personal reflections are yours alone. We strictly guarantee your private information will never be shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLOSING CTA */}
      <section className="py-20 bg-[#2E0B5E] border-t-2 border-[#7C3AED]">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 flex flex-col items-center">
          <MascotPose pose="cheering" className="w-32 h-32 mb-2 drop-shadow-md brightness-110" />
          <h2 className="font-serif text-4xl md:text-5xl text-white font-black">
            Ready to untangle the day?
          </h2>
          <p className="text-lg md:text-xl text-purple-200 font-bold max-w-2xl mx-auto">
            Take a breath, open up, and start building a healthier relationship with your emotions today.
          </p>
          <div className="pt-2">
            <Link 
              to="/chat" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#C8B6FF] text-[#1E0542] rounded-full font-black text-lg shadow-xl hover:bg-white hover:scale-105 transition-all border border-purple-300 cursor-pointer"
            >
              Get Started <ArrowRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-[#18043A] text-purple-300 py-16 px-6 border-t border-[#7C3AED]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-2">
            <h3 className="font-serif text-3xl text-white font-black mb-4">Itoura</h3>
            <p className="text-sm max-w-xs leading-relaxed font-bold text-purple-200">
              Your dedicated space to vent, process, and untangle the day. A quiet place for your loudest thoughts.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-black mb-4 uppercase tracking-wider text-xs">Navigation</h4>
            <ul className="space-y-3 text-sm font-bold">
              <li><Link to="/chat" className="hover:text-white transition-colors">Chat Companion</Link></li>
              <li><Link to="/tools" className="hover:text-white transition-colors">Tools</Link></li>
              <li><Link to="/progress" className="hover:text-white transition-colors">Progress</Link></li>
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
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/settings" className="hover:text-white transition-colors">Settings</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto border-t border-purple-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-purple-300">
          <p>© {new Date().getFullYear()} Itoura. All rights reserved.</p>
          <p>
            Itoura is not a replacement for professional therapy. If you are in crisis, please seek immediate help.
          </p>
        </div>
      </footer>
    </div>
  );
}
