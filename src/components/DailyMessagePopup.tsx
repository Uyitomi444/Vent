import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

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
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-itoura-dark/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-[2rem] overflow-hidden shadow-2xl max-w-sm w-full relative flex flex-col"
        >
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-10 backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-full aspect-square sm:h-64 sm:aspect-auto relative overflow-hidden bg-[#f4f7f6]">
            <img 
              src={content.image} 
              alt="Daily inspiration" 
              className="w-full h-full object-contain p-4"
            />
            {/* Gradient overlay for text legibility if we wanted to overlay text */}
          </div>
          
          <div className="p-8 text-center bg-white dark:bg-itoura-dark">
            <h3 className="font-serif text-2xl text-itoura-dark dark:text-white mb-4">Good Morning</h3>
            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
              "{content.message}"
            </p>
            
            <button
              onClick={() => setIsVisible(false)}
              className="mt-8 px-8 py-3 bg-itoura-primary text-white rounded-full font-medium shadow-sm hover:scale-105 active:scale-95 transition-all w-full"
            >
              Start My Day
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
