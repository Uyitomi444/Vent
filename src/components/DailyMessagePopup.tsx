import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

import daily1 from '../assets/DAILY/daily-1.jpg';
import daily2 from '../assets/DAILY/daily-2.jpg';
import daily3 from '../assets/DAILY/daily-3.jpg';
import daily4 from '../assets/DAILY/daily-4.jpg';
import daily5 from '../assets/DAILY/daily-5.jpg';
import daily6 from '../assets/DAILY/daily-6.jpg';
import daily7 from '../assets/DAILY/daily-7.jpg';

const DAILY_IMAGES = [daily1, daily2, daily3, daily4, daily5, daily6, daily7];
const DAILY_MESSAGES = [
  "Take a deep breath. You are doing exactly what you need to do today.",
  "Remember to be kind to yourself. Progress takes time.",
  "Your feelings are valid, and it's okay to take a step back.",
  "You've survived 100% of your bad days. You got this.",
  "A quiet moment can sometimes be the most productive.",
  "Focus on the step in front of you, not the whole staircase.",
  "Let go of what you can't control today."
];

export default function DailyMessagePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState({ image: '', message: '' });

  useEffect(() => {
    // Check if we've shown the message today
    const today = new Date().toISOString().split('T')[0];
    const lastShown = localStorage.getItem('itoura-daily-message-date');

    if (lastShown !== today) {
      // Pick random content
      const randomIndex = Math.floor(Math.random() * DAILY_IMAGES.length);
      const randomMsgIndex = Math.floor(Math.random() * DAILY_MESSAGES.length);
      
      setContent({
        image: DAILY_IMAGES[randomIndex],
        message: DAILY_MESSAGES[randomMsgIndex]
      });

      // Small delay before showing so it feels natural after app load
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem('itoura-daily-message-date', today);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#160432]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#220A50] rounded-[2.5rem] border-2 border-[#5B21B6] shadow-2xl max-w-sm w-full relative flex flex-col overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 p-2 bg-[#160432]/80 hover:bg-[#160432] text-white rounded-full transition-colors z-20 backdrop-blur-md cursor-pointer border border-[#5B21B6]"
          >
            <X className="w-5 h-5 text-[#C8B6FF]" />
          </button>
          
          {/* Top Illustration Card */}
          <div className="w-full aspect-square relative overflow-hidden bg-white p-4 flex items-center justify-center border-b-2 border-[#5B21B6]">
            <img 
              src={content.image} 
              alt="Daily inspiration" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Bottom Content Area */}
          <div className="p-6 md:p-8 text-center bg-[#220A50] flex flex-col items-center">
            
            <div className="flex items-center gap-1.5 text-[#C8B6FF] mb-2">
              <Sparkles size={18} className="text-[#C8B6FF]" />
              <h3 className="font-serif text-2xl font-black text-[#C8B6FF]">Daily Reminder</h3>
            </div>

            {/* High-Contrast Bold Black Text Box on Lilac */}
            <div className="w-full bg-[#C8B6FF] text-[#160432] p-4 rounded-2xl shadow-md border border-purple-300 my-4 text-center">
              <p className="font-black text-base md:text-lg leading-relaxed text-[#160432]">
                "{content.message}"
              </p>
            </div>
            
            {/* Bold Action Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="mt-2 w-full py-3.5 bg-[#C8B6FF] hover:bg-white text-[#160432] font-black text-base rounded-full shadow-lg border border-purple-300 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              Start My Day
            </button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
