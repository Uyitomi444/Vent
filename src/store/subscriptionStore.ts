import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionStatus = 'free' | 'active' | 'past_due' | 'cancelled';

interface SubscriptionState {
  status: SubscriptionStatus;
  responseCount: number; // Number of companion (assistant) responses used (0 to 5 on free tier)
  maxFreeResponses: number; // 5
  isPaywallOpen: boolean;
  
  incrementResponseCount: () => void;
  openPaywall: () => void;
  closePaywall: () => void;
  subscribe: (paymentProvider: 'paystack' | 'flutterwave') => Promise<boolean>;
  cancelSubscription: () => void;
  resetFreeTierForTesting: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      status: 'free',
      responseCount: 0,
      maxFreeResponses: 5,
      isPaywallOpen: false,

      incrementResponseCount: () => {
        const { status, responseCount } = get();
        if (status === 'free') {
          set({ responseCount: responseCount + 1 });
        }
      },

      openPaywall: () => set({ isPaywallOpen: true }),
      closePaywall: () => set({ isPaywallOpen: false }),

      subscribe: async (paymentProvider) => {
        // Simulates Paystack / Flutterwave popup checkout modal flow
        return new Promise((resolve) => {
          setTimeout(() => {
            set({
              status: 'active',
              isPaywallOpen: false
            });
            alert(`Thank you! Your monthly subscription has been activated via ${paymentProvider === 'paystack' ? 'Paystack' : 'Flutterwave'}. You now have unlimited companion access.`);
            resolve(true);
          }, 1200);
        });
      },

      cancelSubscription: () => {
        set({ status: 'cancelled' });
        alert('Subscription cancelled. You retain read-only access to all your past journal entries, mood history, and progress data.');
      },

      resetFreeTierForTesting: () => {
        set({ status: 'free', responseCount: 0, isPaywallOpen: false });
      }
    }),
    {
      name: 'itoura-subscription-storage'
    }
  )
);
