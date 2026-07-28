import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useMemoryStore } from '../../store/memoryStore';
import { generateSessionSummary } from '../../services/ai';
import { Send, AlertCircle, Mic, MicOff, Save, CloudRain, Sun, Zap, Coffee } from 'lucide-react';
import itouraMascot from '../../assets/ABLE/itoura-mascot.jpeg';
import chatBg from '../../assets/ABLE/chat-bg.jpg';

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
    <div 
      className="flex flex-col h-full bg-[#220A50] rounded-3xl overflow-hidden shadow-2xl border border-[#5B21B6]/80 relative bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(22, 4, 50, 0.84), rgba(34, 10, 80, 0.92)), url(${chatBg})` }}
    >
      
      {/* Save Session Header Button */}
      {messages.length >= 3 && (
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleSaveSession}
            disabled={isSummarizing || isLoading}
            className="px-4 py-2 bg-[#E5D0FF] text-[#160432] font-black text-xs md:text-sm rounded-full shadow-md hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} className="text-[#220A50]" />
            {isSummarizing ? "Saving Memory..." : "Save & Reflect"}
          </button>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">
        {messages.length === 1 && (
          <div className="flex flex-col items-center justify-center mb-6 mt-4">
            <div className="p-2 bg-[#32106E]/60 rounded-full border border-[#5B21B6] shadow-inner mb-3">
              <img 
                src={itouraMascot} 
                alt="Itoura Mascot" 
                className="w-36 h-36 md:w-44 md:h-44 object-cover mix-blend-screen opacity-90 rounded-full"
              />
            </div>
            <p className="text-purple-300 font-extrabold text-xs tracking-widest uppercase">
              ITOURA COMPANION
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <img 
                src={itouraMascot} 
                alt="Itoura"
                className="w-9 h-9 rounded-full object-cover mr-3 shrink-0 border border-purple-500 shadow-md"
              />
            )}
            
            {/* Message Bubbles */}
            <div className={`max-w-[78%] rounded-3xl p-4 md:p-5 shadow-md ${
              msg.role === 'user' 
                ? 'bg-[#E5D0FF] text-[#160432] font-black border border-purple-300 rounded-br-none' 
                : 'bg-[#32106E] text-purple-100 font-bold border border-[#5B21B6]/70 rounded-bl-none'
            }`}>
              <p className="text-[15px] md:text-base leading-relaxed whitespace-pre-wrap font-bold">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        
        {(isLoading || isSummarizing) && (
          <div className="flex justify-start items-center">
            <img 
              src={itouraMascot} 
              alt="Itoura thinking"
              className="w-9 h-9 rounded-full object-cover mr-3 shrink-0 border border-purple-500 shadow-md"
            />
            <div className="bg-[#32106E] border border-[#5B21B6]/70 rounded-3xl rounded-bl-none p-4 flex gap-1.5 items-center h-[52px] shadow-md">
              <div className="w-2.5 h-2.5 bg-purple-200 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-purple-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2.5 h-2.5 bg-purple-200 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-950 text-red-100 font-bold border border-red-700 p-4 rounded-2xl text-sm flex items-start gap-2 max-w-[85%] mx-auto mt-4 shadow-md">
            <AlertCircle size={20} className="shrink-0 text-red-400 mt-0.5" />
            <p className="font-bold">{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-[#18043A]/90 backdrop-blur-xl border-t border-[#5B21B6]/70 flex flex-col relative z-20">
        
        {/* Quick Reply Chips */}
        {messages.length === 1 && !isLoading && !isSummarizing && (
          <div className="flex gap-2.5 overflow-x-auto pb-3 mb-2 w-full hide-scrollbar">
            <button 
              onClick={() => setInput("I'm feeling pretty anxious today.")} 
              className="flex items-center gap-2 px-4 py-2 bg-[#E5D0FF] text-[#160432] font-black border border-purple-300 rounded-full text-xs md:text-sm shadow-md hover:bg-white transition-all whitespace-nowrap cursor-pointer"
            >
              <CloudRain size={16} className="text-[#220A50]" /> Anxious
            </button>
            <button 
              onClick={() => setInput("I am completely exhausted.")} 
              className="flex items-center gap-2 px-4 py-2 bg-[#E5D0FF] text-[#160432] font-black border border-purple-300 rounded-full text-xs md:text-sm shadow-md hover:bg-white transition-all whitespace-nowrap cursor-pointer"
            >
              <Coffee size={16} className="text-[#220A50]" /> Exhausted
            </button>
            <button 
              onClick={() => setInput("I feel really overwhelmed.")} 
              className="flex items-center gap-2 px-4 py-2 bg-[#E5D0FF] text-[#160432] font-black border border-purple-300 rounded-full text-xs md:text-sm shadow-md hover:bg-white transition-all whitespace-nowrap cursor-pointer"
            >
              <Zap size={16} className="text-[#220A50]" /> Overwhelmed
            </button>
            <button 
              onClick={() => setInput("I'm actually doing okay.")} 
              className="flex items-center gap-2 px-4 py-2 bg-[#E5D0FF] text-[#160432] font-black border border-purple-300 rounded-full text-xs md:text-sm shadow-md hover:bg-white transition-all whitespace-nowrap cursor-pointer"
            >
              <Sun size={16} className="text-[#220A50]" /> Okay
            </button>
          </div>
        )}

        {/* Text Input Form */}
        <form onSubmit={handleSend} className="relative flex items-end bg-[#E5D0FF] rounded-2xl shadow-lg border-2 border-purple-400 focus-within:border-white focus-within:ring-2 focus-within:ring-purple-300 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to Itoura..."
            className="flex-1 max-h-32 min-h-[58px] py-4 pl-5 pr-24 bg-transparent outline-none resize-none font-bold text-[#160432] placeholder:text-[#220A50]/60 text-base"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-[#220A50] text-purple-100 hover:bg-[#32106E]'
              }`}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading || isSummarizing}
              className="p-2.5 bg-[#160432] text-white rounded-full disabled:opacity-40 disabled:bg-[#220A50] transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-md cursor-pointer border border-[#5B21B6]"
            >
              <Send size={18} className="ml-0.5 text-purple-200" />
            </button>
          </div>
        </form>
        
        {!apiKey && (
          <p className="text-xs text-center text-red-300 font-bold mt-2 bg-red-950 py-1 px-3 rounded-full border border-red-800 w-fit mx-auto">
            Missing VITE_GROQ_API_KEY in .env file
          </p>
        )}
      </div>

    </div>
  );
}
