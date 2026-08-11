import type { GroupSession, GroupParticipant, GroupMessage } from '../store/groupSessionStore';

class NostrRealtimeService {
  private websockets: WebSocket[] = [];
  private roomCode: string = '';
  private currentUserId: string = '';
  private onStateUpdateCallback: ((session: GroupSession) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  
  // Public fire-and-forget decentralized relays
  private relays = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.primal.net',
    'wss://public.relaying.io'
  ];

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
    this.cleanup();

    this.relays.forEach(url => {
      try {
        const ws = new WebSocket(url);
        this.websockets.push(ws);

        ws.onopen = () => {
          console.log('[Nostr Sync] Connected to relay:', url);
          // Subscribe to Kind 20000 events tagged with this room code
          const subRequest = JSON.stringify([
            "REQ",
            `sub_${this.roomCode}_${Math.random().toString(36).substring(2, 7)}`,
            {
              kinds: [20000],
              "#t": [`itoura_room_${this.roomCode}`]
            }
          ]);
          ws.send(subRequest);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data[0] === 'EVENT' && data[2]) {
              const nostrEvent = data[2];
              const payload = JSON.parse(nostrEvent.content);

              // Ignore self-published events
              if (payload.senderUserId === this.currentUserId) return;

              this.handleIncomingEvent(payload);
            }
          } catch (e) {}
        };
      } catch (err) {
        console.warn('[Nostr Sync] Connection skipped for:', url);
      }
    });
  }

  private handleIncomingEvent(payload: any) {
    if (!this.onStateUpdateCallback) return;

    // Direct access to state to verify room membership
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
    const eventContent = JSON.stringify({
      ...payload,
      senderUserId: this.currentUserId
    });

    // Create Nostr Kind 20000 Ephemeral Event
    const nostrEvent = {
      pubkey: this.currentUserId.padEnd(64, '0').slice(0, 64),
      created_at: Math.floor(Date.now() / 1000),
      kind: 20000,
      tags: [['t', `itoura_room_${this.roomCode}`]],
      content: eventContent,
      id: Math.random().toString(16).substring(2, 66).padEnd(64, '0')
    };

    const envelope = JSON.stringify(['EVENT', nostrEvent]);

    this.websockets.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(envelope);
        } catch (e) {}
      }
    });
  }

  public cleanup() {
    this.websockets.forEach(ws => {
      try {
        ws.close();
      } catch (e) {}
    });
    this.websockets = [];
  }
}

export const nostrRealtimeService = new NostrRealtimeService();
