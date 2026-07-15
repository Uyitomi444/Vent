import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Frown, Meh, Smile, Sun, CloudRain, Trash2 } from 'lucide-react';
import { useMoodStore, type MoodType } from '../store/moodStore';

const MOODS: { type: MoodType; icon: any; label: string; color: string }[] = [
  { type: 'terrible', icon: CloudRain, label: 'Terrible', color: 'text-blue-600 bg-blue-100 border-blue-200' },
  { type: 'bad', icon: Frown, label: 'Bad', color: 'text-indigo-500 bg-indigo-50 border-indigo-200' },
  { type: 'okay', icon: Meh, label: 'Okay', color: 'text-gray-500 bg-gray-50 border-gray-200' },
  { type: 'good', icon: Smile, label: 'Good', color: 'text-emerald-500 bg-emerald-50 border-emerald-200' },
  { type: 'great', icon: Sun, label: 'Great', color: 'text-amber-500 bg-amber-50 border-amber-200' },
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
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-vent-beige/50 space-y-8">
        {/* Mood Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-vent-dark">How are you feeling?</label>
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {MOODS.map(({ type, icon: Icon, label, color }) => {
              const isSelected = selectedMood === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedMood(type)}
                  className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected ? color : 'bg-transparent border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Icon className="w-8 h-8 md:w-10 md:h-10 mb-2" strokeWidth={isSelected ? 2.5 : 1.5} />
                  </motion.div>
                  <span className="text-xs md:text-sm font-medium">{label}</span>
                </button>
              );
            })}
          </div>
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
                const Icon = moodConfig?.icon || Meh;
                
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className={`p-3 rounded-xl ${moodConfig?.color}`}>
                      <Icon className="w-6 h-6" />
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
