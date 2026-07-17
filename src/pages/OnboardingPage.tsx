import { Link } from 'react-router-dom';
import itouraBrand from '../assets/ABLE/itoura-brand.jpeg';

export default function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#EBE5FC] via-[#F2EDFD] to-[#D8CFEA] p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-10 md:top-20 md:right-20 opacity-10 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#8559D6" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center z-10 max-w-3xl mx-auto w-full">
        <div className="mb-10 w-full flex flex-col items-center">
          <img 
            src={itouraBrand} 
            alt="Itoura - vent. breathe. heal." 
            className="w-full max-w-sm md:max-w-md rounded-3xl shadow-xl border border-white/40 mb-8"
          />
          
          <h1 className="font-serif text-4xl md:text-5xl mb-4 text-itoura-dark font-medium tracking-tight">
            A place to breathe.
          </h1>
          <p className="text-itoura-dark/80 text-lg font-medium mb-2">
            Your company's dedicated mental wellness companion.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm font-medium text-itoura-primary uppercase tracking-widest mb-8 opacity-80">
            <span>Safe Space</span>
            <span>•</span>
            <span>Judgement-Free</span>
            <span>•</span>
            <span>Always Here</span>
          </div>
          
          <p className="text-itoura-text md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            We are partnering with your organization to provide a secure, 100% private space for you to process emotions and manage stress. Vent, breathe, and heal with Itoura.
          </p>
        </div>
        
        <div className="bg-white/60 p-6 md:p-8 rounded-3xl backdrop-blur-md text-itoura-dark text-left w-full max-w-lg mb-10 shadow-sm border border-white/40">
          <p className="font-bold mb-3 flex items-center gap-3 text-lg">
            <span className="bg-itoura-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm shadow-sm">!</span>
            Complete Privacy
          </p>
          <p className="opacity-90 leading-relaxed">This is a peer-like supportive space. Your employer and HR department <b>cannot read your messages</b>. Your data is strictly yours.</p>
        </div>
        
        <Link to="/" className="w-full max-w-md bg-itoura-dark text-white py-4 md:py-5 rounded-full font-bold text-center shadow-[0_8px_30px_rgba(62,36,121,0.3)] hover:shadow-[0_8px_30px_rgba(62,36,121,0.4)] hover:-translate-y-0.5 transition-all z-10 text-lg">
          Get Started
        </Link>
      </div>
    </div>
  );
}
