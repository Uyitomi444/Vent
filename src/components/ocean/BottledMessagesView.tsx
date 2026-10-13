import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOceanStore, type BottledMessage } from '../../store/oceanStore';
import { Send, Waves, Check, RefreshCw } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import purpleOceanBottle from '../../assets/ABLE/purple-ocean-bottle.jpg';

export default function BottledMessagesView() {
  const { myCastBottles, communityBottles, castBottle, reactToBottle, fishBottle } = useOceanStore();

  const [activeTab, setActiveTab] = useState<'shore' | 'cast' | 'myBottles'>('shore');
  const [currentFishedBottle, setCurrentFishedBottle] = useState<BottledMessage | null>(null);
  const [isFishing, setIsFishing] = useState(false);

  // Cast form state
  const [draftContent, setDraftContent] = useState('');
  const [castSuccess, setCastSuccess] = useState(false);

  const handleFish = () => {
    setIsFishing(true);
    setCurrentFishedBottle(null);

    setTimeout(() => {
      const bottle = fishBottle();
      setCurrentFishedBottle(bottle);
      setIsFishing(false);
      soundEngine.playZenChime();
    }, 1200);
  };

  const handleCast = () => {
    if (!draftContent.trim()) return;
    castBottle(draftContent.trim());
    setCastSuccess(true);
    soundEngine.playZenChime();

    setTimeout(() => {
      setDraftContent('');
      setCastSuccess(false);
      setActiveTab('shore');
    }, 1800);
  };

  return (
    <div className="w-full flex-1 flex flex-col space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-black text-[#532E60] mb-1 flex items-center gap-2">
            <span>Ocean of Bottled Letters</span>
          </h1>
          <p className="text-[#532E60]/80 font-bold text-sm">
            Cast an anonymous letter into the tide, or reel in comforting words from another soul.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-[#532E60] p-1.5 rounded-full border border-white/40 shadow-md self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('shore')}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === 'shore' ? 'bg-[#C4B4E2] text-[#532E60] shadow-sm' : 'text-white hover:text-[#E8DCF8]'
            }`}
          >
            Shore & Fishing
          </button>
          <button
            onClick={() => setActiveTab('cast')}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === 'cast' ? 'bg-[#C4B4E2] text-[#532E60] shadow-sm' : 'text-white hover:text-[#E8DCF8]'
            }`}
          >
            Cast a Bottle
          </button>
          <button
            onClick={() => setActiveTab('myBottles')}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeTab === 'myBottles' ? 'bg-[#C4B4E2] text-[#532E60] shadow-sm' : 'text-white hover:text-[#E8DCF8]'
            }`}
          >
            My Bottles ({myCastBottles.length})
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full">
        {activeTab === 'shore' && (
          <div className="w-full min-h-[540px] bg-[#532E60] rounded-[2.5rem] border-2 border-white/40 p-5 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between text-white text-center gap-6">
            {/* Ambient Water Horizon Glow */}
            <div className="absolute top-1/3 left-0 right-0 h-40 bg-[#C4B4E2]/15 blur-3xl pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#3D2048]/80 to-transparent pointer-events-none" />

            {/* Ocean Starry Night Banner */}
            <div className="relative z-10 space-y-2">
              <span className="px-3.5 py-1 bg-white/10 rounded-full text-[11px] font-black uppercase tracking-wider text-[#E8DCF8] border border-white/20">
                Calm Horizon
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">
                The Whispering Tide
              </h2>
              <p className="text-xs sm:text-sm text-[#E8DCF8] font-bold max-w-md mx-auto">
                Dozens of anonymous heartfelt notes are floating across the digital sea.
              </p>
            </div>

            {/* Reel in / Fish Bottle Section */}
            <div className="relative z-10 my-4 flex flex-col items-center w-full">
              <AnimatePresence mode="wait">
                {currentFishedBottle ? (
                  <motion.div
                    key={currentFishedBottle.id}
                    initial={{ scale: 0.85, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    className="w-full max-w-lg bg-[#FAF7EE] text-[#2C243B] p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-[#C4B4E2]/80 text-left space-y-4 relative"
                  >
                    <div className="flex items-center justify-between border-b border-purple-900/10 pb-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={purpleOceanBottle} 
                          alt="Bottle" 
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#C4B4E2] shadow-sm shrink-0" 
                        />
                        <div>
                          <div className="text-xs font-black text-[#532E60]">
                            Bottle from a {currentFishedBottle.senderTag}
                          </div>
                          <div className="text-[10px] text-gray-500 font-bold">
                            {new Date(currentFishedBottle.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#C4B4E2]/40 text-[#532E60] border border-[#C4B4E2] flex items-center gap-1">
                        <span>Drifting Letter</span>
                      </span>
                    </div>

                    <p className="font-serif text-base sm:text-lg font-bold text-gray-800 leading-relaxed italic max-h-64 overflow-y-auto pr-1">
                      "{currentFishedBottle.content}"
                    </p>

                    {/* Empathy Reaction Stickers */}
                    <div className="pt-2 border-t border-purple-900/10 space-y-2">
                      <span className="text-[10px] uppercase font-black tracking-wider text-gray-500">
                        Send Anonymous Support:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { key: 'hug', label: 'Warm Hug', icon: '🤗' },
                          { key: 'tea', label: 'Hot Tea', icon: '☕' },
                          { key: 'candle', label: 'Candle Light', icon: '🕯️' },
                          { key: 'star', label: 'Hope Star', icon: '⭐' },
                        ].map((rx) => {
                          const hasReacted = currentFishedBottle.userReacted?.includes(rx.key as any);
                          const count = (currentFishedBottle.reactions as any)[rx.key] || 0;
                          return (
                            <button
                              key={rx.key}
                              onClick={() => {
                                reactToBottle(currentFishedBottle.id, rx.key as any);
                                soundEngine.playBubblePop(1.2);
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border ${
                                hasReacted
                                  ? 'bg-[#532E60] text-white border-[#532E60] shadow-md scale-105'
                                  : 'bg-[#C4B4E2]/30 hover:bg-[#C4B4E2] text-[#532E60] border-[#C4B4E2]/80'
                              }`}
                            >
                              <span>{rx.icon}</span>
                              <span>{rx.label}</span>
                              <span className="font-mono text-[10px] bg-black/10 px-1.5 rounded-full">
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Close / Fish Next */}
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={handleFish}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-[#C4B4E2] hover:bg-white text-[#532E60] rounded-full text-xs font-black shadow-md cursor-pointer transition-all border border-white"
                      >
                        <RefreshCw size={13} />
                        <span>Fish Another Bottle</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    {/* Animated Floating Bottle with Purple Ocean */}
                    <motion.div
                      animate={{
                        y: [-8, 8, -8],
                        rotate: [-3, 3, -3],
                      }}
                      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-white/40 shadow-2xl bg-[#613B6E]/60 backdrop-blur-sm group"
                    >
                      <img 
                        src={purpleOceanBottle} 
                        alt="Message in a bottle floating at sea" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#532E60]/85 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2.5 inset-x-0 text-center">
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#E8DCF8] bg-[#532E60]/85 px-3 py-1 rounded-full border border-white/30 backdrop-blur-md">
                          Drifting Letter
                        </span>
                      </div>
                    </motion.div>

                    <button
                      onClick={handleFish}
                      disabled={isFishing}
                      className="px-8 py-3.5 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-sm rounded-full shadow-xl hover:scale-105 transition-all cursor-pointer border border-white flex items-center gap-2"
                    >
                      <Waves size={18} />
                      <span>{isFishing ? 'Reeling from the sea...' : 'Fish Out a Bottle'}</span>
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative z-10 text-[11px] font-bold text-white/50">
              Total letters drifting in current waters: {communityBottles.length}
            </div>
          </div>
        )}

        {activeTab === 'cast' && (
          <div className="bg-[#532E60] border-2 border-white/40 rounded-[2.5rem] p-6 md:p-10 shadow-2xl text-white space-y-6 max-w-2xl mx-auto">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl md:text-3xl font-serif font-black text-white">
                Cast a Message into the Ocean
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#E8DCF8]">
                Write an anonymous message of hope, gratitude, or a tender reflection for a stranger to find.
              </p>
            </div>

            {/* Letter Paper Text Area */}
            <div className="bg-[#FAF7EE] text-[#2C243B] p-6 rounded-2xl shadow-xl border-2 border-[#C4B4E2]/80">
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder="Dear stranger, I just wanted to tell you..."
                className="w-full h-36 bg-transparent resize-none border-none outline-none font-serif text-base sm:text-lg font-bold placeholder:text-gray-400 leading-relaxed"
              />
            </div>

            {castSuccess && (
              <div className="p-3.5 bg-[#613B6E] border-2 border-white/40 rounded-2xl text-[#E8DCF8] text-xs sm:text-sm font-black flex items-center justify-center gap-2 animate-in fade-in shadow-md">
                <Check size={18} className="text-[#C4B4E2]" />
                <span>Your bottle has sailed into the ocean tide!</span>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleCast}
                disabled={!draftContent.trim() || castSuccess}
                className={`px-8 py-3.5 rounded-full font-black text-sm shadow-xl transition-all flex items-center gap-2 border border-white ${
                  draftContent.trim() && !castSuccess
                    ? 'bg-[#C4B4E2] hover:bg-white text-[#532E60] cursor-pointer hover:scale-105'
                    : 'bg-white/20 text-white/40 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
                <span>Cork Bottle & Throw into Ocean</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'myBottles' && (
          <div className="space-y-4">
            {myCastBottles.length === 0 ? (
              <div className="text-center py-16 bg-[#532E60] border-2 border-white/40 rounded-[2.5rem] p-8 text-white space-y-3">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg mb-2">
                  <img src={purpleOceanBottle} alt="Bottle" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-serif font-black">No bottles cast yet</h3>
                <p className="text-xs sm:text-sm text-[#E8DCF8] font-bold max-w-md mx-auto">
                  Write your first anonymous letter in the "Cast a Bottle" tab and watch it float into the community sea.
                </p>
                <button
                  onClick={() => setActiveTab('cast')}
                  className="px-6 py-2.5 bg-[#C4B4E2] text-[#532E60] rounded-full font-black text-xs hover:bg-white cursor-pointer transition-all shadow-md"
                >
                  Cast Your First Bottle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myCastBottles.map((bottle) => (
                  <div
                    key={bottle.id}
                    className="bg-[#532E60] border-2 border-white/40 p-6 rounded-3xl shadow-xl text-white space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white/90 flex items-center gap-2">
                        <img src={purpleOceanBottle} alt="Bottle" className="w-6 h-6 rounded-full object-cover border border-white/40 shrink-0" />
                        <span>Cast by you</span>
                      </span>
                      <span className="text-[10px] text-[#E8DCF8] font-bold">
                        {new Date(bottle.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="font-serif text-sm font-bold text-white italic leading-relaxed line-clamp-3">
                      "{bottle.content}"
                    </p>

                    <div className="pt-2 border-t border-white/20 flex items-center gap-3 text-xs font-bold text-[#E8DCF8]">
                      <span>Reactions:</span>
                      <span title="Hugs">🤗 {bottle.reactions.hug}</span>
                      <span title="Tea">☕ {bottle.reactions.tea}</span>
                      <span title="Candles">🕯️ {bottle.reactions.candle}</span>
                      <span title="Stars">⭐ {bottle.reactions.star}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
