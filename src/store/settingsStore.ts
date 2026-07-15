import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  darkMode: boolean;
  notifications: boolean;
  setDarkMode: (value: boolean) => void;
  setNotifications: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      notifications: true,
      setDarkMode: (value) => set({ darkMode: value }),
      setNotifications: (value) => set({ notifications: value }),
    }),
    {
      name: 'itoura-settings-storage',
    }
  )
);
