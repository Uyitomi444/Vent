import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useMoodStore, type MoodType } from '../store/moodStore';

const CustomTerribleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ overflow: 'visible' }}>
    <circle cx="32" cy="32" r="28" />
    <path d="M22 36a6 6 0 0 1-2-11.6 8 8 0 0 1 15-3 6 6 0 0 1 7 5.6V28a6 6 0 0 1-6 6H22z" fill="transparent" />
    <line x1="25" y1="42" x2="23" y2="46" stroke="#b39ddb" strokeWidth="3" />
    <line x1="32" y1="44" x2="30" y2="48" stroke="#b39ddb" strokeWidth="3" />
    <line x1="39" y1="42" x2="37" y2="46" stroke="#b39ddb" strokeWidth="3" />
  </svg>
);

const CustomBadIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ overflow: 'visible' }}>
    <circle cx="32" cy="32" r="28" />
    <circle cx="22" cy="26" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="42" cy="26" r="2.5" fill="currentColor" stroke="none" />
    <path d="M22 42c3-5 17-5 20 0" />
    <circle cx="60" cy="32" r="4.5" fill="#b39ddb" stroke="none" />
  </svg>
);

const CustomOkayIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ overflow: 'visible' }}>
    <circle cx="32" cy="32" r="28" />
    <circle cx="22" cy="26" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="42" cy="26" r="2.5" fill="currentColor" stroke="none" />
    <line x1="24" y1="40" x2="40" y2="40" />
    <circle cx="60" cy="32" r="4.5" fill="#b39ddb" stroke="none" />
  </svg>
);

const CustomGoodIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ overflow: 'visible' }}>
    <circle cx="32" cy="32" r="28" />
    <circle cx="22" cy="26" r="2.5" fill="currentColor" stroke="none" />
    <circle cx="42" cy="26" r="2.5" fill="currentColor" stroke="none" />
    <path d="M22 38c3 5 17 5 20 0" />
    <circle cx="60" cy="32" r="4.5" fill="#b39ddb" stroke="none" />
  </svg>
);

const CustomGreatIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={{ overflow: 'visible' }}>
    <circle cx="32" cy="32" r="28" />
    <circle cx="32" cy="32" r="10" />
    <line x1="32" y1="12" x2="32" y2="16" stroke="#b39ddb" strokeWidth="3" />
    <line x1="32" y1="48" x2="32" y2="52" />
    <line x1="12" y1="32" x2="16" y2="32" />
    <line x1="48" y1="32" x2="52" y2="32" stroke="#b39ddb" strokeWidth="3" />
    <line x1="18" y1="18" x2="22" y2="22" />
    <line x1="42" y1="42" x2="46" y2="46" />
    <line x1="18" y1="46" x2="22" y2="42" />
    <line x1="42" y1="22" x2="46" y2="18" stroke="#b39ddb" strokeWidth="3" />
  </svg>
);

const MOODS: { type: MoodType; icon: any; label: string }[] = [
  { type: 'terrible', icon: CustomTerribleIcon, label: 'Terrible' },
  { type: 'bad', icon: CustomBadIcon, label: 'Bad' },
  { type: 'okay', icon: CustomOkayIcon, label: 'Okay' },
  { type: 'good', icon: CustomGoodIcon, label: 'Good' },
  { type: 'great', icon: CustomGreatIcon, label: 'Great' },
];

export default function MoodPage() {
  const { entries, addEntry, deleteEntry } = useMoodStore();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!selectedMood) return;
    addEntry({ mood: selectedMood, energyLevel: energy, note });
    setSelectedMood(null);
    setEnergy(5);
    setNote('');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="font-serif text-3xl text-vent-dark">Mood Check-in</h1>
        <p className="text-gray-500 text-sm md:text-base">Take a moment to reflect on how you're feeling right now.</p>
      </header>

      {/* Check-in Form */}
      <section className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-vent-beige/50 space-y-10">
        {/* Mood Selection (Custom Design) */}
        <div className="flex justify-center items-center gap-4 md:gap-8 overflow-x-auto pb-4 px-2">
          {MOODS.map(({ type, icon: Icon }) => {
            const isSelected = selectedMood === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedMood(type)}
                className={`transition-colors duration-200 outline-none shrink-0 ${
                  isSelected ? 'text-black' : 'text-gray-300 hover:text-gray-500'
                }`}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Icon className="w-16 h-16 md:w-20 md:h-20" />
                </motion.div>
              </button>
            );
          })}
        </div>

        {/* Energy Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-vent-dark">Energy Level</label>
            <span className="text-sm font-medium text-vent-primary bg-vent-beige px-3 py-1 rounded-full">{energy}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-vent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Exhausted</span>
            <span>Energized</span>
          </div>
        </div>

        {/* Optional Note */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-vent-dark">Add a note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's making you feel this way?"
            className="w-full p-4 bg-gray-50 border-none rounded-2xl resize-none focus:ring-2 focus:ring-vent-primary focus:bg-white transition-colors h-24 text-sm"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSave}
          disabled={!selectedMood}
          className="w-full py-4 rounded-2xl bg-vent-dark text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vent-primary transition-colors"
        >
          Save Check-in
        </button>
      </section>

      {/* History */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-vent-dark">Recent History</h2>
        
        <div className="space-y-4">
          <AnimatePresence>
            {entries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center p-8 bg-white/50 rounded-3xl border border-dashed border-gray-200"
              >
                <p className="text-gray-400 text-sm">No check-ins yet. Start tracking your mood above.</p>
              </motion.div>
            ) : (
              entries.map((entry) => {
                const moodConfig = MOODS.find(m => m.type === entry.mood);
                const Icon = moodConfig?.icon || CustomOkayIcon;
                
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="p-2 rounded-xl text-black bg-gray-50 border border-gray-100">
                      <Icon className="w-8 h-8" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-vent-dark capitalize">{entry.mood}</h3>
                          <span className="text-xs text-gray-400">
                            {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium bg-gray-50 px-2 py-1 rounded-lg text-gray-500">
                            Energy: {entry.energyLevel}/10
                          </span>
                          <button 
                            onClick={() => deleteEntry(entry.id)}
                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {entry.note && (
                        <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                          "{entry.note}"
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
