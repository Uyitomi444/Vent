import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Square } from 'lucide-react';

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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-itoura-dark text-white rounded-3xl p-8 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-12">
          <h3 className="font-serif text-2xl mb-2">Box Breathing</h3>
          <p className="text-white/60 text-sm">Follow the circle to regulate your nervous system.</p>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background pulsating ring */}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full border border-itoura-primary/30"
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            )}
            
            {/* The Breathing Circle */}
            <motion.div
              className="absolute bg-gradient-to-tr from-itoura-primary to-[#FF905A] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,115,71,0.3)]"
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
            
            <span className="relative z-10 text-xl font-medium tracking-wide drop-shadow-md">
              {getMessage()}
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors font-medium"
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
      </motion.div>
    </AnimatePresence>
  );
}
