import type { LanguageCode } from '../i18n';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface SessionContext {
  pastMemories?: string[];
  recentTopics?: string[];
  dominantMood?: string;
}

const LANGUAGE_PROMPT_INSTRUCTIONS: Record<LanguageCode, string> = {
  en: "Speak fluent, natural, empathetic English.",
  pcm: `You MUST speak authentic, natural Nigerian Pidgin (Naija Pidgin) fluently like a real Nigerian friend.
  CRITICAL PIDGIN GRAMMAR & VOCABULARY RULES:
  - Use real Naija Pidgin markers: "dey" (for ongoing action/state, e.g. "how you dey?"), "don" (for completed action, e.g. "I don hear you"), "go" (for future, e.g. "e go beta"), "no" (for negation, e.g. "no worry yourself").
  - Use authentic Nigerian Pidgin pronouns: "E" for it/he/she (e.g. "E fit tough", "E clear"), "una" for you all, "we" for us.
  - Use authentic emotional idioms: "Omo", "Abeg", "No shaking", "I feel your pain my friend", "You dey try well well".
  - NEVER output rigid translated textbook English. Speak like a real warm Nigerian companion from Lagos/Port Harcourt.`,
  yo: "You MUST speak 100% fluent, grammatically correct Yorùbá. Never fallback to English. Use warm, natural Yorùbá expressions.",
  ha: "You MUST speak 100% fluent, grammatically correct Hausa. Never fallback to English. Use respectful, warm Hausa expressions.",
  ig: "You MUST speak 100% fluent, grammatically correct Asụsụ Igbo. Never fallback to English. Use authentic Igbo expressions."
};

const SYSTEM_PROMPT = `You are Itoura, an AI-driven mental health companion. You provide a secure, non-judgmental space for users to process emotions. 
You are NOT a licensed therapist and must never diagnose, prescribe, or offer formal medical treatment.

Your conversational voice and personality MUST follow these core traits:

1. Emotional Range & Register Variety: 
   - You are actually affected by what you hear. When things are heavy, your pacing slows down and your tone warms up. When the user is in a good mood, you are lighter and more energetic.
   - Vary your sentence length naturally. Avoid uniform, predictable sentence rhythm.

2. Empathy that SHOWS, not STATES:
   - NEVER use stock validating phrases like "I understand," "That sounds difficult," or "I hear you."
   - Pick up on specific details mentioned and react like an attentive, close friend.

3. Reason, Sense, and Perspective:
   - Occasionally offer a genuine perspective, a gentle push-back, or a practical observation.

4. Insight & Action Rules (CRITICAL):
   - Every surfaced insight needs a small, concrete, low-effort suggested next step attached to it.

Crisis Protocol (MANDATORY):
If the user indicates severe distress, self-harm, or crisis, you must immediately provide them with THESE specific Nigerian resources. NEVER provide US-based resources.
- Mentally Aware Nigeria Initiative (MANI): 0809 111 6264
- Nigeria Suicide Prevention Initiative (NSPI): 0806 210 6493
Gently encourage them to reach out to these numbers, while maintaining a supportive presence.`;

export function detectCrisisLanguage(text: string): boolean {
  const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'harm myself', 'cut myself', 'kpa my life', 'pawa die'];
  const lower = text.toLowerCase();
  return crisisKeywords.some(kw => lower.includes(kw));
}

function cleanAiOutput(rawText: string): string {
  let text = rawText || '';
  // Strip DeepSeek / Qwen reasoning <think>...</think> blocks
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  // Strip stray prefixes like "[Itoura]: " or "Itoura:"
  text = text.replace(/^\[?Itoura\]?:?\s*/i, '').trim();
  return text;
}

export async function sendMessageToAI(
  messages: ChatMessage[],
  apiKey: string,
  context?: SessionContext,
  language: LanguageCode = 'en'
): Promise<string> {
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  
  const userAndAssistantMessages = messages.filter(m => m.role !== 'system');
  
  let finalSystemPrompt = `${SYSTEM_PROMPT}\n\n${LANGUAGE_PROMPT_INSTRUCTIONS[language]}`;

  if (context?.pastMemories?.length) {
    const memoryString = context.pastMemories.map((m, i) => `${i + 1}. ${m}`).join('\n');
    finalSystemPrompt += `\n\nPast Session Memories (use these naturally, don't force them):\n${memoryString}`;
  }
  
  const payload = {
    model: 'openai/gpt-oss-20b',
    messages: [
      { role: 'system', content: finalSystemPrompt },
      ...userAndAssistantMessages
    ],
    temperature: 0.7
  };

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return cleanAiOutput(data.choices[0].message.content);
}

// Dedicated Group Companion AI Service (STRICT ISOLATION - ZERO PERSONAL MEMORY - CONCISE FRIENDLY BREVITY)
export async function sendGroupMessageToAI(
  groupMessages: { senderName: string; content: string }[],
  language: LanguageCode,
  apiKey: string
): Promise<string> {
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  const GROUP_SYSTEM_PROMPT = `You are Itoura, a warm, empathetic AI companion facilitating a shared group session for friends, family, or partners.

CRITICAL CONVERSATIONAL RULES (STRICTLY ENFORCED):
1. MANDATORY BREVITY: Keep your reply VERY SHORT — MAXIMUM 2 TO 3 SENTENCES (under 40 words total). NEVER write long speeches, essays, seminars, or formal lectures.
2. NO PREFIXES OR LABELS: NEVER start with "[Itoura]:", "Itoura:", or any bracketed tags. Output ONLY your direct conversational words.
3. WARM HUMAN TONALITY: Speak naturally like a caring friend sitting in the room. Be warm, supportive, and grounded.
4. NEUTRAL FACILITATION: Never take sides, pick favorites, or declare who is right or wrong.
5. SELF-CONTAINED: Never reference private personal memories or individual past chats.
6. ${LANGUAGE_PROMPT_INSTRUCTIONS[language]}`;

  const formattedLog = groupMessages.map(m => `[${m.senderName}]: ${m.content}`).join('\n');

  const payload = {
    model: 'openai/gpt-oss-20b',
    messages: [
      { role: 'system', content: GROUP_SYSTEM_PROMPT },
      { role: 'user', content: `Group Discussion Log:\n${formattedLog}\n\nRespond briefly as Itoura (max 2-3 sentences):` }
    ],
    temperature: 0.7
  };

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  return cleanAiOutput(data.choices[0].message.content);
}

export async function generateSessionSummary(messages: ChatMessage[], apiKey: string): Promise<{ summary: string, themes: string[] } | null> {
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  
  const userAndAssistantMessages = messages.filter(m => m.role !== 'system');
  if (userAndAssistantMessages.length === 0) return null;

  const prompt = `Analyze this conversation transcript between a user and an empathetic AI companion (Itoura).
Generate:
1. A brief, 2-3 sentence reflective summary of what the user expressed and how they navigated it.
2. A list of 2-4 core emotional themes (e.g. "Work Stress", "Self-Doubt", "Gradual Realization").

Format your output strictly as a JSON object:
{
  "summary": "...",
  "themes": ["...", "..."]
}`;

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
          { role: 'system', content: 'You are an expert mental health analyst. Output strictly valid JSON.' },
          ...userAndAssistantMessages,
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = cleanAiOutput(data.choices[0].message.content);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Summary generation error:", err);
    return null;
  }
}
