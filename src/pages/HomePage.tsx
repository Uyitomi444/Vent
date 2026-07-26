import ChatInterface from '../components/chat/ChatInterface';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Big Inverted Header: Light Text on Dark Canvas */}
      <div className="text-center pt-4 pb-8 relative z-10 flex flex-col items-center">
        <motion.h1 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-serif text-6xl md:text-7xl font-black text-[#E5D0FF] tracking-tight mb-2 drop-shadow-md"
        >
          Itoura
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-serif text-2xl md:text-3xl font-bold text-purple-200/90 mb-2"
        >
          A place to breathe.
        </motion.p>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-purple-300/80 font-bold text-sm md:text-base max-w-md mx-auto"
        >
          Itoura is here whenever you need a secure space to process your emotions.
        </motion.p>
      </div>

      {/* Main Chat Interface Canvas */}
      <div className="flex-1 min-h-[560px] -mt-4 relative z-20">
        <ChatInterface />
      </div>
    </div>
  );
}
