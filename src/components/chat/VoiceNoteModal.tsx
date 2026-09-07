import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, X, RotateCcw } from 'lucide-react';

interface VoiceNoteModalProps {
  onClose: () => void;
  onSendTranscript: (text: string) => void;
}

export default function VoiceNoteModal({ onClose, onSendTranscript }: VoiceNoteModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');

  const timerRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let full = '';
        for (let i = 0; i < event.results.length; i++) {
          full += event.results[i][0].transcript + ' ';
        }
        setTranscript(full.trim());
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Waveform canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const numBars = 32;
      const barWidth = canvas.width / numBars - 3;
      const centerY = canvas.height / 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 3);
        const amp = isRecording
          ? Math.sin(phase + i * 0.4) * 0.5 + Math.cos(phase * 1.5 + i * 0.2) * 0.5
          : 0.1;
        const height = Math.max(4, Math.abs(amp) * (centerY * 0.8));

        ctx.fillStyle = isRecording ? '#C4B4E2' : '#ffffff40';
        ctx.beginPath();
        ctx.roundRect(x, centerY - height, barWidth, height * 2, 4);
        ctx.fill();
      }

      phase += isRecording ? 0.15 : 0.02;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRecording]);

  const startRecording = () => {
    setTranscript('');
    setRecordingSeconds(0);
    setIsRecording(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {}
    }

    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSend = () => {
    if (!transcript.trim()) return;
    onSendTranscript(transcript);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-[#532E60] border-2 border-white/40 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-white space-y-6 text-center"
      >
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <div className="flex items-center gap-2">
            <Mic size={20} className="text-[#C4B4E2]" />
            <h3 className="text-xl font-serif font-black text-white">Voice Note Venting</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#E8DCF8] hover:text-white hover:bg-white/10 rounded-full cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Audio Waveform */}
        <div className="w-full h-24 bg-[#613B6E] rounded-2xl p-2 border border-white/20 flex items-center justify-center relative overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute top-2 right-3 font-mono text-xs font-black text-[#C4B4E2]">
            {formatTime(recordingSeconds)}
          </div>
        </div>

        {/* Microphone Big Button */}
        <div className="flex justify-center">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50 scale-105'
                : 'bg-[#C4B4E2] hover:bg-white text-[#532E60] hover:scale-105 shadow-purple-500/30'
            }`}
          >
            {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
        </div>

        <p className="text-xs font-bold text-[#E8DCF8]">
          {isRecording
            ? 'Listening... Speak openly and tap to stop when ready.'
            : transcript
            ? 'Transcript captured! Review and send below.'
            : 'Tap the microphone to speak your feelings aloud.'}
        </p>

        {/* Live Transcript Output */}
        {transcript && (
          <div className="bg-[#613B6E] p-4 rounded-2xl border border-white/20 text-left max-h-32 overflow-y-auto">
            <div className="text-[10px] uppercase tracking-wider text-[#C4B4E2] font-black mb-1">
              Spoken Words:
            </div>
            <p className="text-sm font-bold text-white leading-relaxed">{transcript}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2">
          {transcript ? (
            <button
              onClick={() => {
                setTranscript('');
                setRecordingSeconds(0);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-black text-xs cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Retry</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleSend}
            disabled={!transcript.trim() || isRecording}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-xs shadow-lg transition-all ${
              transcript.trim() && !isRecording
                ? 'bg-[#C4B4E2] hover:bg-white text-[#532E60] cursor-pointer'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            <Send size={15} />
            <span>Send to Vent</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
