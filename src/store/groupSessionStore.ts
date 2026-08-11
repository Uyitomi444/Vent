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
  createSession: (title: string, displayName: string, language: 'en' | 'pcm' | 'yo' | 'ha' | 'ig') => GroupSession;
  joinSession: (code: string, displayName: string) => boolean;
  sendGroupMessage: (content: string, senderId: string, senderName: string, apiKey: string) => Promise<void>;
  leaveSession: (participantId: string) => void;
  endSession: () => void;
  exportSessionToJournal: () => boolean;
  subscribeToRoom: (code: string) => () => void;
}

// Dynamic Realtime Server URL with fallback guard
const getRealtimeServerUrl = () => {
  if (import.meta.env.VITE_REALTIME_SERVER_URL) {
    return import.meta.env.VITE_REALTIME_SERVER_URL;
  }
  return 'http://localhost:3001';
};

let socket: Socket | null = null;
try {
  socket = io(getRealtimeServerUrl(), {
    autoConnect: true,
    transports: ['websocket', 'polling'],
    timeout: 3000
  });
} catch (e) {
  console.warn("Socket initialization skipped:", e);
}

// LocalStorage Event Bus for multi-tab / cross-window real-time fallback
const broadcastEvent = (eventData: any) => {
  if (socket && socket.connected) {
    try {
      socket.emit(eventData.type, eventData);
    } catch (e) {}
  }

  try {
    localStorage.setItem('itoura_group_bus', JSON.stringify({ ...eventData, _nonce: Math.random() }));
  } catch (e) {}
};

