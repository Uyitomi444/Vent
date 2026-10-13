import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Square } from 'lucide-react';

export default function BreathingTool({ onClose }: { onClose: () => void }) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold ' | 'Ready'>('Ready');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    if (isActive) {
      setPhase('Inhale');
      
      const cycle = () => {
        setPhase('Inhale');
        timer = setTimeout(() => {
          setPhase('Hold');
          timer = setTimeout(() => {
            setPhase('Exhale');
            timer = setTimeout(() => {
              setPhase('Hold ');
              timer = setTimeout(cycle, 4000); // Wait 4s before next cycle
            }, 4000); // Exhale 4s
          }, 4000); // Hold 4s
        }, 4000); // Inhale 4s
      };

      // Start the first cycle
      timer = setTimeout(() => {
        setPhase('Hold');
        timer = setTimeout(() => {
          setPhase('Exhale');
          timer = setTimeout(() => {
            setPhase('Hold ');
            timer = setTimeout(cycle, 4000);
          }, 4000);
        }, 4000);
      }, 4000);
      
    } else {
      setPhase('Ready');
    }

    return () => clearTimeout(timer);
  }, [isActive]);

  const getScale = () => {
    switch (phase) {
      case 'Inhale': return 1.5;
      case 'Hold': return 1.5;
      case 'Exhale': return 1;
      case 'Hold ': return 1;
      default: return 1;
    }
  };

  const getMessage = () => {
    if (!isActive) return 'Ready to begin?';
    return phase;
  };

  return (
    <div className="bg-[#532E60] border-2 border-white/40 rounded-[2.5rem] p-6 md:p-10 shadow-2xl text-white relative overflow-hidden min-h-[520px] flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-[#613B6E] text-white rounded-full font-black text-xs hover:bg-[#3D2048] transition-colors border border-white/30 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Tools</span>
        </button>

        <span className="px-3.5 py-1.5 bg-[#613B6E] text-[#E8DCF8] rounded-full text-xs font-black border border-white/20">
          Mindfulness
        </span>
      </div>

      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl md:text-3xl font-black text-white mb-2">Box Breathing</h3>
        <p className="text-[#E8DCF8] text-sm font-bold">Follow the circle to regulate your nervous system.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Background pulsating ring */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full border border-[#C4B4E2]/40"
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          )}
          
          {/* The Breathing Circle */}
          <motion.div
            className="absolute bg-gradient-to-tr from-[#C4B4E2] to-[#E8DCF8] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(196,180,226,0.4)]"
            initial={{ width: 120, height: 120 }}
            animate={{ 
              scale: getScale(),
              opacity: isActive ? 1 : 0.8
            }}
            transition={{ 
              duration: 4, 
              ease: "easeInOut" 
            }}
            style={{ width: 120, height: 120 }}
          />
          
          <span className="relative z-10 text-xl font-black tracking-wide drop-shadow-md text-[#532E60]">
            {getMessage()}
          </span>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setIsActive(!isActive)}
          className="flex items-center gap-2 px-8 py-3.5 bg-[#C4B4E2] hover:bg-white text-[#532E60] rounded-full transition-colors font-black shadow-xl cursor-pointer border border-white"
        >
          {isActive ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              Stop Exercise
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Start Breathing
            </>
          )}
        </button>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3D2048]/30 pointer-events-none rounded-[2.5rem]" />
    </div>
  );
}
