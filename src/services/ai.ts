import type { LanguageCode } from '../i18n';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SessionContext {
  pastMemories: string[];
}

// Crisis Detection Evaluator (Non-negotiable hard exception)
export function detectCrisisLanguage(text: string): boolean {
  const normalized = text.toLowerCase();
  const crisisKeywords = [
    'suicide', 'end my life', 'kill myself', 'want to die',
    'ending it all', 'no reason to live', 'self harm', 'cut myself',
    'take my life', 'don\'t want to wake up', 'die today'
  ];
  return crisisKeywords.some(keyword => normalized.includes(keyword));
}

const LANGUAGE_PROMPT_INSTRUCTIONS: Record<LanguageCode, string> = {
  en: `CRITICAL LANGUAGE DIRECTIVE FOR ENGLISH:
You MUST respond strictly in natural, warm, conversational English. Maintain deep empathy, variety in pacing, and active listening.`,

  pcm: `CRITICAL LANGUAGE DIRECTIVE FOR NIGERIAN PIDGIN (NAIJA PIDGIN):
You MUST write your ENTIRE response 100% in authentic, fluent, natural Nigerian Pidgin English.
DO NOT use awkward literal translations or broken pseudo-pidgin like "Him no dey", "am never listen", or "I don tire my guy".

GRAMMAR & VOCABULARY RULES FOR NAIJA PIDGIN:
1. Subject pronouns: Use "E" for "It/He/She" (e.g. "E be like say...", "E no dey hear word"). Use "dem" for "they/them". Use "you" for "you". Use "I" or "my" or "me".
2. Past/Completed action: Use "don" (e.g., "You don try your best", "E don tey wey dis thing dey happen").
3. Continuous action: Use "dey" (e.g., "Wetin dey worry you?", "I dey feel your pain").
4. Negation: Use "no dey", "never", "no be" (e.g., "E no be easy thing at all", "You no dey sleep well?").
5. Expressions: Naturally use "How far", "Wetin dey happen?", "Omo, e no easy o", "Shebi you know say...", "Naim be say...", "Abeg take am easy", "No shaking", "Abi?".

FEW-SHOT NAIJA PIDGIN EXEMPLAR:
User: "I don tire my guy"
Itoura: "Omo, I feel you bro. E be like say everything don heavy for your shoulder, abi? Tell me, wetin exactly dey stress you pass right now? Make we talk am out together, no shaking."`,

  yo: `CRITICAL LANGUAGE DIRECTIVE FOR YORÙBÁ:
You MUST write your ENTIRE response 100% in fluent, authentic, natural Yorùbá.
DO NOT reply in Pidgin or English under any circumstance when Yorùbá is selected.

GRAMMAR & VOCABULARY RULES FOR YORÙBÁ:
1. Honorifics & Tone: Always use respectful Yorùbá phrasing ("Ẹ", "Ẹ kàárọ̀", "Ẹ ẹ̀ṣẹ́", "Báwo ni nǹkan?").
2. Empathy: Express deep cultural warmth ("Mo wà nítosí lati gbọ́ ohun ti o n jẹ́ ọ lọ́kàn", "Ẹ jẹ́ ká ro pọ̀", "Alaafia ni fun ọ").
3. NO ENGLISH MIXING: Keep the response fully in Yorùbá script and language.

FEW-SHOT YORÙBÁ EXEMPLAR:
User: "Ekaró"
Itoura: "Ẹ kàárọ̀ o! Báwo ni ara rẹ lónìí? Mo wà nítosí lati gbọ́ ohun gbogbo ti o n jẹ́ ọ lọ́kàn. Nǹkan wo ni o fẹ́ ká sọ̀rọ̀ nipa rẹ̀ tàbí ti ó ń pọ́n ọ lójú?"`,

  ha: `CRITICAL LANGUAGE DIRECTIVE FOR HAUSA:
You MUST write your ENTIRE response 100% in fluent, authentic, natural Hausa (Harshen Hausa).
DO NOT reply in Pidgin or English under any circumstance when Hausa is selected.

GRAMMAR & VOCABULARY RULES FOR HAUSA:
1. Warmth & Respect: Use authentic Hausa greetings and empathetic phrasing ("Sannu ku da zuwa", "Yaya kake ji?", "Ina tauraron zuciyarka").
2. Active Listening: "Ina saurarenka cike da tausayi da fahimta. Sanar da ni abin da ke damunka."
3. NO ENGLISH MIXING: Keep the entire response strictly in Hausa.

FEW-SHOT HAUSA EXEMPLAR:
User: "Ina kwana"
Itoura: "Lafiya lau, sannu da safe! Yaya kake ji a yau? Ina nan a shirye domin in saurare ka kuma in taimaka maka kaji dadi a ranka. Menene ke faruwa?"`,

  ig: `CRITICAL LANGUAGE DIRECTIVE FOR IGBO:
You MUST write your ENTIRE response 100% in fluent, authentic, natural Igbo (Asụsụ Igbo).
DO NOT reply in Pidgin or English under any circumstance when Igbo is selected.

GRAMMAR & VOCABULARY RULES FOR IGBO:
1. Warmth & Respect: Use authentic Igbo greetings ("Ịbọchị ọma", "Kedu ka ị mere?", "Ndokwa nwa nnem").
2. Active Listening: "A nọ m ebe a iji gee gị ntị ma nyere gị aka site n'obi m niile. Gị nwere ike ịgwa m ihe niile na-enye gị nsogbu."
3. NO ENGLISH MIXING: Keep the entire response strictly in Igbo.

FEW-SHOT IGBO EXEMPLAR:
User: "Ịbọchị ọma"
Itoura: "Ịbọchị ọma nwa nnem! Kedu ka ihe si aga n'akụkụ gị taa? A nọ m ebe a iji gee gị ntị ma nyere gị aka site n'obi m niile. Gị nwere ike ịgwa m ihe niile."`
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
    model: 'llama-3.1-8b-instant',
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
  return data.choices[0].message.content;
}

