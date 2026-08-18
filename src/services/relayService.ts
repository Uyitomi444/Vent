import mqtt from 'mqtt';
import type { GroupSession, GroupParticipant, GroupMessage } from '../store/groupSessionStore';

class RoomRelayService {
  private mqttClient: mqtt.MqttClient | null = null;
  private roomCode: string = '';
  private currentUserId: string = '';
  private onStateUpdateCallback: ((session: GroupSession) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;
  private outgoingQueue: any[] = [];

  // HiveMQ Public MQTT WebSockets Broker (zero-config, firewall-tolerant, forever free)
  private MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';

  public connectRoom(
    code: string,
    userId: string,
    onStateUpdate: (session: GroupSession) => void,
    onEnded: () => void
  ) {
    const formattedCode = code.toUpperCase();

    // If already connected to the same room, preserve connection and queue!
    if (this.mqttClient?.connected && this.roomCode === formattedCode) {
      console.log('[Decentralized Relay] Already connected to room:', formattedCode);
      this.onStateUpdateCallback = onStateUpdate;
      this.onEndedCallback = onEnded;
      this.flushOutgoingQueue();
      return;
    }

    this.roomCode = formattedCode;
    this.currentUserId = userId;
    this.onStateUpdateCallback = onStateUpdate;
    this.onEndedCallback = onEnded;
    this.disconnect();

    const topic = `itoura/room/decentralized_${this.roomCode}`;
    const clientId = `itoura_${this.currentUserId}_${Math.random().toString(16).substring(2, 8)}`;
    console.log('[Decentralized Relay] Connecting to MQTT broker...', topic);

    try {
      this.mqttClient = mqtt.connect(this.MQTT_BROKER_URL, {
        clientId,
        clean: true,
        connectTimeout: 8000
      });

      this.mqttClient.on('connect', () => {
        console.log('[Decentralized Relay] Connected successfully! Subscribing to topic:', topic);
        this.mqttClient?.subscribe(topic);

        // Flush any queued outgoing events (e.g. PEER_JOIN)
        this.flushOutgoingQueue();

        // Request full state sync from active peers
        this.publishEvent({ type: 'REQUEST_SYNC' });
      });

      this.mqttClient.on('message', (t, message) => {
        if (t !== topic) return;
        try {
          const payload = JSON.parse(message.toString());
          if (payload.senderUserId === this.currentUserId) return;
          this.handleIncomingEvent(payload);
        } catch (e) {
          console.error('[Decentralized Relay] Error parsing event:', e);
        }
      });

      this.mqttClient.on('error', (err) => {
        console.warn('[Decentralized Relay] Connection error:', err);
      });
    } catch (err) {
      console.error('[Decentralized Relay] Connection failed:', err);
    }
  }

  private flushOutgoingQueue() {
    if (!this.mqttClient?.connected) return;
    const topic = `itoura/room/decentralized_${this.roomCode}`;
    while (this.outgoingQueue.length > 0) {
      const payload = this.outgoingQueue.shift();
      try {
        console.log('[Decentralized Relay] Flushing queued event:', payload.type);
        this.mqttClient.publish(topic, JSON.stringify({
          ...payload,
          senderUserId: this.currentUserId
        }));
      } catch (e) {}
    }
  }

  private handleIncomingEvent(payload: any) {
    if (!this.onStateUpdateCallback) return;

    import('../store/groupSessionStore').then(({ useGroupSessionStore }) => {
      const store = useGroupSessionStore.getState();
      const currentSession = store.activeSession;
      if (!currentSession || currentSession.code !== this.roomCode) return;

      if (payload.type === 'REQUEST_SYNC') {
        // Send our current state snapshot to the requesting peer
        this.publishEvent({ type: 'SYNC_STATE', session: currentSession });
      } else if (payload.type === 'SYNC_STATE') {
        const incoming: GroupSession = payload.session;
        const mergedParticipantsMap = new Map<string, GroupParticipant>();
        currentSession.participants.forEach(p => mergedParticipantsMap.set(p.id, p));
        incoming.participants.forEach(p => mergedParticipantsMap.set(p.id, p));

        const mergedMessagesMap = new Map<string, GroupMessage>();
        currentSession.messages.forEach(m => mergedMessagesMap.set(m.id, m));
        incoming.messages.forEach(m => mergedMessagesMap.set(m.id, m));

        const mergedSession: GroupSession = {
          ...currentSession,
          participants: Array.from(mergedParticipantsMap.values()),
          messages: Array.from(mergedMessagesMap.values()).sort((a, b) => a.timestamp - b.timestamp)
        };

        this.onStateUpdateCallback!(mergedSession);
      } else if (payload.type === 'PEER_JOIN') {
        const newPeer: GroupParticipant = payload.participant;
        const exists = currentSession.participants.some(p => p.id === newPeer.id);
        
        const updatedParticipants = exists 
          ? currentSession.participants 
          : [...currentSession.participants, newPeer];

        const sysMsg: GroupMessage = {
          id: 'msg-sys-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
          senderId: 'system',
          senderName: 'System',
          content: `👋 ${newPeer.displayName} joined the session.`,
          timestamp: Date.now()
        };

        const updatedSession = {
          ...currentSession,
          participants: updatedParticipants,
          messages: [...currentSession.messages, sysMsg]
        };

        this.onStateUpdateCallback!(updatedSession);
        // Reply with full SYNC_STATE so joining peer gets all participants and messages immediately
        this.publishEvent({ type: 'SYNC_STATE', session: updatedSession });
      } else if (payload.type === 'MESSAGE') {
        const exists = currentSession.messages.some(m => m.id === payload.message.id);
        if (!exists) {
          const updatedSession = {
            ...currentSession,
            messages: [...currentSession.messages, payload.message]
          };
          this.onStateUpdateCallback!(updatedSession);
        }
      } else if (payload.type === 'LEAVE') {
        const leavingId = payload.participantId;
        const leavingPeer = currentSession.participants.find(p => p.id === leavingId);
        if (leavingPeer) {
          const updatedParticipants = currentSession.participants.filter(p => p.id !== leavingId);
          const sysMsg: GroupMessage = {
            id: 'msg-sys-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
            senderId: 'system',
            senderName: 'System',
            content: `👋 ${leavingPeer.displayName} left the session.`,
            timestamp: Date.now()
          };
          const updatedSession = {
            ...currentSession,
            participants: updatedParticipants,
            messages: [...currentSession.messages, sysMsg]
          };
          this.onStateUpdateCallback!(updatedSession);
        }
      } else if (payload.type === 'ROOM_ENDED') {
        if (this.onEndedCallback) this.onEndedCallback();
      }
    });
  }

  public publishEvent(payload: any) {
    if (!this.mqttClient?.connected) {
      this.outgoingQueue.push(payload);
      return;
    }
    const topic = `itoura/room/decentralized_${this.roomCode}`;
    try {
      this.mqttClient.publish(topic, JSON.stringify({
        ...payload,
        senderUserId: this.currentUserId
      }));
    } catch (e) {
      console.error('[Decentralized Relay] Publish event failed:', e);
      this.outgoingQueue.push(payload);
    }
  }

  public disconnect() {
    if (this.mqttClient) {
      try {
        this.mqttClient.end();
      } catch (e) {}
      this.mqttClient = null;
    }
  }
}

export const roomRelayService = new RoomRelayService();
