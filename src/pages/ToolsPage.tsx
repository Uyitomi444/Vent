import { useState } from 'react';
import BreathingTool from '../components/tools/BreathingTool';
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

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="font-serif text-3xl text-vent-dark">Wellness Tools</h1>
        <p className="text-gray-500 text-sm md:text-base">Take a moment for yourself. Choose an exercise to help you reset.</p>
      </header>

      <AnimatePresence mode="wait">
        {activeTool === 'breathe' ? (
          <motion.div
            key="breathing-tool"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <BreathingTool onClose={() => setActiveTool(null)} />
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
                  className="flex flex-col text-left p-6 bg-white rounded-3xl shadow-sm border border-vent-beige/50 hover:shadow-md hover:border-vent-beige transition-all group"
                >
                  <div className="flex justify-between items-start w-full mb-4">
                    <div className="p-3 bg-vent-beige/30 rounded-2xl group-hover:scale-105 transition-transform">
                      <SpriteIcon 
                        imageSrc={FourIcons} 
                        totalIcons={4} 
                        index={tool.spriteIndex} 
                        size={48} 
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      {tool.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-vent-dark mb-2">{tool.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
