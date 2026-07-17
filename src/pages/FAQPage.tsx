import { useState } from 'react';
import { ChevronDown, MessageCircleHeart } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQ[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    title: "GETTING STARTED",
    items: [
      {
        question: "What is Itoura?",
        answer: "Itoura is a warm, AI-driven mental health companion designed to provide a secure and non-judgmental space for you to process your emotions. It functions like a peer who is always there to listen and help you work through whatever is on your mind."
      },
      {
        question: "How does it actually work?",
        answer: "You simply type or speak your thoughts, and Itoura listens and responds with empathy. Using professional frameworks like active listening and gentle exploration, Itoura guides you to uncover insights and offers small, concrete steps to help you move forward."
      },
      {
        question: "Is Itoura available any time, or only certain hours?",
        answer: "Itoura is always awake and available 24/7. Whenever you feel overwhelmed, need to vent, or just want a quiet space to reflect, Itoura is here for you."
      },
      {
        question: "Do I need to download anything, or does it work in the browser?",
        answer: "There are no apps to install or updates to manage. Itoura lives entirely in your browser, so you can access it easily from your phone, tablet, or computer at any time."
      },
      {
        question: "Who is Itoura for?",
        answer: "Itoura is for anyone navigating daily stressors, looking to build emotional resilience, or just needing a safe space to vent. It's especially tailored to understand and relate to the unique cultural context and lived experiences of the Nigerian ecosystem."
      }
    ]
  },
  {
    title: "YOUR COMPANION",
    items: [
      {
        question: "Does Itoura remember what I've told it before?",
        answer: "Yes, Itoura securely stores brief summaries and themes from your past sessions right here on your device. This continuous memory allows Itoura to naturally pick up where you left off, providing a seamless and highly contextual experience."
      },
      {
        question: "Can I customize how Itoura responds to me?",
        answer: "While Itoura's core personality is intentionally designed to be calm, grounded, and supportive, it automatically adapts its tone to match your context and emotional state. You don't need to tweak settings—Itoura learns the best way to support you as you chat."
      },
      {
        question: "What kinds of things can I talk to Itoura about?",
        answer: "Absolutely anything. Whether it's work stress, family dynamics, financial worries, relationship issues, or just a general feeling of being overwhelmed, Itoura is here to listen without judgment."
      },
      {
        question: "Does Itoura ever give advice, or just listen?",
        answer: "Itoura focuses heavily on validating your feelings and active listening, but it won't just leave you hanging. Whenever Itoura surfaces an insight, it pairs it with a small, actionable next step—like a short breathing exercise or a journaling prompt."
      }
    ]
  },
  {
    title: "PRIVACY & SAFETY",
    items: [
      {
        question: "Is what I share actually private?",
        answer: "Yes, 100%. Your conversations are strictly confidential. Your employer, HR department, or anyone else cannot read your messages or see your mood logs."
      },
      {
        question: "Who can see my conversations or journal entries?",
        answer: "Only you. All of your journal entries, mood logs, and companion memories are stored locally on the specific device you are using. No one else has access to this data."
      },
      {
        question: "Will my information ever be sold or shared?",
        answer: "Never. Your personal reflections and emotional data are yours alone. We do not sell, rent, or share your private data with third-party advertisers or external organizations."
      },
      {
        question: "Can I delete my data, and what actually gets deleted?",
        answer: "Yes, you can easily delete your data from the Settings page at any time. You can choose to selectively clear your companion's memory, or completely wipe all local chat history, mood logs, and journal entries instantly."
      },
      {
        question: "Is my data stored securely?",
        answer: "Because Itoura stores your data locally on your device rather than a central server, it benefits from the native security of your own browser and operating system. Just make sure to keep your device secure."
      }
    ]
  },
  {
    title: "SUPPORT & BOUNDARIES",
    items: [
      {
        question: "Is Itoura a replacement for therapy?",
        answer: "No, Itoura is completely designed to be a complement to professional mental health care, not a replacement for it. If you are dealing with severe trauma, psychiatric conditions, or are in crisis, please seek out a licensed human professional."
      },
      {
        question: "What happens if I say something that sounds like a crisis?",
        answer: "If Itoura detects language indicating severe distress or a crisis, it will pause standard conversation to provide you with immediate, local emergency resources in Nigeria—like the Mentally Aware Nigeria Initiative (MANI) and the Nigeria Suicide Prevention Initiative (NSPI)."
      },
      {
        question: "Is there an age requirement to use Itoura?",
        answer: "Yes. Given the sensitive nature of emotional processing, Itoura is intended for adults and should be used by individuals who are 18 years of age or older."
      },
      {
        question: "How do I report a problem or give feedback?",
        answer: "We are constantly working to improve Itoura. If you encounter any bugs, or just have feedback on how we can do better, you can reach out to our team using the contact block at the bottom of this page."
      }
    ]
  },
  {
    title: "YOUR ACCOUNT",
    items: [
      {
        question: "Can I delete my account entirely?",
        answer: "Currently, you don't even need an account to start using Itoura! Because everything is stored locally on your device, deleting your app data via the Settings page effectively removes all your information."
      },
      {
        question: "What happens to my journal and chat history if I delete my account?",
        answer: "When you clear your data, your journal entries, mood logs, and companion memories are wiped completely from your device. This action cannot be undone, and Itoura will treat you like a brand new user the next time you visit."
      },
      {
        question: "Can I use Itoura without creating an account?",
        answer: "Yes! You can jump right into chatting, journaling, and logging your moods without entering an email or creating a password. Everything simply saves to your current device."
      }
    ]
  }
];

function AccordionItem({ item }: { item: FAQ }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-itoura-beige/50 bg-white rounded-2xl overflow-hidden shadow-sm transition-all mb-3">
      <button 
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:bg-gray-50 hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-itoura-dark text-lg pr-4">{item.question}</span>
        <ChevronDown 
          className={`shrink-0 text-itoura-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          size={20} 
        />
      </button>
      <div 
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-16 pt-4 px-4 md:px-8">
      {/* Header */}
      <header className="text-center space-y-4 mb-12">
        <h1 className="font-serif text-4xl md:text-5xl text-itoura-dark font-medium tracking-tight">Frequently Asked Questions</h1>
        <p className="text-gray-500 text-lg md:text-xl">Everything you need to know about your new companion.</p>
      </header>

      {/* FAQ Categories */}
      <div className="space-y-12">
        {FAQ_DATA.map((category, idx) => (
          <section key={idx}>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 px-2">
              {category.title}
            </h2>
            <div className="space-y-3">
              {category.items.map((item, itemIdx) => (
                <AccordionItem key={itemIdx} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Contact Block */}
      <div className="mt-16 bg-itoura-light/30 border border-itoura-primary/20 rounded-3xl p-8 md:p-10 text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 mix-blend-multiply">
          <MessageCircleHeart size={120} className="text-itoura-dark" />
        </div>
        <div className="relative z-10">
          <h3 className="font-serif text-2xl text-itoura-dark mb-3">Still have questions?</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            We're always here to help you navigate Itoura. Reach out to our support team and we'll get back to you shortly.
          </p>
          <a 
            href="mailto:support@itoura.com" 
            className="inline-block px-8 py-3 bg-itoura-dark text-white rounded-full font-medium hover:bg-itoura-primary transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
