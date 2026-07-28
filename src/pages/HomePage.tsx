import ChatInterface from '../components/chat/ChatInterface';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto space-y-8">
      
      {/* Editorial Grainy Hero Banner Inspired by Silverstag Artwork */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-grain-texture rounded-[2.5rem] p-8 md:p-12 border border-[#6D28D9]/60 shadow-2xl overflow-hidden text-center flex flex-col items-center justify-center min-h-[300px]"
      >
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#7C3AED]/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Orbiting Ellipse Ring SVG & Sparkle Star Overlay */}
        <div className="relative z-10 my-4 inline-block">
          
          {/* Orbital Ring SVG */}
          <svg 
            className="absolute -inset-x-8 -inset-y-6 w-[130%] h-[140%] pointer-events-none stroke-purple-200/50" 
            viewBox="0 0 400 180" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse 
              cx="200" 
              cy="90" 
              rx="180" 
              ry="75" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeDasharray="6 4"
              transform="rotate(-5 200 90)"
            />
          </svg>

          {/* 4-Point Sparkle Star Ornament */}
          <div className="absolute -right-6 top-2 text-[#E5D0FF] animate-pulse">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
            </svg>
          </div>

          {/* Bold Editorial Main Headline Statement */}
          <h1 className="font-sans text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight drop-shadow-lg px-6">
            Emotional <br />
            clarity without <br />
            <span className="text-[#E5D0FF] italic font-serif font-normal">burnout</span>
          </h1>
        </div>

        {/* Bottom Monospace Editorial Subtitle */}
        <div className="relative z-10 mt-6 space-y-1">
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
