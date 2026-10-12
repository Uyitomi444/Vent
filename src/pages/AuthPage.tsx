import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  HeartHandshake,
  Upload,
  ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { PRESET_AVATARS } from '../store/profileStore';
import MascotPose from '../components/MascotPose';
import itouraLogo from '../assets/ABLE/logo.png';
import { useLanguageStore } from '../i18n';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useLanguageStore();

  const {
    currentUser,
    registeredUsers,
    register,
    login,
    switchUser,
    isUsernameAvailable,
    isAuthenticated,
  } = useAuthStore();

  const initialMode = searchParams.get('mode') === 'signin' ? 'signin' : 'register';
  const redirectTarget = searchParams.get('redirect') || '/chat';

  const [mode, setMode] = useState<'register' | 'signin'>(initialMode);
  
  // Registration fields
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0].url);
  const [companionTone, setCompanionTone] = useState<'gentle' | 'grounding' | 'uplifting' | 'direct'>('gentle');
  const [showPassword, setShowPassword] = useState(false);

  // Sign in fields
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Status & error handling
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If already authenticated and not explicitly trying to switch, let them continue
  useEffect(() => {
    if (isAuthenticated && currentUser && !searchParams.get('force')) {
      navigate(redirectTarget, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, redirectTarget, searchParams]);

  // Handle uploaded custom avatar
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  // Real-time username check
  const cleanUsername = username.trim().toLowerCase().replace(/^@+/, '').replace(/\s+/g, '_');
  const isUsernameValidLength = cleanUsername.length >= 3;
  const isUsernameSyntaxOk = /^[a-zA-Z0-9_.-]+$/.test(cleanUsername);
  const isAvailable = cleanUsername ? isUsernameAvailable(cleanUsername) : null;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cleanUsername) {
      setErrorMsg('Please choose a username to register.');
      return;
    }

    if (!isUsernameValidLength) {
      setErrorMsg('Username must be at least 3 characters long.');
      return;
    }

    if (!isUsernameSyntaxOk) {
      setErrorMsg('Username can only contain letters, numbers, underscores, and dashes.');
      return;
    }

    if (!isAvailable) {
      setErrorMsg(`@${cleanUsername} is already registered. Please choose another username or sign in.`);
      return;
    }

    const cleanedEmail = email.trim().toLowerCase();
    if (!cleanedEmail) {
      setErrorMsg('Email address is required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Password is required.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await register({
        username: cleanUsername,
        displayName: displayName.trim() || cleanUsername,
        email: cleanedEmail,
        password,
        avatarUrl,
        companionTone,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Registration failed. Please check your details.');
        setIsLoading(false);
        return;
      }

      setSuccessAnimation(true);
      setTimeout(() => {
        navigate(redirectTarget, { replace: true });
      }, 900);
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!signInIdentifier.trim()) {
      setErrorMsg('Please enter your username or email.');
      return;
    }

    if (!signInPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login({
        usernameOrEmail: signInIdentifier,
        password: signInPassword,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to sign in. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      setSuccessAnimation(true);
      setTimeout(() => {
        navigate(redirectTarget, { replace: true });
      }, 900);
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  const handleOneClickLogin = (user: (typeof registeredUsers)[0]) => {
    setErrorMsg(null);
    switchUser(user.id);
    setSuccessAnimation(true);
    setTimeout(() => {
      navigate(redirectTarget, { replace: true });
    }, 700);
  };

  const tones = [
    { id: 'gentle', label: t('auth.tone_gentle'), desc: t('auth.tone_gentle_desc') },
    { id: 'grounding', label: t('auth.tone_grounding'), desc: t('auth.tone_grounding_desc') },
    { id: 'uplifting', label: t('auth.tone_uplifting'), desc: t('auth.tone_uplifting_desc') },
    { id: 'direct', label: t('auth.tone_direct'), desc: t('auth.tone_direct_desc') },
  ] as const;

  return (
    <div className="min-h-screen bg-[#C4B4E2] font-sans text-[#532E60] flex flex-col justify-between relative overflow-x-hidden selection:bg-[#532E60] selection:text-white">
      {/* Ambient background decorative glow circles */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#532E60]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Top Bar with Logo & Back Link */}
      <header 
        style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
        className="w-full px-6 pb-4 flex items-center justify-between max-w-5xl mx-auto relative z-50"
      >
        <Link 
          to="/" 
          className="flex items-center gap-2 group text-[#532E60] hover:text-[#3D2048] font-black text-sm transition-transform"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>{t('auth.back_welcome')}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={itouraLogo} 
              alt="Itoura" 
              className="h-9 sm:h-10 object-contain transition-transform group-hover:scale-105" 
            />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-2xl bg-[#532E60] text-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border-2 border-white/30 backdrop-blur-md relative overflow-hidden">
          
          {/* Success Overlay on completion */}
          <AnimatePresence>
            {successAnimation && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#532E60] z-50 flex flex-col items-center justify-center p-8 text-center space-y-4"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400 flex items-center justify-center animate-bounce">
                  <CheckCircle2 size={44} />
                </div>
                <h3 className="text-3xl font-serif font-black text-white">
                  {mode === 'register' ? t('auth.success_register') : t('auth.success_signin')}
                </h3>
                <p className="text-white/80 font-bold max-w-sm">
                  {mode === 'register' 
                    ? `Your sanctuary is ready, @${cleanUsername || currentUser?.username}. Starting your session now...`
                    : `Taking you right back to your companion...`}
                </p>
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mt-4" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header Banner: Mascot + Friendly Intro */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 pb-6 border-b border-white/15">
            <div className="w-20 h-20 bg-[#613B6E] rounded-3xl border-2 border-white/30 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
              <MascotPose pose="waving" className="w-20 h-20 scale-125" />
            </div>

            <div className="text-center sm:text-left flex-1 space-y-1">
              <div className="inline-block px-3 py-1 bg-[#613B6E] text-[#C4B4E2] text-xs font-black rounded-full uppercase tracking-wider mb-1">
                {mode === 'register' ? t('auth.badge_register') : t('auth.badge_signin')}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white">
                {mode === 'register' ? t('auth.title_register') : t('auth.title_signin')}
              </h1>
              <p className="text-sm font-bold text-[#E8DCF8] leading-relaxed">
                {mode === 'register' ? t('auth.desc_register') : t('auth.desc_signin')}
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-[#3D2048] rounded-2xl mb-8 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`py-3 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#532E60] shadow-lg scale-[1.01]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <User size={16} />
              <span>{t('auth.tab_register')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`py-3 px-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-[#532E60] shadow-lg scale-[1.01]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock size={16} />
              <span>{t('auth.tab_signin')}</span>
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-rose-500/20 border-2 border-rose-400/40 text-rose-200 text-sm font-bold flex items-start gap-3 shadow-md"
            >
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-300" />
              <div className="flex-1">{errorMsg}</div>
            </motion.div>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              
              {/* 1. Username Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-username" className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{t('auth.username')}</span>
                    <span className="text-rose-300">*</span>
                  </label>
                  
                  {cleanUsername && (
                    <div className="text-xs font-bold flex items-center gap-1">
                      {!isUsernameValidLength ? (
                        <span className="text-amber-300">Min 3 characters</span>
                      ) : !isUsernameSyntaxOk ? (
                        <span className="text-rose-300">Letters & numbers only</span>
                      ) : isAvailable ? (
                        <span className="text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Available
                        </span>
                      ) : (
                        <span className="text-rose-300 flex items-center gap-1">
                          <AlertCircle size={13} /> Username taken
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-4 text-white/50 font-mono font-bold text-base select-none">
                    @
                  </div>
                  <input
                    id="auth-username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder={t('auth.username_placeholder')}
                    required
                    maxLength={30}
                    className="w-full pl-9 pr-4 py-3.5 bg-[#613B6E] border-2 border-white/20 focus:border-white focus:bg-[#6c427b] rounded-2xl text-white placeholder-white/40 font-bold text-base outline-none transition-all shadow-inner"
                  />
                </div>
                <p className="text-xs font-bold text-[#E8DCF8]/80">
                  {t('auth.username_hint')}
                </p>
              </div>

              {/* 2. Display Name */}
              <div className="space-y-2">
                <label htmlFor="auth-displayname" className="text-sm font-black text-white">
                  {t('auth.fullname')}
                </label>
                <div className="relative flex items-center">
                  <User size={18} className="absolute left-4 text-white/50" />
                  <input
                    id="auth-displayname"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={t('auth.fullname_placeholder')}
                    maxLength={40}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#613B6E] border-2 border-white/20 focus:border-white focus:bg-[#6c427b] rounded-2xl text-white placeholder-white/40 font-bold text-base outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* 3. Mandatory Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="auth-email" className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{t('auth.email')}</span>
                    <span className="text-rose-300">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={16} className="absolute left-3.5 text-white/40" />
                    <input
                      id="auth-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.email_placeholder')}
                      className="w-full pl-10 pr-3 py-3 bg-[#613B6E] border-2 border-white/20 focus:border-white focus:bg-[#6c427b] rounded-2xl text-white placeholder-white/30 text-sm font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="auth-password" className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{t('auth.password')}</span>
                    <span className="text-rose-300">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={16} className="absolute left-3.5 text-white/40" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('auth.password_placeholder')}
                      className="w-full pl-10 pr-10 py-3.5 bg-[#613B6E] border-2 border-white/20 focus:border-white focus:bg-[#6c427b] rounded-2xl text-white placeholder-white/30 text-sm font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-white/50 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Avatar Selection */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-black text-white">{t('auth.avatar_label')}</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-[#C4B4E2] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload size={13} />
                    <span>{t('auth.avatar_upload')}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
                  {PRESET_AVATARS.map((av) => {
                    const isSelected = avatarUrl === av.url;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setAvatarUrl(av.url)}
                        title={av.name}
                        className={`relative shrink-0 w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all p-0.5 cursor-pointer ${
                          isSelected
                            ? 'border-white ring-2 ring-white scale-110 shadow-lg'
                            : 'border-white/20 hover:border-white/60 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={av.url} alt={av.name} className="w-full h-full object-cover rounded-xl" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#532E60]/30 flex items-center justify-center">
                            <CheckCircle2 size={18} className="text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Companion Tone Choice */}
              <div className="space-y-2.5">
                <label className="text-sm font-black text-white flex items-center gap-1.5">
                  <HeartHandshake size={16} className="text-[#C4B4E2]" />
                  <span>{t('auth.tone_label')}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {tones.map((tItem) => (
                    <button
                      key={tItem.id}
                      type="button"
                      onClick={() => setCompanionTone(tItem.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        companionTone === tItem.id
                          ? 'bg-white text-[#532E60] font-black border-white shadow-md'
                          : 'bg-[#613B6E] text-white/80 border-white/20 hover:bg-[#6c427b]'
                      }`}
                    >
                      <div className="text-xs font-black">{tItem.label}</div>
                      <div className={`text-[10px] mt-0.5 leading-tight line-clamp-2 ${companionTone === tItem.id ? 'text-[#532E60]/80 font-bold' : 'text-[#E8DCF8]'}`}>
                        {tItem.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-white hover:bg-[#E8DCF8] text-[#532E60] font-black text-lg rounded-2xl shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border-2 border-white cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-3 border-[#532E60]/30 border-t-[#532E60] rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{t('auth.register_btn')}</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>

              {/* Privacy Footer */}
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#E8DCF8] text-center pt-2">
                <ShieldCheck size={16} className="text-emerald-300 shrink-0" />
                <span>{t('auth.privacy_note')}</span>
              </div>
            </form>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <div className="space-y-6">
              
              {/* Existing accounts on device shortcut */}
              {registeredUsers.length > 0 && (
                <div className="p-4 bg-[#3D2048] rounded-2xl border border-white/10 space-y-3">
                  <div className="text-xs font-black text-[#C4B4E2] uppercase tracking-wider">
                    {t('auth.accounts_on_device')}
                  </div>
                  <div className="space-y-2">
                    {registeredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleOneClickLogin(user)}
                        className="w-full flex items-center justify-between p-3 bg-[#613B6E] hover:bg-[#6c427b] rounded-xl border border-white/10 hover:border-white transition-all text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl || PRESET_AVATARS[0].url}
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full object-cover border border-white/30"
                          />
                          <div>
                            <div className="font-black text-white text-sm group-hover:text-emerald-300 transition-colors">
                              {user.displayName}
                            </div>
                            <div className="text-xs text-[#E8DCF8] font-mono">
                              @{user.username} • {user.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#C4B4E2] group-hover:text-white">
                          <span>Continue</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Standard Sign In Form */}
              <form onSubmit={handleSignInSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="signin-id" className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{t('auth.signin_id')}</span>
                    <span className="text-rose-300">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User size={18} className="absolute left-4 text-white/50" />
                    <input
                      id="signin-id"
                      type="text"
                      required
                      value={signInIdentifier}
                      onChange={(e) => {
                        setSignInIdentifier(e.target.value);
                        setErrorMsg(null);
                      }}
                      placeholder={t('auth.signin_id_placeholder')}
                      className="w-full pl-12 pr-4 py-3.5 bg-[#613B6E] border-2 border-white/20 focus:border-white focus:bg-[#6c427b] rounded-2xl text-white placeholder-white/40 font-bold text-base outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="signin-pw" className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>{t('auth.signin_password')}</span>
                    <span className="text-rose-300">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={18} className="absolute left-4 text-white/50" />
                    <input
                      id="signin-pw"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={(e) => {
                        setSignInPassword(e.target.value);
                        setErrorMsg(null);
                      }}
                      placeholder={t('auth.signin_password_placeholder')}
                      className="w-full pl-12 pr-12 py-3.5 bg-[#613B6E] border-2 border-white/20 focus:border-white focus:bg-[#6c427b] rounded-2xl text-white placeholder-white/40 font-bold text-base outline-none transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-white/50 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-6 bg-white hover:bg-[#E8DCF8] text-[#532E60] font-black text-lg rounded-2xl shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3 border-2 border-white cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-3 border-[#532E60]/30 border-t-[#532E60] rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{t('auth.signin_btn')}</span>
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                  }}
                  className="text-xs font-black text-[#C4B4E2] hover:text-white underline cursor-pointer"
                >
                  {t('auth.switch_register')}
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer 
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
        className="w-full pt-4 text-center text-xs font-bold text-[#532E60]/80 z-10"
      >
        © {new Date().getFullYear()} Itoura. All thoughts remain strictly confidential.
      </footer>
    </div>
  );
}
