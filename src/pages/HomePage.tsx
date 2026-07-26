import ChatInterface from '../components/chat/ChatInterface';
import { LampContainer } from '../components/ui/LampContainer';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto space-y-6">
      {/* Creative Glowing Lamp Header */}
      <LampContainer className="py-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-purple-700 to-purple-950 tracking-tight text-center drop-shadow-sm"
        >
          Itoura
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-purple-950 font-bold text-lg md:text-xl text-center mt-1"
        >
          A place to breathe.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-purple-900/80 font-semibold text-xs md:text-sm text-center max-w-md mt-1"
        >
          Itoura is here whenever you need a secure space to process your emotions.
        </motion.p>
      </LampContainer>

      {/* Main Chat Interface Canvas */}
      <div className="flex-1 min-h-[550px]">
        <ChatInterface />
      </div>
    </div>
  );
}
