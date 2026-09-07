import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  nickname: string;
  avatarUrl: string; // preset path or base64 data URL
  pronouns: string;
  bio: string;
  goals: string[];
  companionTone: 'gentle' | 'grounding' | 'uplifting' | 'direct';
  joinedDate: number;
}

export const PRESET_AVATARS = [
  {
    id: 'calm',
    name: 'Peaceful Companion',
    url: '/assets/illustrations/AI_companion_idle_pose_2K_202607141345.jpeg',
  },
  {
    id: 'joy',
    name: 'Celebratory Spirit',
    url: '/assets/illustrations/AI_companion_celebrating_small_win_202607141349.jpeg',
  },
  {
    id: 'listen',
    name: 'Attentive Listener',
    url: '/assets/illustrations/AI_companion_listening_pose_2K_202607141347.jpeg',
  },
  {
    id: 'zen',
    name: 'Deep Breath',
    url: '/assets/illustrations/Figure_meditating_with_breath-cloud_2K_202607141335.jpeg',
  },
  {
    id: 'welcome',
    name: 'Warm Friend',
    url: '/assets/illustrations/Doodled_character_welcoming_gesture_2K_202607141343.jpeg',
  },
];

export const AVAILABLE_GOALS = [
  'Relieve Daily Stress',
  'Safe Space to Vent',
  'Anxiety Management',
  'Emotional Clarity',
  'Better Sleep & Rest',
  'Mindful Breathing',
  'Work-Life Balance',
  'Building Self-Compassion',
];

interface ProfileState {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Kind Wanderer',
  nickname: 'Friend',
  avatarUrl: PRESET_AVATARS[0].url,
  pronouns: 'they/them',
  bio: 'Taking it one breath at a time.',
  goals: ['Relieve Daily Stress', 'Safe Space to Vent', 'Emotional Clarity'],
  companionTone: 'gentle',
  joinedDate: Date.now(),
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      updateProfile: (updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
          },
        })),
      resetProfile: () => set({ profile: DEFAULT_PROFILE }),
    }),
    {
      name: 'itoura-user-profile-v1',
    }
  )
);
