import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, TrendingUp, Sparkles } from 'lucide-react';
import { useMoodStore, type MoodType } from '../store/moodStore';
import { useMemoryStore } from '../store/memoryStore';
import { useJournalStore } from '../store/journalStore';
import SpriteIcon from '../components/SpriteIcon';
import FiveIcons from '../assets/Five_icons.jpeg';

const MOODS: { type: MoodType; spriteIndex: number; label: string }[] = [
  { type: 'terrible', spriteIndex: 0, label: 'Terrible' },
  { type: 'bad', spriteIndex: 1, label: 'Bad' },
  { type: 'okay', spriteIndex: 2, label: 'Okay' },
  { type: 'good', spriteIndex: 3, label: 'Good' },
  { type: 'great', spriteIndex: 4, label: 'Great' },
];

export default function MoodPage() {
  const { entries, addEntry, deleteEntry } = useMoodStore();
  const { memories } = useMemoryStore();
  const { entries: journalEntries } = useJournalStore();
  
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

  const topThemes = useMemo(() => {
    const counts: Record<string, number> = {};
    const processThemes = (themes?: string[]) => {
      themes?.forEach(t => {
        const key = t.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      });
    };
    memories.forEach(m => processThemes(m.themes));
    journalEntries.forEach(j => processThemes(j.themes));
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([theme, count]) => ({ theme, count }));
  }, [memories, journalEntries]);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-black text-purple-950">Mood Check-in</h1>
        <p className="text-purple-900/80 font-bold text-sm md:text-base">Take a moment to reflect on how you're feeling right now.</p>
      </header>
      
      {/* Insights & Patterns */}
      {topThemes.length > 0 && (
        <section className="bg-[#E9D5FF] rounded-3xl p-6 shadow-lg border-2 border-purple-400">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={22} className="text-purple-900" />
            <h2 className="font-serif text-xl font-black text-black">Recent Patterns</h2>
          </div>
          <p className="text-sm font-bold text-purple-950 mb-4">Based on your recent chats and journal entries, these themes have been on your mind:</p>
          <div className="flex flex-wrap gap-3">
            {topThemes.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-purple-950 text-white px-4 py-2 rounded-full shadow-md text-sm border border-purple-500">
                <Sparkles size={14} className="text-purple-300" />
                <span className="font-extrabold capitalize">{item.theme}</span>
                <span className="text-xs font-black text-purple-200 bg-purple-800 px-2 py-0.5 rounded-full">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Check-in Form in Vibrant Purple Box */}
      <section className="bg-[#E9D5FF] rounded-3xl p-6 md:p-8 shadow-xl border-2 border-purple-500 space-y-8">
        {/* Mood Selection */}
        <div className="space-y-4">
          <label className="block text-base font-black text-black">How are you feeling?</label>
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {MOODS.map(({ type, spriteIndex, label }) => {
              const isSelected = selectedMood === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedMood(type)}
                  className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-3xl transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'bg-purple-950 text-white border-2 border-purple-400 scale-105 shadow-lg' 
                      : 'bg-purple-300/60 border-2 border-purple-400/50 hover:bg-purple-300 opacity-90'
                  }`}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <SpriteIcon 
                      imageSrc={FiveIcons} 
                      totalIcons={5} 
                      index={spriteIndex} 
                      size={60}
                      className={isSelected ? 'scale-110 transition-transform' : ''}
                    />
                  </motion.div>
                  <span className={`text-xs md:text-sm font-extrabold mt-2 ${isSelected ? 'text-purple-200' : 'text-purple-950'}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-base font-black text-black">Energy Level</label>
            <span className="text-sm font-black text-white bg-purple-950 px-4 py-1.5 rounded-full border border-purple-400 shadow-sm">{energy}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full h-3 bg-purple-300 rounded-lg appearance-none cursor-pointer accent-purple-900"
          />
          <div className="flex justify-between text-xs font-black text-purple-950">
            <span>Exhausted</span>
            <span>Energized</span>
          </div>
        </div>

        {/* Note: Purple space with Bold Black Text */}
        <div className="space-y-4">
          <label className="block text-base font-black text-black">Add a note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's making you feel this way?"
            className="w-full p-4 bg-purple-200/90 border-2 border-purple-500 rounded-2xl resize-none outline-none focus:border-purple-800 transition-colors h-24 text-base font-bold text-black placeholder:text-purple-950/60"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSave}
          disabled={!selectedMood}
          className="w-full py-4 rounded-2xl bg-purple-950 text-white font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-800 transition-all shadow-lg border-2 border-purple-400 cursor-pointer"
        >
          Save Check-in
        </button>
      </section>

      {/* History */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl font-black text-purple-950">Recent History</h2>
        
        <div className="space-y-4">
          <AnimatePresence>
            {entries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center p-8 bg-[#E9D5FF] rounded-3xl border-2 border-purple-400 shadow-md"
              >
                <p className="text-purple-950 font-bold text-base">No check-ins yet. Start tracking your mood above.</p>
              </motion.div>
            ) : (
              entries.map((entry) => {
                const moodConfig = MOODS.find(m => m.type === entry.mood);
                
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-start gap-4 p-5 bg-[#E9D5FF] rounded-3xl shadow-lg border-2 border-purple-400/90"
                  >
                    <div className="bg-purple-950 rounded-2xl p-1 shadow-md">
                      {moodConfig && (
                        <SpriteIcon 
                          imageSrc={FiveIcons} 
                          totalIcons={5} 
                          index={moodConfig.spriteIndex} 
                          size={48}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 mt-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-black text-black text-lg capitalize">{entry.mood}</h3>
                          <span className="text-xs font-bold text-purple-900">
                            {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black bg-purple-950 text-white px-3 py-1 rounded-full border border-purple-400">
                            Energy: {entry.energyLevel}/10
                          </span>
                          <button 
                            onClick={() => deleteEntry(entry.id)}
                            className="p-1.5 text-purple-950 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {entry.note && (
                        <p className="mt-3 text-sm font-bold text-black bg-purple-300/80 p-3 rounded-xl border border-purple-400">
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
