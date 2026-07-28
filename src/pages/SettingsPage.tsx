import { Bell, Download, Trash2, Shield, User, ChevronRight, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useJournalStore } from '../store/journalStore';
import { useMoodStore } from '../store/moodStore';
import { useChatStore } from '../store/chatStore';
import { useSettingsStore } from '../store/settingsStore';
import { useMemoryStore } from '../store/memoryStore';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { notifications, setNotifications } = useSettingsStore();
  
  const clearJournal = useJournalStore(state => state.clearEntries);
  const clearMoods = useMoodStore(state => state.clearEntries);
  const clearChat = useChatStore(state => state.clearMessages);
  const setChatMessages = useChatStore(state => state.setMessages);
  const { memories, clearMemories } = useMemoryStore();

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      clearJournal();
      clearMoods();
      clearChat();
      clearMemories();
      alert('All local data has been cleared.');
    }
  };

  const handleClearMemory = () => {
    if (window.confirm('Clear all conversation memories? Itoura will start fresh.')) {
      clearMemories();
      alert('Conversation memories cleared.');
    }
  };

  const handleRestoreMemory = (memory: any) => {
    if (memory.messages && memory.messages.length > 0) {
      if (window.confirm('Do you want to go back to this past conversation? Your current unsaved chat will be cleared.')) {
        setChatMessages(memory.messages);
        navigate('/');
      }
    } else {
      alert("No chat messages saved for this memory. Old memories may only have summaries.");
    }
  };

  const exportData = () => {
    const data = {
      journal: useJournalStore.getState().entries,
      moods: useMoodStore.getState().entries,
      memories: useMemoryStore.getState().memories
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `itoura-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 pt-2 px-4 md:px-8">
      {/* Header */}
      <header className="mb-6 space-y-1">
        <h1 className="font-serif text-3xl md:text-4xl font-black text-[#E5D0FF]">Settings</h1>
        <p className="text-purple-300 font-bold text-sm md:text-base">Manage your account, privacy, and companion memory</p>
      </header>

      {/* Profile Card */}
      <section className="space-y-3">
        <h3 className="font-black text-purple-300 px-2 uppercase tracking-wider text-xs flex items-center gap-2">
          <User size={16} className="text-purple-400" /> Account
        </h3>
        <div className="bg-[#2E0B5E] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl border border-[#7C3AED]/80">
          <div className="w-16 h-16 bg-[#4C1D95] rounded-full flex items-center justify-center shrink-0 border border-[#7C3AED]">
            <User size={28} className="text-[#E5D0FF]" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-serif font-black text-[#E5D0FF] mb-1">Employee Profile</h2>
            <p className="text-purple-300 text-xs font-bold mb-4">Linked to Your Organization</p>
            <button className="w-full md:w-auto px-6 py-2.5 bg-[#E5D0FF] text-[#160432] rounded-full font-black text-sm hover:bg-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-purple-300">
              Sign in with Work Email <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Confidentiality & Trust */}
      <section className="space-y-3">
        <h3 className="font-black text-purple-300 px-2 uppercase tracking-wider text-xs flex items-center gap-2">
          <Shield size={16} className="text-purple-400" /> Privacy & Confidentiality
        </h3>
        <div className="bg-[#2E0B5E] rounded-3xl p-6 md:p-8 shadow-xl border border-[#7C3AED]/80 space-y-4">
          <p className="text-sm text-purple-100 font-bold leading-relaxed">
            <strong className="text-[#E5D0FF] block text-base font-black mb-1">100% Confidential</strong>
            Your HR department and employer cannot read your messages, view your mood logs, or access your journal entries. Itoura is a secure, judgment-free zone designed solely for your mental wellbeing.
          </p>
          <div className="h-px bg-purple-900 my-4" />
          <p className="text-sm text-purple-100 font-bold leading-relaxed">
            <strong className="text-[#E5D0FF] block text-base font-black mb-1">Complement, Not Replacement</strong>
            Itoura is an AI companion designed to complement professional mental health support. It is not a replacement for therapy or psychiatric care. If you are in crisis, please contact local professionals immediately.
          </p>
        </div>
      </section>

      {/* Memory Section */}
      <section className="space-y-3">
        <h3 className="font-black text-purple-300 px-2 uppercase tracking-wider text-xs flex items-center gap-2">
          <BrainCircuit size={16} className="text-purple-400" /> Companion Memory
        </h3>
        <div className="bg-[#2E0B5E] rounded-3xl p-6 md:p-8 shadow-xl border border-[#7C3AED]/80">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-purple-200 font-bold leading-relaxed max-w-md">
                Itoura remembers <strong className="font-black text-[#E5D0FF]">{memories.length}</strong> recent conversation summaries to provide a continuous experience. Click a memory to restore that chat.
              </p>
            </div>
            <button 
              onClick={handleClearMemory}
              disabled={memories.length === 0}
              className="text-xs font-black text-red-400 hover:bg-red-950 px-3 py-1.5 rounded-full border border-red-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Clear Memory
            </button>
          </div>
          {memories.length > 0 && (
            <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {memories.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => handleRestoreMemory(m)}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    m.messages 
                      ? 'bg-[#4C1D95]/80 hover:bg-[#4C1D95] border-[#7C3AED] cursor-pointer shadow-md' 
                      : 'bg-purple-950/60 border-purple-900 opacity-80'
                  }`}
                >
                  <p className="text-xs font-bold text-purple-300 mb-1">{new Date(m.timestamp).toLocaleDateString()}</p>
                  <p className="text-sm font-bold text-purple-100">{m.summary}</p>
                  {m.themes?.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {m.themes.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-[#E5D0FF] text-[#160432] text-[10px] rounded-full uppercase tracking-wider font-extrabold">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Preferences Section */}
      <section className="space-y-3">
        <h3 className="font-black text-purple-300 px-2 uppercase tracking-wider text-xs">Preferences</h3>
        <div className="bg-[#2E0B5E] rounded-3xl overflow-hidden shadow-xl border border-[#7C3AED]/80">
          
          <div className="flex items-center justify-between p-5 md:p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#4C1D95] text-[#E5D0FF] rounded-xl border border-[#7C3AED]">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-black text-[#E5D0FF]">Daily Reminders</p>
                <p className="text-xs font-bold text-purple-300">Receive a gentle nudge to check-in.</p>
              </div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${notifications ? 'bg-[#E5D0FF]' : 'bg-[#4C1D95]'}`}
            >
              <div className={`w-4 h-4 rounded-full absolute top-1 transition-transform ${notifications ? 'translate-x-7 bg-[#160432]' : 'translate-x-1 bg-purple-300'}`} />
            </button>
          </div>

        </div>
      </section>

      {/* Privacy & Data Section */}
      <section className="space-y-3">
        <h3 className="font-black text-purple-300 px-2 uppercase tracking-wider text-xs">Privacy & Local Storage</h3>
        <div className="bg-[#2E0B5E] rounded-3xl overflow-hidden shadow-xl border border-[#7C3AED]/80">
          
          <div className="p-5 md:p-6 border-b border-purple-900 flex gap-4">
            <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-purple-100 leading-relaxed">
                Your data currently lives entirely on your device. Nothing is sent to external servers.
              </p>
            </div>
          </div>

          <button 
            onClick={exportData}
            className="w-full flex items-center justify-between p-5 md:p-6 border-b border-purple-900 hover:bg-[#4C1D95]/60 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#4C1D95] text-[#E5D0FF] rounded-xl border border-[#7C3AED]">
                <Download size={20} />
              </div>
              <span className="font-black text-[#E5D0FF]">Export My Data Backup</span>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-400" />
          </button>

          <button 
            onClick={handleClearData}
            className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-red-950/60 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-red-950 text-red-400 rounded-xl border border-red-800">
                <Trash2 size={20} />
              </div>
              <span className="font-black text-red-400">Clear All Local Data</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>

        </div>
      </section>
    </div>
  );
}
