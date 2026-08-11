import Peer, { type DataConnection } from 'peerjs';
import type { GroupSession, GroupParticipant, GroupMessage } from '../store/groupSessionStore';

class PeerGroupService {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map();
  private hostConn: DataConnection | null = null;
  private isHost: boolean = false;
  private roomCode: string = '';

  // Initialize as Host when creating a room
  public initHost(code: string, onStateUpdate: (session: GroupSession) => void, getSession: () => GroupSession | null) {
    this.roomCode = code.toUpperCase();
    this.isHost = true;
    this.cleanup();

    const hostPeerId = `itoura-room-${this.roomCode}-host`;
    this.peer = new Peer(hostPeerId, {
      debug: 1
    });

    this.peer.on('open', (id) => {
      console.log('[PeerJS Host] Room opened with ID:', id);
    });

    this.peer.on('connection', (conn) => {
      console.log('[PeerJS Host] Incoming participant connection from:', conn.peer);
      this.connections.set(conn.peer, conn);

      conn.on('data', async (data: any) => {
        const currentSession = getSession();
        if (!currentSession) return;

        if (data.type === 'PEER_JOIN') {
          const newParticipant: GroupParticipant = data.participant;
          const exists = currentSession.participants.some(p => p.displayName.toLowerCase() === newParticipant.displayName.toLowerCase());
          
          let updatedParticipants = currentSession.participants;
          let updatedMessages = currentSession.messages;

          if (!exists && currentSession.participants.length < currentSession.maxParticipants) {
            updatedParticipants = [...currentSession.participants, newParticipant];
            const sysMsg: GroupMessage = {
              id: 'msg-sys-' + Date.now(),
              senderId: 'system',
              senderName: 'System',
              content: `👋 ${newParticipant.displayName} joined the session.`,
              timestamp: Date.now()
            };
            updatedMessages = [...currentSession.messages, sysMsg];
          }

          const updatedSession: GroupSession = {
            ...currentSession,
            participants: updatedParticipants,
            messages: updatedMessages
          };

          onStateUpdate(updatedSession);
          this.broadcastToAll({ type: 'ROOM_STATE', session: updatedSession });
        } else if (data.type === 'SEND_MESSAGE') {
          const userMsg: GroupMessage = {
            id: 'msg-' + Date.now(),
            senderId: data.senderId,
            senderName: data.senderName,
            content: data.content,
            timestamp: Date.now()
          };

          const updatedMessages = [...currentSession.messages, userMsg];
          const updatedSession: GroupSession = { ...currentSession, messages: updatedMessages };
          onStateUpdate(updatedSession);
          this.broadcastToAll({ type: 'ROOM_STATE', session: updatedSession });

          // Trigger AI mediation on Host
          if (data.apiKey) {
            try {
              const { sendGroupMessageToAI } = await import('./ai');
              const companionReply = await sendGroupMessageToAI(
                updatedMessages.filter(m => m.senderId !== 'system'),
                currentSession.sessionLanguage,
                data.apiKey
              );

              const aiMsg: GroupMessage = {
                id: 'msg-ai-' + Date.now(),
                senderId: 'assistant',
                senderName: 'Itoura',
                content: companionReply,
                timestamp: Date.now()
              };

              const sessWithAi: GroupSession = {
                ...updatedSession,
                messages: [...updatedSession.messages, aiMsg]
              };
              onStateUpdate(sessWithAi);
              this.broadcastToAll({ type: 'ROOM_STATE', session: sessWithAi });
            } catch (err) {
              console.error("AI error:", err);
            }
          }
        } else if (data.type === 'LEAVE') {
          const leavingId = data.participantId;
          const updatedParticipants = currentSession.participants.filter(p => p.id !== leavingId);
          const leavingUser = currentSession.participants.find(p => p.id === leavingId);
          
          const sysMsg: GroupMessage = {
            id: 'msg-sys-' + Date.now(),
            senderId: 'system',
            senderName: 'System',
            content: `👋 ${leavingUser?.displayName || 'A participant'} left the session.`,
            timestamp: Date.now()
          };

          const updatedSession: GroupSession = {
            ...currentSession,
            participants: updatedParticipants,
            messages: [...currentSession.messages, sysMsg]
          };

          onStateUpdate(updatedSession);
          this.broadcastToAll({ type: 'ROOM_STATE', session: updatedSession });
          this.connections.delete(conn.peer);
        }
      });

      conn.on('close', () => {
        this.connections.delete(conn.peer);
      });
    });

    this.peer.on('error', (err) => {
      console.warn('[PeerJS Host Error]:', err);
    });
  }

  // Join an existing room as a Participant
  public joinRoom(code: string, participant: GroupParticipant, onStateUpdate: (session: GroupSession) => void, onEnded: () => void) {
    this.roomCode = code.toUpperCase();
    this.isHost = false;
    this.cleanup();

    this.peer = new Peer({ debug: 1 });

    this.peer.on('open', () => {
      const hostPeerId = `itoura-room-${this.roomCode}-host`;
      console.log('[PeerJS Client] Connecting to host:', hostPeerId);
      
      const conn = this.peer!.connect(hostPeerId);
      this.hostConn = conn;

      conn.on('open', () => {
        console.log('[PeerJS Client] Connected to host! Sending PEER_JOIN...');
        conn.send({ type: 'PEER_JOIN', participant });
      });

      conn.on('data', (data: any) => {
        if (data.type === 'ROOM_STATE' && data.session) {
          if (data.session.status === 'ended') {
            onEnded();
          } else {
            onStateUpdate(data.session);
          }
        } else if (data.type === 'ROOM_ENDED') {
          onEnded();
        }
      });

      conn.on('close', () => {
        console.log('[PeerJS Client] Connection to host closed');
      });
    });

    this.peer.on('error', (err) => {
      console.warn('[PeerJS Client Error]:', err);
    });
  }

  // Send message to host (if client)
  public sendMessage(content: string, senderId: string, senderName: string, apiKey: string) {
    if (this.hostConn && this.hostConn.open) {
      this.hostConn.send({
        type: 'SEND_MESSAGE',
        content,
        senderId,
        senderName,
        apiKey
      });
    }
  }

  // Broadcast state to all connected peers (if host)
  public broadcastToAll(data: any) {
    this.connections.forEach((conn) => {
      if (conn.open) {
        try {
          conn.send(data);
        } catch (e) {}
      }
    });
  }

  public leave(participantId: string) {
    if (!this.isHost && this.hostConn && this.hostConn.open) {
      this.hostConn.send({ type: 'LEAVE', participantId });
    }
    this.cleanup();
  }

  public endRoom() {
    if (this.isHost) {
      this.broadcastToAll({ type: 'ROOM_ENDED' });
    }
    this.cleanup();
  }

  public cleanup() {
    this.connections.forEach((conn) => conn.close());
    this.connections.clear();
    if (this.hostConn) {
      this.hostConn.close();
      this.hostConn = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }
}

export const peerGroupService = new PeerGroupService();
