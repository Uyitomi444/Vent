import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, TrendingUp } from 'lucide-react';
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
        <h1 className="font-serif text-3xl md:text-4xl font-black text-[#E5D0FF]">Mood Check-in</h1>
        <p className="text-purple-300 font-bold text-sm md:text-base">Take a moment to reflect on how you're feeling right now.</p>
      </header>
      
      {/* Insights & Patterns */}
      {topThemes.length > 0 && (
        <section className="bg-[#2E0B5E] rounded-3xl p-6 shadow-xl border border-[#7C3AED]/80">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={22} className="text-[#E5D0FF]" />
            <h2 className="font-serif text-xl font-black text-[#E5D0FF]">Recent Patterns</h2>
          </div>
          <p className="text-sm font-bold text-purple-200 mb-4">Based on your recent chats and journal entries, these themes have been on your mind:</p>
          <div className="flex flex-wrap gap-3">
            {topThemes.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#E5D0FF] text-[#160432] px-4 py-2 rounded-full shadow-md text-sm font-black border border-purple-300">
                <span className="capitalize">{item.theme}</span>
                <span className="text-xs font-black text-white bg-[#4C1D95] px-2 py-0.5 rounded-full">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Check-in Form in Rich Indigo-Purple Box */}
      <section className="bg-[#2E0B5E] rounded-3xl p-6 md:p-8 shadow-2xl border border-[#7C3AED]/80 space-y-8">
        {/* Mood Selection */}
        <div className="space-y-4">
          <label className="block text-base font-black text-[#E5D0FF]">How are you feeling?</label>
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {MOODS.map(({ type, spriteIndex, label }) => {
              const isSelected = selectedMood === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedMood(type)}
                  className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-3xl transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#E5D0FF] text-[#160432] border-2 border-white scale-105 shadow-xl' 
                      : 'bg-[#4C1D95]/60 border border-[#7C3AED]/60 hover:bg-[#4C1D95] text-purple-200'
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
                  <span className={`text-xs md:text-sm font-extrabold mt-2 ${isSelected ? 'text-[#160432]' : 'text-purple-200'}`}>
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
            <label className="block text-base font-black text-[#E5D0FF]">Energy Level</label>
            <span className="text-sm font-black text-[#160432] bg-[#E5D0FF] px-4 py-1.5 rounded-full border border-purple-300 shadow-sm">{energy}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full h-3 bg-[#4C1D95] rounded-lg appearance-none cursor-pointer accent-[#E5D0FF]"
          />
          <div className="flex justify-between text-xs font-black text-purple-300">
            <span>Exhausted</span>
            <span>Energized</span>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-4">
          <label className="block text-base font-black text-[#E5D0FF]">Add a note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's making you feel this way?"
            className="w-full p-4 bg-[#E5D0FF] border-2 border-purple-400 rounded-2xl resize-none outline-none focus:border-white transition-colors h-24 text-base font-bold text-[#160432] placeholder:text-[#2E0B5E]/60"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSave}
          disabled={!selectedMood}
          className="w-full py-4 rounded-2xl bg-[#E5D0FF] text-[#160432] font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all shadow-xl cursor-pointer"
        >
          Save Check-in
        </button>
      </section>

      {/* History */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl font-black text-[#E5D0FF]">Recent History</h2>
        
        <div className="space-y-4">
          <AnimatePresence>
            {entries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center p-8 bg-[#2E0B5E] rounded-3xl border border-[#7C3AED]/80 shadow-lg"
              >
                <p className="text-purple-200 font-bold text-base">No check-ins yet. Start tracking your mood above.</p>
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
                    className="flex items-start gap-4 p-5 bg-[#2E0B5E] rounded-3xl shadow-xl border border-[#7C3AED]/80"
                  >
                    <div className="bg-[#4C1D95] rounded-2xl p-1 shadow-inner">
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
                          <h3 className="font-black text-[#E5D0FF] text-lg capitalize">{entry.mood}</h3>
                          <span className="text-xs font-bold text-purple-300">
                            {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black bg-[#E5D0FF] text-[#160432] px-3 py-1 rounded-full border border-purple-300">
                            Energy: {entry.energyLevel}/10
                          </span>
                          <button 
                            onClick={() => deleteEntry(entry.id)}
                            className="p-1.5 text-purple-300 hover:text-red-400 hover:bg-[#4C1D95] rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {entry.note && (
                        <p className="mt-3 text-sm font-bold text-purple-100 bg-[#4C1D95]/80 p-3 rounded-xl border border-[#7C3AED]">
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
