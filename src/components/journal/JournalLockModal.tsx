import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, KeyRound, AlertCircle, Delete, HelpCircle } from 'lucide-react';
import { useJournalStore } from '../../store/journalStore';
import { hashPin } from '../../services/cryptoService';

interface JournalLockModalProps {
  onUnlocked?: () => void;
}

export default function JournalLockModal({ onUnlocked }: JournalLockModalProps) {
  const { unlockVault, securityQuestion, securityAnswerHash, removePin } = useJournalStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);
      setErrorMessage('');

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  const verifyPin = async (inputPin: string) => {
    const success = await unlockVault(inputPin);
    if (success) {
      if (onUnlocked) onUnlocked();
    } else {
      setError(true);
      setErrorMessage('Incorrect PIN. Please try again.');
      setTimeout(() => {
        setPin('');
      }, 500);
    }
  };

  const handleRecover = async () => {
    if (!recoveryAnswer.trim()) return;
    const answerHash = await hashPin(recoveryAnswer.trim().toLowerCase());
    if (answerHash === securityAnswerHash) {
      removePin();
      setShowRecovery(false);
      if (onUnlocked) onUnlocked();
    } else {
      setRecoveryError('Incorrect security answer.');
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 min-h-[460px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-[#532E60] border-2 border-white/40 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Glow background */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#C4B4E2]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-[#C4B4E2]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Diary Notebook with Lock badge */}
        <div className="relative mb-3">
          <div className="p-2.5 bg-[#613B6E] rounded-3xl border border-white/30 shadow-md">
            <img 
              src="/assets/illustrations/Notebook_with_pen_and_star_202607141352.jpeg" 
              alt="Diary Notebook" 
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover mix-blend-screen opacity-95 rounded-2xl"
            />
          </div>
          <motion.div
            animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl bg-[#532E60] border-2 border-white/60 flex items-center justify-center shadow-lg text-[#C4B4E2]"
          >
            <Lock size={18} className="stroke-[2.5]" />
          </motion.div>
        </div>

        <h2 className="text-2xl font-serif font-black text-white mb-1">Journal Vault Locked</h2>
        <p className="text-xs sm:text-sm font-bold text-[#E8DCF8]/80 mb-6">
          Enter your 4-digit PIN to access private entries
        </p>

        {/* PIN Dots Display */}
        <motion.div
          animate={error ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-6"
        >
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  isFilled
                    ? error
                      ? 'bg-rose-400 border-rose-300 scale-110 shadow-lg shadow-rose-500/50'
                      : 'bg-[#C4B4E2] border-white scale-110 shadow-lg shadow-[#C4B4E2]/50'
                    : 'border-white/30 bg-white/10'
                }`}
              />
            );
          })}
        </motion.div>

        {errorMessage && (
          <p className="text-xs font-black text-rose-300 mb-3 flex items-center gap-1.5 animate-in fade-in">
            <AlertCircle size={14} />
            {errorMessage}
          </p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="h-13 sm:h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xl font-black transition-all shadow-md cursor-pointer flex items-center justify-center select-none"
            >
              {digit}
            </button>
          ))}

          <button
            onClick={handleClear}
            className="h-13 sm:h-14 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 border border-white/10 text-[#E8DCF8] text-xs font-black transition-all cursor-pointer flex items-center justify-center uppercase select-none"
          >
            Clear
          </button>

          <button
            onClick={() => handleKeyPress('0')}
            className="h-13 sm:h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xl font-black transition-all shadow-md cursor-pointer flex items-center justify-center select-none"
          >
            0
          </button>

          <button
            onClick={handleDelete}
            className="h-13 sm:h-14 rounded-2xl bg-white/5 hover:bg-white/15 active:scale-95 border border-white/10 text-[#E8DCF8] hover:text-white transition-all cursor-pointer flex items-center justify-center select-none"
            aria-label="Delete digit"
          >
            <Delete size={20} />
          </button>
        </div>

        {/* Recovery Link if Security Question exists */}
        {securityQuestion && (
          <button
            onClick={() => setShowRecovery(true)}
            className="text-xs font-black text-[#C4B4E2] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer mt-2"
          >
            <HelpCircle size={13} />
            <span>Forgot PIN?</span>
          </button>
        )}
      </motion.div>

      {/* Recovery Modal */}
      <AnimatePresence>
        {showRecovery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#532E60] border-2 border-white/40 rounded-3xl p-6 shadow-2xl text-white space-y-4"
            >
              <h3 className="text-xl font-serif font-black flex items-center gap-2">
                <KeyRound size={20} className="text-[#C4B4E2]" />
                Reset Vault PIN
              </h3>
              <p className="text-xs text-[#E8DCF8]">
                Answer your security question to reset the PIN protection.
              </p>

              <div className="p-3 bg-[#613B6E] rounded-xl border border-white/20 text-sm font-bold text-white">
                {securityQuestion}
              </div>

              <input
                type="text"
                placeholder="Your secret answer"
                value={recoveryAnswer}
                onChange={(e) => {
                  setRecoveryAnswer(e.target.value);
                  setRecoveryError('');
                }}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white outline-none font-bold placeholder:text-white/40 text-sm"
              />

              {recoveryError && (
                <p className="text-xs font-black text-rose-300">{recoveryError}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowRecovery(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-full font-black text-xs hover:bg-white/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRecover}
                  className="px-5 py-2 bg-[#C4B4E2] text-[#532E60] rounded-full font-black text-xs hover:bg-white cursor-pointer shadow-md"
                >
                  Reset & Unlock
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
