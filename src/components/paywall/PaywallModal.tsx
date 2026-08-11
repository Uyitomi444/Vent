import { useState } from 'react';
import { useSubscriptionStore } from '../../store/subscriptionStore';
import { useLanguageStore } from '../../i18n';
import { HeartHandshake, X } from 'lucide-react';

export default function PaywallModal() {
  const { isPaywallOpen, closePaywall, subscribe } = useSubscriptionStore();
  const { t } = useLanguageStore();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isPaywallOpen) return null;

  const handleSubscribe = async (provider: 'paystack' | 'flutterwave') => {
    setIsProcessing(true);
    await subscribe(provider);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3D2048]/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#532E60] border-2 border-white/40 shadow-2xl rounded-[2.5rem] max-w-md w-full p-6 md:p-8 relative text-white text-center flex flex-col items-center">
        
        <button
          onClick={closePaywall}
          className="absolute top-4 right-4 p-2 bg-[#3D2048]/80 hover:bg-[#3D2048] text-white rounded-full transition-colors cursor-pointer border border-white/40"
        >
          <X size={18} className="text-[#C4B4E2]" />
        </button>

        <div className="p-4 bg-[#613B6E] rounded-full border border-white/30 mb-4 shadow-inner">
          <HeartHandshake size={36} className="text-[#C4B4E2]" />
        </div>

        <h3 className="font-serif text-2xl md:text-3xl font-black text-white mb-2">
          {t('paywall.title')}
        </h3>

        <p className="text-[#E8DCF8] font-bold text-sm leading-relaxed mb-6">
          {t('paywall.desc')}
        </p>

        {/* Pricing Badge */}
        <div className="w-full bg-[#C4B4E2] text-[#532E60] p-4 rounded-2xl border border-white shadow-md mb-6">
          <p className="text-xs uppercase tracking-wider font-extrabold text-[#532E60]/80">Unlimited Monthly Access</p>
          <p className="text-2xl font-black text-[#532E60] mt-0.5">{t('paywall.price')}</p>
        </div>

        {/* Payment Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={() => handleSubscribe('paystack')}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 bg-[#C4B4E2] hover:bg-white text-[#532E60] font-black text-sm md:text-base rounded-full shadow-lg border border-white transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? 'Connecting Paystack...' : 'Pay with Paystack (Card / Transfer / USSD)'}
          </button>

          <button
            onClick={() => handleSubscribe('flutterwave')}
            disabled={isProcessing}
            className="w-full py-3 px-6 bg-[#613B6E] hover:bg-[#6D427C] text-white font-bold text-xs md:text-sm rounded-full border border-white/30 transition-all cursor-pointer disabled:opacity-50"
          >
            Pay with Flutterwave
          </button>
        </div>

      </div>
    </div>
  );
}
