import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, ArrowLeft, Zap } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface BubbleWrapToolProps {
  onClose: () => void;
}

export default function BubbleWrapTool({ onClose }: BubbleWrapToolProps) {
  const TOTAL_BUBBLES = 36; // 6x6 grid
  const [poppedState, setPoppedState] = useState<boolean[]>(Array(TOTAL_BUBBLES).fill(false));
  const [combo, setCombo] = useState(0);

  const handlePop = (idx: number) => {
    if (poppedState[idx]) return;

    // Play procedural pop sound with randomized slight pitch variance
    const pitch = 0.9 + Math.random() * 0.3;
    soundEngine.playBubblePop(pitch);

    // Trigger haptic vibration if supported on mobile
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }

    const next = [...poppedState];
    next[idx] = true;
    setPoppedState(next);
    setCombo((prev) => prev + 1);

    // If whole board completed, play zen chime celebratory sound
    if (next.every((p) => p)) {
      setTimeout(() => {
        soundEngine.playZenChime();
      }, 300);
    }
  };

  const handleResetBoard = () => {
    setPoppedState(Array(TOTAL_BUBBLES).fill(false));
    setCombo(0);
  };

  const handlePopAll = () => {
    poppedState.forEach((_, idx) => {
      setTimeout(() => {
        soundEngine.playBubblePop(0.8 + Math.random() * 0.4);
      }, idx * 25);
    });
    setPoppedState(Array(TOTAL_BUBBLES).fill(true));
  };

  const poppedCount = poppedState.filter(Boolean).length;
  const progressPercent = Math.round((poppedCount / TOTAL_BUBBLES) * 100);

  return (
    <div className="bg-[#532E60] border-2 border-white/40 rounded-[2.5rem] p-6 md:p-10 shadow-2xl text-white relative overflow-hidden min-h-[540px] flex flex-col justify-between max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-[#613B6E] text-white rounded-full font-black text-xs hover:bg-[#3D2048] transition-colors border border-white/30 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePopAll}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-black text-xs border border-white/20 cursor-pointer transition-all"
          >
            Pop All
          </button>
          <button
            onClick={handleResetBoard}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#C4B4E2] hover:bg-white text-[#532E60] rounded-full font-black text-xs shadow-md cursor-pointer transition-all"
          >
            <RotateCcw size={14} />
            <span>Fresh Sheet</span>
          </button>
        </div>
      </div>

      {/* Tool Introduction & Stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-black text-white flex items-center gap-2">
            <span>🫧 Kinetic Bubble Wrap</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#E8DCF8] font-bold">
            Tap to pop sensory bubbles, release pent-up tension, and unwind.
          </p>
        </div>

        {/* Stress meter & stats */}
        <div className="flex items-center gap-4 bg-[#613B6E] px-4 py-2.5 rounded-2xl border border-white/20">
          <div className="text-center">
            <div className="text-xs font-black text-[#E8DCF8] uppercase tracking-wider">Sheet</div>
            <div className="text-base font-mono font-black text-white">{poppedCount}/{TOTAL_BUBBLES}</div>
          </div>
          <div className="h-7 w-px bg-white/20" />
          <div className="text-center">
            <div className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
              <Zap size={12} /> Combo
            </div>
            <div className="text-base font-mono font-black text-white">{combo}x</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-2 rounded-full mb-6 overflow-hidden border border-white/10">
        <motion.div
          className="bg-gradient-to-r from-[#C4B4E2] to-emerald-400 h-full rounded-full"
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Bubble Grid */}
      <div className="grid grid-cols-6 gap-3 sm:gap-4 max-w-md mx-auto w-full p-4 bg-[#613B6E]/60 rounded-3xl border-2 border-white/20 shadow-inner">
        {poppedState.map((isPopped, idx) => (
          <motion.button
            key={idx}
            whileHover={!isPopped ? { scale: 1.08 } : {}}
            whileTap={!isPopped ? { scale: 0.85 } : {}}
            onClick={() => handlePop(idx)}
            className={`aspect-square rounded-2xl sm:rounded-3xl border-2 transition-all duration-200 flex items-center justify-center cursor-pointer select-none relative ${
              isPopped
                ? 'bg-white/5 border-white/10 shadow-none scale-90 opacity-40'
                : 'bg-gradient-to-br from-[#E8DCF8]/40 via-[#C4B4E2]/20 to-white/10 border-white/60 shadow-lg shadow-purple-500/20 hover:border-white'
            }`}
          >
            {/* Glossy reflection on unpopped bubble */}
            {!isPopped && (
              <>
                <div className="absolute top-1.5 left-1.5 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/80 blur-[0.5px]" />
                <div className="w-4 h-4 sm:w-6 sm:h-6 rounded-full bg-[#C4B4E2]/30" />
              </>
            )}

            {isPopped && (
              <span className="text-white/20 text-xs font-mono font-black">✕</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Board Complete Banner */}
      {poppedCount === TOTAL_BUBBLES && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-emerald-500/20 border border-emerald-400/60 rounded-2xl text-center flex items-center justify-center gap-2 text-emerald-200 text-sm font-black"
        >
          <CheckCircle2 size={18} className="text-emerald-300" />
          <span>Sheet Cleared! Feeling more grounded? Refresh for another round.</span>
        </motion.div>
      )}
    </div>
  );
}
