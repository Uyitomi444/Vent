import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, Hand, Ear, Wind, Coffee, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { count: 5, sense: 'See', icon: Eye, prompt: 'Find 5 things you can see around you.' },
  { count: 4, sense: 'Feel', icon: Hand, prompt: 'Find 4 things you can physically feel.' },
  { count: 3, sense: 'Hear', icon: Ear, prompt: 'Find 3 things you can hear right now.' },
  { count: 2, sense: 'Smell', icon: Wind, prompt: 'Find 2 things you can smell.' },
  { count: 1, sense: 'Taste', icon: Coffee, prompt: 'Find 1 thing you can taste.' },
];

export default function GroundingTool({ onClose }: { onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = STEPS[stepIndex];
  const isFinished = stepIndex >= STEPS.length;

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
          Reset
        </span>
      </div>

      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl md:text-3xl font-black text-white mb-2">5-4-3-2-1 Grounding</h3>
        <p className="text-[#E8DCF8] text-sm font-bold">Engage your senses to return to the present.</p>
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i < stepIndex
                ? 'bg-[#C4B4E2] scale-100'
                : i === stepIndex && !isFinished
                ? 'bg-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentStep.count}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-6"
            >
              <motion.div 
                className="w-24 h-24 mx-auto bg-[#613B6E] rounded-full flex items-center justify-center border-2 border-[#C4B4E2] relative shadow-xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <currentStep.icon className="w-10 h-10 text-[#E8DCF8]" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#C4B4E2] text-[#532E60] rounded-full flex items-center justify-center font-black text-sm border border-white shadow-md">
                  {currentStep.count}
                </div>
              </motion.div>
              
              <h4 className="text-xl md:text-2xl font-serif font-black text-white">{currentStep.prompt}</h4>
              <p className="text-[#E8DCF8] font-bold text-sm max-w-xs mx-auto">
                Take your time. Notice the small details. Close your eyes and focus if it helps.
              </p>

              <button
                onClick={() => setStepIndex(prev => prev + 1)}
                className="mt-6 px-8 py-3.5 bg-[#C4B4E2] text-[#532E60] rounded-full font-black hover:bg-white transition-colors shadow-xl cursor-pointer border border-white"
              >
                {stepIndex === STEPS.length - 1 ? 'Finish' : 'Next Sense'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="finished"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-24 h-24 mx-auto bg-[#613B6E] rounded-full flex items-center justify-center border-2 border-[#C4B4E2] shadow-xl">
                <CheckCircle2 className="w-12 h-12 text-[#C4B4E2]" />
              </div>
              <h4 className="text-2xl font-serif font-black text-white">You are grounded.</h4>
              <p className="text-[#E8DCF8] font-bold text-sm max-w-xs mx-auto">
                You've successfully brought your awareness back to the present moment.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-8 py-3.5 bg-[#C4B4E2] text-[#532E60] rounded-full font-black hover:bg-white transition-colors shadow-xl cursor-pointer border border-white"
              >
                Return to Tools
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3D2048]/30 pointer-events-none rounded-[2.5rem]" />
    </div>
  );
}
