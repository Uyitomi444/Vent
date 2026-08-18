import mqtt from 'mqtt';
import type { GroupSession, GroupParticipant, GroupMessage } from '../store/groupSessionStore';

class RoomRelayService {
  private mqttClient: mqtt.MqttClient | null = null;
  private roomCode: string = '';
  private currentUserId: string = '';
  private onStateUpdateCallback: ((session: GroupSession) => void) | null = null;
  private onEndedCallback: (() => void) | null = null;

  // HiveMQ Public MQTT WebSockets Broker (zero-config, firewall-tolerant, forever free)
  private MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';

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

    const topic = `itoura/room/decentralized_${this.roomCode}`;
    const clientId = `itoura_${this.currentUserId}_${Math.random().toString(16).substring(2, 8)}`;
    console.log('[Decentralized Relay] Connecting to MQTT broker...', topic);

    try {
      this.mqttClient = mqtt.connect(this.MQTT_BROKER_URL, {
        clientId,
        clean: true,
        connectTimeout: 5000
      });

      this.mqttClient.on('connect', () => {
        console.log('[Decentralized Relay] Connected successfully! Subscribing...');
        this.mqttClient?.subscribe(topic);

        // Request full state sync from any active peer in the room
        setTimeout(() => {
          this.publishEvent({ type: 'REQUEST_SYNC' });
        }, 1000);
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

  private handleIncomingEvent(payload: any) {
    if (!this.onStateUpdateCallback) return;

    import('../store/groupSessionStore').then(({ useGroupSessionStore }) => {
      const store = useGroupSessionStore.getState();
      const currentSession = store.activeSession;
      if (!currentSession || currentSession.code !== this.roomCode) return;

      if (payload.type === 'REQUEST_SYNC') {
        // Send our state to the newly joined peer if we have messages or participants
        if (currentSession.participants.length > 1 || currentSession.messages.length > 1) {
          this.publishEvent({ type: 'SYNC_STATE', session: currentSession });
        }
      } else if (payload.type === 'SYNC_STATE') {
        // Sync our local state with the room state from the peer
        this.onStateUpdateCallback!(payload.session);
      } else if (payload.type === 'PEER_JOIN') {
        const newPeer: GroupParticipant = payload.participant;
        const exists = currentSession.participants.some(p => p.id === newPeer.id);
        if (!exists) {
          const updatedParticipants = [...currentSession.participants, newPeer];
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
        }
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
    if (!this.mqttClient?.connected) return;
    const topic = `itoura/room/decentralized_${this.roomCode}`;
    try {
      this.mqttClient.publish(topic, JSON.stringify({
        ...payload,
        senderUserId: this.currentUserId
      }));
    } catch (e) {
      console.error('[Decentralized Relay] Publish event failed:', e);
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
