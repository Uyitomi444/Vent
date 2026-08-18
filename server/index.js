import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory room store: Map<roomCode, GroupSession>
const rooms = new Map();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function cleanAiOutput(rawText) {
  let text = rawText || '';
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  text = text.replace(/^\[?Itoura\]?:?\s*/i, '').trim();
  return text;
}

async function sendGroupMessageToAI(messages, language, apiKey) {
  if (!apiKey) return "Thank you for sharing with the group. Let's keep supporting one another.";

  const GROUP_SYSTEM_PROMPT = `You are Itoura, a warm, empathetic AI companion facilitating a shared group session for friends, family, or partners.

CRITICAL CONVERSATIONAL RULES (STRICTLY ENFORCED):
1. MANDATORY BREVITY: Keep your reply VERY SHORT — MAXIMUM 2 TO 3 SENTENCES (under 40 words total). NEVER write long speeches, essays, seminars, or formal lectures.
2. NO PREFIXES OR LABELS: NEVER start with "[Itoura]:", "Itoura:", or any bracketed tags. Output ONLY your direct conversational words.
3. WARM HUMAN TONALITY: Speak naturally like a caring friend sitting in the room. Be warm, supportive, and grounded.
4. NEUTRAL FACILITATION: Never take sides, pick favorites, or declare who is right or wrong.
5. Language: ${language}`;

  const formattedLog = messages.map(m => `[${m.senderName}]: ${m.content}`).join('\n');

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: GROUP_SYSTEM_PROMPT },
          { role: 'user', content: `Group Discussion Log:\n${formattedLog}\n\nRespond briefly as Itoura (max 2-3 sentences):` }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) return "I hear you all. Let's take a moment together.";
    const data = await response.json();
    return cleanAiOutput(data.choices[0].message.content);
  } catch (err) {
    console.error("AI service error:", err);
    return "Thank you for sharing with the group. Let me know how everyone is feeling.";
  }
}

io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // 1. Create Room
  socket.on('CREATE_ROOM', ({ title, displayName, language }) => {
    const creatorId = 'user-' + Date.now().toString().slice(-4);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const initialMessage = {
      id: 'msg-init-' + Date.now(),
      senderId: 'assistant',
      senderName: 'Itoura',
      content: `Welcome to this group session. I am Itoura, present to facilitate a supportive conversation for everyone present. Feel free to share when you're ready.`,
      timestamp: Date.now()
    };

    const newSession = {
      id: 'grp-' + Date.now(),
      code,
      title: title.trim() || 'Group Discussion',
      sessionLanguage: language || 'en',
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

    rooms.set(code, newSession);
    socket.join(code);

    socket.emit('ROOM_CREATED', { session: newSession, currentUserId: creatorId });
  });

  // 2. Join Room
  socket.on('JOIN_ROOM', ({ code, displayName }) => {
    const normalizedCode = code.trim().toUpperCase();
    let session = rooms.get(normalizedCode);

    if (!session) {
      const creatorId = 'creator-external';
      session = {
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
        creatorId
      };
      rooms.set(normalizedCode, session);
    }

    if (session.participants.length >= session.maxParticipants) {
      socket.emit('ERROR', { message: 'Session is full (maximum 6 participants).' });
      return;
    }

    const userId = 'user-' + Date.now().toString().slice(-4);
    const newParticipant = {
      id: userId,
      displayName: displayName.trim() || 'Participant',
      joinedAt: Date.now(),
      isCreator: session.participants.length === 0
    };

    const exists = session.participants.some(p => p.displayName.toLowerCase() === newParticipant.displayName.toLowerCase());
    if (!exists) {
      session.participants.push(newParticipant);
      session.messages.push({
        id: 'msg-sys-' + Date.now(),
        senderId: 'system',
        senderName: 'System',
        content: `👋 ${newParticipant.displayName} joined the session.`,
        timestamp: Date.now()
      });
    }

    socket.join(normalizedCode);
    io.to(normalizedCode).emit('ROOM_UPDATED', { session });
    socket.emit('JOINED_SUCCESS', { currentUserId: userId });
  });

  // 3. Send Message
  socket.on('SEND_MESSAGE', async ({ code, content, senderId, senderName, apiKey }) => {
    const normalizedCode = code.trim().toUpperCase();
    const session = rooms.get(normalizedCode);

    if (!session || session.status === 'ended') return;

    const userMsg = {
      id: 'msg-' + Date.now(),
      senderId,
      senderName,
      content,
      timestamp: Date.now()
    };

    session.messages.push(userMsg);
    io.to(normalizedCode).emit('ROOM_UPDATED', { session });

    // AI Response
    try {
      io.to(normalizedCode).emit('AI_THINKING', { isThinking: true });
      const companionReply = await sendGroupMessageToAI(
        session.messages.filter(m => m.senderId !== 'system'),
        session.sessionLanguage,
        apiKey
      );

      const aiMsg = {
        id: 'msg-ai-' + Date.now(),
        senderId: 'assistant',
        senderName: 'Itoura',
        content: companionReply,
        timestamp: Date.now()
      };

      session.messages.push(aiMsg);
      io.to(normalizedCode).emit('ROOM_UPDATED', { session });
      io.to(normalizedCode).emit('AI_THINKING', { isThinking: false });
    } catch (err) {
      console.error('AI response error:', err);
      io.to(normalizedCode).emit('AI_THINKING', { isThinking: false });
    }
  });

  // 4. Leave Room
  socket.on('LEAVE_ROOM', ({ code, participantId }) => {
    const normalizedCode = code.trim().toUpperCase();
    const session = rooms.get(normalizedCode);

    if (!session) return;

    const leavingParticipant = session.participants.find(p => p.id === participantId);
    session.participants = session.participants.filter(p => p.id !== participantId);

    session.messages.push({
      id: 'msg-sys-' + Date.now(),
      senderId: 'system',
      senderName: 'System',
      content: `👋 ${leavingParticipant?.displayName || 'A participant'} left the session.`,
      timestamp: Date.now()
    });

    socket.leave(normalizedCode);

    if (session.participants.length === 0) {
      rooms.delete(normalizedCode);
    } else {
      io.to(normalizedCode).emit('ROOM_UPDATED', { session });
    }
  });

  // 5. End Room
  socket.on('END_ROOM', ({ code }) => {
    const normalizedCode = code.trim().toUpperCase();
    const session = rooms.get(normalizedCode);

    if (!session) return;

    session.status = 'ended';
    session.messages.push({
      id: 'msg-sys-' + Date.now(),
      senderId: 'system',
      senderName: 'System',
      content: `🛑 Group session has been ended by the host.`,
      timestamp: Date.now()
    });

    io.to(normalizedCode).emit('ROOM_ENDED', { session });
    rooms.delete(normalizedCode);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[Itoura Realtime Server] Running on http://localhost:${PORT}`);
});
