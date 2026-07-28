import { useMemo } from 'react';
import { useMoodStore } from '../store/moodStore';
import { useMemoryStore } from '../store/memoryStore';
import MascotPose from '../components/MascotPose';

const MOOD_SCORES = {
  terrible: 1,
  bad: 2,
  okay: 3,
  good: 4,
  great: 5
};

export default function ProgressPage() {
  const { entries } = useMoodStore();
  const { memories } = useMemoryStore();

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
      const dayEntries = entries.filter(e => {
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
  }, [entries]);

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

  // 3. Weekly Reflection
  const reflection = topThemes.length > 0 
    ? `I've noticed that "${topThemes[0][0]}" has come up a few times recently. It seems like it's been weighing on you. Let's try to take a small step to decompress: spend just 5 minutes today doing a brain dump in your journal without editing yourself.`
    : `It looks like you're just getting started with Itoura. Checking in regularly can help us spot patterns over time. Let's start small: try logging your mood at the end of the day today.`;

  return (
    <div className="space-y-8 animate-fade-in pb-10 max-w-5xl mx-auto">
      <header className="mb-8 space-y-1">
        <h1 className="font-serif text-3xl md:text-4xl font-black text-[#532E60]">Your Progress</h1>
        <p className="text-[#532E60]/80 font-bold text-sm md:text-base">Patterns, reflections, and how you're doing over time.</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Mood Trend Chart */}
        <div className="md:col-span-2 bg-[#532E60] rounded-3xl p-6 md:p-8 shadow-xl border-2 border-white/40">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif font-black text-xl text-white">
              Mood Trend (Past 7 Days)
            </h2>
            <div className="bg-[#C4B4E2] text-[#532E60] px-4 py-1.5 rounded-full text-xs font-black shadow-sm border border-white">
              {daysCheckedIn} of 7 days
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
            Top Themes
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
              <p>No themes recorded yet.</p>
              <p className="mt-1">Have a chat with Itoura to see patterns.</p>
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
          <h2 className="font-serif text-2xl text-white font-black mb-3">Weekly Reflection</h2>
          <p className="text-[#E8DCF8] leading-relaxed font-bold mb-5 text-[15px]">
            {reflection}
          </p>
          <div className="inline-flex items-center gap-2 bg-[#C4B4E2] text-[#532E60] px-4 py-2 rounded-full text-sm font-black shadow-md border border-white">
            Suggested Next Step
          </div>
        </div>
      </div>

    </div>
  );
}
