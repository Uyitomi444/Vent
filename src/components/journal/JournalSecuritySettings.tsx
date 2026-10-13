import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Unlock, Clock, Check, X } from 'lucide-react';
import { useJournalStore } from '../../store/journalStore';

interface JournalSecuritySettingsProps {
  onClose: () => void;
}

export default function JournalSecuritySettings({ onClose }: JournalSecuritySettingsProps) {
  const {
    pinHash,
    autoLockMinutes,
    setupPin,
    removePin,
    setAutoLockMinutes,
  } = useJournalStore();

  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState("What is your favorite childhood place?");
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [step, setStep] = useState<'main' | 'setup' | 'disable'>('main');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSaveNewPin = async () => {
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setError('PIN must be exactly 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setError('PINs do not match.');
      return;
    }
    if (!securityAnswer.trim()) {
      setError('Please provide an answer to your recovery question.');
      return;
    }

    await setupPin(newPin, securityQuestion, securityAnswer);
    setSuccess('Journal PIN lock enabled successfully!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleRemovePin = () => {
    removePin();
    setSuccess('PIN protection disabled.');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-[#532E60] border-2 border-white/40 rounded-[2rem] p-6 sm:p-8 shadow-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#613B6E] rounded-2xl border border-white/30 text-[#C4B4E2]">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-black text-white">Journal Vault & Privacy</h2>
              <p className="text-xs text-[#E8DCF8]/80 font-bold">Client-side PIN & AES-GCM encryption</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#E8DCF8] hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {success && (
          <div className="p-3.5 bg-[#613B6E] border-2 border-white/40 rounded-2xl text-[#E8DCF8] text-sm font-black flex items-center gap-2 shadow-md">
            <Check size={18} className="text-[#C4B4E2]" />
            {success}
          </div>
        )}

        {step === 'main' && (
          <div className="space-y-6">
            <div className="bg-[#613B6E] p-4 sm:p-5 rounded-2xl border border-white/20 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-sm font-black text-white flex items-center gap-2">
                  {pinHash ? <Lock size={16} className="text-[#C4B4E2]" /> : <Unlock size={16} className="text-[#E8DCF8]" />}
                  Vault Status: {pinHash ? 'Protected with 4-Digit PIN' : 'Unprotected (No PIN)'}
                </span>
                <p className="text-xs text-[#E8DCF8]">
                  {pinHash
                    ? 'Entries are locally encrypted with AES-256 GCM.'
                    : 'Set a 4-digit PIN to lock your personal journal and encrypt your thoughts.'}
                </p>
              </div>

              {pinHash ? (
                <button
                  onClick={() => setStep('disable')}
                  className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-black rounded-full border border-rose-400/40 cursor-pointer shrink-0"
                >
                  Disable PIN
                </button>
              ) : (
                <button
                  onClick={() => {
                    setError('');
                    setStep('setup');
                  }}
                  className="px-5 py-2.5 bg-[#C4B4E2] hover:bg-white text-[#532E60] text-xs font-black rounded-full shadow-md cursor-pointer shrink-0 transition-all"
                >
                  Enable PIN
                </button>
              )}
            </div>

            {/* Auto Lock Timer */}
            {pinHash && (
              <div className="space-y-3 bg-[#613B6E]/60 p-4 rounded-2xl border border-white/20">
                <label className="text-xs font-black uppercase text-[#E8DCF8] tracking-wider flex items-center gap-1.5">
                  <Clock size={14} />
                  Auto-Lock Timeout
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '1 Min', val: 1 },
                    { label: '5 Mins', val: 5 },
                    { label: '15 Mins', val: 15 },
                    { label: 'Never', val: 0 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setAutoLockMinutes(opt.val)}
                      className={`py-2 px-3 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                        autoLockMinutes === opt.val
                          ? 'bg-[#C4B4E2] text-[#532E60] border-white shadow-md'
                          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'setup' && (
          <div className="space-y-4">
            <h3 className="text-base font-black text-white">Create 4-Digit Security PIN</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#E8DCF8] mb-1 block">New PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/30 rounded-xl text-center text-xl tracking-widest text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#E8DCF8] mb-1 block">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/30 rounded-xl text-center text-xl tracking-widest text-white font-mono outline-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-[#E8DCF8]">Security Recovery Question</label>
              <select
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#613B6E] border border-white/30 rounded-xl text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value="What is your favorite childhood place?">What is your favorite childhood place?</option>
                <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                <option value="What city brings you the most peace?">What city brings you the most peace?</option>
                <option value="What is your secret favorite comfort food?">What is your secret favorite comfort food?</option>
              </select>

              <input
                type="text"
                placeholder="Secret recovery answer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/30 rounded-xl text-xs font-bold text-white outline-none placeholder:text-white/40"
              />
            </div>

            {error && <p className="text-xs font-black text-rose-300">{error}</p>}

            <div className="flex justify-end gap-2 pt-4 border-t border-white/20">
              <button
                onClick={() => setStep('main')}
                className="px-4 py-2 bg-white/10 text-white rounded-full font-black text-xs hover:bg-white/20 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewPin}
                className="px-6 py-2 bg-[#C4B4E2] text-[#532E60] rounded-full font-black text-xs hover:bg-white shadow-md cursor-pointer"
              >
                Enable Lock
              </button>
            </div>
          </div>
        )}

        {step === 'disable' && (
          <div className="space-y-4">
            <h3 className="text-base font-black text-rose-300">Disable PIN Vault Protection?</h3>
            <p className="text-xs text-[#E8DCF8]">
              Disabling PIN protection will allow anyone with access to this device to read your journal entries without entering a code.
            </p>

            <div className="flex justify-end gap-2 pt-4 border-t border-white/20">
              <button
                onClick={() => setStep('main')}
                className="px-4 py-2 bg-white/10 text-white rounded-full font-black text-xs hover:bg-white/20 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRemovePin}
                className="px-5 py-2 bg-rose-500 text-white rounded-full font-black text-xs hover:bg-rose-600 shadow-md cursor-pointer"
              >
                Confirm Remove PIN
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
