import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { soundEngine } from '../services/soundEngine';

export interface SoundTrackState {
  id: 'rain' | 'fire' | 'wind' | 'brownNoise' | 'lofi' | 'bowl';
  name: string;
  icon: string;
  volume: number; // 0 to 1
  isPlaying: boolean;
}

interface SoundStoreState {
  isPlayingAll: boolean;
  masterVolume: number;
  tracks: SoundTrackState[];
  isMixerOpen: boolean;

  // Actions
  toggleMixer: () => void;
  setMasterVolume: (vol: number) => void;
  setTrackVolume: (trackId: string, vol: number) => void;
  toggleTrack: (trackId: string) => void;
  applyPreset: (presetName: 'rainyCabin' | 'zenMonastery' | 'deepFocus' | 'cozyFireplace') => void;
  stopAll: () => void;
}

const DEFAULT_TRACKS: SoundTrackState[] = [
  { id: 'rain', name: 'Gentle Rain', icon: '🌧️', volume: 0.6, isPlaying: false },
  { id: 'fire', name: 'Campfire', icon: '🔥', volume: 0.5, isPlaying: false },
  { id: 'wind', name: 'Forest Wind', icon: '🍃', volume: 0.4, isPlaying: false },
  { id: 'brownNoise', name: 'Brown Noise', icon: '🌊', volume: 0.4, isPlaying: false },
  { id: 'lofi', name: 'Lo-Fi Warmth', icon: '☕', volume: 0.5, isPlaying: false },
  { id: 'bowl', name: 'Singing Bowl', icon: '🔔', volume: 0.5, isPlaying: false },
];

export const useSoundStore = create<SoundStoreState>()(
  persist(
    (set, get) => ({
      isPlayingAll: false,
      masterVolume: 0.8,
      tracks: DEFAULT_TRACKS,
      isMixerOpen: false,

      toggleMixer: () => set((s) => ({ isMixerOpen: !s.isMixerOpen })),

      setMasterVolume: (vol) => {
        soundEngine.setMasterVolume(vol);
        set({ masterVolume: vol });
      },

      setTrackVolume: (trackId, vol) => {
        const state = get();
        const updated = state.tracks.map((t) => {
          if (t.id === trackId) {
            if (t.isPlaying) {
              soundEngine.setAmbientVolume(trackId, vol);
            }
            return { ...t, volume: vol };
          }
          return t;
        });
        set({ tracks: updated });
      },

      toggleTrack: (trackId) => {
        const state = get();
        let anyPlaying = false;
        const updated = state.tracks.map((t) => {
          if (t.id === trackId) {
            const nextPlaying = !t.isPlaying;
            if (nextPlaying) {
              soundEngine.startAmbientTrack(trackId, t.volume);
              anyPlaying = true;
            } else {
              soundEngine.stopAmbientTrack(trackId);
            }
            return { ...t, isPlaying: nextPlaying };
          }
          if (t.isPlaying) anyPlaying = true;
          return t;
        });
        set({ tracks: updated, isPlayingAll: anyPlaying });
      },

      applyPreset: (preset) => {
        soundEngine.stopAllAmbient();
        const state = get();

        let newSettings: Record<string, { isPlaying: boolean; volume: number }> = {};

        switch (preset) {
          case 'rainyCabin':
            newSettings = {
              rain: { isPlaying: true, volume: 0.7 },
              fire: { isPlaying: true, volume: 0.5 },
              wind: { isPlaying: true, volume: 0.3 },
              brownNoise: { isPlaying: false, volume: 0.3 },
              lofi: { isPlaying: false, volume: 0.4 },
              bowl: { isPlaying: false, volume: 0.4 },
            };
            break;
          case 'zenMonastery':
            newSettings = {
              bowl: { isPlaying: true, volume: 0.6 },
              wind: { isPlaying: true, volume: 0.3 },
              rain: { isPlaying: false, volume: 0.4 },
              fire: { isPlaying: false, volume: 0.3 },
              brownNoise: { isPlaying: false, volume: 0.3 },
              lofi: { isPlaying: false, volume: 0.3 },
            };
            break;
          case 'deepFocus':
            newSettings = {
              brownNoise: { isPlaying: true, volume: 0.6 },
              rain: { isPlaying: true, volume: 0.3 },
              lofi: { isPlaying: false, volume: 0.3 },
              fire: { isPlaying: false, volume: 0.3 },
              wind: { isPlaying: false, volume: 0.3 },
              bowl: { isPlaying: false, volume: 0.3 },
            };
            break;
          case 'cozyFireplace':
            newSettings = {
              fire: { isPlaying: true, volume: 0.7 },
              lofi: { isPlaying: true, volume: 0.5 },
              rain: { isPlaying: false, volume: 0.3 },
              wind: { isPlaying: false, volume: 0.2 },
              brownNoise: { isPlaying: false, volume: 0.3 },
              bowl: { isPlaying: false, volume: 0.3 },
            };
            break;
        }

        const updated = state.tracks.map((t) => {
          const conf = newSettings[t.id];
          if (conf) {
            if (conf.isPlaying) {
              soundEngine.startAmbientTrack(t.id, conf.volume);
            }
            return { ...t, isPlaying: conf.isPlaying, volume: conf.volume };
          }
          return { ...t, isPlaying: false };
        });

        set({ tracks: updated, isPlayingAll: true });
      },

      stopAll: () => {
        soundEngine.stopAllAmbient();
        set((s) => ({
          isPlayingAll: false,
          tracks: s.tracks.map((t) => ({ ...t, isPlaying: false })),
        }));
      },
    }),
    {
      name: 'itoura-sound-storage',
      partialize: (s) => ({
        masterVolume: s.masterVolume,
        tracks: s.tracks.map((t) => ({ ...t, isPlaying: false })), // Don't auto-blast sound on fresh reload
      }),
    }
  )
);
