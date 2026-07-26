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
      {/* Clean Minimalist Header */}
      <header className="mb-6 space-y-1">
        <h1 className="font-serif text-3xl md:text-4xl font-black text-purple-950">Settings</h1>
        <p className="text-purple-900/80 font-bold text-sm md:text-base">Manage your account, privacy, and companion memory</p>
      </header>

      {/* Profile Card */}
      <section className="space-y-3">
        <h3 className="font-black text-purple-900 px-2 uppercase tracking-wider text-xs flex items-center gap-2">
          <User size={16} className="text-purple-700" /> Account
        </h3>
        <div className="bg-purple-950 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-md border border-purple-800">
          <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center shrink-0 border border-purple-700">
            <User size={28} className="text-purple-200" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-serif font-black mb-1">Employee Profile</h2>
            <p className="text-purple-300 text-xs font-bold mb-4">Linked to Your Organization</p>
            <button className="w-full md:w-auto px-6 py-2.5 bg-white text-purple-950 rounded-full font-black text-sm hover:bg-purple-100 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              Sign in with Work Email <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Confidentiality & Trust */}
      <section className="space-y-3">
        <h3 className="font-black text-purple-900 px-2 uppercase tracking-wider text-xs flex items-center gap-2">
          <Shield size={16} className="text-purple-700" /> Privacy & Confidentiality
        </h3>
        <div className="bg-[#F7F0FF] rounded-3xl p-6 md:p-8 shadow-sm border border-purple-200 space-y-4">
          <p className="text-sm text-purple-950 font-bold leading-relaxed">
            <strong className="text-purple-950 block text-base font-black mb-1">100% Confidential</strong>
            Your HR department and employer cannot read your messages, view your mood logs, or access your journal entries. Itoura is a secure, judgment-free zone designed solely for your mental wellbeing.
          </p>
          <div className="h-px bg-purple-200 my-4" />
          <p className="text-sm text-purple-950 font-bold leading-relaxed">
            <strong className="text-purple-950 block text-base font-black mb-1">Complement, Not Replacement</strong>
            Itoura is an AI companion designed to complement professional mental health support. It is not a replacement for therapy or psychiatric care. If you are in crisis, please contact local professionals immediately.
          </p>
        </div>
      </section>

      {/* Memory Section */}
      <section className="space-y-3">
        <h3 className="font-black text-purple-900 px-2 uppercase tracking-wider text-xs flex items-center gap-2">
          <BrainCircuit size={16} className="text-purple-700" /> Companion Memory
        </h3>
        <div className="bg-[#F7F0FF] rounded-3xl p-6 md:p-8 shadow-sm border border-purple-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-purple-950 font-bold leading-relaxed max-w-md">
                Itoura remembers <strong className="font-black text-purple-900">{memories.length}</strong> recent conversation summaries to provide a continuous experience. Click a memory to restore that chat.
              </p>
            </div>
            <button 
              onClick={handleClearMemory}
              disabled={memories.length === 0}
              className="text-xs font-black text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-full border border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
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
                      ? 'bg-white hover:bg-purple-100 border-purple-200 cursor-pointer shadow-sm' 
                      : 'bg-purple-100/50 border-purple-200 opacity-80'
                  }`}
                >
                  <p className="text-xs font-bold text-purple-800 mb-1">{new Date(m.timestamp).toLocaleDateString()}</p>
                  <p className="text-sm font-bold text-purple-950">{m.summary}</p>
                  {m.themes?.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {m.themes.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-purple-950 text-white text-[10px] rounded-full uppercase tracking-wider font-extrabold">
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
        <h3 className="font-black text-purple-900 px-2 uppercase tracking-wider text-xs">Preferences</h3>
        <div className="bg-[#F7F0FF] rounded-3xl overflow-hidden shadow-sm border border-purple-200">
          
          <div className="flex items-center justify-between p-5 md:p-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-purple-950 text-white rounded-xl">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-black text-purple-950">Daily Reminders</p>
                <p className="text-xs font-bold text-purple-800/80">Receive a gentle nudge to check-in.</p>
              </div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${notifications ? 'bg-purple-950' : 'bg-purple-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

        </div>
      </section>

      {/* Privacy & Data Section */}
      <section className="space-y-3">
        <h3 className="font-black text-purple-900 px-2 uppercase tracking-wider text-xs">Privacy & Local Storage</h3>
        <div className="bg-[#F7F0FF] rounded-3xl overflow-hidden shadow-sm border border-purple-200">
          
          <div className="p-5 md:p-6 border-b border-purple-200/80 flex gap-4">
            <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-purple-950 leading-relaxed">
                Your data currently lives entirely on your device. Nothing is sent to external servers.
              </p>
            </div>
          </div>

          <button 
            onClick={exportData}
            className="w-full flex items-center justify-between p-5 md:p-6 border-b border-purple-200/80 hover:bg-purple-200/50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-purple-950 text-white rounded-xl">
                <Download size={20} />
              </div>
              <span className="font-black text-purple-950">Export My Data Backup</span>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-800" />
          </button>

          <button 
            onClick={handleClearData}
            className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-red-100/60 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-red-600 text-white rounded-xl">
                <Trash2 size={20} />
              </div>
              <span className="font-black text-red-600">Clear All Local Data</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>

        </div>
      </section>
    </div>
  );
}
