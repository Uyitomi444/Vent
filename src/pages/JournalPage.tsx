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

  // Editor View
  if (editingId) {
    return (
      <div className="h-full flex flex-col max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-6 pt-4 shrink-0">
          <button 
            onClick={() => setEditingId(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-itoura-dark transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-itoura-dark text-white rounded-full font-medium shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            Save Entry
          </button>
        </div>

        <div className="flex-1 bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-sm border border-white/50 flex flex-col min-h-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your thoughts a title..."
            className="text-2xl md:text-3xl font-serif text-itoura-dark bg-transparent border-none outline-none mb-4 placeholder:text-gray-400"
          />
          <div className="h-px bg-itoura-light/50 w-full mb-6"></div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? This space is entirely yours..."
            className="flex-1 resize-none bg-transparent border-none outline-none text-gray-700 leading-relaxed placeholder:text-gray-400 font-sans text-lg"
          />
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      <div className="flex items-end justify-between mb-8 pt-4 shrink-0">
        <div>
          <h1 className="font-serif text-3xl text-itoura-dark mb-1">Your Journal</h1>
          <p className="text-gray-500 text-sm">A private space for your thoughts.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-itoura-light text-itoura-dark border border-itoura-dark/10 rounded-full font-medium shadow-sm hover:bg-white transition-all"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 min-h-0">
        {entries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <img 
              src="/assets/illustrations/Notebook_with_pen_and_star_202607141352.jpeg" 
              alt="Empty Journal" 
              className="w-48 h-48 object-cover mix-blend-multiply opacity-80 mb-6 rounded-3xl"
            />
            <h3 className="text-xl font-serif text-itoura-dark mb-2">No entries yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Writing down your feelings is a powerful way to process them. Start your first entry whenever you're ready.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <div 
                key={entry.id} 
                className="bg-white/60 backdrop-blur-sm border border-white/50 p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow group flex flex-col cursor-pointer"
                onClick={() => handleEdit(entry)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-serif text-itoura-dark line-clamp-1">{entry.title}</h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if(window.confirm('Delete this entry forever?')) deleteEntry(entry.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 md:group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-gray-600 line-clamp-2 mb-4 text-sm leading-relaxed">
                  {entry.content}
                </p>
                <div className="mt-auto flex items-center text-xs text-gray-400 font-medium">
                  <Calendar size={12} className="mr-1.5" />
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
