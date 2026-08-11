import { useNavigate } from 'react-router-dom';
import { useJournalStore } from '../store/journalStore';
import { useMoodStore } from '../store/moodStore';
import { useChatStore } from '../store/chatStore';
import { useSettingsStore } from '../store/settingsStore';
import { useMemoryStore } from '../store/memoryStore';
import { useLanguageStore } from '../i18n';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { notifications, setNotifications } = useSettingsStore();
  const { t } = useLanguageStore();

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
        navigate('/chat');
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
        <h1 className="font-serif text-3xl md:text-4xl font-black text-[#532E60]">{t('settings.title')}</h1>
        <p className="text-[#532E60]/80 font-bold text-sm md:text-base">{t('settings.subtitle')}</p>
      </header>

      {/* Profile Card */}
      <section className="space-y-3">
        <h3 className="font-black text-[#532E60] px-2 uppercase tracking-wider text-xs">
          {t('settings.account')}
        </h3>
        <div className="bg-[#532E60] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl border-2 border-white/40">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-serif font-black text-white mb-1">{t('settings.emp_profile')}</h2>
            <p className="text-[#E8DCF8] text-xs font-bold mb-4">{t('settings.emp_desc')}</p>
            <button className="w-full md:w-auto px-6 py-2.5 bg-[#C4B4E2] text-[#532E60] rounded-full font-black text-sm hover:bg-white transition-all shadow-md cursor-pointer border border-white">
              {t('settings.emp_btn')}
            </button>
          </div>
        </div>
      </section>

      {/* Confidentiality & Trust */}
      <section className="space-y-3">
        <h3 className="font-black text-[#532E60] px-2 uppercase tracking-wider text-xs">
          {t('settings.privacy')}
        </h3>
        <div className="bg-[#532E60] text-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-white/40 space-y-4">
          <p className="text-sm text-[#E8DCF8] font-bold leading-relaxed">
            <strong className="text-white block text-base font-black mb-1">{t('settings.confidential_title')}</strong>
            {t('settings.confidential_body')}
          </p>
          <div className="h-px bg-white/20 my-4" />
          <p className="text-sm text-[#E8DCF8] font-bold leading-relaxed">
            <strong className="text-white block text-base font-black mb-1">{t('settings.complement_title')}</strong>
            {t('settings.complement_body')}
          </p>
        </div>
      </section>

      {/* Memory Section */}
      <section className="space-y-3">
        <h3 className="font-black text-[#532E60] px-2 uppercase tracking-wider text-xs">
          {t('settings.memory')}
        </h3>
        <div className="bg-[#532E60] text-white rounded-3xl p-6 md:p-8 shadow-xl border-2 border-white/40">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-[#E8DCF8] font-bold leading-relaxed max-w-md">
                {t('settings.mem_info', { count: memories.length })}
              </p>
            </div>
            <button 
              onClick={handleClearMemory}
              disabled={memories.length === 0}
              className="text-xs font-black text-red-300 hover:bg-red-950 px-3.5 py-1.5 rounded-full border border-red-400 transition-colors disabled:opacity-50 cursor-pointer bg-red-950/60"
            >
              {t('settings.clear_mem_btn')}
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
                      ? 'bg-[#613B6E] hover:bg-[#6D427C] border-white/40 cursor-pointer shadow-md' 
                      : 'bg-[#432250] border-white/20 opacity-80'
                  }`}
                >
                  <p className="text-xs font-bold text-[#C4B4E2] mb-1">{new Date(m.timestamp).toLocaleDateString()}</p>
                  <p className="text-sm font-bold text-white">{m.summary}</p>
                  {m.themes?.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {m.themes.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-[#C4B4E2] text-[#532E60] text-[10px] rounded-full uppercase tracking-wider font-black">
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
        <h3 className="font-black text-[#532E60] px-2 uppercase tracking-wider text-xs">{t('settings.preferences')}</h3>
        <div className="bg-[#532E60] text-white rounded-3xl overflow-hidden shadow-xl border-2 border-white/40">
          
          <div className="flex items-center justify-between p-5 md:p-6">
            <div>
              <p className="font-black text-white">{t('settings.reminders_title')}</p>
              <p className="text-xs font-bold text-[#E8DCF8]">{t('settings.reminders_desc')}</p>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${notifications ? 'bg-[#C4B4E2]' : 'bg-[#3D2048]'}`}
            >
              <div className={`w-4 h-4 rounded-full absolute top-1 transition-transform ${notifications ? 'translate-x-7 bg-[#532E60]' : 'translate-x-1 bg-white'}`} />
            </button>
          </div>

        </div>
      </section>

      {/* Privacy & Data Section */}
      <section className="space-y-3">
        <h3 className="font-black text-[#532E60] px-2 uppercase tracking-wider text-xs">{t('settings.local_storage')}</h3>
        <div className="bg-[#532E60] text-white rounded-3xl overflow-hidden shadow-xl border-2 border-white/40">
          
          <div className="p-5 md:p-6 border-b border-white/20">
            <p className="text-sm font-bold text-[#E8DCF8] leading-relaxed">
              {t('settings.local_info')}
            </p>
          </div>

          <button 
            onClick={exportData}
            className="w-full flex items-center justify-between p-5 md:p-6 border-b border-white/20 hover:bg-[#613B6E] transition-colors text-left cursor-pointer"
          >
            <span className="font-black text-white">{t('settings.export_btn')}</span>
          </button>

          <button 
            onClick={handleClearData}
            className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-red-950/80 transition-colors text-left cursor-pointer"
          >
            <span className="font-black text-red-300">{t('settings.clear_data_btn')}</span>
          </button>

        </div>
      </section>
    </div>
  );
}
