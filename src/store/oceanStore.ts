import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BottledMessage {
  id: string;
  senderTag: string; // e.g. "Gentle Wanderer", "Quiet Soul", "Night Owl"
  content: string;
  sealType?: 'hope' | 'vent' | 'gratitude' | 'healing';
  timestamp: number;
  reactions: {
    hug: number;
    tea: number;
    candle: number;
    star: number;
  };
  userReacted?: ('hug' | 'tea' | 'candle' | 'star')[];
}

interface OceanState {
  myCastBottles: BottledMessage[];
  communityBottles: BottledMessage[];
  fishedBottleIds: string[];

  // Actions
  castBottle: (content: string, sealType?: BottledMessage['sealType']) => void;
  reactToBottle: (bottleId: string, reaction: 'hug' | 'tea' | 'candle' | 'star') => void;
  fishBottle: () => BottledMessage | null;
}

const DEFAULT_COMMUNITY_BOTTLES: BottledMessage[] = [
  {
    id: 'comm-1',
    senderTag: 'Kind Wanderer',
    content: "If you're reading this right now, take a deep breath. Whatever is making your shoulders tight can wait for 30 seconds. You are doing much better than you think.",
    sealType: 'hope',
    timestamp: Date.now() - 3600000 * 4,
    reactions: { hug: 42, tea: 18, candle: 29, star: 35 },
  },
  {
    id: 'comm-2',
    senderTag: 'Tired Soul',
    content: "I felt so invisible today at work. Like I worked until my bones ached and nobody even looked up. Leaving this here so I don't carry the sorrow to sleep.",
    sealType: 'vent',
    timestamp: Date.now() - 3600000 * 12,
    reactions: { hug: 68, tea: 34, candle: 19, star: 22 },
  },
  {
    id: 'comm-3',
    senderTag: 'Quiet Healer',
    content: "Today was the first day in 3 months that I woke up without a tight knot in my chest. Healing is slow, messy, and non-linear, but it really is happening.",
    sealType: 'healing',
    timestamp: Date.now() - 3600000 * 20,
    reactions: { hug: 89, tea: 41, candle: 52, star: 77 },
  },
  {
    id: 'comm-4',
    senderTag: 'Grateful Heart',
    content: "Grateful for cold fresh water, the sound of rain on the tin roof, and getting another chance to try again tomorrow.",
    sealType: 'gratitude',
    timestamp: Date.now() - 3600000 * 28,
    reactions: { hug: 31, tea: 27, candle: 16, star: 40 },
  },
  {
    id: 'comm-5',
    senderTag: 'Night Thinker',
    content: "You don't need to have all the answers right now. Surviving today is more than enough victory.",
    sealType: 'hope',
    timestamp: Date.now() - 3600000 * 36,
    reactions: { hug: 54, tea: 39, candle: 44, star: 63 },
  },
];

const RANDOM_NAMES = ['Gentle Nomad', 'Starlight Soul', 'Quiet Dreamer', 'Soft Spoken', 'Brave Spirit'];

export const useOceanStore = create<OceanState>()(
  persist(
    (set, get) => ({
      myCastBottles: [],
      communityBottles: DEFAULT_COMMUNITY_BOTTLES,
      fishedBottleIds: [],

      castBottle: (content, sealType) => {
        const randomSender = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
        const newBottle: BottledMessage = {
          id: 'my-' + Date.now().toString() + Math.random().toString(36).substring(7),
          senderTag: randomSender,
          content,
          sealType,
          timestamp: Date.now(),
          reactions: { hug: 0, tea: 0, candle: 0, star: 0 },
        };

        set((s) => ({
          myCastBottles: [newBottle, ...s.myCastBottles],
          communityBottles: [newBottle, ...s.communityBottles],
        }));
      },

      reactToBottle: (bottleId, reaction) => {
        set((s) => ({
          communityBottles: s.communityBottles.map((b) => {
            if (b.id === bottleId) {
              const currentReacted = b.userReacted || [];
              if (currentReacted.includes(reaction)) return b;
              return {
                ...b,
                reactions: {
                  ...b.reactions,
                  [reaction]: b.reactions[reaction] + 1,
                },
                userReacted: [...currentReacted, reaction],
              };
            }
            return b;
          }),
        }));
      },

      fishBottle: () => {
        const state = get();
        const available = state.communityBottles.filter(
          (b) => !state.fishedBottleIds.includes(b.id)
        );

        if (available.length === 0) {
          // Reset loop so user can always fish bottles
          const randomPick = state.communityBottles[Math.floor(Math.random() * state.communityBottles.length)];
          return randomPick || null;
        }

        const picked = available[Math.floor(Math.random() * available.length)];
        set((s) => ({
          fishedBottleIds: [...s.fishedBottleIds, picked.id],
        }));
        return picked;
      },
    }),
    {
      name: 'itoura-ocean-storage',
    }
  )
);
