import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Coffee } from 'lucide-react';

const BREAK_ACRONYM = [
  { letter: 'B', title: 'reasthe', desc: 'Take 5 deep, slow breaths.' },
  { letter: 'R', title: 'est', desc: 'Close your eyes until your mind is clear.' },
  { letter: 'E', title: 'mpowering words', desc: 'Say 3 nice things about yourself.' },
  { letter: 'A', title: 'bsorb', desc: 'Check in with your senses. What do you see, feel, hear?' },
  { letter: 'K', title: 'nowledge', desc: 'Stop and think before you act.' },
];

const ACTIVITIES = [
  "Start a Mini Garden 🪴",
  "Go on a Nature Walk 🚶‍♂️",
  "Stargaze at Night ✨",
  "Watch a Sunrise or Sunset 🌅",
  "Go Camping (Even at Home) ⛺️",
  "Beach Day or Nature Escape 🏖",
  "Try Kayaking or Boating 🛶",
  "Cloud Watching ☁️",
  "Try Birdwatching 🐦",
  "Go Fishing 🎣",
  "Nature Sound Walk 🎧",
  "Press Flowers or Leaves 🌸",
  "Plan a Picnic 🧺",
  "Try Outdoor Sketching or Painting 🎨",
  "Visit a Garden or Nursery 🌻",
  "Outdoor Yoga 🧘‍♀️",
  "Watch a Feel-Good Movie 🎬"
];

export default function BreakTool({ onClose }: { onClose: () => void }) {
  const [activity, setActivity] = useState<string | null>(null);

  const suggestActivity = () => {
    let nextIndex = Math.floor(Math.random() * ACTIVITIES.length);
    setActivity(ACTIVITIES[nextIndex]);
  };

  return (
    <div className="bg-white border border-itoura-beige rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col shadow-sm">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>

      <div className="text-center mb-8 relative z-10">
        <h3 className="font-serif text-2xl mb-2 text-itoura-dark">Take a Mindful Break</h3>
        <p className="text-gray-500 text-sm">Disconnect and rest your mind.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10">
        
        {/* Left side: Acronym */}
        <div className="space-y-4">
          <h4 className="font-medium text-itoura-dark mb-4 border-b pb-2">The B.R.E.A.K. Method</h4>
          {BREAK_ACRONYM.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <span className="text-2xl font-black text-itoura-primary">{item.letter}</span>
              <div>
                <h5 className="font-bold text-gray-700 tracking-wide">{item.title}</h5>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right side: Activities */}
        <div className="bg-itoura-beige/30 p-6 rounded-2xl flex flex-col items-center justify-center text-center h-full min-h-[250px]">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Coffee className="w-6 h-6 text-indigo-500" />
          </div>
          <h4 className="font-medium text-itoura-dark mb-2">Need an activity?</h4>
          <p className="text-sm text-gray-500 mb-6">Let's find something relaxing to do away from the screen.</p>
          
          <AnimatePresence mode="wait">
            {activity && (
              <motion.div
                key={activity}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white px-4 py-3 rounded-xl shadow-sm mb-6 w-full border border-indigo-50"
              >
                <span className="font-medium text-indigo-600">{activity}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={suggestActivity}
            className="flex items-center gap-2 px-6 py-2.5 bg-itoura-primary text-white rounded-full font-medium hover:bg-itoura-dark transition-colors shadow-sm w-full justify-center"
          >
            <Sparkles className="w-4 h-4" />
            {activity ? 'Give me another idea' : 'Suggest an Activity'}
          </button>
        </div>

      </div>
    </div>
  );
}
