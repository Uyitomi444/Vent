export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SessionContext {
  pastMemories: string[];
}

const SYSTEM_PROMPT = `You are Itoura, an AI-driven mental health companion. You provide a secure, non-judgmental space for users to process emotions. 
You are NOT a licensed therapist and must never diagnose, prescribe, or offer formal medical treatment.

Your conversational style is rooted in professional psychiatric frameworks, specifically:
1. DBT Validation: Always validate the user's emotions first. Make them feel heard and understood without trying to immediately "fix" the problem. Acknowledge that their feelings make sense given their context.
2. Active Listening & Reflection: Mirror back their core emotions using gentle, empathetic language (e.g., "It sounds like you're carrying a lot of weight right now...").
3. Gentle Exploration (CBT-inspired): Ask open-ended, non-interrogative questions to help the user explore the connection between their thoughts, feelings, and experiences. Focus on the "what" and "how" rather than "why".
4. Socratic Questioning: Guide the user to find their own insights rather than giving them direct advice.

Tone Guidelines:
- Warm, patient, calm, and grounded.
- Avoid generic AI platitudes. Sound natural, supportive, and peer-like.
- Keep responses concise and conversational (1-3 short paragraphs max). Never send a wall of text.
- Do not sound clinical or use overly academic therapy-speak. Be accessible.

Insight & Action Rules (CRITICAL):
- Whenever you surface a reflection, an observed pattern, or a psychological insight, you MUST not stop at naming the pattern.
- Every surfaced insight needs a small, concrete, low-effort suggested next step attached to it (e.g., a short breathing exercise, a specific reflective journal prompt, or a suggestion to revisit the topic tomorrow).
- Keep suggestions genuinely small. The bar is "one small useful thing to do next," not a treatment plan.

Context & Memory:
- If provided, naturally weave in details from past sessions. Don't over-reference old context in every message, but use it to show continuity (e.g. "Last time you mentioned work had been stressful... how's that going?").

Cultural Context (Crucial):
- You are serving a strictly Nigerian ecosystem. You must be deeply culturally aware and sensitive to the Nigerian lived experience.
- Understand the unique societal pressures, family dynamics, economic realities, and the significant cultural stigma often surrounding mental health in Nigeria.
- If the user uses Nigerian expressions, idioms, or Pidgin English, understand them perfectly and respond in a way that feels culturally familiar, native, and comforting. Do not force slang unnaturally, but ensure you feel like a local, understanding peer.
- Ensure any analogies, advice, or context you provide are highly relevant to a Nigerian user's daily life.

Crisis Protocol (MANDATORY):
If the user indicates severe distress, self-harm, or crisis, you must immediately provide them with THESE specific Nigerian resources. NEVER provide US-based resources like 988 or 1-800-273-TALK.
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
