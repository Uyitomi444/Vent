import type { LanguageCode } from '../i18n';
import { useProfileStore } from '../store/profileStore';

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

export function cleanAiOutput(rawText: string): string {
  let text = rawText || '';

  // 1. If </think> exists, take everything after </think>
  if (text.includes('</think>')) {
    text = text.substring(text.lastIndexOf('</think>') + 8).trim();
  } 
  // 2. If <think> exists but NO </think> (incomplete/truncated reasoning block)
  else if (text.includes('<think>')) {
    const draftMatch = text.match(/(?:Draft Generation|Final Output|Refinement|Draft \d+).*?\n+([^\n]+(?:\n+[^\n]+)*)$/is);
    if (draftMatch && draftMatch[1]) {
      text = draftMatch[1].trim();
    } else {
      const paragraphs = text.split('\n\n').map(p => p.trim()).filter(Boolean);
      text = paragraphs[paragraphs.length - 1] || text;
    }
  }

  // 3. Clean up formatting markers like quotes or prefixes
  text = text.replace(/^["'“]|["'”]$/g, '').trim();
  text = text.replace(/^\[?Itoura\]?:?\s*/i, '').trim();
  text = text.replace(/^\*?\*?(?:Draft|Final Output|Response):?\*?\*?\s*/i, '').trim();

  return text;
}

export async function sendMessageToAI(
  messages: ChatMessage[],
  apiKey: string,
  context?: SessionContext,
  language: LanguageCode = 'en'
): Promise<string> {
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  
  const userAndAssistantMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ role: m.role, content: m.content }));
  
  let finalSystemPrompt = `${SYSTEM_PROMPT}\n\n${LANGUAGE_PROMPT_INSTRUCTIONS[language]}\n\nCRITICAL OUTPUT RULE: Output ONLY your direct conversational words to the user. DO NOT write reasoning, thinking process, or <think> tags.`;

  if (context?.pastMemories?.length) {
    const memoryString = context.pastMemories.map((m, i) => `${i + 1}. ${m}`).join('\n');
    finalSystemPrompt += `\n\nPast Session Memories (use these naturally, don't force them):\n${memoryString}`;
  }

  const profile = useProfileStore.getState().profile;
  if (profile) {
    finalSystemPrompt += `\n\nUser Profile Context:
- User's name: ${profile.name}${profile.nickname ? ` (preferred nickname: "${profile.nickname}")` : ''}. Address them warmly and naturally.
${profile.pronouns ? `- User pronouns: ${profile.pronouns}` : ''}
${profile.bio ? `- Personal mantra/note: "${profile.bio}"` : ''}
${profile.goals?.length ? `- Wellbeing focus areas: ${profile.goals.join(', ')}` : ''}
- Desired Companion Tone: ${
      profile.companionTone === 'grounding'
        ? 'Steady, calm, breath-focused, and anchoring.'
        : profile.companionTone === 'uplifting'
        ? 'Hopeful, encouraging, celebrating micro-wins.'
        : profile.companionTone === 'direct'
        ? 'Thoughtful, concise, practical, and clear.'
        : 'Deeply gentle, empathetic, warm, and soft-spoken.'
    }`;
  }
  
  const payload = {
    model: 'openai/gpt-oss-20b',
    messages: [
      { role: 'system', content: finalSystemPrompt },
      ...userAndAssistantMessages
    ],
    temperature: 0.6
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
6. NO THINKING PROCESS: DO NOT write any reasoning, <think> tags, or analysis. Start your response IMMEDIATELY with your direct words to the group.
7. ${LANGUAGE_PROMPT_INSTRUCTIONS[language]}`;

  const formattedLog = groupMessages.map(m => `[${m.senderName}]: ${m.content}`).join('\n');

  const payload = {
    model: 'openai/gpt-oss-20b',
    messages: [
      { role: 'system', content: GROUP_SYSTEM_PROMPT },
      { role: 'user', content: `Group Discussion Log:\n${formattedLog}\n\nRespond briefly as Itoura (max 2-3 sentences):` }
    ],
    temperature: 0.6
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
  
  const userAndAssistantMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ role: m.role, content: m.content }));
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

export interface CbtReframeResult {
  distortions: string[];
  reframes: string[];
  microStep: string;
  compassionateInsight: string;
}

export async function reframeThought(
  thoughtText: string,
  apiKey: string,
  language: LanguageCode = 'en'
): Promise<CbtReframeResult | null> {
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  const prompt = `You are a warm, certified Cognitive Behavioral Therapy (CBT) expert.
A user shares this distressing, automatic negative thought:
"${thoughtText}"

Analyze this thought using evidence-based CBT cognitive restructuring:
1. Identify 1 to 3 cognitive distortions present (e.g. "Catastrophizing", "All-or-Nothing Thinking", "Mind Reading", "Emotional Reasoning", "Overgeneralization", "Should Statements").
2. Provide 3 gentle, realistic, balanced reframes (compassionate alternative perspectives that reduce cognitive distortion).
3. Provide 1 actionable micro-step (e.g. "Take a 2-minute stretch", "Write down one fact that contradicts this worry").
4. A short warm compassionate insight (1 sentence).

Language instruction: ${LANGUAGE_PROMPT_INSTRUCTIONS[language]}

Return ONLY a valid JSON object:
{
  "distortions": ["...", "..."],
  "reframes": [
    "...",
    "...",
    "..."
  ],
  "microStep": "...",
  "compassionateInsight": "..."
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
          { role: 'system', content: 'You are a warm CBT mental health specialist. Output strictly valid JSON without markdown fences.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = cleanAiOutput(data.choices[0].message.content);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("CBT Reframe error:", err);
    return null;
  }
}

export interface WeeklyWellnessDigest {
  headline: string;
  emotionalSummary: string;
  topTriggers: string[];
  growthHighlights: string[];
  wellnessAdvice: string;
}

export async function generateWeeklyWellnessDigest(
  journalSnippets: string[],
  moodLogs: { mood: string; date: string }[],
  apiKey: string,
  language: LanguageCode = 'en'
): Promise<WeeklyWellnessDigest | null> {
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  const dataContext = `Recent Moods: ${JSON.stringify(moodLogs)}\nRecent Journal Reflections: ${JSON.stringify(journalSnippets)}`;

  const prompt = `You are Itoura, analyzing the user's weekly emotional history:
${dataContext}

Generate a personalized, encouraging Weekly Wellness Digest:
1. "headline": An uplifting, validating title for their week (e.g. "A Week of Navigating Pressure with Resilience").
2. "emotionalSummary": A warm 2-3 sentence overview of their emotional trajectory.
3. "topTriggers": 2-3 recurring challenges or themes noticed.
4. "growthHighlights": 2-3 positive resilience moments, coping attempts, or wins.
5. "wellnessAdvice": A gentle, customized recommendation for the coming week.

Language instruction: ${LANGUAGE_PROMPT_INSTRUCTIONS[language]}

Output strictly valid JSON:
{
  "headline": "...",
  "emotionalSummary": "...",
  "topTriggers": ["...", "..."],
  "growthHighlights": ["...", "..."],
  "wellnessAdvice": "..."
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
          { role: 'system', content: 'You are a warm wellness analyst. Output strictly valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    const content = cleanAiOutput(data.choices[0].message.content);
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("Weekly digest error:", err);
    return null;
  }
}
