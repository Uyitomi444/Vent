import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '../services/ai';

export interface MemorySummary {
  id: string;
  timestamp: number;
  summary: string;
  themes: string[];
  messages?: ChatMessage[];
}

interface MemoryState {
  memories: MemorySummary[];
  addMemory: (summary: string, themes: string[], messages?: ChatMessage[]) => void;
  deleteMemory: (id: string) => void;
  clearMemories: () => void;
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set) => ({
      memories: [],
      addMemory: (summary, themes, messages) => set((state) => {
        const newMemory: MemorySummary = {
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          summary,
          themes,
          messages,
        };
        // Keep only the latest 10 memories to avoid context bloat
        const updatedMemories = [newMemory, ...state.memories].slice(0, 10);
        return { memories: updatedMemories };
      }),
      deleteMemory: (id) => set((state) => ({
        memories: state.memories.filter((m) => m.id !== id)
      })),
      clearMemories: () => set({ memories: [] }),
    }),
    {
      name: 'itoura-memory-storage',
    }
  )
);
