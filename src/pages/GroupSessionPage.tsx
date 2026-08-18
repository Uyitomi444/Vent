import { useState, useEffect, useRef } from 'react';
import { useGroupSessionStore } from '../store/groupSessionStore';
import { useLanguageStore } from '../i18n';
import { Users, Shield, Send, LogOut, Download, Plus, ArrowRight, Copy, Check, Mic, MicOff } from 'lucide-react';
import itouraMascot from '../assets/ABLE/itoura-mascot.jpeg';

export default function GroupSessionPage() {
  const {
    activeSession,
    hasSeenPrivacyNotice,
    isLoading,
    error,
    currentUserId,
    setHasSeenPrivacyNotice,
    createSession,
    joinSession,
    sendGroupMessage,
    leaveSession,
    endSession,
    exportSessionToJournal,
    subscribeToRoom
  } = useGroupSessionStore();

  const { t, currentLanguage } = useLanguageStore();

  const [createTitle, setCreateTitle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [inputMsg, setInputMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const apiKey = import.meta.env.VITE_GROQ_API_KEY || '';

  // Real-time subscription hook when activeSession exists
  useEffect(() => {
    if (activeSession?.code) {
      const unsubscribe = subscribeToRoom(activeSession.code);
      return () => {
        unsubscribe();
      };
    }
  }, [activeSession?.code, subscribeToRoom]);

  // Auto-scroll to bottom of group messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isLoading]);

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech-to-text voice input is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'yo' ? 'yo-NG' 
        : currentLanguage === 'ha' ? 'ha-NG' 
        : currentLanguage === 'ig' ? 'ig-NG' 
        : currentLanguage === 'pcm' ? 'en-NG' 
        : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMsg(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    createSession(createTitle, displayName, currentLanguage);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || !displayName.trim()) return;
    joinSession(joinCode, displayName);
  };

  const currentParticipant = activeSession?.participants.find(p => p.id === currentUserId) 
    || activeSession?.participants[0] 
    || { id: 'me', displayName: 'Me', isCreator: true };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeSession || isLoading) return;

    const content = inputMsg.trim();
    setInputMsg('');

    await sendGroupMessage(content, currentParticipant.id, currentParticipant.displayName, apiKey);
  };

  const handleCopyCode = () => {
    if (activeSession) {
      navigator.clipboard.writeText(activeSession.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleExport = () => {
    const success = exportSessionToJournal();
    if (success) {
      alert("Group session transcript saved to your private journal!");
    }
  };

  // 1. One-time Privacy Notice Modal
  if (!hasSeenPrivacyNotice) {
    return (
      <div className="max-w-2xl mx-auto p-3 sm:p-6 md:p-8 animate-fade-in my-auto">
        <div className="bg-[#532E60] border-2 border-white/40 shadow-2xl rounded-3xl p-5 sm:p-6 md:p-8 text-white space-y-5">
          <div className="flex items-center gap-3 text-[#C4B4E2]">
            <Shield size={28} className="shrink-0" />
            <h2 className="font-serif text-xl sm:text-2xl font-black text-white">{t('group.privacy_notice_title')}</h2>
          </div>
          
          <div className="bg-[#613B6E] p-4 sm:p-5 rounded-2xl border border-white/20 space-y-3 text-sm sm:text-base font-bold text-[#E8DCF8] leading-relaxed">
            <p className="text-white font-black">{t('group.privacy_notice_body')}</p>
            <ul className="list-disc pl-4 space-y-1.5 text-xs sm:text-sm">
              <li>Your personal chat memories, mood logs, and private journal entries are <strong>100% walled off</strong> and will NEVER be brought into this group.</li>
              <li>Group session content will NEVER pollute your personal memory or progress trends.</li>
              <li>Maximum 6 participants per session.</li>
            </ul>
          </div>

          <button
            onClick={() => setHasSeenPrivacyNotice(true)}
            className="w-full py-4 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-base rounded-full shadow-lg border-2 border-white transition-all cursor-pointer min-h-[48px]"
          >
            {t('group.privacy_agree')}
          </button>
        </div>
      </div>
    );
  }

  // 2. Active Session View
  if (activeSession) {
    return (
      <div className="h-full flex flex-col max-w-4xl mx-auto space-y-3 sm:space-y-4 pb-2">
        
        {/* Group Header Bar */}
        <div className="bg-[#532E60] border-2 border-white/40 shadow-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Users size={20} className="text-[#C4B4E2] shrink-0" />
              <h2 className="font-serif font-black text-xl sm:text-2xl text-white">{activeSession.title}</h2>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#E8DCF8] font-bold mt-1">
              <span>Code: <strong className="text-white tracking-wider bg-[#613B6E] px-2 py-0.5 rounded border border-white/30 text-xs sm:text-sm">{activeSession.code}</strong></span>
              <span>•</span>
              <span className="text-[#C4B4E2] font-black text-xs sm:text-sm">{activeSession.participants.length} of {activeSession.maxParticipants} participants</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#C4B4E2] text-[#532E60] font-black text-xs sm:text-sm rounded-full hover:bg-white transition-all border border-white cursor-pointer shadow-sm"
              title="Copy Shareable Code"
            >
              {copiedCode ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedCode ? 'Copied' : 'Share Code'}</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#613B6E] text-white font-bold text-xs sm:text-sm rounded-full hover:bg-[#6D427C] transition-all border border-white/30 cursor-pointer shadow-sm"
              title="Save Copy to Private Journal"
            >
              <Download size={14} />
              <span className="hidden sm:inline">{t('group.save_copy')}</span>
            </button>

            {currentParticipant.isCreator ? (
              <button
                onClick={() => {
                  if (window.confirm("End this group session for everyone?")) {
                    endSession();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-900/90 hover:bg-red-800 text-red-100 font-black text-xs sm:text-sm rounded-full border border-red-400 cursor-pointer shadow-sm"
              >
                <LogOut size={14} />
                <span>End</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (window.confirm("Leave this group session?")) {
                    leaveSession(currentParticipant.id);
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-900/90 hover:bg-red-800 text-red-100 font-black text-xs sm:text-sm rounded-full border border-red-400 cursor-pointer shadow-sm"
              >
                <LogOut size={14} />
                <span>Leave</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Participants Chips Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 px-1 shrink-0">
          {activeSession.participants.map(p => {
            const isMe = p.id === currentParticipant.id;
            return (
              <span 
                key={p.id} 
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-black rounded-full border transition-all shrink-0 ${
                  isMe 
                    ? 'bg-[#C4B4E2] text-[#532E60] border-white shadow-md' 
                    : 'bg-[#532E60] text-white border-white/30'
                }`}
              >
                {p.displayName} {p.isCreator && '(Host)'} {isMe && '(You)'}
              </span>
            );
          })}
        </div>

        {/* Group Chat Messages Box */}
        <div className="flex-1 bg-[#532E60] border-2 border-white/40 shadow-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 overflow-y-auto space-y-3 sm:space-y-4 min-h-[300px]">
          {activeSession.messages.map(msg => {
            const isAI = msg.senderId === 'assistant';
            const isSystem = msg.senderId === 'system';
            const isMe = msg.senderId === currentParticipant.id;

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <span className="px-3.5 py-1.5 bg-[#613B6E]/90 text-[#C4B4E2] text-xs font-bold rounded-full border border-white/20 shadow-sm text-center">
                    {msg.content}
                  </span>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex ${isAI ? 'justify-start' : isMe ? 'justify-end' : 'justify-start'}`}>
                {isAI && (
                  <img
                    src={itouraMascot}
                    alt="Itoura"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover mr-2.5 sm:mr-3 shrink-0 border-2 border-white/40 shadow-md"
                  />
                )}
                
                <div className={`max-w-[88%] sm:max-w-[80%] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-md ${
                  isAI
                    ? 'bg-[#613B6E] text-white font-bold border border-white/30 rounded-bl-none'
                    : isMe
                    ? 'bg-[#C4B4E2] text-[#532E60] font-black border-2 border-white rounded-br-none'
                    : 'bg-[#432250] text-white font-bold border border-white/20 rounded-bl-none'
                }`}>
                  <p className="text-xs font-black uppercase tracking-wider mb-1 opacity-80">
                    {msg.senderName}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start items-center">
              <img src={itouraMascot} alt="Thinking" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full mr-2.5 sm:mr-3 border-2 border-white/40" />
              <div className="bg-[#613B6E] p-3 rounded-2xl text-xs sm:text-sm font-bold text-[#E8DCF8] animate-pulse border border-white/20">
                Itoura is responding to the group...
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-950 text-red-200 border border-red-700 rounded-xl text-xs sm:text-sm font-bold">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Form with Minimum 16px Font & Voice Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0 pt-1">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              placeholder={isListening ? "Listening..." : `Message the group as ${currentParticipant.displayName}...`}
              className={`flex-1 px-4 sm:px-5 py-3.5 sm:py-4 bg-[#C4B4E2] text-[#532E60] font-bold text-base sm:text-lg placeholder:text-[#532E60]/60 rounded-2xl outline-none border-2 border-white shadow-md transition-all ${isListening ? 'animate-pulse bg-[#E8DCF8]' : ''}`}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`px-3.5 sm:px-4 py-3.5 sm:py-4 rounded-2xl border-2 transition-all cursor-pointer shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse border-red-300 shadow-lg' 
                  : 'bg-[#613B6E] text-white hover:bg-[#6D427C] border-white/30'
              }`}
              title="Voice to Text Input"
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              type="submit"
              disabled={!inputMsg.trim() || isLoading}
              className="px-4 sm:px-5 py-3.5 sm:py-4 bg-[#532E60] text-white rounded-2xl font-black border-2 border-white/40 hover:bg-[#613B6E] transition-all disabled:opacity-50 cursor-pointer shrink-0 min-w-[48px] min-h-[48px] flex items-center justify-center shadow-md"
            >
              <Send size={20} />
            </button>
          </div>
        </form>

      </div>
    );
  }

  // 3. Session Setup / Join Screen
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 p-2 sm:p-6 md:p-8 animate-fade-in pb-8">
      <header className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-0">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-[#532E60] leading-tight">{t('group.title')}</h1>
        <p className="text-[#532E60]/80 font-bold text-sm sm:text-base leading-relaxed">{t('group.subtitle')}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
        
        {/* Create Session Card */}
        <div className="bg-[#532E60] border-2 border-white/40 shadow-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 text-white space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#613B6E] rounded-2xl border border-white/30 shrink-0">
              <Plus size={22} className="text-[#C4B4E2]" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-black text-white">{t('group.create')}</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#C4B4E2] uppercase tracking-wider mb-1.5">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Alex, Mom, Tolu"
                className="w-full px-4 py-3 bg-[#C4B4E2] text-[#532E60] font-bold text-base placeholder:text-[#532E60]/60 rounded-xl outline-none border-2 border-white shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#C4B4E2] uppercase tracking-wider mb-1.5">Session Title (Optional)</label>
              <input
                type="text"
                value={createTitle}
                onChange={e => setCreateTitle(e.target.value)}
                placeholder="e.g. Family Check-in"
                className="w-full px-4 py-3 bg-[#C4B4E2] text-[#532E60] font-bold text-base placeholder:text-[#532E60]/60 rounded-xl outline-none border-2 border-white shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={!displayName.trim()}
              className="w-full py-4 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-base rounded-full shadow-lg border-2 border-white transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>{t('group.create')}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Join Session Card */}
        <div className="bg-[#532E60] border-2 border-white/40 shadow-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 text-white space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#613B6E] rounded-2xl border border-white/30 shrink-0">
              <Users size={22} className="text-[#C4B4E2]" />
            </div>
            <h2 className="font-serif text-2xl font-black text-white">{t('group.join')}</h2>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#C4B4E2] uppercase tracking-wider mb-1.5">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name for this room"
                className="w-full px-4 py-3 bg-[#C4B4E2] text-[#532E60] font-bold text-base placeholder:text-[#532E60]/60 rounded-xl outline-none border-2 border-white shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#C4B4E2] uppercase tracking-wider mb-1.5">Room Code</label>
              <input
                type="text"
                required
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                placeholder="6-character code"
                className="w-full px-4 py-3 bg-[#C4B4E2] text-[#532E60] font-bold text-base placeholder:text-[#532E60]/60 rounded-xl uppercase tracking-widest outline-none border-2 border-white shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={!joinCode.trim() || !displayName.trim()}
              className="w-full py-4 bg-[#613B6E] hover:bg-[#6D427C] text-white font-black text-base rounded-full shadow-lg border-2 border-white/40 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>{t('group.join')}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
