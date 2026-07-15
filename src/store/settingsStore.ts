import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  notifications: boolean;
  setNotifications: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notifications: true,
      setNotifications: (value) => set({ notifications: value }),
    }),
    {
      name: 'itoura-settings-storage',
    }
  )
);
