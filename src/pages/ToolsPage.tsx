import { useState } from 'react';
import BreathingTool from '../components/tools/BreathingTool';
import GroundingTool from '../components/tools/GroundingTool';
import MindfulMomentTool from '../components/tools/MindfulMomentTool';
import BreakTool from '../components/tools/BreakTool';
import { motion, AnimatePresence } from 'framer-motion';
import SpriteIcon from '../components/SpriteIcon';
import FourIcons from '../assets/Four_icons.jpeg';
import { useLanguageStore } from '../i18n';

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const { t } = useLanguageStore();

  const TOOLS = [
    {
      id: 'breathe',
      title: t('tools.breathe_title'),
      description: t('tools.breathe_desc'),
      spriteIndex: 0,
      duration: '1-5 mins'
    },
    {
      id: 'grounding',
      title: t('tools.grounding_title'),
      description: t('tools.grounding_desc'),
      spriteIndex: 1,
      duration: '3 mins'
    },
    {
      id: 'meditation',
      title: t('tools.meditation_title'),
      description: t('tools.meditation_desc'),
      spriteIndex: 2,
      duration: '5 mins'
    },
    {
      id: 'break',
      title: t('tools.break_title'),
      description: t('tools.break_desc'),
      spriteIndex: 3,
      duration: '10 mins'
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
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-black text-[#532E60]">{t('tools.title')}</h1>
        <p className="text-[#532E60]/80 font-bold text-sm md:text-base">
          {t('tools.subtitle')}
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
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {TOOLS.map((tool) => {
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="flex flex-col text-left p-8 bg-[#532E60] rounded-[2rem] border-2 border-white/40 hover:bg-[#613B6E] hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group relative overflow-hidden shadow-xl cursor-pointer"
                >
                  <div className="flex justify-between items-start w-full mb-6 relative z-10">
                    <div className="p-3.5 bg-[#613B6E] rounded-3xl shadow-inner border border-white/30 group-hover:-rotate-3 transition-transform duration-300">
                      <SpriteIcon 
                        imageSrc={FourIcons} 
                        totalIcons={4} 
                        index={tool.spriteIndex} 
                        size={64} 
                      />
                    </div>
                    <span className="text-xs font-black text-[#532E60] bg-[#C4B4E2] px-3.5 py-1.5 rounded-full border border-white shadow-md">
                      {tool.duration}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-serif font-black text-white mb-3 relative z-10">{tool.title}</h3>
                  <p className="text-base font-bold text-[#E8DCF8] mb-8 relative z-10 flex-1 leading-relaxed">{tool.description}</p>
                  
                  <div className="w-full relative z-10 mt-auto">
                    <span className="inline-flex items-center justify-center w-full py-4 bg-[#C4B4E2] text-[#532E60] rounded-2xl font-black text-base border border-white group-hover:bg-white transition-colors shadow-md">
                      {t('tools.begin')}
                    </span>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
