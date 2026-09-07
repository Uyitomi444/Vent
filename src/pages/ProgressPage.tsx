import { useState, useMemo } from 'react';
import { useMoodStore } from '../store/moodStore';
import { useMemoryStore } from '../store/memoryStore';
import { useJournalStore } from '../store/journalStore';
import { useLanguageStore } from '../i18n';
import MascotPose from '../components/MascotPose';
import { generateWeeklyWellnessDigest, type WeeklyWellnessDigest } from '../services/ai';
import { Sparkles, Brain, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

const MOOD_SCORES = {
  terrible: 1,
  bad: 2,
  okay: 3,
  good: 4,
  great: 5
};

export default function ProgressPage() {
  const { entries: moodEntries } = useMoodStore();
  const { memories } = useMemoryStore();
  const { entries: journalEntries } = useJournalStore();
  const { t, currentLanguage } = useLanguageStore();

  const [isGeneratingDigest, setIsGeneratingDigest] = useState(false);
  const [digest, setDigest] = useState<WeeklyWellnessDigest | null>(null);
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';

  // 1. Mood Trend over past 7 days
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0,0,0,0);
      days.push(d);
    }
    return days.map(day => {
      const dayEntries = moodEntries.filter(e => {
        const ed = new Date(e.timestamp);
        return ed.getDate() === day.getDate() && ed.getMonth() === day.getMonth() && ed.getFullYear() === day.getFullYear();
      });
      
      let score = 0;
      if (dayEntries.length > 0) {
        score = dayEntries.reduce((acc, curr) => acc + MOOD_SCORES[curr.mood], 0) / dayEntries.length;
      }
      
      const isToday = day.getDate() === new Date().getDate();
      return {
        date: day,
        dayStr: day.toLocaleDateString('en-US', { weekday: 'short' }),
        score,
        isToday,
        hasEntry: dayEntries.length > 0
      };
    });
  }, [moodEntries]);

  const daysCheckedIn = last7Days.filter(d => d.hasEntry).length;

  // 2. Top Themes
  const topThemes = useMemo(() => {
    const themeCounts: Record<string, number> = {};
    memories.forEach(m => {
      m.themes.forEach(t => {
        const normalized = t.toLowerCase().trim();
        themeCounts[normalized] = (themeCounts[normalized] || 0) + 1;
      });
    });
    
    return Object.entries(themeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [memories]);

  const handleGenerateDigest = async () => {
    setIsGeneratingDigest(true);
    try {
      const moodLogs = moodEntries.slice(0, 10).map((m) => ({
        mood: m.mood,
        date: new Date(m.timestamp).toLocaleDateString(),
      }));
      const journalSnippets = journalEntries.slice(0, 5).map((j) => `${j.title}: ${j.content.slice(0, 150)}`);

      const res = await generateWeeklyWellnessDigest(journalSnippets, moodLogs, apiKey, currentLanguage);
      if (res) {
        setDigest(res);
        soundEngine.playZenChime();
      }
    } catch (err) {
      console.error('Digest error:', err);
    } finally {
      setIsGeneratingDigest(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-5xl mx-auto">
      <header className="mb-8 space-y-1">
        <h1 className="font-serif text-3xl md:text-4xl font-black text-[#532E60]">{t('progress.title')}</h1>
        <p className="text-[#532E60]/80 font-bold text-sm md:text-base">{t('progress.subtitle')}</p>
      </header>

      {/* AI Wellness Digest Card */}
      <div className="bg-[#532E60] border-2 border-white/40 rounded-[2.5rem] p-6 md:p-8 shadow-2xl text-white space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#613B6E] rounded-2xl border border-white/30 text-[#C4B4E2]">
              <Brain size={26} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
                Weekly AI Wellness Digest
              </h2>
              <p className="text-xs text-[#E8DCF8]/80 font-bold">
                Synthesized insights from your moods, journals & reflections
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateDigest}
            disabled={isGeneratingDigest}
            className="px-5 py-2.5 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-xs sm:text-sm rounded-full shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles size={16} />
            <span>{isGeneratingDigest ? 'Synthesizing Patterns...' : (digest ? 'Regenerate Digest' : 'Generate AI Digest')}</span>
          </button>
        </div>

        {digest ? (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-4 bg-[#613B6E] rounded-2xl border border-white/20">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">Digest Headline</span>
              <h3 className="text-lg sm:text-xl font-serif font-black text-white mt-1">
                "{digest.headline}"
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#E8DCF8] mt-2 leading-relaxed">
                {digest.emotionalSummary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Recurring Triggers */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert size={14} />
                  Observed Stress Patterns
                </span>
                <ul className="space-y-1.5 pt-1">
                  {digest.topTriggers.map((trig, i) => (
                    <li key={i} className="text-xs font-bold text-[#E8DCF8] flex items-start gap-2">
                      <span className="text-rose-400 mt-0.5">•</span>
                      <span>{trig}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resilience Wins */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Award size={14} />
                  Emotional Growth & Coping
                </span>
                <ul className="space-y-1.5 pt-1">
                  {digest.growthHighlights.map((win, i) => (
                    <li key={i} className="text-xs font-bold text-[#E8DCF8] flex items-start gap-2">
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{win}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mascot Advice */}
            <div className="p-4 bg-purple-950/40 border border-purple-300/30 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold text-white">
              <Sparkles size={20} className="text-[#C4B4E2] shrink-0" />
              <span>Itoura's Focus for Next Week: {digest.wellnessAdvice}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-[#E8DCF8] font-bold text-xs sm:text-sm">
            Click "Generate AI Digest" above to produce your personalized weekly emotional pattern report.
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Mood Trend Chart */}
        <div className="md:col-span-2 bg-[#532E60] rounded-3xl p-6 md:p-8 shadow-xl border-2 border-white/40">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif font-black text-xl text-white">
              {t('progress.trend_title')}
            </h2>
            <div className="bg-[#C4B4E2] text-[#532E60] px-4 py-1.5 rounded-full text-xs font-black shadow-sm border border-white">
              {t('progress.days_count', { count: daysCheckedIn })}
            </div>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {last7Days.map((day, idx) => {
              const height = day.score === 0 ? '12%' : `${(day.score / 5) * 100}%`;
              return (
                <div key={idx} className="flex flex-col items-center gap-3 flex-1">
                  <div className="w-full relative flex justify-center items-end h-32 rounded-t-lg">
                    {/* Background track */}
                    <div className="absolute inset-0 bg-[#613B6E] rounded-t-xl w-8 md:w-12 mx-auto border border-white/20"></div>
                    {/* Actual Bar */}
                    <div 
                      className={`w-8 md:w-12 rounded-t-xl transition-all duration-1000 ${
                        day.isToday ? 'bg-[#C4B4E2] shadow-md border-2 border-white' : (day.score > 0 ? 'bg-[#8E79B6] shadow-sm' : 'bg-transparent')
                      }`}
                      style={{ height }}
                    ></div>
                  </div>
                  <span className={`text-xs font-extrabold ${day.isToday ? 'text-[#C4B4E2] font-black scale-110' : 'text-[#E8DCF8]'}`}>
                    {day.isToday ? 'Today' : day.dayStr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Themes */}
        <div className="bg-[#532E60] rounded-3xl p-6 md:p-8 shadow-xl border-2 border-white/40">
          <h2 className="font-serif font-black text-xl text-white mb-6">
            {t('progress.top_themes')}
          </h2>
          
          {topThemes.length > 0 ? (
            <div className="space-y-5">
              {topThemes.map(([theme, count], idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-extrabold text-white capitalize">{theme}</span>
                    <span className="font-black text-[#532E60] bg-[#C4B4E2] px-2.5 py-0.5 rounded-full border border-white">{count} {count === 1 ? 'time' : 'times'}</span>
                  </div>
                  {/* Frequency Indicator Bar */}
                  <div className="h-3 w-full bg-[#613B6E] rounded-full overflow-hidden border border-white/20">
                    <div 
                      className="h-full bg-[#C4B4E2] rounded-full" 
                      style={{ width: `${Math.min((count / topThemes[0][1]) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#E8DCF8] font-bold text-sm">
              <p>{t('progress.no_themes')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Reflection Card */}
      <div className="bg-[#532E60] rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-6 border-2 border-white/40">
        <div className="shrink-0 bg-[#613B6E] p-4 rounded-2xl border border-white/30 shadow-md">
          <MascotPose pose="sitting" className="w-20 h-20 drop-shadow-md brightness-110" />
        </div>
        
        <div className="flex-1 relative z-10 text-center md:text-left">
          <h2 className="font-serif text-2xl text-white font-black mb-3">{t('progress.weekly_reflection')}</h2>
          <p className="text-[#E8DCF8] leading-relaxed font-bold mb-5 text-[15px]">
            {topThemes.length > 0 
              ? `I've noticed that "${topThemes[0][0]}" has come up recently. Let's take 5 minutes today to decompress in your journal or try the kinetic bubble wrap tool.`
              : `Checking in regularly helps us spot trends over time. Try logging your mood and releasing a thought in the Vent Lab today!`}
          </p>
          <div className="inline-flex items-center gap-2 bg-[#C4B4E2] text-[#532E60] px-4 py-2 rounded-full text-sm font-black shadow-md border border-white">
            {t('progress.next_step')}
          </div>
        </div>
      </div>
    </div>
  );
}
