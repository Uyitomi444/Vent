import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useMoodStore, type MoodType } from '../store/moodStore';
import { useMemoryStore } from '../store/memoryStore';
import { useJournalStore } from '../store/journalStore';
import { useLanguageStore } from '../i18n';
import SpriteIcon from '../components/SpriteIcon';
import FiveIcons from '../assets/Five_icons.jpeg';

export default function MoodPage() {
  const { entries, addEntry, deleteEntry } = useMoodStore();
  const { memories } = useMemoryStore();
  const { entries: journalEntries } = useJournalStore();
  const { t } = useLanguageStore();

  const MOODS: { type: MoodType; spriteIndex: number; label: string }[] = [
    { type: 'terrible', spriteIndex: 0, label: t('mood.terrible') },
    { type: 'bad', spriteIndex: 1, label: t('mood.bad') },
    { type: 'okay', spriteIndex: 2, label: t('mood.okay') },
    { type: 'good', spriteIndex: 3, label: t('mood.good') },
    { type: 'great', spriteIndex: 4, label: t('mood.great') },
  ];
  
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
        <h1 className="font-serif text-3xl md:text-4xl font-black text-[#532E60]">{t('mood.title')}</h1>
        <p className="text-[#532E60]/80 font-bold text-sm md:text-base">{t('mood.subtitle')}</p>
      </header>
      
      {/* Insights & Patterns */}
      {topThemes.length > 0 && (
        <section className="bg-[#532E60] text-white rounded-3xl p-6 shadow-xl border-2 border-white/40">
          <h2 className="font-serif text-xl font-black text-white mb-2">{t('mood.patterns')}</h2>
          <p className="text-sm font-bold text-[#E8DCF8] mb-4">Based on your recent chats and journal entries, these themes have been on your mind:</p>
          <div className="flex flex-wrap gap-3">
            {topThemes.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#C4B4E2] text-[#532E60] px-4 py-2 rounded-full shadow-md text-sm font-black border border-white">
                <span className="capitalize">{item.theme}</span>
                <span className="text-xs font-black text-white bg-[#532E60] px-2 py-0.5 rounded-full">{item.count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Check-in Form */}
      <section className="bg-[#532E60] text-white rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-white/40 space-y-8">
        {/* Mood Selection */}
        <div className="space-y-4">
          <label className="block text-base font-black text-white">{t('mood.how_feeling')}</label>
          <div className="grid grid-cols-5 gap-2 md:gap-4">
            {MOODS.map(({ type, spriteIndex, label }) => {
              const isSelected = selectedMood === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedMood(type)}
                  className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-3xl transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'bg-[#C4B4E2] text-[#532E60] border-2 border-white scale-105 shadow-xl' 
                      : 'bg-[#613B6E] border border-white/30 hover:bg-[#6D427C] text-[#E8DCF8]'
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
                  <span className={`text-xs md:text-sm font-extrabold mt-2 ${isSelected ? 'text-[#532E60]' : 'text-[#E8DCF8]'}`}>
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
            <label className="block text-base font-black text-white">{t('mood.energy_level')}</label>
            <span className="text-sm font-black text-[#532E60] bg-[#C4B4E2] px-4 py-1.5 rounded-full border border-white shadow-sm">{energy}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full h-3 bg-[#613B6E] rounded-lg appearance-none cursor-pointer accent-[#C4B4E2]"
          />
          <div className="flex justify-between text-xs font-black text-[#E8DCF8]">
            <span>{t('mood.exhausted')}</span>
            <span>{t('mood.energized')}</span>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-4">
          <label className="block text-base font-black text-white">{t('mood.note_label')}</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('mood.note_placeholder')}
            className="w-full p-4 bg-[#C4B4E2] border-2 border-white rounded-2xl resize-none outline-none focus:border-white transition-colors h-24 text-base font-bold text-[#532E60] placeholder:text-[#532E60]/60"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSave}
          disabled={!selectedMood}
          className="w-full py-4 rounded-2xl bg-[#C4B4E2] text-[#532E60] font-black text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-all shadow-xl cursor-pointer border border-white"
        >
          {t('mood.save_btn')}
        </button>
      </section>

      {/* History */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl md:text-3xl font-black text-[#532E60]">{t('mood.history')}</h2>
        
        <div className="space-y-4">
          <AnimatePresence>
            {entries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center p-8 bg-[#532E60] text-white rounded-3xl border-2 border-white/40 shadow-lg"
              >
                <p className="text-[#E8DCF8] font-bold text-base">{t('mood.no_history')}</p>
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
                    className="flex items-start gap-4 p-5 bg-[#532E60] text-white rounded-3xl shadow-xl border-2 border-white/40"
                  >
                    <div className="bg-[#613B6E] rounded-2xl p-1 shadow-inner border border-white/20">
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
                          <h3 className="font-black text-white text-lg capitalize">{entry.mood}</h3>
                          <span className="text-xs font-bold text-[#E8DCF8]">
                            {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black bg-[#C4B4E2] text-[#532E60] px-3 py-1 rounded-full border border-white">
                            Energy: {entry.energyLevel}/10
                          </span>
                          <button 
                            onClick={() => deleteEntry(entry.id)}
                            className="p-1.5 text-[#E8DCF8] hover:text-red-300 hover:bg-red-950 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      {entry.note && (
                        <p className="mt-3 text-sm font-bold text-white bg-[#613B6E] p-3 rounded-xl border border-white/20">
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
