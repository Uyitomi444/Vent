import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, RotateCcw, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface BurnWorryToolProps {
  onClose: () => void;
}

export default function BurnWorryTool({ onClose }: BurnWorryToolProps) {
  const [worryText, setWorryText] = useState('');
  const [stage, setStage] = useState<'write' | 'destroying' | 'released'>('write');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particles animation for burning embers
  useEffect(() => {
    if (stage !== 'destroying') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ['#ff4500', '#ff8c00', '#ffd700', '#ff6347', '#ffffe0'];

    for (let i = 0; i < 160; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height * 0.7 + Math.random() * (canvas.height * 0.3),
        vx: (Math.random() - 0.5) * 3,
        vy: -(Math.random() * 4 + 2),
        size: Math.random() * 6 + 2,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.008;
        p.size = Math.max(0, p.size - 0.03);

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [stage]);

  const handleDestroy = () => {
    if (!worryText.trim()) return;

    setStage('destroying');
    soundEngine.playBurnSfx();

    setTimeout(() => {
      soundEngine.playZenChime();
      setStage('released');
    }, 2800);
  };

  const handleReset = () => {
    setWorryText('');
    setStage('write');
  };

  return (
    <div className="bg-[#532E60] border-2 border-white/40 rounded-[2.5rem] p-6 md:p-10 shadow-2xl text-white relative overflow-hidden min-h-[520px] flex flex-col justify-between">
      {/* Canvas for Particle Effects */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />

      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-6 relative z-20">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-[#613B6E] text-white rounded-full font-black text-xs hover:bg-[#3D2048] transition-colors border border-white/30 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Tools</span>
        </button>

        <span className="px-3.5 py-1.5 bg-[#613B6E] text-[#E8DCF8] rounded-full text-xs font-black border border-white/20 flex items-center gap-1.5">
          <Flame size={14} className="text-[#C4B4E2]" />
          <span>Incinerator</span>
        </span>
      </div>

      {/* Main Content Areas */}
      <div className="flex-1 flex flex-col justify-center relative z-20">
        <AnimatePresence mode="wait">
          {stage === 'write' && (
            <motion.div
              key="write"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4 max-w-xl mx-auto w-full"
            >
              <div className="text-center space-y-1">
                <h2 className="text-2xl md:text-3xl font-serif font-black text-white">
                  Burn Your Worry Into Ash
                </h2>
                <p className="text-xs sm:text-sm text-[#E8DCF8] font-bold">
                  Write down whatever is weighing on your soul. Once destroyed, it is gone forever.
                </p>
              </div>

              {/* Simulated Paper Note */}
              <div className="bg-[#FAF7EE] text-[#2C243B] p-6 rounded-2xl shadow-2xl border-2 border-[#C4B4E2]/60 rotate-[-0.5deg]">
                <textarea
                  value={worryText}
                  onChange={(e) => setWorryText(e.target.value)}
                  placeholder="I feel anxious about... / I'm angry that... / I release the burden of..."
                  className="w-full h-36 bg-transparent resize-none border-none outline-none font-serif text-lg font-bold placeholder:text-gray-400 leading-relaxed"
                />
              </div>

              <div className="flex justify-center pt-2">
                <button
                  onClick={handleDestroy}
                  disabled={!worryText.trim()}
                  className={`px-8 py-3.5 rounded-full font-black text-sm md:text-base shadow-xl transition-all flex items-center gap-2 border border-white ${
                    worryText.trim()
                      ? 'bg-[#C4B4E2] hover:bg-white text-[#532E60] hover:scale-105 cursor-pointer shadow-[#532E60]/30'
                      : 'bg-white/20 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <Flame size={20} />
                  <span>Ignite & Burn Away</span>
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'destroying' && (
            <motion.div
              key="destroying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 0.9, 0.4, 0],
                  opacity: [1, 1, 0.8, 0.3, 0],
                  rotate: [0, 2, -2, 5, 0],
                  filter: [
                    'brightness(1)',
                    'brightness(1.5) saturate(2)',
                    'brightness(2) contrast(2)',
                    'brightness(0.2)',
                  ],
                }}
                transition={{ duration: 2.6, ease: 'easeInOut' }}
                className="bg-[#FAF7EE] text-[#2C243B] p-6 rounded-2xl shadow-2xl border-4 border-amber-500 w-80 text-left relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 via-amber-500/30 to-transparent" />
                <p className="font-serif font-bold text-sm line-clamp-4 relative z-10">{worryText}</p>
              </motion.div>

              <p className="text-base font-black text-[#E8DCF8] animate-pulse flex items-center gap-2">
                <Sparkles size={18} className="text-[#C4B4E2]" />
                <span>Releasing and letting go...</span>
              </p>
            </motion.div>
          )}

          {stage === 'released' && (
            <motion.div
              key="released"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              className="text-center space-y-4 max-w-md mx-auto"
            >
              <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto text-emerald-300 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 size={40} />
              </div>

              <h3 className="text-3xl font-serif font-black text-white">Breathe. It is Gone.</h3>
              <p className="text-sm font-bold text-[#E8DCF8] leading-relaxed">
                You have released this thought from your mind. It has no hold over you anymore. Give yourself permission to feel lighter.
              </p>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-[#613B6E] hover:bg-[#3D2048] text-white font-black text-xs rounded-full border border-white/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={15} />
                  <span>Release Another</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-xs rounded-full shadow-lg transition-all cursor-pointer border border-white"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
