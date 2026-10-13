import { useState } from 'react';
import BreathingTool from '../components/tools/BreathingTool';
import GroundingTool from '../components/tools/GroundingTool';
import MindfulMomentTool from '../components/tools/MindfulMomentTool';
import BreakTool from '../components/tools/BreakTool';
import BurnWorryTool from '../components/tools/BurnWorryTool';
import BubbleWrapTool from '../components/tools/BubbleWrapTool';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '../i18n';
import { useSoundStore } from '../store/soundStore';
import { TextEffect } from '../components/ui/TextEffect';

import burnWorryImg from '../assets/tools/burn-worry.jpg';
import bubbleWrapImg from '../assets/tools/bubble-wrap.jpg';
import soundscapeImg from '../assets/tools/soundscape.jpg';
import boxBreathingImg from '../assets/tools/box-breathing.jpg';
import groundingImg from '../assets/tools/grounding.jpg';
import mindfulMomentImg from '../assets/tools/mindful-moment.jpg';
import takeABreakImg from '../assets/tools/take-a-break.jpg';

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const { t } = useLanguageStore();
  const { toggleMixer } = useSoundStore();

  const MINDFUL_TOOLS = [
    {
      id: 'breathe',
      title: t('tools.breathe_title'),
      description: t('tools.breathe_desc'),
      image: boxBreathingImg,
      duration: '1-5 mins',
      tag: 'Mindfulness'
    },
    {
      id: 'grounding',
      title: t('tools.grounding_title'),
      description: t('tools.grounding_desc'),
      image: groundingImg,
      duration: '3 mins',
      tag: 'Reset'
    },
    {
      id: 'meditation',
      title: t('tools.meditation_title'),
      description: t('tools.meditation_desc'),
      image: mindfulMomentImg,
      duration: '5 mins',
      tag: 'Focus'
    },
    {
      id: 'break',
      title: t('tools.break_title'),
      description: t('tools.break_desc'),
      image: takeABreakImg,
      duration: '10 mins',
      tag: 'Rest'
    }
  ];

  const VENT_LAB_TOOLS = [
    {
      id: 'burn',
      title: 'Burn Your Worry',
      description: 'Write down toxic thoughts, grievances, or heavy burdens and watch them incinerate into ash.',
      image: burnWorryImg,
      duration: '2 mins',
      badge: 'Cathartic'
    },
    {
      id: 'bubble',
      title: 'Tactile Bubble Wrap',
      description: 'Squishy sensory popping board with realistic ASMR audio feedback and haptic tension release.',
      image: bubbleWrapImg,
      duration: 'Instant',
      badge: 'De-Stress'
    },
    {
      id: 'soundscape',
      title: 'Ambient Soundscape Mixer',
      description: 'Layered procedural rain, warm campfire, forest wind, lo-fi chords, and singing bowls you can mix while exploring.',
      image: soundscapeImg,
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
    <div className="p-2 sm:p-4 md:p-8 w-full max-w-5xl mx-auto space-y-8 pb-16 overflow-x-hidden">
      {/* Header */}
      <header className="space-y-2">
        <TextEffect
          as="h1"
          preset="fade"
          per="word"
          className="font-serif text-3xl md:text-4xl font-black text-[#532E60]"
        >
          {t('tools.title')}
        </TextEffect>
        <TextEffect
          as="p"
          preset="slide"
          delay={0.1}
          className="text-[#532E60]/80 font-bold text-sm md:text-base"
        >
          Interactive exercises, cathartic release tools, and sensory relaxation.
        </TextEffect>
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
                      {tool.image ? (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-white/30 shadow-md bg-[#532E60] p-1 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-white/60 transition-all duration-300">
                          <img
                            src={tool.image}
                            alt={tool.title}
                            className="w-full h-full object-contain rounded-xl"
                          />
                        </div>
                      ) : (
                        <div />
                      )}
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
                      {tool.image ? (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/30 shadow-md bg-[#532E60] p-1 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-white/60 transition-all duration-300">
                          <img
                            src={tool.image}
                            alt={tool.title}
                            className="w-full h-full object-contain rounded-xl"
                          />
                        </div>
                      ) : (
                        <div />
                      )}
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
