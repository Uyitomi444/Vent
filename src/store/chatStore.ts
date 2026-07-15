import { create } from 'zustand';
import { sendMessageToAI } from '../services/ai';
import type { ChatMessage } from '../services/ai';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, apiKey: string) => Promise<void>;
  clearMessages: () => void;
}

const INITIAL_MESSAGE: ChatMessage = { 
  role: 'assistant', 
  content: "Hi there. I'm Itoura. This is a safe space to vent, process your thoughts, or just take a breath. What's on your mind today?" 
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [INITIAL_MESSAGE],
  isLoading: false,
  error: null,
  sendMessage: async (content, apiKey) => {
    const userMessage: ChatMessage = { role: 'user', content };
    set((state) => ({ 
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      const responseContent = await sendMessageToAI(get().messages, apiKey);
      set((state) => ({
        messages: [...state.messages, { role: 'assistant', content: responseContent }],
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.message || 'Failed to send message', isLoading: false });
    }
  },
  clearMessages: () => set({ 
    messages: [INITIAL_MESSAGE],
    error: null
  })
}));
