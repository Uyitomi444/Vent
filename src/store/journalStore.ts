import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  mood?: 'happy' | 'calm' | 'anxious' | 'sad' | 'angry';
}

interface JournalState {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteEntry: (id: string) => void;
  clearEntries: () => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entryData) => set((state) => {
        const newEntry: JournalEntry = {
          ...entryData,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        return { entries: [newEntry, ...state.entries] };
      }),
      updateEntry: (id, updates) => set((state) => ({
        entries: state.entries.map((entry) => 
          entry.id === id 
            ? { ...entry, ...updates, updatedAt: Date.now() } 
            : entry
        )
      })),
      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id)
      })),
      clearEntries: () => set({ entries: [] }),
    }),
    {
      name: 'vent-journal-storage',
    }
  )
);
