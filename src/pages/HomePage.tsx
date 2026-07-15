import ChatInterface from '../components/chat/ChatInterface';

export default function HomePage() {
  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      <div className="text-center mb-4 pt-2 shrink-0 flex flex-col items-center">
        <img 
          src="/assets/illustrations/Doodled_character_welcoming_gesture_2K_202607141343.jpeg" 
          alt="Welcoming companion" 
          className="w-24 h-24 object-cover rounded-full mb-3 shadow-sm border-4 border-white/50 mix-blend-multiply" 
        />
        <h1 className="font-serif text-3xl text-vent-dark mb-1">A place to breathe.</h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">Ventila is here whenever you need a secure space to process your emotions.</p>
      </div>
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
