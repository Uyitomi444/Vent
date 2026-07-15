import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { Send, AlertCircle } from 'lucide-react';

export default function ChatInterface() {
  const { messages, isLoading, error, sendMessage } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || ''; 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    if (!apiKey) {
      alert("Please add your VITE_GROQ_API_KEY to the .env file to talk to Ventila.");
      return;
    }

    const content = input.trim();
    setInput('');
    await sendMessage(content, apiKey);
  };

  return (
    <div className="flex flex-col h-full bg-vent-surface/50 rounded-3xl overflow-hidden shadow-sm border border-white/50 relative">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 1 && (
          <div className="flex flex-col items-center justify-center mb-6 mt-2">
            <img 
              src="/assets/illustrations/Figure_meditating_with_breath-cloud_2K_202607141335.jpeg" 
              alt="Meditating figure" 
              className="w-48 h-48 object-cover mix-blend-multiply opacity-80 rounded-3xl"
            />
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <img 
                src="/assets/illustrations/AI_companion_listening_pose_2K_202607141347.jpeg" 
                alt="Ventila"
                className="w-8 h-8 rounded-full object-cover mr-2 shrink-0 border border-vent-dark/10 shadow-sm"
              />
            )}
            <div className={`max-w-[75%] rounded-3xl p-4 ${msg.role === 'user' ? 'bg-vent-dark text-white rounded-br-sm' : 'bg-white shadow-sm border border-gray-100 rounded-bl-sm text-vent-text'}`}>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <img 
              src="/assets/illustrations/AI_companion_idle_pose_2K_202607141345.jpeg" 
              alt="Ventila thinking"
              className="w-8 h-8 rounded-full object-cover mr-2 shrink-0 border border-vent-dark/10 shadow-sm"
            />
            <div className="bg-white shadow-sm border border-gray-100 rounded-3xl rounded-bl-sm p-4 flex gap-1 items-center h-[52px]">
              <div className="w-2 h-2 bg-vent-dark/40 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-vent-dark/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-vent-dark/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-sm flex items-start gap-2 max-w-[80%] mx-auto mt-4">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/40 backdrop-blur-md border-t border-gray-100">
        <form onSubmit={handleSend} className="relative flex items-end bg-white rounded-3xl shadow-sm border border-gray-200 focus-within:border-vent-dark focus-within:ring-2 focus-within:ring-vent-light transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to Ventila..."
            className="flex-1 max-h-32 min-h-[56px] py-4 pl-6 pr-14 bg-transparent outline-none resize-none font-sans"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-2.5 bg-vent-dark text-white rounded-full disabled:opacity-30 disabled:bg-gray-400 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </form>
        {!apiKey && (
           <p className="text-xs text-center text-red-500 mt-2 font-medium">Missing VITE_GROQ_API_KEY in .env file</p>
        )}
      </div>
    </div>
  );
}