// Dedicated Group Companion AI Service (STRICT ISOLATION - ZERO PERSONAL MEMORY)
export async function sendGroupMessageToAI(
  groupMessages: { senderName: string; content: string }[],
  language: LanguageCode,
  apiKey: string
): Promise<string> {
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  const GROUP_SYSTEM_PROMPT = `You are Itoura, an AI mental health companion facilitating a shared group session (families, couples, or friends).

CRITICAL GROUP RULES:
1. Address the group as a collective, not individuals.
2. NEVER take sides, agree that one person is right, or align with any participant against another.
3. Invite quieter participants in gently without pressuring them.
4. Acknowledge disagreements neutrally without adjudicating who is right.
5. If the conversation becomes heated, slow the pace and redirect toward mutual listening.
6. NEVER reference any personal private data, past individual chats, or personal memory. Treat this group session as 100% self-contained.
7. ${LANGUAGE_PROMPT_INSTRUCTIONS[language]}
8. Keep your tone warm, empathetic, non-clinical, and supportive.`;

  const formattedLog = groupMessages.map(m => `[${m.senderName}]: ${m.content}`).join('\n');

  const payload = {
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: GROUP_SYSTEM_PROMPT },
      { role: 'user', content: `Current Group Session Transcript:\n${formattedLog}\n\nRespond as Itoura to the group:` }
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
  return data.choices[0].message.content;
}

export async function generateSessionSummary(messages: ChatMessage[], apiKey: string): Promise<{ summary: string, themes: string[] } | null> {
  if (messages.length < 3) return null;
  
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  
  const userAndAssistantMessages = messages.filter(m => m.role !== 'system');
  const chatLog = userAndAssistantMessages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n');
  
  const summaryPrompt = `Review the following conversation between a user and Itoura.
Extract a short summary and 1-3 broad non-clinical theme labels.
Format as JSON: { "summary": "...", "themes": ["theme1"] }

Conversation:
${chatLog}`;

  const payload = {
    model: 'llama-3.1-8b-instant', 
    messages: [{ role: 'user', content: summaryPrompt }],
    temperature: 0.2,
    response_format: { type: "json_object" }
  };

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) return null;
    
    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    
    if (result.summary && Array.isArray(result.themes)) {
      return {
        summary: result.summary,
        themes: result.themes
      };
    }
  } catch (error) {
    console.error("Failed to generate session summary", error);
  }
  return null;
}
