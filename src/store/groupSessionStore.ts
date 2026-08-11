import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendGroupMessageToAI } from '../services/ai';
import { useJournalStore } from './journalStore';
import { roomRelayService } from '../services/relayService';

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

        set({ activeSession: newSession, currentUserId: creatorId, error: null, isLoading: false });

        // Connect room to real-time pub/sub relay
        roomRelayService.connectRoom(
          code,
          creatorId,
          (updatedSession) => set({ activeSession: updatedSession, isLoading: false, error: null }),
          () => set({ activeSession: null, isLoading: false })
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
            }
          ],
          status: 'active',
          createdAt: Date.now(),
          creatorId: 'creator-external'
        };

        set({ activeSession: joinedSession, currentUserId: userId, error: null, isLoading: false });

        // Connect room to real-time pub/sub relay
        roomRelayService.connectRoom(
          normalizedCode,
          userId,
          (updatedSession) => set({ activeSession: updatedSession, isLoading: false, error: null }),
          () => set({ activeSession: null, isLoading: false })
        );

        // Publish PEER_JOIN event over real-time relay to room host
        setTimeout(() => {
          roomRelayService.publishEvent({
            type: 'PEER_JOIN',
            code: normalizedCode,
            participant: newParticipant
          });
        }, 500);

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

        // Safety timeout so isLoading resets under any network lag
        const timeoutGuard = setTimeout(() => {
          set({ isLoading: false });
        }, 8000);

        if (currentParticipant.isCreator) {
          // Host publishes updated room state directly to all peers
          roomRelayService.publishEvent({ type: 'ROOM_STATE', session: updatedSession });

          try {
            const companionReply = await sendGroupMessageToAI(
              updatedMessages.filter(m => m.senderId !== 'system'),
              session.sessionLanguage,
              apiKey
            );

            clearTimeout(timeoutGuard);

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
              roomRelayService.publishEvent({ type: 'ROOM_STATE', session: sessionWithAi });
            }
          } catch (err: any) {
            clearTimeout(timeoutGuard);
            set({ error: err.message || 'AI message error', isLoading: false });
          }
        } else {
          // Participant publishes user message event to host
          roomRelayService.publishEvent({
            type: 'SEND_MESSAGE',
            code: session.code,
            content,
            senderId,
            senderName,
            apiKey
          });
        }
      },

      leaveSession: (participantId) => {
        const session = get().activeSession;
        if (session) {
          const leavingParticipant = session.participants.find(p => p.id === participantId);
          const isHost = session.creatorId === participantId;

          if (isHost) {
            roomRelayService.publishEvent({ type: 'ROOM_ENDED', code: session.code });
          } else {
            const updatedParticipants = session.participants.filter(p => p.id !== participantId);
            const leaveMsg: GroupMessage = {
              id: 'msg-sys-' + Date.now(),
              senderId: 'system',
              senderName: 'System',
              content: `👋 ${leavingParticipant?.displayName || 'A participant'} left the session.`,
              timestamp: Date.now()
            };
            const updatedSession = { ...session, participants: updatedParticipants, messages: [...session.messages, leaveMsg] };
            roomRelayService.publishEvent({ type: 'ROOM_STATE', session: updatedSession });
          }
        }

        roomRelayService.disconnect();
        set({ activeSession: null, error: null, isLoading: false });
      },

      endSession: () => {
        const session = get().activeSession;
        if (session) {
          roomRelayService.publishEvent({ type: 'ROOM_ENDED', code: session.code });
        }
        roomRelayService.disconnect();
        set({ activeSession: null, error: null, isLoading: false });
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
        const session = get().activeSession;
        const currentUserId = get().currentUserId;
        if (session && currentUserId) {
          roomRelayService.connectRoom(
            code,
            currentUserId,
            (updatedSession) => set({ activeSession: updatedSession, isLoading: false, error: null }),
            () => set({ activeSession: null, isLoading: false })
          );
        }
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
