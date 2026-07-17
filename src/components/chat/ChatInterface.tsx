import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useMemoryStore } from '../../store/memoryStore';
import { generateSessionSummary } from '../../services/ai';
import { Send, AlertCircle, Mic, MicOff, Save } from 'lucide-react';
import MascotPose from '../MascotPose';

export default function ChatInterface() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChatStore();
  const { addMemory } = useMemoryStore();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || ''; 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        
        recognitionRef.current.onresult = (event: any) => {
          const newTranscript = event.results[event.results.length - 1][0].transcript;
          setInput((prev) => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + newTranscript.trim());
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) toggleRecording();
    if (!input.trim() || isLoading || isSummarizing) return;
    
    if (!apiKey) {
      alert("Please add your VITE_GROQ_API_KEY to the .env file to talk to Itoura.");
      return;
    }

    const content = input.trim();
    setInput('');
    await sendMessage(content, apiKey);
  };

  const handleSaveSession = async () => {
    if (!apiKey || messages.length < 3) return;
    setIsSummarizing(true);
    const result = await generateSessionSummary(messages, apiKey);
    if (result) {
      addMemory(result.summary, result.themes, messages);
    }
    clearMessages();
    setIsSummarizing(false);
  };

  return (
    <div className="flex flex-col h-full bg-itoura-surface/50 rounded-3xl overflow-hidden shadow-sm border border-white/50 relative">
      {/* Header controls */}
      {messages.length >= 3 && (
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleSaveSession}
            disabled={isSummarizing || isLoading}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-itoura-primary/20 text-itoura-dark text-sm font-medium rounded-full shadow-sm hover:bg-itoura-light transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {isSummarizing ? "Saving..." : "Save & Reflect"}
          </button>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 mt-10 md:mt-0">
        {messages.length === 1 && (
          <div className="flex flex-col items-center justify-center mb-6 mt-8 md:mt-2">
            <MascotPose 
              pose="sitting"
              className="w-48 h-48 opacity-80"
            />
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <MascotPose 
                pose="waving"
                className="w-8 h-8 rounded-full mr-2 shrink-0 border border-itoura-dark/10 shadow-sm"
              />
            )}
            <div className={`max-w-[75%] rounded-3xl p-4 ${msg.role === 'user' ? 'bg-itoura-dark text-white rounded-br-sm' : 'bg-white shadow-sm border border-gray-100 rounded-bl-sm text-itoura-text'}`}>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</p>
            </div>
          </div>
        ))}
        
        {(isLoading || isSummarizing) && (
          <div className="flex justify-start">
            <MascotPose 
              pose="jumping"
              className="w-8 h-8 rounded-full mr-2 shrink-0 border border-itoura-dark/10 shadow-sm"
            />
            <div className="bg-white shadow-sm border border-gray-100 rounded-3xl rounded-bl-sm p-4 flex gap-1 items-center h-[52px]">
              <div className="w-2 h-2 bg-itoura-dark/40 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-itoura-dark/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-itoura-dark/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
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
        <form onSubmit={handleSend} className="relative flex items-end bg-white rounded-3xl shadow-sm border border-gray-200 focus-within:border-itoura-dark focus-within:ring-2 focus-within:ring-itoura-light transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to Itoura..."
            className="flex-1 max-h-32 min-h-[56px] py-4 pl-6 pr-24 bg-transparent outline-none resize-none font-sans"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2.5 rounded-full transition-all flex items-center justify-center ${isRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-transparent text-gray-400 hover:text-itoura-dark hover:bg-gray-50'}`}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading || isSummarizing}
              className="p-2.5 bg-itoura-dark text-white rounded-full disabled:opacity-30 disabled:bg-gray-400 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>
        </form>
        {!apiKey && (
           <p className="text-xs text-center text-red-500 mt-2 font-medium">Missing VITE_GROQ_API_KEY in .env file</p>
        )}
      </div>
    </div>
  );
}
