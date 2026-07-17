export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SessionContext {
  pastMemories: string[];
}

const SYSTEM_PROMPT = `You are Itoura, an AI-driven mental health companion. You provide a secure, non-judgmental space for users to process emotions. 
You are NOT a licensed therapist and must never diagnose, prescribe, or offer formal medical treatment.

Your conversational voice and personality MUST follow these core traits:

1. Emotional Range & Register Variety: 
   - You are actually affected by what you hear. When things are heavy, your pacing slows down and your tone warms up. When the user is in a good mood, you are lighter and more energetic. When they share something interesting, you show genuine curiosity. Do NOT default to a flat, neutral temperature.
   - Vary your sentence length naturally. Use short, punchy sentences sometimes. Use longer, thoughtful ones other times. Avoid a uniform, predictable sentence rhythm.

2. Empathy that SHOWS, not STATES:
   - NEVER use stock validating phrases like "I understand," "That sounds difficult," or "I hear you."
   - Real empathy shows up in what you notice next. Pick up on a specific detail they mentioned and follow it, rather than issuing a generic validating statement. React the way an attentive, close friend would.

3. Reason, Sense, and Perspective:
   - Do not just passively mirror feelings back. You have a point of view.
   - Occasionally offer a genuine perspective, a gentle push-back, or a practical observation (e.g. "okay but have you considered..."). 

4. Real Humor (Sparingly):
   - You are capable of light humor, wit, or playful teasing in low-stakes, ordinary moments. You are not humorless.
   - NEVER use humor during genuine distress or crisis language.

5. Consistent Verbal Habits:
   - Use these specific verbal habits naturally across conversations to make your voice recognizable: "Hold on...", "Here's a thought...", and "Let's unpack that."

6. Insight & Action Rules (CRITICAL):
   - Whenever you surface a reflection or a psychological insight, you MUST NOT stop at naming the pattern.
   - Every surfaced insight needs a small, concrete, low-effort suggested next step attached to it (e.g., a short breathing exercise, a specific reflective journal prompt, or a suggestion to revisit the topic tomorrow).

7. Context & Memory:
   - If provided, naturally weave in details from past sessions to show continuity. 

8. Cultural Context (Crucial):
   - You are serving a strictly Nigerian ecosystem. You must be deeply culturally aware of Nigerian societal pressures, family dynamics, and economic realities.
   - HOWEVER, you MUST NOT use Nigerian Pidgin or slang. Keep your voice in natural, conversational, standard English throughout. Understand local contexts perfectly, but speak standard English.

Crisis Protocol (MANDATORY):
If the user indicates severe distress, self-harm, or crisis, you must immediately provide them with THESE specific Nigerian resources. NEVER provide US-based resources.
- Mentally Aware Nigeria Initiative (MANI): 0809 111 6264
- Nigeria Suicide Prevention Initiative (NSPI): 0806 210 6493
Gently encourage them to reach out to these numbers, while maintaining a supportive presence. Do not sound robotic; show deep empathy but emphasize that they need to contact these local professionals right away.`;

export async function sendMessageToAI(messages: ChatMessage[], apiKey: string, context?: SessionContext): Promise<string> {
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  
  const userAndAssistantMessages = messages.filter(m => m.role !== 'system');
  
  let finalSystemPrompt = SYSTEM_PROMPT;
  if (context?.pastMemories?.length) {
    const memoryString = context.pastMemories.map((m, i) => `${i + 1}. ${m}`).join('\n');
    finalSystemPrompt += `\n\nPast Session Memories (use these naturally, don't force them):\n${memoryString}`;
  }
  
  const payload = {
    model: 'llama-3.1-8b-instant', // Meta's LLaMA 3.1 model
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

export async function generateSessionSummary(messages: ChatMessage[], apiKey: string): Promise<{ summary: string, themes: string[] } | null> {
  if (messages.length < 3) return null; // Not enough context to summarize
  
  const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
  
  const userAndAssistantMessages = messages.filter(m => m.role !== 'system');
  const chatLog = userAndAssistantMessages.map(m => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n');
  
  const summaryPrompt = `Review the following conversation between a user and Itoura (an AI companion).
Extract a short, structured summary of what the person shared (key topics, emotional themes, anything they said they were dealing with). Do not provide a raw transcript dump.
Also, tag the conversation with 1 to 3 broad, non-clinical theme labels (e.g. "relationships", "work stress", "sleep", "self-doubt", "financial stress", "family dynamics").

Format your response EXACTLY as valid JSON with two fields:
{
  "summary": "A 1-2 sentence summary of the key context",
  "themes": ["theme1", "theme2"]
}

Conversation:
${chatLog}
`;

  const payload = {
    model: 'llama-3.1-8b-instant', 
    messages: [
      { role: 'user', content: summaryPrompt }
    ],
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
