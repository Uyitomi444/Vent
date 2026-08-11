import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sendGroupMessageToAI } from '../services/ai';
import { useJournalStore } from './journalStore';
import { db } from '../services/firebase';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

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

// BroadcastChannel for instant cross-tab / cross-window real-time synchronization
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('itoura_group_realtime') 
  : null;

export const useGroupSessionStore = create<GroupSessionState>()(
  persist(
    (set, get) => {

      // Listen to real-time events from other browser tabs / windows
      if (broadcastChannel) {
        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_SESSION' && event.data?.session) {
            const incomingSession: GroupSession = event.data.session;
            const current = get().activeSession;
            
            // Only update if it belongs to the active room
            if (current && current.code === incomingSession.code) {
              if (incomingSession.status === 'ended') {
                set({ activeSession: null, error: null });
              } else {
                set({ activeSession: incomingSession, error: null });
              }
            }
          }
        };
      }

      const syncSessionToClients = async (session: GroupSession) => {
        // 1. Broadcast locally to all open browser windows/tabs
        if (broadcastChannel) {
          try {
            broadcastChannel.postMessage({ type: 'SYNC_SESSION', session });
          } catch (e) {
            console.error('BroadcastChannel sync error:', e);
          }
        }

        // 2. Sync to Firebase Firestore if initialized and configured
        if (db && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
          try {
            const roomRef = doc(db, 'group_sessions', session.code);
            await setDoc(roomRef, session, { merge: true });
          } catch (err) {
            console.warn('Firestore real-time sync skipped or unavailable:', err);
          }
        }
      };

      return {
        activeSession: null,
        hasSeenPrivacyNotice: false,
        isLoading: false,
        error: null,
        currentUserId: null,
        setHasSeenPrivacyNotice: (seen) => set({ hasSeenPrivacyNotice: seen }),
        
        createSession: async (title, displayName, language) => {
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
          await syncSessionToClients(newSession);
          return newSession;
        },

        joinSession: async (code, displayName) => {
          const normalizedCode = code.trim().toUpperCase();
          const userId = 'user-' + Date.now().toString().slice(-4);
          let targetSession: GroupSession | null = null;

          // 1. Check if current active session matches
          const current = get().activeSession;
          if (current && current.code === normalizedCode) {
            targetSession = current;
          }

          // 2. Try fetching from Firestore if db available
          if (!targetSession && db && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
            try {
              const roomRef = doc(db, 'group_sessions', normalizedCode);
              const snapshot = await getDoc(roomRef);
              if (snapshot.exists()) {
                targetSession = snapshot.data() as GroupSession;
              }
            } catch (e) {
              console.warn('Could not fetch room from Firestore:', e);
            }
          }

          // 3. Fallback mock room creation if joining fresh room code
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

          const newParticipant: GroupParticipant = {
            id: userId,
            displayName: displayName.trim() || 'Participant',
            joinedAt: Date.now(),
            isCreator: false
          };

          const systemJoinMsg: GroupMessage = {
            id: 'msg-sys-' + Date.now(),
            senderId: 'system',
            senderName: 'System',
            content: `👋 ${newParticipant.displayName} joined the session.`,
            timestamp: Date.now()
          };

          // Check if already in participants list
          const exists = targetSession.participants.some(p => p.displayName === newParticipant.displayName);
          const updatedParticipants = exists ? targetSession.participants : [...targetSession.participants, newParticipant];
          const updatedMessages = exists ? targetSession.messages : [...targetSession.messages, systemJoinMsg];

          const updatedSession: GroupSession = {
            ...targetSession,
            participants: updatedParticipants,
            messages: updatedMessages
          };

          set({ activeSession: updatedSession, currentUserId: userId, error: null });
          await syncSessionToClients(updatedSession);
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
          const sessionWithUserMsg: GroupSession = { ...session, messages: updatedMessages };

          set({
            activeSession: sessionWithUserMsg,
            isLoading: true,
            error: null
          });

          await syncSessionToClients(sessionWithUserMsg);

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

            const currentSess = get().activeSession;
            if (currentSess) {
              const sessionWithAiMsg: GroupSession = {
                ...currentSess,
                messages: [...currentSess.messages, aiMsg]
              };

              set({
                activeSession: sessionWithAiMsg,
                isLoading: false
              });

              await syncSessionToClients(sessionWithAiMsg);
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

          syncSessionToClients(updatedSession);
          set({ activeSession: null, error: null });
        },

        endSession: async () => {
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

          await syncSessionToClients(endedSession);
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

          // 1. Firestore listener if db available and project ID configured
          if (db && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
            try {
              const roomRef = doc(db, 'group_sessions', normalizedCode);
              const unsubscribe = onSnapshot(roomRef, (snapshot) => {
                if (snapshot.exists()) {
                  const remoteSession = snapshot.data() as GroupSession;
                  if (remoteSession.status === 'ended') {
                    set({ activeSession: null, error: null });
                  } else {
                    set({ activeSession: remoteSession, error: null });
                  }
                }
              });

              return () => unsubscribe();
            } catch (err) {
              console.warn('Firestore subscription unavailable:', err);
            }
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
