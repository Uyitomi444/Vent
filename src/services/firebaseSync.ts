import { db } from './firebase';
import { doc, setDoc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';
import type { GroupSession, GroupParticipant, GroupMessage } from '../store/groupSessionStore';

export class FirestoreGroupService {
  private unsubscribe: (() => void) | null = null;

  public isAvailable(): boolean {
    return db !== null;
  }

  public async createSession(
    session: GroupSession,
    onStateUpdate: (sess: GroupSession) => void,
    onEnded: () => void
  ) {
    if (!db) return;
    this.disconnect();
    try {
      const sessionRef = doc(db, 'group_sessions', session.code);
      await setDoc(sessionRef, session);

      this.unsubscribe = onSnapshot(sessionRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as GroupSession;
          if (data.status === 'ended') {
            onEnded();
          } else {
            onStateUpdate(data);
          }
        }
      });
    } catch (err) {
      console.warn("[Firestore Group] Sync error:", err);
    }
  }

  public async joinSession(
    code: string,
    participant: GroupParticipant,
    onStateUpdate: (sess: GroupSession) => void,
    onEnded: () => void
  ) {
    if (!db) return;
    this.disconnect();
    try {
      const sessionRef = doc(db, 'group_sessions', code.toUpperCase());
      const snap = await getDoc(sessionRef);

      if (snap.exists()) {
        const currentSession = snap.data() as GroupSession;
        const exists = currentSession.participants.some(p => p.id === participant.id);

        if (!exists && currentSession.participants.length < currentSession.maxParticipants) {
          const updatedParticipants = [...currentSession.participants, participant];
          const sysMsg: GroupMessage = {
            id: 'msg-sys-' + Date.now(),
            senderId: 'system',
            senderName: 'System',
            content: `👋 ${participant.displayName} joined the session.`,
            timestamp: Date.now()
          };
          const updatedMessages = [...currentSession.messages, sysMsg];

          await updateDoc(sessionRef, {
            participants: updatedParticipants,
            messages: updatedMessages
          });
        }
      }

      this.unsubscribe = onSnapshot(sessionRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as GroupSession;
          if (data.status === 'ended') {
            onEnded();
          } else {
            onStateUpdate(data);
          }
        }
      });
    } catch (err) {
      console.warn("[Firestore Group] Join error:", err);
    }
  }

  public async updateSession(session: GroupSession) {
    if (!db) return;
    try {
      const sessionRef = doc(db, 'group_sessions', session.code);
      await updateDoc(sessionRef, {
        participants: session.participants,
        messages: session.messages,
        status: session.status
      });
    } catch (err) {
      console.warn("[Firestore Group] Update error:", err);
    }
  }

  public async endSession(code: string) {
    if (!db) return;
    try {
      const sessionRef = doc(db, 'group_sessions', code);
      await updateDoc(sessionRef, { status: 'ended' });
    } catch (err) {}
    this.disconnect();
  }

  public disconnect() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
}

export const firestoreGroupService = new FirestoreGroupService();
