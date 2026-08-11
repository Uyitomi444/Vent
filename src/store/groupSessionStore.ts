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

// BroadcastChannel for instant cross-tab real-time synchronization
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('itoura_group_realtime') 
  : null;

export const useGroupSessionStore = create<GroupSessionState>()(
  persist(
    (set, get) => {

      // Realtime event emitter over BroadcastChannel + LocalStorage Bus + Firestore
      const emitRealtimeEvent = (eventData: any) => {
        if (broadcastChannel) {
          try {
            broadcastChannel.postMessage(eventData);
          } catch (e) {
            console.error('BroadcastChannel post error:', e);
          }
        }

        // LocalStorage Event Bus for multi-window / multi-tab cross-browser fallback
        try {
          localStorage.setItem('itoura_group_event_bus', JSON.stringify({ ...eventData, _nonce: Math.random() }));
        } catch (e) {}

        // Firestore real-time doc sync if configured
        if (db && import.meta.env.VITE_FIREBASE_PROJECT_ID && eventData.session) {
          try {
            const roomRef = doc(db, 'group_sessions', eventData.session.code);
            setDoc(roomRef, eventData.session, { merge: true });
          } catch (err) {
            console.warn('Firestore real-time sync skipped:', err);
          }
        }
      };

      // Handler for real-time mesh events
      const handleIncomingRealtimeEvent = (eventData: any) => {
        if (!eventData || !eventData.type || !eventData.code) return;
        const current = get().activeSession;
        const normalizedEventCode = eventData.code.trim().toUpperCase();

        if (eventData.type === 'PEER_JOIN') {
          // If this window is hosting or participating in the room, add the new peer
          if (current && current.code === normalizedEventCode) {
            const newPeer: GroupParticipant = eventData.participant;
            const exists = current.participants.some(p => p.displayName.toLowerCase() === newPeer.displayName.toLowerCase());
            
            if (!exists && current.participants.length < current.maxParticipants) {
              const updatedParticipants = [...current.participants, newPeer];
              const systemJoinMsg: GroupMessage = {
                id: 'msg-sys-' + Date.now(),
                senderId: 'system',
                senderName: 'System',
                content: `👋 ${newPeer.displayName} joined the session.`,
                timestamp: Date.now()
              };

              const updatedSession: GroupSession = {
                ...current,
                participants: updatedParticipants,
                messages: [...current.messages, systemJoinMsg]
              };

              set({ activeSession: updatedSession, error: null });

              // Broadcast updated room snapshot to all peers (so the joining peer gets the full state)
              emitRealtimeEvent({
                type: 'ROOM_SNAPSHOT',
                code: normalizedEventCode,
                session: updatedSession
              });
            }
          }
        } else if (eventData.type === 'ROOM_SNAPSHOT') {
          if (eventData.session && normalizedEventCode === eventData.code) {
            const incomingSession: GroupSession = eventData.session;
            
            if (incomingSession.status === 'ended') {
              set({ activeSession: null, error: null });
            } else {
              set({ activeSession: incomingSession, error: null });
            }
          }
        } else if (eventData.type === 'END_ROOM') {
          if (current && current.code === normalizedEventCode) {
            set({ activeSession: null, error: null });
          }
        } else if (eventData.type === 'LEAVE_PEER') {
          if (current && current.code === normalizedEventCode) {
            const updatedParticipants = current.participants.filter(p => p.id !== eventData.participantId);
            const leavingPeer = current.participants.find(p => p.id === eventData.participantId);
            
            const leaveMsg: GroupMessage = {
              id: 'msg-sys-' + Date.now(),
              senderId: 'system',
              senderName: 'System',
              content: `👋 ${leavingPeer?.displayName || 'A participant'} left the session.`,
              timestamp: Date.now()
            };

            const updatedSession: GroupSession = {
              ...current,
              participants: updatedParticipants,
              messages: [...current.messages, leaveMsg]
            };

            set({ activeSession: updatedSession, error: null });
            emitRealtimeEvent({
              type: 'ROOM_SNAPSHOT',
              code: normalizedEventCode,
              session: updatedSession
            });
          }
        }
      };

      // Register BroadcastChannel listener
      if (broadcastChannel) {
        broadcastChannel.onmessage = (e) => {
          handleIncomingRealtimeEvent(e.data);
        };
      }

      // Register LocalStorage Event Bus listener for cross-window / multi-browser tab sync
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', (e) => {
          if (e.key === 'itoura_group_event_bus' && e.newValue) {
            try {
              const eventData = JSON.parse(e.newValue);
              handleIncomingRealtimeEvent(eventData);
            } catch (err) {}
          }
        });
      }

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

          // Save room state locally and broadcast
          try {
            localStorage.setItem(`itoura_room_${code}`, JSON.stringify(newSession));
          } catch (e) {}

          set({ activeSession: newSession, currentUserId: creatorId, error: null });
          emitRealtimeEvent({ type: 'ROOM_SNAPSHOT', code, session: newSession });
          return newSession;
        },

        joinSession: async (code, displayName) => {
          const normalizedCode = code.trim().toUpperCase();
          const userId = 'user-' + Date.now().toString().slice(-4);
          const newParticipant: GroupParticipant = {
            id: userId,
            displayName: displayName.trim() || 'Participant',
            joinedAt: Date.now(),
            isCreator: false
          };

          let targetSession: GroupSession | null = null;

          // 1. Check if host room exists in localStorage
          try {
            const storedRoom = localStorage.getItem(`itoura_room_${normalizedCode}`);
            if (storedRoom) {
              targetSession = JSON.parse(storedRoom);
            }
          } catch (e) {}

          // 2. Check if activeSession in memory matches
          if (!targetSession) {
            const current = get().activeSession;
            if (current && current.code === normalizedCode) {
              targetSession = current;
            }
          }

          // 3. Try fetching from Firestore if db available
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

          // 4. Fallback mock room creation if joining fresh room code
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

          const exists = targetSession.participants.some(p => p.displayName.toLowerCase() === newParticipant.displayName.toLowerCase());
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

          set({ activeSession: updatedSession, currentUserId: userId, error: null });

          // Broadcast PEER_JOIN request to host & all room participants
          emitRealtimeEvent({
            type: 'PEER_JOIN',
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
          const sessionWithUserMsg: GroupSession = { ...session, messages: updatedMessages };

          set({
            activeSession: sessionWithUserMsg,
            isLoading: true,
            error: null
          });

          emitRealtimeEvent({ type: 'ROOM_SNAPSHOT', code: session.code, session: sessionWithUserMsg });

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

              emitRealtimeEvent({ type: 'ROOM_SNAPSHOT', code: currentSess.code, session: sessionWithAiMsg });
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

          emitRealtimeEvent({
            type: 'LEAVE_PEER',
            code: session.code,
            participantId
          });

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

          emitRealtimeEvent({
            type: 'END_ROOM',
            code: session.code,
            session: endedSession
          });

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

          // Firestore listener if db available and project ID configured
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
