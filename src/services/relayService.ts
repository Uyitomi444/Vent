import type { GroupSession, GroupParticipant, GroupMessage } from '../store/groupSessionStore';

class RoomRelayService {
  private ws: WebSocket | null = null;
  private roomCode: string = '';
  private currentUserId: string = '';
  private onStateUpdateCallback: ((session: GroupSession) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private isReconnecting: boolean = false;

  // Free public PieSocket developer test API key (zero-config, firewall-tolerant pub/sub relay)
  private API_KEY = 'oCdZlQk8Pp874NMZuCmthjMQZjtgUr6glwFDVzo5';

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

    const wsUrl = `wss://demo.piesocket.com/v3/itoura_room_${this.roomCode}?api_key=${this.API_KEY}&notify_self=0`;
    console.log('[Relay] Connecting to real-time pub/sub relay:', wsUrl);

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[Relay] Connected successfully to room:', this.roomCode);
        this.isReconnecting = false;
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          
          // Ignore self-published events
          if (payload.senderUserId === this.currentUserId) return;

          this.handleIncomingEvent(payload);
        } catch (e) {
          console.error('[Relay] Error parsing message:', e);
        }
      };

      this.ws.onclose = (e) => {
        console.log('[Relay] Connection closed:', e.reason);
        // Auto-reconnect once if disconnected unexpectedly
        if (!this.isReconnecting) {
          this.isReconnecting = true;
          setTimeout(() => {
            if (this.roomCode) {
              this.connectRoom(this.roomCode, this.currentUserId, onStateUpdate, onEnded);
            }
          }, 3000);
        }
      };

      this.ws.onerror = (err) => {
        console.error('[Relay] WebSocket error:', err);
      };
    } catch (err) {
      console.error('[Relay] Failed to instantiate WebSocket:', err);
    }
  }

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

        // Trigger AI mediation on Host
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
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    try {
      this.ws.send(JSON.stringify({
        ...payload,
        senderUserId: this.currentUserId
      }));
    } catch (e) {
      console.error('[Relay] Send event error:', e);
    }
  }

  public disconnect() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
  }
}

export const roomRelayService = new RoomRelayService();
