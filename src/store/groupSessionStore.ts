import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendGroupMessageToAI } from '../services/ai';
import { useJournalStore } from './journalStore';

export interface GroupParticipant {
  id: string;
  displayName: string;
  joinedAt: number;
  isCreator: boolean;
}

export interface GroupMessage {
  id: string;
  senderId: string; // 'assistant' | participant.id
  senderName: string; // 'Itoura' | participant.displayName
  content: string;
  timestamp: number;
}

export interface GroupSession {
  id: string;
  code: string; // 6-char room code
  title: string;
  sessionLanguage: 'en' | 'pcm' | 'yo' | 'ha' | 'ig';
  maxParticipants: number; // 6
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
  setHasSeenPrivacyNotice: (seen: boolean) => void;
  createSession: (title: string, displayName: string, language: 'en' | 'pcm' | 'yo' | 'ha' | 'ig') => GroupSession;
  joinSession: (code: string, displayName: string) => boolean;
  sendGroupMessage: (content: string, senderId: string, senderName: string, apiKey: string) => Promise<void>;
  leaveSession: (participantId: string) => void;
  endSession: () => void;
  exportSessionToJournal: () => boolean;
}

export const useGroupSessionStore = create<GroupSessionState>()(
  persist(
    (set, get) => ({
      activeSession: null,
      hasSeenPrivacyNotice: false,
      isLoading: false,
      error: null,
      setHasSeenPrivacyNotice: (seen) => set({ hasSeenPrivacyNotice: seen }),
      
      createSession: (title, displayName, language) => {
        const creatorId = 'user-' + Date.now().toString().slice(-4);
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const initialMessage: GroupMessage = {
          id: 'msg-init-' + Date.now(),
          senderId: 'assistant',
          senderName: 'Itoura',
          content: `Welcome to this group session. I am Itoura, and I am here to facilitate a supportive conversation for everyone present. Feel free to share when you're ready.`,
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

        set({ activeSession: newSession, error: null });
        return newSession;
      },

      joinSession: (code, displayName) => {
        const current = get().activeSession;
        const normalizedCode = code.trim().toUpperCase();

        if (current && current.code === normalizedCode) {
          if (current.participants.length >= 6) {
            set({ error: 'Session is full (maximum 6 participants).' });
            return false;
          }
          const newParticipant: GroupParticipant = {
            id: 'user-' + Date.now().toString().slice(-4),
            displayName: displayName.trim() || 'Participant',
            joinedAt: Date.now(),
            isCreator: false
          };
          set({
            activeSession: {
              ...current,
              participants: [...current.participants, newParticipant]
            },
            error: null
          });
          return true;
        }

        // Mock join for a new room code
        const newParticipant: GroupParticipant = {
          id: 'user-' + Date.now().toString().slice(-4),
          displayName: displayName.trim() || 'Participant',
          joinedAt: Date.now(),
          isCreator: false
        };

        const joinedSession: GroupSession = {
          id: 'grp-' + Date.now(),
          code: normalizedCode,
          title: `Group Session (${normalizedCode})`,
          sessionLanguage: 'en',
          maxParticipants: 6,
          participants: [newParticipant],
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

        set({ activeSession: joinedSession, error: null });
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
        set({
          activeSession: { ...session, messages: updatedMessages },
          isLoading: true,
          error: null
        });

        try {
          const companionReply = await sendGroupMessageToAI(
            updatedMessages,
            session.sessionLanguage,
            apiKey
          );

          const aiMsg: GroupMessage = {
            id: 'msg-ai-' + Date.now(),
            senderId: 'assistant',
            senderName: 'Itoura',
            content: companionReply,
            timestamp: Date.now()
          };

          const currentSess = get().activeSession;
          if (currentSess) {
            set({
              activeSession: {
                ...currentSess,
                messages: [...currentSess.messages, aiMsg]
              },
              isLoading: false
            });
          }
        } catch (err: any) {
          set({
            error: err.message || 'Failed to send group message',
            isLoading: false
          });
        }
      },

      leaveSession: (participantId) => {
        const session = get().activeSession;
        if (!session) return;

        const updatedParticipants = session.participants.filter(p => p.id !== participantId);
        if (updatedParticipants.length === 0) {
          set({ activeSession: null });
        } else {
          set({
            activeSession: { ...session, participants: updatedParticipants }
          });
        }
      },

      endSession: () => {
        const session = get().activeSession;
        if (!session) return;
        set({
          activeSession: { ...session, status: 'ended' }
        });
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
      }
    }),
    {
      name: 'itoura-group-session-storage',
      partialize: (state) => ({
        activeSession: state.activeSession,
        hasSeenPrivacyNotice: state.hasSeenPrivacyNotice
      })
    }
  )
);
