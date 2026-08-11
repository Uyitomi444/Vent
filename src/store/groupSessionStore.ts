import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendGroupMessageToAI } from '../services/ai';
import { useJournalStore } from './journalStore';
import { peerGroupService } from '../services/peerService';

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

export const useGroupSessionStore = create<GroupSessionState>()(
  persist(
    (set, get) => ({
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

        set({ activeSession: newSession, currentUserId: creatorId, error: null });

        // Initialize PeerJS P2P WebRTC Host signal
        peerGroupService.initHost(
          code,
          (updatedSession) => set({ activeSession: updatedSession, error: null }),
          () => get().activeSession
        );

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
            },
            {
              id: 'msg-sys-' + Date.now(),
              senderId: 'system',
              senderName: 'System',
              content: `👋 ${newParticipant.displayName} joined the session.`,
              timestamp: Date.now()
            }
          ],
          status: 'active',
          createdAt: Date.now(),
          creatorId: 'creator-external'
        };

        set({ activeSession: joinedSession, currentUserId: userId, error: null });

        // Connect over PeerJS P2P WebRTC to Host
        peerGroupService.joinRoom(
          normalizedCode,
          newParticipant,
          (updatedSession) => set({ activeSession: updatedSession, error: null }),
          () => set({ activeSession: null })
        );

        return true;
      },

      sendGroupMessage: async (content, senderId, senderName, apiKey) => {
        const session = get().activeSession;
        if (!session || session.status === 'ended') return;

        const currentParticipant = session.participants.find(p => p.id === senderId) || { isCreator: false };

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

        if (currentParticipant.isCreator) {
          // Host sends message & triggers AI
          peerGroupService.broadcastToAll({ type: 'ROOM_STATE', session: updatedSession });

          try {
            const companionReply = await sendGroupMessageToAI(
              updatedMessages.filter(m => m.senderId !== 'system'),
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

            const curr = get().activeSession;
            if (curr) {
              const sessionWithAi: GroupSession = {
                ...curr,
                messages: [...curr.messages, aiMsg]
              };
              set({ activeSession: sessionWithAi, isLoading: false });
              peerGroupService.broadcastToAll({ type: 'ROOM_STATE', session: sessionWithAi });
            }
          } catch (err: any) {
            set({ error: err.message || 'AI message error', isLoading: false });
          }
        } else {
          // Participant sends via PeerJS WebRTC P2P Data Channel
          peerGroupService.sendMessage(content, senderId, senderName, apiKey);
        }
      },

      leaveSession: (participantId) => {
        peerGroupService.leave(participantId);
        set({ activeSession: null, error: null });
      },

      endSession: () => {
        peerGroupService.endRoom();
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

      subscribeToRoom: () => {
        return () => {};
      }
    }),
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
