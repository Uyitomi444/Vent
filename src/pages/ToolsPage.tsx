import { useState } from 'react';
import BreathingTool from '../components/tools/BreathingTool';
import GroundingTool from '../components/tools/GroundingTool';
import MindfulMomentTool from '../components/tools/MindfulMomentTool';
import BreakTool from '../components/tools/BreakTool';
import { motion, AnimatePresence } from 'framer-motion';
import SpriteIcon from '../components/SpriteIcon';
import FourIcons from '../assets/Four_icons.jpeg';

// The Four_icons.jpeg has 4 icons. 
const TOOLS = [
  {
    id: 'breathe',
    title: 'Box Breathing',
    description: 'A simple technique to quickly regulate your nervous system.',
    spriteIndex: 0,
    duration: '1-5 mins'
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    description: 'Engage your senses to bring yourself back to the present moment.',
    spriteIndex: 1,
    duration: '3 mins'
  },
  {
    id: 'meditation',
    title: 'Mindful Moment',
    description: 'Guided reflection to help process complex emotions.',
    spriteIndex: 2,
    duration: '5 mins'
  },
  {
    id: 'break',
    title: 'Take a Break',
    description: 'Disconnect and rest your eyes from the screen.',
    spriteIndex: 3,
    duration: '10 mins'
  }
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

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
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="font-serif text-3xl text-itoura-dark">Wellness Tools</h1>
        <p className="text-gray-500 text-sm md:text-base">Take a moment for yourself. Choose an exercise to help you reset.</p>
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
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          >
            {TOOLS.map((tool) => {
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="flex flex-col text-left p-8 bg-itoura-light/30 rounded-[2rem] border border-itoura-primary/20 hover:bg-itoura-light/50 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-itoura-primary/10 rounded-full blur-2xl group-hover:bg-itoura-primary/20 transition-all"></div>
                  
                  <div className="flex justify-between items-start w-full mb-6 relative z-10">
                    <div className="p-4 bg-white rounded-3xl shadow-sm border border-itoura-primary/10 group-hover:-rotate-3 transition-transform duration-300">
                      <SpriteIcon 
                        imageSrc={FourIcons} 
                        totalIcons={4} 
                        index={tool.spriteIndex} 
                        size={64} 
                      />
                    </div>
                    <span className="text-xs font-bold text-itoura-dark bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-itoura-primary/20 shadow-sm">
                      {tool.duration}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-serif font-medium text-itoura-dark mb-3 relative z-10">{tool.title}</h3>
                  <p className="text-base text-gray-600 mb-8 relative z-10 flex-1">{tool.description}</p>
                  
                  <div className="w-full relative z-10 mt-auto">
                    <span className="inline-flex items-center justify-center w-full py-3.5 bg-itoura-dark text-white rounded-2xl font-medium group-hover:bg-itoura-primary transition-colors">
                      Begin Exercise
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
