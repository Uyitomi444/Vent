import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { io, Socket } from 'socket.io-client';
import { useJournalStore } from './journalStore';

export interface GroupParticipant {
  id: string;
  displayName: string;
  joinedAt: number;
  isCreator: boolean;
}

export interface GroupMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

export interface GroupSession {
  id: string;
  code: string;
  title: string;
  sessionLanguage: 'en' | 'pcm' | 'yo' | 'ha' | 'ig';
  maxParticipants: number;
  participants: GroupParticipant[];
  messages: GroupMessage[];
  status: 'active' | 'ended';
  createdAt: number;
  creatorId: string;
}

interface GroupSessionState {
  activeSession: GroupSession | null;
  hasSeenPrivacyNotice: boolean;
  isLoading: boolean;
  error: string | null;
  currentUserId: string | null;
  setHasSeenPrivacyNotice: (seen: boolean) => void;
  createSession: (title: string, displayName: string, language: 'en' | 'pcm' | 'yo' | 'ha' | 'ig') => Promise<GroupSession>;
  joinSession: (code: string, displayName: string) => Promise<boolean>;
  sendGroupMessage: (content: string, senderId: string, senderName: string, apiKey: string) => Promise<void>;
  leaveSession: (participantId: string) => void;
  endSession: () => Promise<void>;
  exportSessionToJournal: () => boolean;
  subscribeToRoom: (code: string) => () => void;
}

// Dynamic Realtime Server URL: uses VITE_REALTIME_SERVER_URL if set, or window location/localhost
const getRealtimeServerUrl = () => {
  if (import.meta.env.VITE_REALTIME_SERVER_URL) {
    return import.meta.env.VITE_REALTIME_SERVER_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `${window.location.protocol}//${window.location.hostname}`;
  }
  return 'http://localhost:3001';
};

const socket: Socket = io(getRealtimeServerUrl(), {
  autoConnect: true,
  transports: ['websocket', 'polling']
});

export const useGroupSessionStore = create<GroupSessionState>()(
  persist(
    (set, get) => {

      // Listen for socket events
      socket.on('ROOM_CREATED', ({ session, currentUserId }) => {
        set({ activeSession: session, currentUserId, error: null, isLoading: false });
      });

      socket.on('ROOM_UPDATED', ({ session }) => {
        set({ activeSession: session, error: null });
      });

      socket.on('JOINED_SUCCESS', ({ currentUserId }) => {
        set({ currentUserId });
      });

      socket.on('AI_THINKING', ({ isThinking }) => {
        set({ isLoading: isThinking });
      });

      socket.on('ROOM_ENDED', () => {
        set({ activeSession: null, error: null });
      });

      socket.on('ERROR', ({ message }) => {
        set({ error: message, isLoading: false });
      });

      return {
        activeSession: null,
        hasSeenPrivacyNotice: false,
        isLoading: false,
        error: null,
        currentUserId: null,
        setHasSeenPrivacyNotice: (seen) => set({ hasSeenPrivacyNotice: seen }),
        
        createSession: async (title, displayName, language) => {
          set({ isLoading: true, error: null });
          
          return new Promise((resolve) => {
            socket.emit('CREATE_ROOM', { title, displayName, language });
            
            const handleCreated = ({ session, currentUserId }: any) => {
              set({ activeSession: session, currentUserId, isLoading: false });
              socket.off('ROOM_CREATED', handleCreated);
              resolve(session);
            };

            socket.on('ROOM_CREATED', handleCreated);
          });
        },

        joinSession: async (code, displayName) => {
          set({ isLoading: true, error: null });
          
          return new Promise((resolve) => {
            socket.emit('JOIN_ROOM', { code, displayName });

            const handleSuccess = () => {
              socket.off('JOINED_SUCCESS', handleSuccess);
              set({ isLoading: false });
              resolve(true);
            };

            const handleError = ({ message }: any) => {
              socket.off('ERROR', handleError);
              set({ error: message, isLoading: false });
              resolve(false);
            };

            socket.on('JOINED_SUCCESS', handleSuccess);
            socket.on('ERROR', handleError);

            // Timeout safety
            setTimeout(() => {
              socket.off('JOINED_SUCCESS', handleSuccess);
              socket.off('ERROR', handleError);
              resolve(true);
            }, 1000);
          });
        },

        sendGroupMessage: async (content, senderId, senderName, apiKey) => {
          const session = get().activeSession;
          if (!session || session.status === 'ended') return;

          set({ isLoading: true, error: null });
          socket.emit('SEND_MESSAGE', {
            code: session.code,
            content,
            senderId,
            senderName,
            apiKey
          });
        },

        leaveSession: (participantId) => {
          const session = get().activeSession;
          if (!session) return;

          socket.emit('LEAVE_ROOM', { code: session.code, participantId });
          set({ activeSession: null, error: null });
        },

        endSession: async () => {
          const session = get().activeSession;
          if (!session) return;

          socket.emit('END_ROOM', { code: session.code });
          set({ activeSession: null, error: null });
        },

        exportSessionToJournal: () => {
          const session = get().activeSession;
          if (!session || session.messages.length === 0) return false;

          const transcript = session.messages
            .map(m => `[${m.senderName}]: ${m.content}`)
            .join('\n\n');

          useJournalStore.getState().addEntry({
            title: `Group Session Export — ${session.title} (${session.code})`,
            content: `Group Session Transcript (${new Date(session.createdAt).toLocaleDateString()})\n\n${transcript}`
          });

          return true;
        },

        subscribeToRoom: (code: string) => {
          const normalizedCode = code.trim().toUpperCase();
          socket.emit('JOIN_ROOM', { code: normalizedCode, displayName: 'Peer' });
          return () => {};
        }
      };
    },
    {
      name: 'itoura-group-session-storage',
      partialize: (state) => ({
        activeSession: state.activeSession,
        hasSeenPrivacyNotice: state.hasSeenPrivacyNotice,
        currentUserId: state.currentUserId
      })
    }
  )
);
