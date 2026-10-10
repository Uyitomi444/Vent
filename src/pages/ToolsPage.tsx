import { useState } from 'react';
import BreathingTool from '../components/tools/BreathingTool';
import GroundingTool from '../components/tools/GroundingTool';
import MindfulMomentTool from '../components/tools/MindfulMomentTool';
import BreakTool from '../components/tools/BreakTool';
import BurnWorryTool from '../components/tools/BurnWorryTool';
import BubbleWrapTool from '../components/tools/BubbleWrapTool';
import { motion, AnimatePresence } from 'framer-motion';
import SpriteIcon from '../components/SpriteIcon';
import FourIcons from '../assets/Four_icons.jpeg';
import { useLanguageStore } from '../i18n';
import { useSoundStore } from '../store/soundStore';
import { Flame, CircleDot, Music } from 'lucide-react';

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const { t } = useLanguageStore();
  const { toggleMixer } = useSoundStore();

  const MINDFUL_TOOLS = [
    {
      id: 'breathe',
      title: t('tools.breathe_title'),
      description: t('tools.breathe_desc'),
      spriteIndex: 0,
      duration: '1-5 mins',
      tag: 'Mindfulness'
    },
    {
      id: 'grounding',
      title: t('tools.grounding_title'),
      description: t('tools.grounding_desc'),
      spriteIndex: 1,
      duration: '3 mins',
      tag: 'Reset'
    },
    {
      id: 'meditation',
      title: t('tools.meditation_title'),
      description: t('tools.meditation_desc'),
      spriteIndex: 2,
      duration: '5 mins',
      tag: 'Focus'
    },
    {
      id: 'break',
      title: t('tools.break_title'),
      description: t('tools.break_desc'),
      spriteIndex: 3,
      duration: '10 mins',
      tag: 'Rest'
    }
  ];

  const VENT_LAB_TOOLS = [
    {
      id: 'burn',
      title: '🔥 Burn Your Worry',
      description: 'Write down toxic thoughts, grievances, or heavy burdens and watch them incinerate into ash.',
      icon: <Flame size={32} className="text-amber-400" />,
      duration: '2 mins',
      badge: 'Cathartic'
    },
    {
      id: 'bubble',
      title: '🫧 Tactile Bubble Wrap',
      description: 'Squishy sensory popping board with realistic ASMR audio feedback and haptic tension release.',
      icon: <CircleDot size={32} className="text-[#C4B4E2]" />,
      duration: 'Instant',
      badge: 'De-Stress'
    },
    {
      id: 'soundscape',
      title: '🌧️ Ambient Soundscape Mixer',
      description: 'Layered procedural rain, warm campfire, forest wind, lo-fi chords, and singing bowls you can mix while exploring.',
      icon: <Music size={32} className="text-emerald-300" />,
      duration: 'Ongoing',
      badge: 'Audio Lab',
      onClick: () => toggleMixer()
    }
  ];

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'breathe':
        return <BreathingTool onClose={() => setActiveTool(null)} />;
      case 'grounding':
        return <GroundingTool onClose={() => setActiveTool(null)} />;
      case 'meditation':
        return <MindfulMomentTool onClose={() => setActiveTool(null)} />;
      case 'break':
        return <BreakTool onClose={() => setActiveTool(null)} />;
      case 'burn':
        return <BurnWorryTool onClose={() => setActiveTool(null)} />;
      case 'bubble':
        return <BubbleWrapTool onClose={() => setActiveTool(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-black text-[#532E60]">{t('tools.title')}</h1>
        <p className="text-[#532E60]/80 font-bold text-sm md:text-base">
          Interactive exercises, cathartic release tools, and sensory relaxation.
        </p>
      </header>

      <AnimatePresence mode="wait">
        {activeTool ? (
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderActiveTool()}
          </motion.div>
        ) : (
          <motion.div
            key="tools-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* The Vent Lab Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#532E60] text-white rounded-full text-xs font-black uppercase tracking-wider">
                  The Vent Lab
                </span>
                <span className="text-xs font-bold text-[#532E60]/70">Interactive Catharsis & Stress Release</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {VENT_LAB_TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      if (tool.onClick) {
                        tool.onClick();
                      } else {
                        setActiveTool(tool.id);
                      }
                    }}
                    className="flex flex-col text-left p-6 bg-[#532E60] rounded-[2rem] border-2 border-white/40 hover:bg-[#613B6E] hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden shadow-xl cursor-pointer"
                  >
                    <div className="flex justify-between items-start w-full mb-4 relative z-10">
                      <div className="p-3 bg-[#613B6E] rounded-2xl shadow-inner border border-white/30 group-hover:-rotate-3 transition-transform duration-300">
                        {tool.icon}
                      </div>
                      <span className="text-[11px] font-black text-[#532E60] bg-[#C4B4E2] px-3 py-1 rounded-full border border-white shadow-md">
                        {tool.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-black text-white mb-2 relative z-10">{tool.title}</h3>
                    <p className="text-xs sm:text-sm font-bold text-[#E8DCF8] mb-6 relative z-10 flex-1 leading-relaxed">
                      {tool.description}
                    </p>

                    <div className="w-full relative z-10 mt-auto">
                      <span className="inline-flex items-center justify-center w-full py-3 bg-[#C4B4E2] text-[#532E60] rounded-xl font-black text-sm border border-white group-hover:bg-white transition-colors shadow-md">
                        {tool.id === 'soundscape' ? 'Open Mixer' : 'Launch Tool'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Guided Mindfulness Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#613B6E] text-white rounded-full text-xs font-black uppercase tracking-wider">
                  Mindfulness & Calming
                </span>
                <span className="text-xs font-bold text-[#532E60]/70">Guided breathing, grounding & resets</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MINDFUL_TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className="flex flex-col text-left p-6 sm:p-8 bg-[#532E60] rounded-[2rem] border-2 border-white/40 hover:bg-[#613B6E] hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden shadow-xl cursor-pointer"
                  >
                    <div className="flex justify-between items-start w-full mb-6 relative z-10">
                      <div className="p-3.5 bg-[#613B6E] rounded-3xl shadow-inner border border-white/30 group-hover:-rotate-3 transition-transform duration-300">
                        <SpriteIcon 
                          imageSrc={FourIcons} 
                          totalIcons={4} 
                          index={tool.spriteIndex} 
                          size={56} 
                        />
                      </div>
                      <span className="text-xs font-black text-[#532E60] bg-[#C4B4E2] px-3.5 py-1.5 rounded-full border border-white shadow-md">
                        {tool.duration}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-serif font-black text-white mb-3 relative z-10">{tool.title}</h3>
                    <p className="text-sm sm:text-base font-bold text-[#E8DCF8] mb-6 relative z-10 flex-1 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <div className="w-full relative z-10 mt-auto">
                      <span className="inline-flex items-center justify-center w-full py-3.5 bg-[#C4B4E2] text-[#532E60] rounded-2xl font-black text-sm sm:text-base border border-white group-hover:bg-white transition-colors shadow-md">
                        {t('tools.begin')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
