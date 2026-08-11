import { create } from 'zustand';
import { sendMessageToAI, detectCrisisLanguage } from '../services/ai';
import type { ChatMessage } from '../services/ai';
import { useMemoryStore } from './memoryStore';
import { useSubscriptionStore } from './subscriptionStore';
import { useLanguageStore } from '../i18n';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, apiKey: string) => Promise<void>;
  clearMessages: () => void;
  setMessages: (messages: ChatMessage[]) => void;
}

const INITIAL_MESSAGE: ChatMessage = { 
  id: 'init-msg',
  timestamp: Date.now(),
  role: 'assistant', 
  content: "Hi there. I'm Itoura. This is a safe space to vent, process your thoughts, or just take a breath. What's on your mind today?" 
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [INITIAL_MESSAGE],
  isLoading: false,
  error: null,
  sendMessage: async (content, apiKey) => {
    const userMessage: ChatMessage = { 
      id: 'msg-user-' + Date.now(),
      timestamp: Date.now(),
      role: 'user', 
      content 
    };
    const { status, responseCount, maxFreeResponses, openPaywall, incrementResponseCount } = useSubscriptionStore.getState();
    const isCrisis = detectCrisisLanguage(content);

    // HARD CRISIS PATHWAY OVERRIDE:
    // If distress/crisis is detected, BYPASS the paywall completely!
    if (!isCrisis && status === 'free' && responseCount >= maxFreeResponses) {
      openPaywall();
      return;
    }

    set((state) => ({ 
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      // Memory context
      const memories = useMemoryStore.getState().memories;
      const pastMemories = memories.map(m => m.summary);
      const activeLanguage = useLanguageStore.getState().currentLanguage;
      
      const responseContent = await sendMessageToAI(
        get().messages,
        apiKey,
        { pastMemories },
        activeLanguage
      );
      
      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        timestamp: Date.now(),
        role: 'assistant',
        content: responseContent
      };

      set((state) => ({
        messages: [...state.messages, aiMsg],
        isLoading: false
      }));

      // Increment response count for free tier
      if (!isCrisis && status === 'free') {
        incrementResponseCount();
        const updatedCount = useSubscriptionStore.getState().responseCount;
        if (updatedCount >= maxFreeResponses) {
          // Open paywall after the 5th message completes its full thought
          setTimeout(() => {
            openPaywall();
          }, 1500);
        }
      }

    } catch (err: any) {
      set({ 
        error: err.message || 'Failed to send message', 
        isLoading: false 
      });
    }
  },
  clearMessages: () => set({ messages: [INITIAL_MESSAGE] }),
  setMessages: (messages) => set({ messages })
}));
