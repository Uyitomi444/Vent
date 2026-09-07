import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { hashPin, encryptText, decryptText } from '../services/cryptoService';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  mood?: 'happy' | 'calm' | 'anxious' | 'sad' | 'angry';
  themes?: string[];
  isEncrypted?: boolean;
}

interface JournalState {
  entries: JournalEntry[];
  isLocked: boolean;
  pinHash: string | null;
  securityQuestion?: string;
  securityAnswerHash?: string;
  autoLockMinutes: number; // 0 = never, 1, 5, 15
  lastActiveTimestamp: number;
  activePinSession: string | null;

  // Actions
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteEntry: (id: string) => void;
  clearEntries: () => void;
  
  // Security & Vault Actions
  setupPin: (pin: string, question?: string, answer?: string) => Promise<void>;
  removePin: () => void;
  unlockVault: (pin: string) => Promise<boolean>;
  lockVault: () => void;
  setAutoLockMinutes: (minutes: number) => void;
  checkAutoLock: () => void;
  touchActivity: () => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      isLocked: false,
      pinHash: null,
      securityQuestion: undefined,
      securityAnswerHash: undefined,
      autoLockMinutes: 5,
      lastActiveTimestamp: Date.now(),
      activePinSession: null,

      addEntry: async (entryData) => {
        const state = get();
        let contentToStore = entryData.content;
        let isEncrypted = false;

        if (state.pinHash && state.activePinSession) {
          contentToStore = await encryptText(entryData.content, state.activePinSession);
          isEncrypted = true;
        }

        const newEntry: JournalEntry = {
          ...entryData,
          content: contentToStore,
          isEncrypted,
          id: Date.now().toString() + Math.random().toString(36).substring(7),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((s) => ({ entries: [newEntry, ...s.entries], lastActiveTimestamp: Date.now() }));
      },

      updateEntry: async (id, updates) => {
        const state = get();
        let finalUpdates = { ...updates };

        if (updates.content !== undefined && state.pinHash && state.activePinSession) {
          finalUpdates.content = await encryptText(updates.content, state.activePinSession);
          finalUpdates.isEncrypted = true;
        }

        set((s) => ({
          entries: s.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...finalUpdates, updatedAt: Date.now() }
              : entry
          ),
          lastActiveTimestamp: Date.now()
        }));
      },

      deleteEntry: (id) => set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== id),
        lastActiveTimestamp: Date.now()
      })),

      clearEntries: () => set({ entries: [] }),

      setupPin: async (pin: string, question?: string, answer?: string) => {
        const hash = await hashPin(pin);
        let ansHash: string | undefined = undefined;
        if (answer) {
          ansHash = await hashPin(answer.trim().toLowerCase());
        }

        // Encrypt any existing plain entries
        const currentEntries = get().entries;
        const encryptedEntries = await Promise.all(
          currentEntries.map(async (e) => {
            if (!e.isEncrypted) {
              const encrypted = await encryptText(e.content, pin);
              return { ...e, content: encrypted, isEncrypted: true };
            }
            return e;
          })
        );

        set({
          pinHash: hash,
          securityQuestion: question,
          securityAnswerHash: ansHash,
          isLocked: false,
          activePinSession: pin,
          entries: encryptedEntries,
          lastActiveTimestamp: Date.now(),
        });
      },

      removePin: () => {
        set({
          pinHash: null,
          securityQuestion: undefined,
          securityAnswerHash: undefined,
          isLocked: false,
          activePinSession: null,
        });
      },

      unlockVault: async (pin: string) => {
        const hash = await hashPin(pin);
        const state = get();
        if (state.pinHash === hash) {
          set({
            isLocked: false,
            activePinSession: pin,
            lastActiveTimestamp: Date.now(),
          });
          return true;
        }
        return false;
      },

      lockVault: () => {
        set({
          isLocked: true,
          activePinSession: null,
        });
      },

      setAutoLockMinutes: (minutes: number) => {
        set({ autoLockMinutes: minutes });
      },

      checkAutoLock: () => {
        const state = get();
        if (!state.pinHash || state.isLocked) return;
        if (state.autoLockMinutes === 0) return;

        const now = Date.now();
        const diffMinutes = (now - state.lastActiveTimestamp) / (1000 * 60);
        if (diffMinutes >= state.autoLockMinutes) {
          set({ isLocked: true, activePinSession: null });
        }
      },

      touchActivity: () => {
        set({ lastActiveTimestamp: Date.now() });
      }
    }),
    {
      name: 'itoura-journal-storage',
      partialize: (state) => ({
        entries: state.entries,
        pinHash: state.pinHash,
        securityQuestion: state.securityQuestion,
        securityAnswerHash: state.securityAnswerHash,
        autoLockMinutes: state.autoLockMinutes,
        isLocked: !!state.pinHash, // Lock on reload if PIN is set
      }),
    }
  )
);

export async function getDecryptedEntryContent(entry: JournalEntry, activePin: string | null): Promise<string> {
  if (!entry.isEncrypted || !activePin) {
    return entry.content;
  }
  return await decryptText(entry.content, activePin);
}
