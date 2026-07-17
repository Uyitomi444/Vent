import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, TrendingUp, Sparkles } from 'lucide-react';
import { useMoodStore, type MoodType } from '../store/moodStore';
import { useMemoryStore } from '../store/memoryStore';
import { useJournalStore } from '../store/journalStore';
import SpriteIcon from '../components/SpriteIcon';
import FiveIcons from '../assets/Five_icons.jpeg';

// The Five_icons.jpeg has 5 icons in order (left to right):
// 0: Rain Cloud (Terrible)
// 1: Frown (Bad)
// 2: Neutral (Okay)
// 3: Smile (Good)
// 4: Sun (Great)
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="font-serif text-3xl text-itoura-dark">Mood Check-in</h1>
        <p className="text-gray-500 text-sm md:text-base">Take a moment to reflect on how you're feeling right now.</p>
      </header>
      
      {/* Insights & Patterns */}
      {topThemes.length > 0 && (
        <section className="bg-gradient-to-br from-itoura-primary/10 to-itoura-accent/5 rounded-3xl p-6 shadow-sm border border-itoura-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-itoura-primary" />
            <h2 className="font-serif text-xl text-itoura-dark">Recent Patterns</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Based on your recent chats and journal entries, these themes have been on your mind:</p>
          <div className="flex flex-wrap gap-3">
            {topThemes.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm text-sm border border-itoura-beige/50">
                <Sparkles size={14} className="text-itoura-accent" />
                <span className="font-medium text-itoura-dark capitalize">{item.theme}</span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Check-in Form */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-itoura-beige/50 space-y-8">
        {/* Mood Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-itoura-dark">How are you feeling?</label>
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {MOODS.map(({ type, spriteIndex, label }) => {
              const isSelected = selectedMood === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedMood(type)}
                  className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-3xl transition-all duration-300 ${
                    isSelected 
                      ? 'bg-itoura-beige/50 border-2 border-itoura-primary/20 scale-105 shadow-sm' 
                      : 'bg-transparent border-2 border-transparent opacity-60 hover:opacity-100 hover:bg-gray-50/50'
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
                  {/* Optional label if the user wants text, otherwise we can keep it subtle */}
                  <span className={`text-xs md:text-sm font-medium mt-2 transition-colors ${isSelected ? 'text-itoura-dark' : 'text-gray-400'}`}>
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
            <label className="block text-sm font-medium text-itoura-dark">Energy Level</label>
            <span className="text-sm font-medium text-itoura-primary bg-itoura-beige px-3 py-1 rounded-full">{energy}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-itoura-primary"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Exhausted</span>
            <span>Energized</span>
          </div>
        </div>

        {/* Optional Note */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-itoura-dark">Add a note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's making you feel this way?"
            className="w-full p-4 bg-gray-50 border-none rounded-2xl resize-none focus:ring-2 focus:ring-itoura-primary focus:bg-white transition-colors h-24 text-sm"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSave}
          disabled={!selectedMood}
          className="w-full py-4 rounded-2xl bg-itoura-dark text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-itoura-primary transition-colors"
        >
          Save Check-in
        </button>
      </section>

      {/* History */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-itoura-dark">Recent History</h2>
        
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
                
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100"
                  >
                    <div className="bg-itoura-beige/30 rounded-2xl p-1">
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
                          <h3 className="font-medium text-itoura-dark capitalize">{entry.mood}</h3>
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
