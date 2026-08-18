function cleanAiOutput(rawText) {
  let text = rawText || '';

  // 1. If </think> exists, take everything after </think>
  if (text.includes('</think>')) {
    text = text.substring(text.lastIndexOf('</think>') + 8).trim();
  } 
  // 2. If <think> exists but NO </think> (truncated/missing </think> tag)
  else if (text.includes('<think>')) {
    // Strip everything from <think> to the start of final response
    const draftMatch = text.match(/(?:Draft Generation|Final Output|Refinement|Draft \d+).*?\n+([^\n]+(?:\n+[^\n]+)*)$/is);
    if (draftMatch && draftMatch[1]) {
      text = draftMatch[1].trim();
    } else {
      // Fallback: Take the last non-empty paragraph
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

// Test case 1: Incomplete <think> without closing tag (from user's screenshot)
const screenshotText = `<think>
Here's a thinking process:

1. **Analyze User Input:**
- Group Discussion Log shows a conversation about a technical issue (participant numbers not showing when someone joins).
- Carl says "Still not working"
- Itoura (previous) asked for error messages/recent changes
- Uyi clarifies: "i mean the participant numbers are not showing and when someone joins the session, it still does not show"
- I need to respond as Itoura, following strict rules.

2. **Check Constraints:**
- MANDATORY BREVITY: MAX 2-3 sentences, under 40 words.
- NO PREFIXES/LABELS: Just the direct response.
- WARM HUMAN TONALITY: Caring, supportive, grounded.
- NEUTRAL FACILITATION: No taking sides.
- SELF-CONTAINED: No referencing past chats/memories.
- Language: Fluent, natural, empathetic English.

3. **Draft Generation (Mental):**
Thanks for clarifying that, Uyi. Let's try refreshing the page or checking if any pop-up blockers might be hiding that count. I'm right here with you both as we figure this out together.`;

console.log("--- TEST RESULT 1 ---");
console.log(cleanAiOutput(screenshotText));

// Test case 2: Complete <think>...</think>
const completeText = `<think>Some thinking here...</think>\n\nHi Uyi! I hear you loud and clear.`;
console.log("\n--- TEST RESULT 2 ---");
console.log(cleanAiOutput(completeText));
