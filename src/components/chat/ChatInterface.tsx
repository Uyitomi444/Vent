import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useMemoryStore } from '../../store/memoryStore';
import { generateSessionSummary } from '../../services/ai';
import { Send, AlertCircle, Mic, MicOff, Save, CloudRain, Sun, Zap, Coffee, Sparkles } from 'lucide-react';
import itouraMascot from '../../assets/ABLE/itoura-mascot.jpeg';

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
    <div className="flex flex-col h-full bg-purple-200/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border-2 border-purple-400/80 relative">
      
      {/* Save Session Header */}
      {messages.length >= 3 && (
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleSaveSession}
            disabled={isSummarizing || isLoading}
            className="px-4 py-2 bg-purple-950 text-white font-bold text-xs md:text-sm rounded-full shadow-md border-2 border-purple-400 hover:bg-purple-800 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} className="text-purple-300" />
            {isSummarizing ? "Saving Memory..." : "Save & Reflect"}
          </button>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 mt-2">
        {messages.length === 1 && (
          <div className="flex flex-col items-center justify-center mb-6 mt-4">
            <div className="relative p-2 bg-purple-300/60 rounded-full border-4 border-purple-400/80 shadow-lg">
              <img 
                src={itouraMascot} 
                alt="Itoura Mascot" 
                className="w-40 h-40 md:w-48 md:h-48 object-cover mix-blend-multiply opacity-90 rounded-full"
              />
            </div>
            <p className="text-purple-950 font-black text-sm mt-3 tracking-wide flex items-center gap-1.5">
              <Sparkles size={16} className="text-purple-700" />
              ITOURA COMPANION READY
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <img 
                src={itouraMascot} 
                alt="Itoura"
                className="w-9 h-9 rounded-full object-cover mr-2 shrink-0 border-2 border-purple-500 shadow-md"
              />
            )}
            
            {/* Message Bubble: Purple spaces with bold black text for assistant */}
            <div className={`max-w-[80%] rounded-3xl p-4 md:p-5 shadow-md border-2 ${
              msg.role === 'user' 
                ? 'bg-purple-950 text-white font-bold border-purple-600 rounded-br-none' 
                : 'bg-[#E9D5FF] text-black font-bold border-purple-400/90 rounded-bl-none'
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
              className="w-9 h-9 rounded-full object-cover mr-2 shrink-0 border-2 border-purple-500 shadow-md"
            />
            <div className="bg-[#E9D5FF] border-2 border-purple-400/90 rounded-3xl rounded-bl-none p-4 flex gap-1.5 items-center h-[52px] shadow-md">
              <div className="w-2.5 h-2.5 bg-purple-950 rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-purple-950 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2.5 h-2.5 bg-purple-950 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-200 text-red-950 font-bold border-2 border-red-400 p-4 rounded-2xl text-sm flex items-start gap-2 max-w-[85%] mx-auto mt-4 shadow-md">
            <AlertCircle size={20} className="shrink-0 text-red-700 mt-0.5" />
            <p className="font-bold">{error}</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area: Purple background with Bold Black Text */}
      <div className="p-4 bg-purple-300/90 backdrop-blur-xl border-t-2 border-purple-400 flex flex-col relative z-20">
        
        {/* Mood Quick-Reply Chips: Vibrant Purple with Bold Black Text */}
        {messages.length === 1 && !isLoading && !isSummarizing && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-2 w-full hide-scrollbar">
            <button 
              onClick={() => setInput("I'm feeling pretty anxious today.")} 
              className="flex items-center gap-2 px-4 py-2 bg-[#E9D5FF] text-black font-extrabold border-2 border-purple-500 rounded-full text-xs md:text-sm shadow-md hover:bg-purple-300 hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
            >
              <CloudRain size={16} className="text-purple-900" /> Anxious
            </button>
            <button 
              onClick={() => setInput("I am completely exhausted.")} 
              className="flex items-center gap-2 px-4 py-2 bg-[#E9D5FF] text-black font-extrabold border-2 border-purple-500 rounded-full text-xs md:text-sm shadow-md hover:bg-purple-300 hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
            >
              <Coffee size={16} className="text-purple-900" /> Exhausted
            </button>
            <button 
              onClick={() => setInput("I feel really overwhelmed.")} 
              className="flex items-center gap-2 px-4 py-2 bg-[#E9D5FF] text-black font-extrabold border-2 border-purple-500 rounded-full text-xs md:text-sm shadow-md hover:bg-purple-300 hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
            >
              <Zap size={16} className="text-purple-900" /> Overwhelmed
            </button>
            <button 
              onClick={() => setInput("I'm actually doing okay.")} 
              className="flex items-center gap-2 px-4 py-2 bg-[#E9D5FF] text-black font-extrabold border-2 border-purple-500 rounded-full text-xs md:text-sm shadow-md hover:bg-purple-300 hover:scale-105 transition-all whitespace-nowrap cursor-pointer"
            >
              <Sun size={16} className="text-purple-900" /> Okay
            </button>
          </div>
        )}

        {/* Text Input Form: Purple space with Bold Black Text */}
        <form onSubmit={handleSend} className="relative flex items-end bg-[#E9D5FF] rounded-3xl shadow-lg border-2 border-purple-500 focus-within:border-purple-800 focus-within:ring-4 focus-within:ring-purple-400 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to Itoura..."
            className="flex-1 max-h-32 min-h-[60px] py-4 pl-6 pr-24 bg-transparent outline-none resize-none font-bold text-black placeholder:text-purple-950/70 placeholder:font-bold text-base md:text-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
          />
          <div className="absolute right-2 bottom-2.5 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-300/80 text-purple-950 hover:bg-purple-400'
              }`}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading || isSummarizing}
              className="p-3 bg-purple-950 text-white rounded-full disabled:opacity-40 disabled:bg-purple-900 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-md cursor-pointer"
            >
              <Send size={18} className="ml-0.5 text-purple-200" />
            </button>
          </div>
        </form>
        
        {!apiKey && (
          <p className="text-xs text-center text-red-700 font-extrabold mt-2 bg-red-100 py-1 px-3 rounded-full border border-red-300 w-fit mx-auto">
            Missing VITE_GROQ_API_KEY in .env file
          </p>
        )}
      </div>

    </div>
  );
}
