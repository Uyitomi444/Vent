import { Link } from 'react-router-dom';

export default function OnboardingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-itoura-light via-[#EBE6F3] to-[#D8CFEA] p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-10 md:top-20 md:right-20 opacity-10 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="#4B3B7A" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center z-10 max-w-3xl mx-auto w-full">
        <div className="mb-12">
          {/* Logo placeholder */}
          <div className="w-24 h-24 mx-auto mb-6 bg-itoura-dark/5 rounded-3xl flex items-center justify-center border border-itoura-dark/10 shadow-sm">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4B3B7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              <path d="M12 10v4"></path>
              <path d="M12 18h.01"></path>
            </svg>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl mb-6 text-itoura-dark font-medium tracking-tight">Welcome to Itoura</h1>
          <p className="text-itoura-text md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            Itoura is an AI-driven mental health companion that provides a secure space for users to process emotions and manage stress. Through its AI companion, Itoura, the app tracks mood patterns and provides personalized insights to help users develop emotional intelligence and lasting resilience.
          </p>
        </div>
        
        <div className="bg-white/60 p-6 md:p-8 rounded-3xl backdrop-blur-md text-itoura-dark text-left w-full max-w-lg mb-10 shadow-sm border border-white/40">
          <p className="font-bold mb-3 flex items-center gap-3 text-lg">
            <span className="bg-itoura-dark text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">!</span>
            Please note
          </p>
          <p className="opacity-90 leading-relaxed">This is a peer-like supportive space. It is not a replacement for professional mental health care or therapy.</p>
        </div>
        
        <Link to="/" className="w-full max-w-md bg-itoura-dark text-white py-4 md:py-5 rounded-full font-bold text-center shadow-[0_8px_30px_rgba(75,59,122,0.3)] hover:shadow-[0_8px_30px_rgba(75,59,122,0.4)] hover:-translate-y-0.5 transition-all z-10 text-lg">
          Get Started
        </Link>
      </div>
    </div>
  );
}
