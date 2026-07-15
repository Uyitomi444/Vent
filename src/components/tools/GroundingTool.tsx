import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Hand, Ear, Wind, Coffee } from 'lucide-react';

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
    <div className="bg-itoura-dark text-white rounded-3xl p-8 relative overflow-hidden min-h-[400px] flex flex-col">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="text-center mb-8 relative z-10">
        <h3 className="font-serif text-2xl mb-2">5-4-3-2-1 Grounding</h3>
        <p className="text-white/60 text-sm">Engage your senses to return to the present.</p>
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
                className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center border-2 border-itoura-primary relative"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <currentStep.icon className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-itoura-primary rounded-full flex items-center justify-center font-bold">
                  {currentStep.count}
                </div>
              </motion.div>
              
              <h4 className="text-2xl font-medium">{currentStep.prompt}</h4>
              <p className="text-white/70 max-w-xs mx-auto">
                Take your time. Notice the small details. Close your eyes and focus if it helps.
              </p>

              <button
                onClick={() => setStepIndex(prev => prev + 1)}
                className="mt-8 px-8 py-3 bg-white text-itoura-dark rounded-full font-medium hover:bg-gray-100 transition-colors"
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
              <div className="w-24 h-24 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500">
                <span className="text-4xl">✨</span>
              </div>
              <h4 className="text-2xl font-medium">You are grounded.</h4>
              <p className="text-white/70 max-w-xs mx-auto">
                You've successfully brought your awareness back to the present moment.
              </p>
              <button
                onClick={onClose}
                className="mt-8 px-8 py-3 bg-white text-itoura-dark rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Return to Tools
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-itoura-primary/20 pointer-events-none" />
    </div>
  );
}
