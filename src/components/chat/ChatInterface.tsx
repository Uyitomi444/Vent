import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useMemoryStore } from '../../store/memoryStore';
import { useLanguageStore } from '../../i18n';
import { generateSessionSummary } from '../../services/ai';
import { Send, AlertCircle, Mic, MicOff, Save } from 'lucide-react';
import itouraMascot from '../../assets/ABLE/itoura-mascot.jpeg';
import chatBg from '../../assets/ABLE/chat-bg.jpg';

export default function ChatInterface() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChatStore();
  const { addMemory } = useMemoryStore();
  const { t } = useLanguageStore();

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
    if (!input.trim() || isLoading || isSummarizing) return;
    
    const userMsg = input.trim();
    setInput('');
    await sendMessage(userMsg, apiKey);
  };

  const handleSaveSession = async () => {
    if (messages.length < 3 || isSummarizing) return;

    try {
      setIsSummarizing(true);
      const summaryData = await generateSessionSummary(messages, apiKey);

      if (summaryData) {
        addMemory(summaryData.summary, summaryData.themes, [...messages]);
        alert("Session reflection saved! You can view it in your Settings and Progress tab.");
        clearMessages();
      } else {
        alert("Could not generate session summary. Please try again.");
      }
    } catch (err: any) {
      console.error("Failed to save memory:", err);
      alert("Could not generate summary. Check your connection or API key.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div 
      className="flex flex-col h-full bg-[#532E60] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/40 relative bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(83, 46, 96, 0.90), rgba(61, 32, 72, 0.95)), url(${chatBg})` }}
    >
      
      {/* Save Session Header Button */}
      {messages.length >= 3 && (
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleSaveSession}
            disabled={isSummarizing || isLoading}
            className="px-4 py-2 bg-[#C4B4E2] text-[#532E60] font-black text-xs md:text-sm rounded-full shadow-md hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer border border-white"
          >
            <Save size={15} className="text-[#532E60]" />
            {isSummarizing ? t('chat.saving') : t('chat.save_session')}
          </button>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">
        {messages.length === 1 && (
          <div className="flex flex-col items-center justify-center mb-6 mt-4">
            <div className="p-2 bg-[#613B6E] rounded-full border border-white/40 shadow-inner mb-3">
              <img 
                src={itouraMascot} 
                alt="Itoura Mascot" 
                className="w-36 h-36 md:w-44 md:h-44 object-cover mix-blend-screen opacity-90 rounded-full"
              />
            </div>
            <p className="text-[#E8DCF8] font-black text-xs tracking-widest uppercase">
              ITOURA COMPANION
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => {
          // If this is the initial message (index 0 and role assistant), dynamically translate it!
          const displayContent = (idx === 0 && messages.length === 1 && msg.role === 'assistant')
            ? t('chat.initial_msg')
            : msg.content;

          return (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <img 
                  src={itouraMascot} 
                  alt="Itoura"
                  className="w-9 h-9 rounded-full object-cover mr-3 shrink-0 border border-white/40 shadow-md"
                />
              )}
              
              {/* Message Bubbles */}
              <div className={`max-w-[78%] rounded-3xl p-4 md:p-5 shadow-md ${
                msg.role === 'user' 
                  ? 'bg-[#C4B4E2] text-[#532E60] font-black border border-white rounded-br-none' 
                  : 'bg-[#613B6E] text-white font-bold border border-white/30 rounded-bl-none'
              }`}>
                <p className="text-[15px] md:text-base leading-relaxed whitespace-pre-wrap font-bold">
                  {displayContent}
                </p>
              </div>
            </div>
          );
        })}
        
        {(isLoading || isSummarizing) && (
          <div className="flex justify-start items-center">
            <img 
              src={itouraMascot} 
              alt="Itoura thinking"
              className="w-9 h-9 rounded-full object-cover mr-3 shrink-0 border border-white/40 shadow-md"
            />
            <div className="bg-[#613B6E] border border-white/30 rounded-3xl rounded-bl-none p-4 flex gap-1.5 items-center h-[52px] shadow-md">
              <div className="w-2.5 h-2.5 bg-[#C4B4E2] rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-[#C4B4E2] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2.5 h-2.5 bg-[#C4B4E2] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
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
      <div className="p-4 md:p-6 bg-[#432250]/95 backdrop-blur-xl border-t border-white/20 flex flex-col relative z-20">
        
        {/* Quick Reply Chips (Translated) */}
        {messages.length === 1 && !isLoading && !isSummarizing && (
          <div className="flex gap-2.5 overflow-x-auto pb-3 mb-2 w-full hide-scrollbar">
            <button 
              onClick={() => setInput(t('chip.anxious_prompt'))} 
              className="px-4 py-2 bg-[#C4B4E2] text-[#532E60] font-black border border-white rounded-full text-xs md:text-sm shadow-md hover:bg-white transition-all whitespace-nowrap cursor-pointer"
            >
              {t('chip.anxious')}
            </button>
            <button 
              onClick={() => setInput(t('chip.exhausted_prompt'))} 
              className="px-4 py-2 bg-[#C4B4E2] text-[#532E60] font-black border border-white rounded-full text-xs md:text-sm shadow-md hover:bg-white transition-all whitespace-nowrap cursor-pointer"
            >
              {t('chip.exhausted')}
            </button>
            <button 
              onClick={() => setInput(t('chip.overwhelmed_prompt'))} 
              className="px-4 py-2 bg-[#C4B4E2] text-[#532E60] font-black border border-white rounded-full text-xs md:text-sm shadow-md hover:bg-white transition-all whitespace-nowrap cursor-pointer"
            >
              {t('chip.overwhelmed')}
            </button>
            <button 
              onClick={() => setInput(t('chip.okay_prompt'))} 
              className="px-4 py-2 bg-[#C4B4E2] text-[#532E60] font-black border border-white rounded-full text-xs md:text-sm shadow-md hover:bg-white transition-all whitespace-nowrap cursor-pointer"
            >
              {t('chip.okay')}
            </button>
          </div>
        )}

        {/* Text Input Form */}
        <form onSubmit={handleSend} className="relative flex items-end bg-[#C4B4E2] rounded-2xl shadow-lg border-2 border-white focus-within:ring-2 focus-within:ring-white transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="flex-1 max-h-32 min-h-[58px] py-4 pl-5 pr-24 bg-transparent outline-none resize-none font-bold text-[#532E60] placeholder:text-[#532E60]/60 text-base"
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
                isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-[#532E60] text-white hover:bg-[#3D2048]'
              }`}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading || isSummarizing}
              className="p-2.5 bg-[#532E60] text-white rounded-full disabled:opacity-40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center shadow-md cursor-pointer border border-white/40"
            >
              <Send size={18} className="ml-0.5 text-[#E8DCF8]" />
            </button>
          </div>
        </form>
        
        {!apiKey && (
          <p className="text-xs text-center text-red-300 font-bold mt-2 bg-red-950 py-1 px-3 rounded-full border border-red-800 w-fit mx-auto">
            Groq API Key not found. Please set VITE_GROQ_API_KEY in .env
          </p>
        )}
      </div>
    </div>
  );
}
