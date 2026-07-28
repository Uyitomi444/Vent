import ChatInterface from '../components/chat/ChatInterface';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto space-y-4">
      
      {/* Editorial Deep Plum Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-[#532E60] rounded-3xl py-5 px-6 md:py-6 md:px-10 border-2 border-white/40 shadow-xl overflow-hidden text-center flex flex-col items-center justify-center"
      >
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#C4B4E2]/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Orbiting Ring Frame Container */}
        <div className="relative z-10 my-1 px-8 py-3 md:px-14 md:py-4 inline-flex flex-col items-center justify-center">
          
          {/* Orbital Ring SVG */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible stroke-[#C4B4E2]/60" 
            viewBox="0 0 440 160" 
            preserveAspectRatio="none"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse 
              cx="220" 
              cy="80" 
              rx="210" 
              ry="72" 
              stroke="currentColor" 
              strokeWidth="1.75" 
              strokeDasharray="6 4"
              transform="rotate(-3 220 80)"
            />
          </svg>

          {/* Compact Main Headline Statement */}
          <h1 className="font-sans text-xl md:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-sm relative z-10 px-3">
            Emotional clarity without <span className="text-[#C4B4E2] italic font-serif font-normal">burnout</span>
          </h1>
        </div>

        {/* Bottom Monospace Editorial Subtitle */}
        <div className="relative z-10 mt-2 space-y-0.5">
          <p className="text-[10px] md:text-[11px] font-mono font-black text-[#C4B4E2]/90 uppercase tracking-[0.2em]">
            CONVERSATIONS WITH YOUR 24/7 EMOTIONAL WELLBEING COMPANION
          </p>
        </div>

      </motion.div>

      {/* Main Chat Interface Canvas */}
      <div className="flex-1 min-h-[560px] relative z-20">
        <ChatInterface />
      </div>
    </div>
  );
}
