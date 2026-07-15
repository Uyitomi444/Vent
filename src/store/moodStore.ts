import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MoodType = 'terrible' | 'bad' | 'okay' | 'good' | 'great';

export interface MoodEntry {
  id: string;
  mood: MoodType;
  energyLevel: number;
  note?: string;
  timestamp: number;
}

interface MoodState {
  entries: MoodEntry[];
  addEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  deleteEntry: (id: string) => void;
  clearEntries: () => void;
}

export const useMoodStore = create<MoodState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: Date.now().toString() + Math.random().toString(36).substring(7),
              timestamp: Date.now(),
            },
            ...state.entries,
          ],
        })),
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      clearEntries: () => set({ entries: [] }),
    }),
    {
      name: 'itoura-mood-storage',
    }
  )
);
