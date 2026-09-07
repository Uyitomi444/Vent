import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, Upload, Check, Sparkles, User, Heart, MessageSquareQuote } from 'lucide-react';
import { useProfileStore, PRESET_AVATARS, AVAILABLE_GOALS } from '../../store/profileStore';

interface ProfileEditorModalProps {
  onClose: () => void;
}

export default function ProfileEditorModal({ onClose }: ProfileEditorModalProps) {
  const { profile, updateProfile } = useProfileStore();

  const [name, setName] = useState(profile.name);
  const [nickname, setNickname] = useState(profile.nickname);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [pronouns, setPronouns] = useState(profile.pronouns);
  const [bio, setBio] = useState(profile.bio);
  const [goals, setGoals] = useState<string[]>(profile.goals || []);
  const [companionTone, setCompanionTone] = useState(profile.companionTone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use FileReader and Canvas to resize image to max 256x256 for lightweight localStorage storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setAvatarUrl(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const toggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const handleSave = () => {
    updateProfile({
      name: name.trim() || 'Kind Wanderer',
      nickname: nickname.trim() || name.trim() || 'Friend',
      avatarUrl,
      pronouns: pronouns.trim() || 'they/them',
      bio: bio.trim(),
      goals,
      companionTone,
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  const PRONOUN_PRESETS = ['they/them', 'she/her', 'he/him', 'prefer not to say'];

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#532E60] border-2 border-white/40 rounded-[2.5rem] shadow-2xl text-white max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Pinned Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-[#532E60] border-b border-white/20 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#613B6E] rounded-2xl border border-white/30 text-[#C4B4E2]">
              <User size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight">
                Edit Your Profile
              </h2>
              <p className="text-xs text-[#E8DCF8]/80 font-bold">
                Personalize your name, photo, and companion experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-[#613B6E] hover:bg-white text-[#E8DCF8] hover:text-[#532E60] rounded-full border border-white/30 transition-all cursor-pointer shadow-md"
            aria-label="Close Profile Editor"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 min-h-0 custom-scrollbar">
          {/* 1. Photo / Avatar Section */}
          <div className="bg-[#613B6E]/60 p-5 rounded-3xl border border-white/20 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative group shrink-0">
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl bg-[#532E60]"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-[#C4B4E2] hover:bg-white text-[#532E60] rounded-full shadow-lg border-2 border-white transition-all cursor-pointer"
                  title="Upload New Photo"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#E8DCF8] block">
                  Profile Photo
                </span>
                <p className="text-xs text-white/80 font-bold leading-relaxed">
                  Upload your own photo or choose one of our soothing illustrated avatars below.
                </p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-xs rounded-full shadow-md transition-all cursor-pointer flex items-center gap-1.5 border border-white"
                  >
                    <Upload size={14} />
                    <span>Upload Photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Illustrated Presets */}
            <div className="space-y-2 pt-2 border-t border-white/15">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#E8DCF8]/80 block">
                Or Pick a Cozy Preset Avatar:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = avatarUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className={`relative rounded-full p-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-3 ring-white ring-offset-2 ring-offset-[#532E60] scale-110'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white/50 bg-[#532E60]"
                      />
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 text-emerald-950 rounded-full flex items-center justify-center text-[10px] font-bold border border-white">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Name & Nickname */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[#E8DCF8]">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-4 py-3 bg-[#613B6E] text-white rounded-2xl border border-white/30 font-bold placeholder:text-white/40 focus:outline-none focus:border-white transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[#E8DCF8]">
                Preferred Nickname (for Itoura)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="What should Itoura call you?"
                className="w-full px-4 py-3 bg-[#613B6E] text-white rounded-2xl border border-white/30 font-bold placeholder:text-white/40 focus:outline-none focus:border-white transition-all text-sm"
              />
            </div>
          </div>

          {/* 3. Pronouns */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#E8DCF8]">
              Pronouns
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRONOUN_PRESETS.map((p) => {
                const active = pronouns === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPronouns(p)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border ${
                      active
                        ? 'bg-[#C4B4E2] text-[#532E60] border-white shadow-md'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              placeholder="Or enter custom pronouns..."
              className="w-full px-4 py-2.5 bg-[#613B6E] text-white rounded-2xl border border-white/30 font-bold placeholder:text-white/40 focus:outline-none focus:border-white transition-all text-xs"
            />
          </div>

          {/* 4. Personal Mantra / Bio */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-[#E8DCF8] flex items-center gap-1.5">
              <MessageSquareQuote size={15} />
              <span>Personal Mantra or Reflection Note</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A gentle reminder for yourself, e.g. 'One day at a time', 'I am allowed to rest'..."
              rows={2}
              className="w-full px-4 py-3 bg-[#613B6E] text-white rounded-2xl border border-white/30 font-bold placeholder:text-white/40 focus:outline-none focus:border-white transition-all text-sm resize-none leading-relaxed"
            />
          </div>

          {/* 5. Wellbeing Intentions & Goals */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#E8DCF8] flex items-center gap-1.5">
              <Heart size={15} />
              <span>Wellbeing Focus Areas</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_GOALS.map((goal) => {
                const isSelected = goals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#C4B4E2] text-[#532E60] border-white shadow-md scale-102'
                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {isSelected && <Check size={13} />}
                    <span>{goal}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Companion Tone */}
          <div className="space-y-2.5">
            <label className="text-xs font-black uppercase tracking-wider text-[#E8DCF8] flex items-center gap-1.5">
              <Sparkles size={15} />
              <span>Preferred Itoura Voice & Tone</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  id: 'gentle',
                  name: 'Gentle & Empathetic',
                  desc: 'Warm, deeply validating, patient, and soft-spoken.',
                },
                {
                  id: 'grounding',
                  name: 'Calm & Grounding',
                  desc: 'Steadfast, breath-focused, anchoring through storms.',
                },
                {
                  id: 'uplifting',
                  name: 'Uplifting & Encouraging',
                  desc: 'Hopeful, celebrating micro-wins and inner strength.',
                },
                {
                  id: 'direct',
                  name: 'Thoughtful & Practical',
                  desc: 'Clear, insightful, concise, and focused on steps.',
                },
              ].map((tone) => {
                const isSelected = companionTone === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setCompanionTone(tone.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#613B6E] border-white shadow-md'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white">{tone.name}</span>
                      {isSelected && (
                        <span className="w-4 h-4 bg-[#C4B4E2] text-[#532E60] rounded-full flex items-center justify-center text-[10px] font-black">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#E8DCF8]/80 font-bold leading-relaxed">
                      {tone.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pinned Bottom Footer Bar */}
        <div className="p-4 sm:p-5 bg-[#4A2656] border-t border-white/20 shrink-0 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-black transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-7 py-2.5 bg-[#C4B4E2] hover:bg-white text-[#532E60] rounded-full text-xs font-black shadow-lg transition-all cursor-pointer border border-white flex items-center gap-2"
          >
            {savedSuccess ? (
              <>
                <Check size={16} />
                <span>Profile Saved!</span>
              </>
            ) : (
              <span>Save Profile</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
