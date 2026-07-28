import { useState, useEffect } from 'react';
import { Wind, Anchor, Sparkles, X, Play, RotateCcw, ArrowRight } from 'lucide-react';

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<'breathing' | 'grounding' | 'reframing' | null>(null);
  
  // Box breathing state
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Grounding technique state
  const [groundingStep, setGroundingStep] = useState(0);

  useEffect(() => {
    let interval: any;
    if (activeTool === 'breathing' && isBreathingActive) {
      interval = setInterval(() => {
        setBreathTimer((prev) => {
          if (prev > 1) return prev - 1;
          
          setBreathPhase((currentPhase) => {
            if (currentPhase === 'Inhale') return 'Hold';
            if (currentPhase === 'Hold') return 'Exhale';
            if (currentPhase === 'Exhale') return 'Rest';
            return 'Inhale';
          });
          return 4;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTool, isBreathingActive]);

  const groundingSteps = [
    { count: '5', sense: 'Things you can SEE', desc: 'Look around and notice 5 distinct details in your room.' },
    { count: '4', sense: 'Things you can TOUCH', desc: 'Feel the fabric of your clothes, the desk, or your feet on the floor.' },
    { count: '3', sense: 'Things you can HEAR', desc: 'Listen closely for 3 background sounds (ac, traffic, birds).' },
    { count: '2', sense: 'Things you can SMELL', desc: 'Notice 2 scents in the air or your coffee cup.' },
    { count: '1', sense: 'Thing you can TASTE', desc: 'Focus on 1 taste in your mouth right now.' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-black text-white">Wellness Tools</h1>
        <p className="text-purple-200 text-sm md:text-base font-bold mt-1">
          Instant, science-backed grounding techniques whenever you feel overwhelmed.
        </p>
      </div>

      {/* Grid of Interactive Wellness Tools */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Tool 1: Box Breathing */}
        <div 
          onClick={() => { setActiveTool('breathing'); setIsBreathingActive(true); }}
          className="flex flex-col text-left p-8 bg-[#2E0B5E] rounded-[2rem] border-2 border-[#7C3AED] hover:bg-[#3B0C78] hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden shadow-xl cursor-pointer"
        >
          <div className="w-14 h-14 bg-[#4C1D95] rounded-2xl flex items-center justify-center text-[#C8B6FF] mb-6 border border-[#8A2BE2]">
            <Wind size={28} />
          </div>
          <span className="text-xs font-black text-[#1E0542] bg-[#C8B6FF] px-3.5 py-1.5 rounded-full border border-purple-300 shadow-md w-fit mb-3">
            4-4-4-4 Rhythm
          </span>
          <h3 className="text-2xl font-serif font-black text-white mb-3 relative z-10">Box Breathing</h3>
          <p className="text-purple-200 leading-relaxed font-bold text-sm mb-6 flex-1">
            Reset your nervous system with equal 4-second intervals of inhaling, holding, exhaling, and resting.
          </p>
          <button className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#C8B6FF] text-[#1E0542] rounded-2xl font-black text-sm border border-purple-300 group-hover:bg-white transition-colors shadow-md">
            Start Exercise <ArrowRight size={16} />
          </button>
        </div>

        {/* Tool 2: 5-4-3-2-1 Grounding */}
        <div 
          onClick={() => { setActiveTool('grounding'); setGroundingStep(0); }}
          className="flex flex-col text-left p-8 bg-[#2E0B5E] rounded-[2rem] border-2 border-[#7C3AED] hover:bg-[#3B0C78] hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden shadow-xl cursor-pointer"
        >
          <div className="w-14 h-14 bg-[#4C1D95] rounded-2xl flex items-center justify-center text-[#C8B6FF] mb-6 border border-[#8A2BE2]">
            <Anchor size={28} />
          </div>
          <span className="text-xs font-black text-[#1E0542] bg-[#C8B6FF] px-3.5 py-1.5 rounded-full border border-purple-300 shadow-md w-fit mb-3">
            Sensory Reset
          </span>
          <h3 className="text-2xl font-serif font-black text-white mb-3 relative z-10">5-4-3-2-1 Grounding</h3>
          <p className="text-purple-200 leading-relaxed font-bold text-sm mb-6 flex-1">
            Pull your mind back to the present moment by engaging your 5 physical senses sequentially.
          </p>
          <button className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#C8B6FF] text-[#1E0542] rounded-2xl font-black text-sm border border-purple-300 group-hover:bg-white transition-colors shadow-md">
            Start Grounding <ArrowRight size={16} />
          </button>
        </div>

        {/* Tool 3: Perspective Shift */}
        <div 
          onClick={() => setActiveTool('reframing')}
          className="flex flex-col text-left p-8 bg-[#2E0B5E] rounded-[2rem] border-2 border-[#7C3AED] hover:bg-[#3B0C78] hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden shadow-xl cursor-pointer"
        >
          <div className="w-14 h-14 bg-[#4C1D95] rounded-2xl flex items-center justify-center text-[#C8B6FF] mb-6 border border-[#8A2BE2]">
            <Sparkles size={28} />
          </div>
          <span className="text-xs font-black text-[#1E0542] bg-[#C8B6FF] px-3.5 py-1.5 rounded-full border border-purple-300 shadow-md w-fit mb-3">
            Cognitive Reframe
          </span>
          <h3 className="text-2xl font-serif font-black text-white mb-3 relative z-10">Thought Reframing</h3>
          <p className="text-purple-200 leading-relaxed font-bold text-sm mb-6 flex-1">
            Gently re-examine stressful automatic thoughts and transform them into balanced perspectives.
          </p>
          <button className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#C8B6FF] text-[#1E0542] rounded-2xl font-black text-sm border border-purple-300 group-hover:bg-white transition-colors shadow-md">
            Start Reframing <ArrowRight size={16} />
          </button>
        </div>

      </div>

      {/* Interactive Modal Overlay */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#160432]/90 backdrop-blur-md">
          <div className="bg-[#2E0B5E] rounded-3xl p-8 max-w-lg w-full border-2 border-[#7C3AED] shadow-2xl relative">
            <button 
              onClick={() => setActiveTool(null)}
              className="absolute top-4 right-4 p-2 bg-[#160432] text-white rounded-full hover:bg-white hover:text-[#160432] transition-colors border border-[#8A2BE2]"
            >
              <X size={20} />
            </button>

            {/* Box Breathing Modal */}
            {activeTool === 'breathing' && (
              <div className="text-center space-y-6">
                <h3 className="font-serif text-3xl font-black text-white">Box Breathing</h3>
                <div className="relative w-48 h-48 mx-auto flex flex-col items-center justify-center bg-[#3B0C78] rounded-full border-4 border-[#8A2BE2] shadow-inner">
                  <span className="text-2xl font-black text-[#C8B6FF]">{breathPhase}</span>
                  <span className="text-5xl font-black text-white mt-1">{breathTimer}s</span>
                </div>
                <div className="flex justify-center gap-4 pt-4">
                  <button 
                    onClick={() => setIsBreathingActive(!isBreathingActive)}
                    className="px-6 py-3 bg-[#C8B6FF] text-[#1E0542] rounded-full font-black flex items-center gap-2 shadow-md hover:bg-white transition-all cursor-pointer"
                  >
                    {isBreathingActive ? <><X size={18} /> Pause</> : <><Play size={18} /> Resume</>}
                  </button>
                  <button 
                    onClick={() => { setBreathPhase('Inhale'); setBreathTimer(4); }}
                    className="px-6 py-3 bg-[#3B0C78] text-white rounded-full font-black flex items-center gap-2 border border-[#8A2BE2] hover:bg-[#4C1D95] transition-all cursor-pointer"
                  >
                    <RotateCcw size={18} /> Reset
                  </button>
                </div>
              </div>
            )}

            {/* Grounding Modal */}
            {activeTool === 'grounding' && (
              <div className="text-center space-y-6">
                <span className="text-xs font-black bg-[#C8B6FF] text-[#1E0542] px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Step {groundingStep + 1} of 5
                </span>
                <div className="w-20 h-20 bg-[#3B0C78] rounded-full flex items-center justify-center text-4xl font-black text-white mx-auto border-2 border-[#8A2BE2]">
                  {groundingSteps[groundingStep].count}
                </div>
                <h3 className="text-2xl font-serif font-black text-[#C8B6FF]">
                  {groundingSteps[groundingStep].sense}
                </h3>
                <p className="text-purple-100 font-bold text-base max-w-sm mx-auto leading-relaxed">
                  {groundingSteps[groundingStep].desc}
                </p>
                <div className="flex justify-center gap-4 pt-4">
                  {groundingStep > 0 && (
                    <button 
                      onClick={() => setGroundingStep(prev => prev - 1)}
                      className="px-6 py-3 bg-[#3B0C78] text-white rounded-full font-black border border-[#8A2BE2] cursor-pointer"
                    >
                      Back
                    </button>
                  )}
                  {groundingStep < 4 ? (
                    <button 
                      onClick={() => setGroundingStep(prev => prev + 1)}
                      className="px-6 py-3 bg-[#C8B6FF] text-[#1E0542] rounded-full font-black shadow-md hover:bg-white cursor-pointer"
                    >
                      Next Step
                    </button>
                  ) : (
                    <button 
                      onClick={() => setActiveTool(null)}
                      className="px-6 py-3 bg-[#C8B6FF] text-[#1E0542] rounded-full font-black shadow-md hover:bg-white cursor-pointer"
                    >
                      Complete Reset
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Reframing Modal */}
            {activeTool === 'reframing' && (
              <div className="space-y-4 text-left">
                <h3 className="font-serif text-2xl font-black text-white mb-2">Perspective Reframer</h3>
                <p className="text-purple-200 text-sm font-bold leading-relaxed">
                  When feeling overwhelmed, ask yourself these 3 questions:
                </p>
                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-[#3B0C78] rounded-2xl border border-[#8A2BE2]">
                    <p className="font-black text-[#C8B6FF] text-sm mb-1">1. Is this 100% true right now?</p>
                    <p className="text-xs text-purple-100 font-bold">Am I predicting the worst-case scenario without proof?</p>
                  </div>
                  <div className="p-4 bg-[#3B0C78] rounded-2xl border border-[#8A2BE2]">
                    <p className="font-black text-[#C8B6FF] text-sm mb-1">2. What can I actually control?</p>
                    <p className="text-xs text-purple-100 font-bold">Separate what is in your hands from what is outside your control.</p>
                  </div>
                  <div className="p-4 bg-[#3B0C78] rounded-2xl border border-[#8A2BE2]">
                    <p className="font-black text-[#C8B6FF] text-sm mb-1">3. What advice would I give a friend?</p>
                    <p className="text-xs text-purple-100 font-bold">Treat yourself with the same compassion you extend to others.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTool(null)}
                  className="w-full mt-4 py-3 bg-[#C8B6FF] text-[#1E0542] rounded-full font-black shadow-md hover:bg-white cursor-pointer"
                >
                  Finished Reframing
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
