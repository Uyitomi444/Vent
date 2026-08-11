import { useState, useEffect, useRef } from 'react';
import { useGroupSessionStore } from '../store/groupSessionStore';
import { useLanguageStore } from '../i18n';
import { Users, Shield, Send, LogOut, Download, Plus, ArrowRight, Copy, Check } from 'lucide-react';
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    await createSession(createTitle, displayName, currentLanguage);
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || !displayName.trim()) return;
    await joinSession(joinCode, displayName);
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
      <div className="max-w-2xl mx-auto p-4 md:p-8 animate-fade-in">
        <div className="bg-[#532E60] border-2 border-white/40 shadow-2xl rounded-3xl p-6 md:p-8 text-white space-y-6">
          <div className="flex items-center gap-3 text-[#C4B4E2]">
            <Shield size={32} />
            <h2 className="font-serif text-2xl font-black text-white">{t('group.privacy_notice_title')}</h2>
          </div>
          
          <div className="bg-[#613B6E] p-5 rounded-2xl border border-white/20 space-y-3 text-sm md:text-base font-bold text-[#E8DCF8] leading-relaxed">
            <p className="text-white font-black">{t('group.privacy_notice_body')}</p>
            <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm">
              <li>Your personal chat memories, mood logs, and private journal entries are <strong>100% walled off</strong> and will NEVER be brought into this group.</li>
              <li>Group session content will NEVER pollute your personal memory or progress trends.</li>
              <li>Maximum 6 participants per session.</li>
            </ul>
          </div>

          <button
            onClick={() => setHasSeenPrivacyNotice(true)}
            className="w-full py-4 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-base rounded-full shadow-lg border border-white transition-all cursor-pointer"
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
      <div className="h-full flex flex-col max-w-4xl mx-auto space-y-4 pb-4">
        
        {/* Group Header Bar */}
        <div className="bg-[#532E60] border-2 border-white/40 shadow-xl rounded-3xl p-4 md:p-6 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users size={20} className="text-[#C4B4E2]" />
              <h2 className="font-serif font-black text-xl md:text-2xl text-white">{activeSession.title}</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#E8DCF8] font-bold mt-1">
              <span>Code: <strong className="text-white tracking-widest bg-[#613B6E] px-2 py-0.5 rounded border border-white/20">{activeSession.code}</strong></span>
              <span>•</span>
              <span className="text-[#C4B4E2] font-black">{activeSession.participants.length} of {activeSession.maxParticipants} participants</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C4B4E2] text-[#532E60] font-black text-xs rounded-full hover:bg-white transition-all border border-white cursor-pointer"
              title="Copy Shareable Code"
            >
              {copiedCode ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedCode ? 'Copied' : 'Share Code'}</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#613B6E] text-white font-bold text-xs rounded-full hover:bg-[#6D427C] transition-all border border-white/30 cursor-pointer"
              title="Save Copy to Private Journal"
            >
              <Download size={14} />
              <span className="hidden sm:inline">{t('group.save_copy')}</span>
            </button>

            {currentParticipant.isCreator ? (
              <button
                onClick={async () => {
                  if (window.confirm("End this group session for everyone?")) {
                    await endSession();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-900/80 hover:bg-red-800 text-red-100 font-black text-xs rounded-full border border-red-500 cursor-pointer"
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-900/80 hover:bg-red-800 text-red-100 font-black text-xs rounded-full border border-red-500 cursor-pointer"
              >
                <LogOut size={14} />
                <span>Leave</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Participants Chips Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 px-1">
          {activeSession.participants.map(p => {
            const isMe = p.id === currentParticipant.id;
            return (
              <span 
                key={p.id} 
                className={`px-3.5 py-1.5 text-xs font-black rounded-full border transition-all shrink-0 ${
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
        <div className="flex-1 bg-[#532E60] border-2 border-white/40 shadow-2xl rounded-3xl p-4 md:p-6 overflow-y-auto space-y-4 min-h-[380px]">
          {activeSession.messages.map(msg => {
            const isAI = msg.senderId === 'assistant';
            const isSystem = msg.senderId === 'system';
            const isMe = msg.senderId === currentParticipant.id;

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <span className="px-4 py-1.5 bg-[#613B6E]/80 text-[#C4B4E2] text-xs font-bold rounded-full border border-white/20 shadow-sm">
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
                    className="w-9 h-9 rounded-full object-cover mr-3 shrink-0 border border-white/40 shadow-md"
                  />
                )}
                
                <div className={`max-w-[80%] rounded-3xl p-4 shadow-md ${
                  isAI
                    ? 'bg-[#613B6E] text-white font-bold border border-white/30 rounded-bl-none'
                    : isMe
                    ? 'bg-[#C4B4E2] text-[#532E60] font-black border border-white rounded-br-none'
                    : 'bg-[#432250] text-white font-bold border border-white/20 rounded-bl-none'
                }`}>
                  <p className="text-[11px] uppercase tracking-wider font-black mb-1 opacity-75">
                    {msg.senderName}
                  </p>
                  <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start items-center">
              <img src={itouraMascot} alt="Thinking" className="w-9 h-9 rounded-full mr-3 border border-white/40" />
              <div className="bg-[#613B6E] p-3 rounded-2xl text-xs font-bold text-[#E8DCF8] animate-pulse border border-white/20">
                Itoura is responding to the group...
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-950 text-red-200 border border-red-700 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Form */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            placeholder={`Message the group as ${currentParticipant.displayName}...`}
            className="flex-1 px-5 py-3.5 bg-[#C4B4E2] text-[#532E60] font-bold placeholder:text-[#532E60]/60 rounded-2xl outline-none border-2 border-white shadow-md"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim() || isLoading}
            className="px-5 py-3.5 bg-[#532E60] text-white rounded-2xl font-black border border-white/40 hover:bg-[#613B6E] transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send size={18} />
          </button>
        </form>

      </div>
    );
  }

  // 3. Session Setup / Join Screen
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8 animate-fade-in pb-12">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl md:text-4xl font-black text-[#532E60]">{t('group.title')}</h1>
        <p className="text-[#532E60]/80 font-bold text-sm md:text-base">{t('group.subtitle')}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Create Session Card */}
        <div className="bg-[#532E60] border-2 border-white/40 shadow-2xl rounded-3xl p-6 md:p-8 text-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#613B6E] rounded-2xl border border-white/30">
              <Plus size={24} className="text-[#C4B4E2]" />
            </div>
            <h2 className="font-serif text-2xl font-black text-white">{t('group.create')}</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#C4B4E2] uppercase tracking-wider mb-2">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Alex, Mom, Tolu"
                className="w-full px-4 py-3 bg-[#C4B4E2] text-[#532E60] font-bold placeholder:text-[#532E60]/60 rounded-xl outline-none border border-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#C4B4E2] uppercase tracking-wider mb-2">Session Title (Optional)</label>
              <input
                type="text"
                value={createTitle}
                onChange={e => setCreateTitle(e.target.value)}
                placeholder="e.g. Family Check-in"
                className="w-full px-4 py-3 bg-[#C4B4E2] text-[#532E60] font-bold placeholder:text-[#532E60]/60 rounded-xl outline-none border border-white"
              />
            </div>

            <button
              type="submit"
              disabled={!displayName.trim()}
              className="w-full py-4 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-base rounded-full shadow-lg border border-white transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{t('group.create')}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Join Session Card */}
        <div className="bg-[#532E60] border-2 border-white/40 shadow-2xl rounded-3xl p-6 md:p-8 text-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#613B6E] rounded-2xl border border-white/30">
              <Users size={24} className="text-[#C4B4E2]" />
            </div>
            <h2 className="font-serif text-2xl font-black text-white">{t('group.join')}</h2>
          </div>

          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#C4B4E2] uppercase tracking-wider mb-2">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name for this room"
                className="w-full px-4 py-3 bg-[#C4B4E2] text-[#532E60] font-bold placeholder:text-[#532E60]/60 rounded-xl outline-none border border-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#C4B4E2] uppercase tracking-wider mb-2">Room Code</label>
              <input
                type="text"
                required
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                placeholder="6-character code"
                className="w-full px-4 py-3 bg-[#C4B4E2] text-[#532E60] font-bold placeholder:text-[#532E60]/60 rounded-xl uppercase tracking-widest outline-none border border-white"
              />
            </div>

            <button
              type="submit"
              disabled={!joinCode.trim() || !displayName.trim()}
              className="w-full py-4 bg-[#613B6E] hover:bg-[#6D427C] text-white font-black text-base rounded-full shadow-lg border border-white/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
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
