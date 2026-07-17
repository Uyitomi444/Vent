import { Bell, Download, Trash2, Shield, User, ChevronRight, BrainCircuit } from 'lucide-react';
import { useJournalStore } from '../store/journalStore';
import { useMoodStore } from '../store/moodStore';
import { useChatStore } from '../store/chatStore';
import { useSettingsStore } from '../store/settingsStore';
import { useMemoryStore } from '../store/memoryStore';

export default function SettingsPage() {
  const { notifications, setNotifications } = useSettingsStore();
  
  const clearJournal = useJournalStore(state => state.clearEntries);
  const clearMoods = useMoodStore(state => state.clearEntries);
  const clearChat = useChatStore(state => state.clearMessages);
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
    <div className="max-w-2xl mx-auto space-y-8 pb-12 pt-4 px-4 md:px-8">
      <header className="mb-8">
        <h1 className="font-serif text-4xl text-itoura-dark mb-2">Settings</h1>
        <p className="text-gray-500">Manage your account and preferences</p>
      </header>

      {/* Account Section */}
      <section className="space-y-4">
        <h3 className="font-medium text-gray-400 px-4 uppercase tracking-wider text-sm flex items-center gap-2">
          <User size={16} /> Account
        </h3>
        <div className="bg-itoura-dark text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-itoura-primary/20 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/20">
            <User size={32} className="text-white/80" />
          </div>
          <div className="flex-1 text-center md:text-left z-10">
            <h2 className="text-2xl font-serif mb-1">Employee Profile</h2>
            <p className="text-itoura-light/70 text-sm mb-4">Linked to Your Organization</p>
            <button className="w-full md:w-auto px-6 py-2.5 bg-white text-itoura-dark rounded-full font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
              Sign in with Work Email <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-medium text-gray-400 px-4 uppercase tracking-wider text-sm flex items-center gap-2">
          <Shield size={16} /> Privacy & Trust
        </h3>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-itoura-beige/50 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-itoura-dark block mb-1">100% Confidential</strong>
            Your HR department and employer cannot read your messages, view your mood logs, or access your journal entries. Itoura is a secure, judgement-free zone designed solely for your mental wellbeing.
          </p>
          <div className="h-px bg-gray-100 my-4" />
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-itoura-dark block mb-1">Complement, Not Replacement</strong>
            Itoura is an AI companion designed to complement professional mental health support. It is not a replacement for therapy, counseling, or psychiatric care. If you are in crisis, please contact local professionals immediately.
          </p>
        </div>
      </section>

      {/* Memory Section */}
      <section className="space-y-4">
        <h3 className="font-medium text-gray-400 px-4 uppercase tracking-wider text-sm flex items-center gap-2">
          <BrainCircuit size={16} /> Companion Memory
        </h3>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-itoura-beige/50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                Itoura remembers <strong>{memories.length}</strong> recent conversation summaries to provide a continuous, contextual experience.
              </p>
            </div>
            <button 
              onClick={handleClearMemory}
              disabled={memories.length === 0}
              className="text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors disabled:opacity-50"
            >
              Clear Memory
            </button>
          </div>
          {memories.length > 0 && (
            <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {memories.map(m => (
                <div key={m.id} className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">{new Date(m.timestamp).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-700">{m.summary}</p>
                  {m.themes?.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {m.themes.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-itoura-light text-itoura-dark text-[10px] rounded-full uppercase tracking-wider font-semibold">
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
      <section className="space-y-4">
        <h3 className="font-medium text-gray-400 px-4 uppercase tracking-wider text-sm">Preferences</h3>
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-itoura-beige/50">
          
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-50 text-indigo-500 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-itoura-dark">Daily Reminders</p>
                <p className="text-xs text-gray-500">Receive a gentle nudge to check-in.</p>
              </div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-itoura-primary' : 'bg-gray-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${notifications ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

        </div>
      </section>

      {/* Privacy & Data Section */}
      <section className="space-y-4">
        <h3 className="font-medium text-gray-400 px-4 uppercase tracking-wider text-sm">Privacy & Data</h3>
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-itoura-beige/50">
          
          <div className="p-4 md:p-6 border-b border-gray-100 flex gap-4">
            <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your data currently lives entirely on your device. Nothing is sent to our servers.
                To sync across devices, sign in above.
              </p>
            </div>
          </div>

          <button 
            onClick={exportData}
            className="w-full flex items-center justify-between p-4 md:p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 text-blue-500 rounded-xl">
                <Download className="w-5 h-5" />
              </div>
              <span className="font-medium text-itoura-dark">Export My Data</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button 
            onClick={handleClearData}
            className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-red-50 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-50 text-red-500 rounded-xl">
                <Trash2 className="w-5 h-5" />
              </div>
              <span className="font-medium text-red-600">Clear All Data</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

        </div>
      </section>
    </div>
  );
}
