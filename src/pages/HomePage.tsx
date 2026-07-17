import ChatInterface from '../components/chat/ChatInterface';

export default function HomePage() {
  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto">
      <div className="text-center mb-4 pt-6 shrink-0 flex flex-col items-center">
        <h1 className="font-serif text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-itoura-primary to-[#A855F7] tracking-tight mb-3 drop-shadow-sm">Itoura</h1>
        <h2 className="font-serif text-2xl text-itoura-dark mb-1">A place to breathe.</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">Itoura is here whenever you need a secure space to process your emotions.</p>
      </div>
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
