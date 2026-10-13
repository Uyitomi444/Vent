import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Coffee } from 'lucide-react';

const BREAK_ACRONYM = [
  { letter: 'B', title: 'reathe', desc: 'Take 5 deep, slow breaths.' },
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
    const nextIndex = Math.floor(Math.random() * ACTIVITIES.length);
    setActivity(ACTIVITIES[nextIndex]);
  };

  return (
    <div className="bg-[#532E60] border-2 border-white/40 rounded-[2.5rem] p-6 md:p-10 shadow-2xl text-white relative overflow-hidden flex flex-col">
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
          Rest
        </span>
      </div>

      <div className="text-center mb-8">
        <h3 className="font-serif text-2xl md:text-3xl font-black text-white mb-2">Take a Mindful Break</h3>
        <p className="text-[#E8DCF8] text-sm font-bold">Disconnect and rest your mind.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start relative z-10">
        
        {/* Left side: Acronym */}
        <div className="space-y-4">
          <h4 className="font-black text-white mb-4 border-b border-white/20 pb-2">The B.R.E.A.K. Method</h4>
          {BREAK_ACRONYM.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col"
            >
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-[#C4B4E2]">{item.letter}</span>
                <h5 className="text-lg font-black text-white tracking-wide">{item.title}</h5>
              </div>
              <p className="text-sm text-[#E8DCF8] font-bold ml-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Right side: Activities */}
        <div className="bg-[#613B6E] p-6 rounded-2xl flex flex-col items-center justify-center text-center min-h-[250px] border border-white/20 shadow-inner">
          <div className="w-12 h-12 bg-[#532E60] rounded-full flex items-center justify-center mb-4 border border-[#C4B4E2] shadow-md">
            <Coffee className="w-6 h-6 text-[#C4B4E2]" />
          </div>
          <h4 className="font-black text-white mb-2">Need an activity?</h4>
          <p className="text-sm text-[#E8DCF8] font-bold mb-6">Let's find something relaxing to do away from the screen.</p>
          
          <AnimatePresence mode="wait">
            {activity && (
              <motion.div
                key={activity}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#532E60] px-4 py-3 rounded-xl shadow-md mb-6 w-full border border-[#C4B4E2]"
              >
                <span className="font-black text-[#C4B4E2]">{activity}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={suggestActivity}
            className="flex items-center gap-2 px-6 py-3 bg-[#C4B4E2] text-[#532E60] rounded-full font-black hover:bg-white transition-colors shadow-xl w-full justify-center cursor-pointer border border-white"
          >
            <RotateCcw className="w-4 h-4" />
            {activity ? 'Give me another idea' : 'Suggest an Activity'}
          </button>
        </div>

      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3D2048]/30 pointer-events-none rounded-[2.5rem]" />
    </div>
  );
}
