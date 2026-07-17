import { Link } from 'react-router-dom';
import { Shield, Lock, EyeOff, MessageSquare, BrainCircuit, LineChart, Target, ArrowRight } from 'lucide-react';
import itouraBrand from '../assets/ABLE/itoura-brand.jpeg';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-itoura-surface font-sans text-itoura-text overflow-x-hidden">
      
      {/* 1. HERO */}
      <section className="pt-20 pb-16 px-6 md:pt-32 md:pb-24 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h1 className="font-serif text-5xl md:text-7xl text-itoura-dark font-medium tracking-tight leading-tight">
            A quiet place for your loudest thoughts.
          </h1>
          <p className="text-xl md:text-2xl text-itoura-dark/80 max-w-2xl leading-relaxed">
            Meet your dedicated space to vent, process, and untangle the day. Designed for the unique rhythms of the Nigerian workplace, Itoura is here whenever you need to breathe.
          </p>
          <div className="pt-4">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-itoura-dark text-white rounded-full font-medium text-lg shadow-[0_8px_30px_rgba(62,36,121,0.2)] hover:shadow-[0_8px_30px_rgba(62,36,121,0.3)] hover:-translate-y-0.5 transition-all"
            >
              Get Started <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        
        <div className="flex-1 relative w-full max-w-md md:max-w-none">
          <div className="absolute inset-0 bg-itoura-primary/10 blur-3xl rounded-full"></div>
          <img 
            src={itouraBrand} 
            alt="Itoura Interface Preview" 
            className="relative z-10 w-full h-auto rounded-[2rem] shadow-2xl border border-white/50"
          />
        </div>
      </section>

      {/* 2. FEATURE EXPLAINER */}
      <section className="py-24 bg-white/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-4xl text-itoura-dark">How Itoura supports you</h2>
            <p className="text-lg text-gray-600">A structured path from feeling overwhelmed to feeling grounded.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-itoura-beige/50">
              <div className="w-12 h-12 bg-itoura-light rounded-2xl flex items-center justify-center text-itoura-dark mb-6">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold text-itoura-dark mb-3">1. Processing what you're feeling</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Sometimes you just need to get it out. Whether you prefer typing out your frustrations or speaking them aloud, Itoura provides a non-judgmental space to vent. We use active listening to help you organize your thoughts without interrupting your flow.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-itoura-beige/50">
              <div className="w-12 h-12 bg-itoura-light rounded-2xl flex items-center justify-center text-itoura-dark mb-6">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-bold text-itoura-dark mb-3">2. Support that remembers you</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                You shouldn't have to explain your backstory every time you need to talk. Itoura safely saves brief, private summaries of your past sessions on your device. When you return, your companion seamlessly picks up right where you left off.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-itoura-beige/50">
              <div className="w-12 h-12 bg-itoura-light rounded-2xl flex items-center justify-center text-itoura-dark mb-6">
                <LineChart size={24} />
              </div>
              <h3 className="text-xl font-bold text-itoura-dark mb-3">3. Spotting patterns over time</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                It's hard to see the big picture when you're in the middle of a stressful week. By gently analyzing your conversation themes and mood logs, Itoura helps you visualize emotional trends. Recognizing these patterns is the first step toward managing them.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-itoura-beige/50">
              <div className="w-12 h-12 bg-itoura-light rounded-2xl flex items-center justify-center text-itoura-dark mb-6">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-itoura-dark mb-3">4. Turning insights into action</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Venting feels good, but moving forward feels better. Instead of just leaving you with an insight, Itoura pairs every realization with a small, concrete next step. Whether it's a quick breathing exercise or a grounding technique, you leave with a clear action.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIALS — SKIP FOR NOW */}
      {/* Testimonials — add once real user feedback exists 
      <section className="py-24">
        ...
      </section>
      */}

      {/* 4. PRIVACY SECTION */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="font-serif text-4xl text-itoura-dark">Your safe space stays safe</h2>
            <p className="text-lg text-gray-600">We built Itoura with privacy as a foundational priority, ensuring your reflections belong strictly to you.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-itoura-dark text-white p-8 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Lock size={100} />
              </div>
              <Shield size={32} className="text-itoura-light mb-6 relative z-10" />
              <h3 className="text-xl font-bold mb-3 relative z-10">Technical Protection</h3>
              <p className="text-white/80 leading-relaxed text-sm relative z-10">
                Itoura is designed to keep your data securely on the specific device you are using. We do not store your private journal entries or companion memories on a central server.
              </p>
            </div>

            <div className="bg-itoura-dark text-white p-8 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <EyeOff size={100} />
              </div>
              <EyeOff size={32} className="text-itoura-light mb-6 relative z-10" />
              <h3 className="text-xl font-bold mb-3 relative z-10">Private by Default</h3>
              <p className="text-white/80 leading-relaxed text-sm relative z-10">
                Your conversations are completely confidential. Your employer, HR department, and colleagues cannot read your messages or access your emotional data under any circumstances.
              </p>
            </div>

            <div className="bg-itoura-dark text-white p-8 rounded-3xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Shield size={100} />
              </div>
              <Lock size={32} className="text-itoura-light mb-6 relative z-10" />
              <h3 className="text-xl font-bold mb-3 relative z-10">Never Sold or Shared</h3>
              <p className="text-white/80 leading-relaxed text-sm relative z-10">
                Your personal reflections are yours alone. We strictly guarantee that your private information and emotional data will never be sold, rented, or shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CLOSING CTA */}
      <section className="py-24 bg-white/60">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="font-serif text-4xl md:text-5xl text-itoura-dark">
            Ready to untangle the day?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take a breath, open up, and start building a healthier relationship with your emotions today.
          </p>
          <div className="pt-4">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-itoura-dark text-white rounded-full font-medium text-lg shadow-[0_8px_30px_rgba(62,36,121,0.2)] hover:shadow-[0_8px_30px_rgba(62,36,121,0.3)] hover:-translate-y-0.5 transition-all"
            >
              Start Chatting <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-itoura-dark text-white/80 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-2">
            <h3 className="font-serif text-3xl text-white font-medium mb-4">Itoura</h3>
            <p className="text-sm max-w-xs leading-relaxed text-white/60">
              Your dedicated space to vent, process, and untangle the day. A quiet place for your loudest thoughts.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© {new Date().getFullYear()} Itoura. All rights reserved.</p>
          <p>
            Itoura is not a replacement for professional therapy. If you are in crisis, please seek immediate help.
          </p>
        </div>
      </footer>
    </div>
  );
}
