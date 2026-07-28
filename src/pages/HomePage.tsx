import ChatInterface from '../components/chat/ChatInterface';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto space-y-8">
      
      {/* Editorial Grainy Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-grain-texture rounded-[2.5rem] p-8 md:p-14 border border-[#6D28D9]/60 shadow-2xl overflow-hidden text-center flex flex-col items-center justify-center min-h-[340px]"
      >
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7C3AED]/25 rounded-full blur-3xl pointer-events-none"></div>

        {/* Orbiting Ring Frame Container */}
        <div className="relative z-10 my-2 px-10 py-8 md:px-20 md:py-10 inline-flex flex-col items-center justify-center">
          
          {/* Orbital Ring SVG */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible stroke-purple-200/60" 
            viewBox="0 0 500 240" 
            preserveAspectRatio="none"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse 
              cx="250" 
              cy="120" 
              rx="235" 
              ry="105" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeDasharray="7 5"
              transform="rotate(-4 250 120)"
            />
          </svg>

          {/* 4-Point Sparkle Star sitting right on the orbital path */}
          <div className="absolute -top-1 right-2 md:right-6 text-[#E5D0FF] animate-pulse z-20">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
          </div>

          {/* Perfectly Aligned Main Headline Statement */}
          <h1 className="font-sans text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight drop-shadow-md relative z-10 px-4">
            Emotional <br />
            clarity without <br />
            <span className="text-[#E5D0FF] italic font-serif font-normal">burnout</span>
          </h1>
        </div>

        {/* Bottom Monospace Editorial Subtitle */}
        <div className="relative z-10 mt-4 space-y-1">
          <p className="text-[11px] md:text-xs font-mono font-black text-purple-200/90 uppercase tracking-[0.25em]">
            CONVERSATIONS WITH YOUR 24/7 EMOTIONAL WELLBEING COMPANION
          </p>
          <p className="text-[10px] font-mono font-bold text-purple-300/60 uppercase tracking-[0.2em]">
            BY ITOURA HEALTH FOUNDRY
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
