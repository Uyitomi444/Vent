import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Heart } from 'lucide-react';

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
    <div className="bg-[#FAF9F6] border border-itoura-beige rounded-3xl p-8 relative overflow-hidden min-h-[400px] flex flex-col shadow-sm">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>

      <div className="text-center mb-8 relative z-10">
        <h3 className="font-serif text-2xl mb-2 text-itoura-dark">Mindful Moment</h3>
        <p className="text-gray-500 text-sm">Guided reflection to process complex emotions.</p>
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
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            
            <h4 className="text-xl md:text-2xl font-serif text-itoura-dark leading-relaxed mb-10">
              "{PROMPTS[promptIndex]}"
            </h4>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleNextPrompt}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                New Prompt
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
