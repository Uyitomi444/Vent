import { io, type Socket } from 'socket.io-client';
import type { GroupSession, GroupParticipant, GroupMessage } from '../store/groupSessionStore';

class RoomRelayService {
  private ws: WebSocket | null = null;
  private socket: Socket | null = null;
  private useSocketIO: boolean = false;
  private roomCode: string = '';
  private currentUserId: string = '';
  private onStateUpdateCallback: ((session: GroupSession) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;

  // Free public PieSocket developer test API key (zero-config, firewall-tolerant pub/sub relay)
  private API_KEY = 'oCdZlQk8Pp874NMZuCmthjMQZjtgUr6glwFDVzo5';
  
  // Public Render Backend URL (automatically connects when deployed on Render)
  private BACKEND_URL = 'https://vent-backend-uyitomi.onrender.com';

  public connectRoom(
    code: string,
    userId: string,
    onStateUpdate: (session: GroupSession) => void,
    onEnded: () => void
  ) {
    this.roomCode = code.toUpperCase();
    this.currentUserId = userId;
    this.onStateUpdateCallback = onStateUpdate;
    this.onEndedCallback = onEnded;
    this.disconnect();

    // 1. Try to connect to live Node.js Express/Socket.IO backend on Render
    console.log('[Relay] Attempting Socket.IO connection to cloud backend...');
    this.socket = io(this.BACKEND_URL, {
      transports: ['websocket'],
      timeout: 4000,
      reconnectionAttempts: 2
    });

    this.socket.on('connect', () => {
      console.log('[Relay] Connected to cloud backend via Socket.IO');
      this.useSocketIO = true;
      
      // Request joining the room on the backend server
      this.socket?.emit('JOIN_ROOM', { code: this.roomCode, displayName: 'User' });
    });

    this.socket.on('ROOM_UPDATED', (data: any) => {
      if (data.session && this.onStateUpdateCallback) {
        this.onStateUpdateCallback(data.session);
      }
    });

    this.socket.on('ROOM_ENDED', () => {
      if (this.onEndedCallback) this.onEndedCallback();
    });

    // 2. Fall back to PieSocket WSS if Socket.IO connection fails or times out
    const connectFallback = () => {
      if (this.useSocketIO) return;
      console.log('[Relay] Socket.IO connection timed out or unavailable. Falling back to public WSS room broker...');
      
      // CRITICAL: MUST prefix channel name with "channel_" to enable pub/sub relaying on PieSocket demo server!
      const wsUrl = `wss://demo.piesocket.com/v3/channel_itoura_${this.roomCode}?api_key=${this.API_KEY}&notify_self=0`;
      
      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('[Relay Fallback] Connected to public WSS channel:', this.roomCode);
        };

        this.ws.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);
            if (payload.senderUserId === this.currentUserId) return;
            this.handleIncomingEvent(payload);
          } catch (e) {}
        };
      } catch (err) {
        console.error('[Relay Fallback] Error establishing WSS connection:', err);
      }
    };

    this.socket.on('connect_error', () => {
      connectFallback();
    });

    setTimeout(() => {
      if (!this.useSocketIO && (!this.ws || this.ws.readyState !== WebSocket.OPEN)) {
        connectFallback();
      }
    }, 4500);
  }

  // Handle incoming fallback events
  private handleIncomingEvent(payload: any) {
    if (!this.onStateUpdateCallback) return;

    import('../store/groupSessionStore').then(({ useGroupSessionStore }) => {
      const currentSession = useGroupSessionStore.getState().activeSession;
      if (!currentSession || currentSession.code !== this.roomCode) return;

      const isHost = currentSession.creatorId === this.currentUserId;

      if (payload.type === 'PEER_JOIN' && isHost) {
        const newPeer: GroupParticipant = payload.participant;
        const exists = currentSession.participants.some(p => p.id === newPeer.id);

        if (!exists && currentSession.participants.length < currentSession.maxParticipants) {
          const updatedParticipants = [...currentSession.participants, newPeer];
          const sysMsg: GroupMessage = {
            id: 'msg-sys-' + Date.now(),
            senderId: 'system',
            senderName: 'System',
            content: `👋 ${newPeer.displayName} joined the session.`,
            timestamp: Date.now()
          };
          const updatedSession: GroupSession = {
            ...currentSession,
            participants: updatedParticipants,
            messages: [...currentSession.messages, sysMsg]
          };

          this.onStateUpdateCallback!(updatedSession);
          this.publishEvent({ type: 'ROOM_STATE', session: updatedSession });
        }
      } else if (payload.type === 'ROOM_STATE') {
        if (payload.session.status === 'ended') {
          if (this.onEndedCallback) this.onEndedCallback();
        } else {
          this.onStateUpdateCallback!(payload.session);
        }
      } else if (payload.type === 'SEND_MESSAGE' && isHost) {
        const userMsg: GroupMessage = {
          id: 'msg-' + Date.now(),
          senderId: payload.senderId,
          senderName: payload.senderName,
          content: payload.content,
          timestamp: Date.now()
        };

        const updatedMessages = [...currentSession.messages, userMsg];
        const updatedSession = { ...currentSession, messages: updatedMessages };
        
        this.onStateUpdateCallback!(updatedSession);
        this.publishEvent({ type: 'ROOM_STATE', session: updatedSession });

        if (payload.apiKey) {
          import('./ai').then(async ({ sendGroupMessageToAI }) => {
            try {
              const companionReply = await sendGroupMessageToAI(
                updatedMessages.filter(m => m.senderId !== 'system'),
                currentSession.sessionLanguage,
                payload.apiKey
              );

              const aiMsg: GroupMessage = {
                id: 'msg-ai-' + Date.now(),
                senderId: 'assistant',
                senderName: 'Itoura',
                content: companionReply,
                timestamp: Date.now()
              };

              const sessWithAi = {
                ...updatedSession,
                messages: [...updatedSession.messages, aiMsg]
              };
              this.onStateUpdateCallback!(sessWithAi);
              this.publishEvent({ type: 'ROOM_STATE', session: sessWithAi });
            } catch (err) {
              console.error("AI error:", err);
            }
          });
        }
      } else if (payload.type === 'ROOM_ENDED') {
        if (this.onEndedCallback) this.onEndedCallback();
      }
    });
  }

  public publishEvent(payload: any) {
    if (this.useSocketIO && this.socket?.connected) {
      if (payload.type === 'SEND_MESSAGE') {
        this.socket.emit('SEND_MESSAGE', {
          code: this.roomCode,
          content: payload.content,
          senderId: payload.senderId,
          senderName: payload.senderName,
          apiKey: payload.apiKey
        });
      } else if (payload.type === 'ROOM_ENDED') {
        this.socket.emit('END_ROOM', { code: this.roomCode });
      }
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({
          ...payload,
          senderUserId: this.currentUserId
        }));
      } catch (e) {
        console.error('[Relay] WSS Send error:', e);
      }
    }
  }

  public disconnect() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    if (this.socket) {
      try {
        this.socket.disconnect();
      } catch (e) {}
      this.socket = null;
    }
    this.useSocketIO = false;
  }
}

export const roomRelayService = new RoomRelayService();
