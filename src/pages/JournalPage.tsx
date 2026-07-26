import { useState } from 'react';
import { useJournalStore } from '../store/journalStore';
import type { JournalEntry } from '../store/journalStore';
import { Plus, Trash2, ArrowLeft, Calendar } from 'lucide-react';

export default function JournalPage() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournalStore();
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreateNew = () => {
    setTitle('');
    setContent('');
    setEditingId('new');
  };

  const handleEdit = (entry: JournalEntry) => {
    setTitle(entry.title);
    setContent(entry.content);
    setEditingId(entry.id);
  };

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;

    if (editingId === 'new') {
      addEntry({ title: title || 'Untitled', content });
    } else if (editingId) {
      updateEntry(editingId, { title: title || 'Untitled', content });
    }
    setEditingId(null);
  };

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(ts));
  };

  // Editor View: Vibrant Purple Text Space with Bold Black Text
  if (editingId) {
    return (
      <div className="h-full flex flex-col max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-6 pt-4 shrink-0">
          <button 
            onClick={() => setEditingId(null)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-900 text-white rounded-full font-bold text-sm hover:bg-purple-800 transition-colors shadow-md"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2.5 bg-purple-950 text-white font-extrabold rounded-full shadow-lg hover:bg-purple-800 hover:scale-105 active:scale-95 transition-all border-2 border-purple-400"
          >
            Save Entry
          </button>
        </div>

        {/* Purple Container for Journal Editor */}
        <div className="flex-1 bg-[#E9D5FF] rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-purple-500 flex flex-col min-h-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your thoughts a title..."
            className="text-2xl md:text-3xl font-serif font-black text-black bg-transparent border-none outline-none mb-4 placeholder:text-purple-950/60"
          />
          <div className="h-0.5 bg-purple-400 w-full mb-6"></div>
          <div className="flex-1 relative flex flex-col">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? This space is entirely yours..."
              className="flex-1 resize-none bg-transparent border-none outline-none text-black font-bold leading-relaxed placeholder:text-purple-950/60 text-lg pb-12"
            />
            <button
              onClick={() => {
                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                if (!SpeechRecognition) {
                  alert("Voice input is not supported in this browser.");
                  return;
                }
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.onresult = (event: any) => {
                  setContent(prev => prev + (prev.endsWith(' ') || prev.length === 0 ? '' : ' ') + event.results[0][0].transcript);
                };
                recognition.start();
              }}
              className="absolute bottom-2 right-2 p-3 bg-purple-950 text-white rounded-full shadow-md hover:bg-purple-800 transition-colors border border-purple-400"
              title="Voice Dictation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List View: Purple Cards with Bold Black Text
  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      <div className="flex items-end justify-between mb-8 pt-4 shrink-0">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-black text-purple-950 mb-1">Your Journal</h1>
          <p className="text-purple-900/80 font-bold text-sm">A private space for your thoughts.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-950 text-white font-extrabold rounded-full shadow-lg border-2 border-purple-400 hover:bg-purple-800 transition-all hover:scale-105"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 min-h-0">
        {entries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-12 bg-purple-200/80 rounded-3xl border-2 border-purple-400/80">
            <h3 className="text-2xl font-serif font-black text-purple-950 mb-2">No entries yet</h3>
            <p className="text-purple-950 font-bold max-w-md mx-auto mb-6">
              Writing down your feelings is a powerful way to process them. Start your first entry whenever you're ready.
            </p>
            <button 
              onClick={handleCreateNew}
              className="px-6 py-3 bg-purple-950 text-white rounded-full font-extrabold shadow-md hover:bg-purple-800 transition-all"
            >
              Write First Entry
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <div 
                key={entry.id} 
                className="bg-[#E9D5FF] border-2 border-purple-400/90 p-6 rounded-3xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all group flex flex-col cursor-pointer"
                onClick={() => handleEdit(entry)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-serif font-black text-black line-clamp-1">{entry.title}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(window.confirm('Delete this entry forever?')) deleteEntry(entry.id);
                    }}
                    className="p-2 text-purple-950 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-black font-bold line-clamp-2 mb-4 text-sm leading-relaxed">
                  {entry.content}
                </p>
                <div className="mt-auto flex items-center text-xs text-purple-900 font-extrabold">
                  <Calendar size={14} className="mr-1.5 text-purple-800" />
                  {formatDate(entry.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
