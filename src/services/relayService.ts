import { io, type Socket } from 'socket.io-client';
import mqtt from 'mqtt';
import type { GroupSession, GroupParticipant, GroupMessage } from '../store/groupSessionStore';

class RoomRelayService {
  private socket: Socket | null = null;
  private mqttClient: mqtt.MqttClient | null = null;
  private useSocketIO: boolean = false;
  private useMqtt: boolean = false;
  private roomCode: string = '';
  private currentUserId: string = '';
  private onStateUpdateCallback: ((session: GroupSession) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;

  // HiveMQ Public MQTT WebSockets Broker (zero-config, firewall-tolerant, forever free)
  private MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
  
  // Public Render Backend URL (connects when custom Node backend is running)
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
      timeout: 3000,
      reconnectionAttempts: 1
    });

    this.socket.on('connect', () => {
      console.log('[Relay] Connected to cloud backend via Socket.IO');
      this.useSocketIO = true;
      this.useMqtt = false;
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

    // 2. Fall back to HiveMQ MQTT over WSS if Socket.IO is unavailable
    const connectFallback = () => {
      if (this.useSocketIO || this.useMqtt) return;
      console.log('[Relay] Socket.IO cloud backend unavailable. Falling back to public MQTT WSS broker...');
      
      const topic = `itoura/room/${this.roomCode}`;
      const clientId = `itoura_${this.currentUserId}_${Math.random().toString(16).substring(2, 8)}`;

      try {
        this.mqttClient = mqtt.connect(this.MQTT_BROKER_URL, {
          clientId,
          clean: true,
          connectTimeout: 5000
        });

        this.mqttClient.on('connect', () => {
          console.log('[Relay Fallback] Connected to HiveMQ Broker! Subscribing to topic:', topic);
          this.useMqtt = true;
          this.mqttClient?.subscribe(topic);
        });

        this.mqttClient.on('message', (t, message) => {
          if (t !== topic) return;
          try {
            const payload = JSON.parse(message.toString());
            // Ignore self-published events
            if (payload.senderUserId === this.currentUserId) return;
            this.handleIncomingEvent(payload);
          } catch (e) {}
        });

        this.mqttClient.on('error', (err) => {
          console.warn('[Relay Fallback] MQTT Broker error:', err);
        });
      } catch (err) {
        console.error('[Relay Fallback] Failed to connect to MQTT:', err);
      }
    };

    this.socket.on('connect_error', () => {
      connectFallback();
    });

    setTimeout(() => {
      if (!this.useSocketIO && !this.useMqtt) {
        connectFallback();
      }
    }, 3500);
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

    if (this.useMqtt && this.mqttClient?.connected) {
      const topic = `itoura/room/${this.roomCode}`;
      try {
        this.mqttClient.publish(topic, JSON.stringify({
          ...payload,
          senderUserId: this.currentUserId
        }));
      } catch (e) {
        console.error('[Relay] MQTT Publish error:', e);
      }
    }
  }

  public disconnect() {
    if (this.mqttClient) {
      try {
        this.mqttClient.end();
      } catch (e) {}
      this.mqttClient = null;
    }
    if (this.socket) {
      try {
        this.socket.disconnect();
      } catch (e) {}
      this.socket = null;
    }
    this.useSocketIO = false;
    this.useMqtt = false;
  }
}

export const roomRelayService = new RoomRelayService();