export const useGroupSessionStore = create<GroupSessionState>()(
  persist(
    (set, get) => {

      // Listen to LocalStorage Bus for multi-tab / multi-window sync
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
          if (e.key === 'itoura_group_bus' && e.newValue) {
            try {
              const eventData = JSON.parse(e.newValue);
              const current = get().activeSession;
              
              if (eventData.type === 'SYNC_SESSION' && eventData.session) {
                if (current && current.code === eventData.session.code) {
                  if (eventData.session.status === 'ended') {
                    set({ activeSession: null, error: null });
                  } else {
                    set({ activeSession: eventData.session, error: null });
                  }
                }
              } else if (eventData.type === 'JOIN_EVENT' && eventData.code) {
                if (current && current.code === eventData.code) {
                  const exists = current.participants.some(p => p.id === eventData.participant.id);
                  if (!exists && current.participants.length < current.maxParticipants) {
                    const updatedParticipants = [...current.participants, eventData.participant];
                    const sysMsg: GroupMessage = {
                      id: 'msg-sys-' + Date.now(),
                      senderId: 'system',
                      senderName: 'System',
                      content: `👋 ${eventData.participant.displayName} joined the session.`,
                      timestamp: Date.now()
                    };
                    const updatedSess: GroupSession = {
                      ...current,
                      participants: updatedParticipants,
                      messages: [...current.messages, sysMsg]
                    };
                    set({ activeSession: updatedSess, error: null });
                    broadcastEvent({ type: 'SYNC_SESSION', session: updatedSess });
                  }
                }
              }
            } catch (err) {}
          }
        });
      }

      // Socket.IO event bindings
      if (socket) {
        socket.on('ROOM_UPDATED', ({ session }: any) => {
          set({ activeSession: session, error: null, isLoading: false });
        });

        socket.on('AI_THINKING', ({ isThinking }: any) => {
          set({ isLoading: isThinking });
        });

        socket.on('ROOM_ENDED', () => {
          set({ activeSession: null, error: null });
        });
      }

      return {
        activeSession: null,
        hasSeenPrivacyNotice: false,
        isLoading: false,
        error: null,
        currentUserId: null,
        setHasSeenPrivacyNotice: (seen) => set({ hasSeenPrivacyNotice: seen }),
        
        createSession: (title, displayName, language) => {
          const creatorId = 'user-' + Date.now().toString().slice(-4);
          const code = Math.random().toString(36).substring(2, 8).toUpperCase();
          
          const initialMessage: GroupMessage = {
            id: 'msg-init-' + Date.now(),
            senderId: 'assistant',
            senderName: 'Itoura',
            content: `Welcome to this group session. I am Itoura, present to facilitate a supportive conversation for everyone present. Feel free to share when you're ready.`,
            timestamp: Date.now()
          };

          const newSession: GroupSession = {
            id: 'grp-' + Date.now(),
            code,
            title: title.trim() || 'Group Discussion',
            sessionLanguage: language,
            maxParticipants: 6,
            participants: [
              {
                id: creatorId,
                displayName: displayName.trim() || 'Creator',
                joinedAt: Date.now(),
                isCreator: true
              }
            ],
            messages: [initialMessage],
            status: 'active',
            createdAt: Date.now(),
            creatorId
          };

          // Update state IMMEDIATELY so room opens instantly
          set({ activeSession: newSession, currentUserId: creatorId, error: null, isLoading: false });
          
          // Save room state for local cross-tab lookup
          try {
            localStorage.setItem(`itoura_room_${code}`, JSON.stringify(newSession));
          } catch (e) {}

          broadcastEvent({ type: 'CREATE_ROOM', title, displayName, language, session: newSession });
          return newSession;
        },

        joinSession: (code, displayName) => {
          const normalizedCode = code.trim().toUpperCase();
          const userId = 'user-' + Date.now().toString().slice(-4);
          const newParticipant: GroupParticipant = {
            id: userId,
            displayName: displayName.trim() || 'Participant',
            joinedAt: Date.now(),
            isCreator: false
          };

          let targetSession: GroupSession | null = null;

          // 1. Check current activeSession
          const current = get().activeSession;
          if (current && current.code === normalizedCode) {
            targetSession = current;
          }

          // 2. Check localStorage for room code
          if (!targetSession) {
            try {
              const stored = localStorage.getItem(`itoura_room_${normalizedCode}`);
              if (stored) {
                targetSession = JSON.parse(stored);
              }
            } catch (e) {}
          }

          // 3. Fallback fresh session if joining new code
          if (!targetSession) {
            targetSession = {
              id: 'grp-' + Date.now(),
              code: normalizedCode,
              title: `Group Session (${normalizedCode})`,
              sessionLanguage: 'en',
              maxParticipants: 6,
              participants: [],
              messages: [
                {
                  id: 'msg-init-' + Date.now(),
                  senderId: 'assistant',
                  senderName: 'Itoura',
                  content: `Welcome to the session! I am Itoura, present to facilitate a thoughtful group conversation.`,
                  timestamp: Date.now()
                }
              ],
              status: 'active',
              createdAt: Date.now(),
              creatorId: 'creator-external'
            };
          }

          if (targetSession.participants.length >= targetSession.maxParticipants) {
            set({ error: 'Session is full (maximum 6 participants).' });
            return false;
          }

          const systemJoinMsg: GroupMessage = {
            id: 'msg-sys-' + Date.now(),
            senderId: 'system',
            senderName: 'System',
            content: `👋 ${newParticipant.displayName} joined the session.`,
            timestamp: Date.now()
          };

          const exists = targetSession.participants.some(p => p.id === newParticipant.id || p.displayName.toLowerCase() === newParticipant.displayName.toLowerCase());
          const updatedParticipants = exists ? targetSession.participants : [...targetSession.participants, newParticipant];
          const updatedMessages = exists ? targetSession.messages : [...targetSession.messages, systemJoinMsg];

          const updatedSession: GroupSession = {
            ...targetSession,
            participants: updatedParticipants,
            messages: updatedMessages
          };

          try {
            localStorage.setItem(`itoura_room_${normalizedCode}`, JSON.stringify(updatedSession));
          } catch (e) {}

          // Update state IMMEDIATELY so room opens instantly
          set({ activeSession: updatedSession, currentUserId: userId, error: null, isLoading: false });

          broadcastEvent({
            type: 'JOIN_EVENT',
            code: normalizedCode,
            participant: newParticipant,
            session: updatedSession
          });

          return true;
        },

        sendGroupMessage: async (content, senderId, senderName, apiKey) => {
          const session = get().activeSession;
          if (!session || session.status === 'ended') return;

          const userMsg: GroupMessage = {
            id: 'msg-' + Date.now(),
            senderId,
            senderName,
            content,
            timestamp: Date.now()
          };

          const updatedMessages = [...session.messages, userMsg];
          const updatedSession: GroupSession = { ...session, messages: updatedMessages };

          set({ activeSession: updatedSession, isLoading: true, error: null });
          broadcastEvent({ type: 'SYNC_SESSION', session: updatedSession });

          if (socket && socket.connected) {
            socket.emit('SEND_MESSAGE', { code: session.code, content, senderId, senderName, apiKey });
          } else {
            // AI Fallback when backend socket unavailable
            setTimeout(() => {
              const aiReplyMsg: GroupMessage = {
                id: 'msg-ai-' + Date.now(),
                senderId: 'assistant',
                senderName: 'Itoura',
                content: `Thank you for sharing with the group, ${senderName}. I am here to facilitate a balanced conversation for everyone present.`,
                timestamp: Date.now()
              };
              const curr = get().activeSession;
              if (curr) {
                const sessionWithAi = { ...curr, messages: [...curr.messages, aiReplyMsg] };
                set({ activeSession: sessionWithAi, isLoading: false });
                broadcastEvent({ type: 'SYNC_SESSION', session: sessionWithAi });
              }
            }, 1000);
          }
        },

        leaveSession: (participantId) => {
          const session = get().activeSession;
          if (!session) return;

          const leavingParticipant = session.participants.find(p => p.id === participantId);
          const updatedParticipants = session.participants.filter(p => p.id !== participantId);

          const leaveMsg: GroupMessage = {
            id: 'msg-sys-' + Date.now(),
            senderId: 'system',
            senderName: 'System',
            content: `👋 ${leavingParticipant?.displayName || 'A participant'} left the session.`,
            timestamp: Date.now()
          };

          const updatedSession: GroupSession = {
            ...session,
            participants: updatedParticipants,
            messages: [...session.messages, leaveMsg]
          };

          broadcastEvent({ type: 'SYNC_SESSION', session: updatedSession });
          set({ activeSession: null, error: null });
        },

        endSession: () => {
          const session = get().activeSession;
          if (!session) return;

          const endMsg: GroupMessage = {
            id: 'msg-sys-' + Date.now(),
            senderId: 'system',
            senderName: 'System',
            content: `🛑 Group session has been ended by the host.`,
            timestamp: Date.now()
          };

          const endedSession: GroupSession = {
            ...session,
            status: 'ended',
            messages: [...session.messages, endMsg]
          };

          broadcastEvent({ type: 'SYNC_SESSION', session: endedSession });
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
          if (socket && socket.connected) {
            socket.emit('JOIN_ROOM', { code: normalizedCode, displayName: 'Peer' });
          }
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
