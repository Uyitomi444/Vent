import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sliders, X, Music } from 'lucide-react';
import { useSoundStore } from '../../store/soundStore';

export default function AmbientSoundMixer() {
  const {
    isMixerOpen,
    isPlayingAll,
    masterVolume,
    tracks,
    toggleMixer,
    setMasterVolume,
    setTrackVolume,
    toggleTrack,
    applyPreset,
    stopAll,
  } = useSoundStore();

  const activeTrackCount = tracks.filter((t) => t.isPlaying).length;

  return (
    <>
      {/* Floating Ambient Toggle Dock Button (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={toggleMixer}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl border-2 transition-all cursor-pointer backdrop-blur-md ${
            isPlayingAll && activeTrackCount > 0
              ? 'bg-[#532E60] border-emerald-400 text-white shadow-emerald-500/20'
              : 'bg-[#532E60]/90 border-white/40 text-white hover:bg-[#532E60]'
          }`}
          title="Ambient Soundscape Mixer"
        >
          {isPlayingAll && activeTrackCount > 0 ? (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-4 bg-emerald-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" />
            </div>
          ) : (
            <Music size={18} className="text-[#C4B4E2]" />
          )}
          <span className="text-xs font-black hidden sm:inline">
            {activeTrackCount > 0 ? `${activeTrackCount} Sounds Active` : 'Soundscapes'}
          </span>
        </button>
      </div>

      {/* Slide-Over Mixer Drawer */}
      <AnimatePresence>
        {isMixerOpen && (
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) toggleMixer();
            }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full bg-[#532E60] border-l-2 border-white/40 shadow-2xl flex flex-col text-white z-10"
            >
              {/* Pinned Permanent Header - Never scrolls away */}
              <div className="flex items-center justify-between p-5 sm:p-6 bg-[#532E60] border-b border-white/20 shrink-0 z-20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#613B6E] rounded-2xl border border-white/30 text-[#C4B4E2]">
                    <Sliders size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif font-black text-white leading-tight">Soundscape Mixer</h2>
                    <p className="text-xs text-[#E8DCF8]/80 font-bold">Procedural background audio</p>
                  </div>
                </div>
                <button
                  onClick={toggleMixer}
                  className="p-2.5 bg-[#613B6E] hover:bg-white text-[#E8DCF8] hover:text-[#532E60] rounded-full border border-white/30 transition-all cursor-pointer shadow-md"
                  aria-label="Close Soundscape Mixer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 min-h-0">
                {/* Master Volume Bar */}
                <div className="bg-[#613B6E] p-4 rounded-2xl border border-white/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-[#E8DCF8] flex items-center gap-2">
                      {masterVolume > 0 ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      Master Volume
                    </span>
                    <span className="text-xs font-black text-white">{Math.round(masterVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={masterVolume}
                    onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                    className="w-full accent-[#C4B4E2] cursor-pointer"
                  />
                </div>

                {/* Soothing Presets */}
                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#E8DCF8] flex items-center gap-1.5">
                    <Sliders size={14} className="text-amber-300" />
                    Instant Presets
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => applyPreset('rainyCabin')}
                      className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-left transition-all cursor-pointer group"
                    >
                      <div className="text-lg mb-1">🌧️ 🔥</div>
                      <div className="text-xs font-black text-white group-hover:text-[#C4B4E2]">Rainy Cabin</div>
                      <div className="text-[10px] text-[#E8DCF8]/70">Rain + Hearth</div>
                    </button>

                    <button
                      onClick={() => applyPreset('zenMonastery')}
                      className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-left transition-all cursor-pointer group"
                    >
                      <div className="text-lg mb-1">🔔 🍃</div>
                      <div className="text-xs font-black text-white group-hover:text-[#C4B4E2]">Zen Monastery</div>
                      <div className="text-[10px] text-[#E8DCF8]/70">Singing Bowls + Wind</div>
                    </button>

                    <button
                      onClick={() => applyPreset('deepFocus')}
                      className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-left transition-all cursor-pointer group"
                    >
                      <div className="text-lg mb-1">🌊 🌧️</div>
                      <div className="text-xs font-black text-white group-hover:text-[#C4B4E2]">Deep Focus</div>
                      <div className="text-[10px] text-[#E8DCF8]/70">Brown Noise + Rain</div>
                    </button>

                    <button
                      onClick={() => applyPreset('cozyFireplace')}
                      className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-left transition-all cursor-pointer group"
                    >
                      <div className="text-lg mb-1">🔥 ☕</div>
                      <div className="text-xs font-black text-white group-hover:text-[#C4B4E2]">Cozy Hearth</div>
                      <div className="text-[10px] text-[#E8DCF8]/70">Fire + Warm Lo-Fi</div>
                    </button>
                  </div>
                </div>

                {/* Individual Multi-Track Sliders */}
                <div className="space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#E8DCF8]">Custom Sound Layers</span>
                  <div className="space-y-2.5">
                    {tracks.map((track) => (
                      <div
                        key={track.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          track.isPlaying
                            ? 'bg-[#613B6E] border-white shadow-md'
                            : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <button
                            onClick={() => toggleTrack(track.id)}
                            className="flex items-center gap-2 text-left cursor-pointer group"
                          >
                            <span className="text-xl">{track.icon}</span>
                            <div>
                              <div className="text-xs font-black text-white group-hover:text-[#C4B4E2]">
                                {track.name}
                              </div>
                              <div className="text-[10px] text-[#E8DCF8]/80 font-bold">
                                {track.isPlaying ? 'Playing' : 'Muted'}
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={() => toggleTrack(track.id)}
                            className={`px-3 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                              track.isPlaying
                                ? 'bg-[#C4B4E2] text-[#532E60]'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            {track.isPlaying ? 'Active' : 'Turn On'}
                          </button>
                        </div>

                        {track.isPlaying && (
                          <div className="pt-1 flex items-center gap-2 animate-in fade-in">
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={track.volume}
                              onChange={(e) => setTrackVolume(track.id, parseFloat(e.target.value))}
                              className="w-full accent-[#C4B4E2] cursor-pointer"
                            />
                            <span className="text-[10px] font-mono text-white/80 w-8 text-right">
                              {Math.round(track.volume * 100)}%
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions inside scroll area */}
                {activeTrackCount > 0 && (
                  <button
                    onClick={stopAll}
                    className="w-full py-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/40 rounded-2xl text-xs font-black transition-all cursor-pointer"
                  >
                    Stop All Sounds
                  </button>
                )}
              </div>

              {/* Permanent Bottom Footer Bar */}
              <div className="p-4 bg-[#4A2656] border-t border-white/20 shrink-0 flex items-center justify-between gap-3">
                <span className="text-xs text-[#E8DCF8] font-bold">
                  {activeTrackCount > 0 ? `${activeTrackCount} track(s) playing` : 'No sound playing'}
                </span>
                <button
                  onClick={toggleMixer}
                  className="px-5 py-2 bg-[#C4B4E2] hover:bg-white text-[#532E60] text-xs font-black rounded-full shadow-md transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
