import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Heart } from 'lucide-react';

const PROMPTS = [
  "What is a childhood memory that always makes you smile?",
  "Think about a recent challenge you overcame. How did it make you stronger?",
  "What is something you've achieved recently, no matter how small, that you're proud of?",
  "Recall a time when someone showed you unexpected kindness. How did it feel?",
  "What is a lesson you've learned in the past year that has changed your perspective?",
  "Think of a place where you feel completely at peace. What does it look and sound like?",
  "Who is someone that has had a positive impact on your life, and why?",
  "What is a simple pleasure in your daily routine that you often overlook?"
];

export default function MindfulMomentTool({ onClose }: { onClose: () => void }) {
  const [promptIndex, setPromptIndex] = useState(() => Math.floor(Math.random() * PROMPTS.length));
  
  const handleNextPrompt = () => {
    let nextIndex = Math.floor(Math.random() * PROMPTS.length);
    while (nextIndex === promptIndex) {
      nextIndex = Math.floor(Math.random() * PROMPTS.length);
    }
    setPromptIndex(nextIndex);
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
          Focus
        </span>
      </div>

      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl md:text-3xl font-black text-white mb-2">Mindful Moment</h3>
        <p className="text-[#E8DCF8] text-sm font-bold">Guided reflection to process complex emotions.</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={promptIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center max-w-md w-full"
          >
            <div className="mb-8 flex justify-center">
              <div className="w-16 h-16 bg-[#613B6E] rounded-full flex items-center justify-center border-2 border-[#C4B4E2] shadow-xl">
                <Heart className="w-8 h-8 text-[#C4B4E2]" />
              </div>
            </div>
            
            <h4 className="text-xl md:text-2xl font-serif font-black text-white leading-relaxed mb-10 px-4">
              "{PROMPTS[promptIndex]}"
            </h4>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleNextPrompt}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#C4B4E2] text-[#532E60] rounded-full font-black hover:bg-white transition-colors shadow-xl cursor-pointer border border-white"
              >
                <RefreshCw className="w-4 h-4" />
                New Prompt
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3D2048]/30 pointer-events-none rounded-[2.5rem]" />
    </div>
  );
}
