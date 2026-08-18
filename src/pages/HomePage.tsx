import ChatInterface from '../components/chat/ChatInterface';

export default function HomePage() {
  return (
    <div className="h-full flex flex-col max-w-3xl mx-auto w-full py-1">
      {/* Main Chat Companion Interface */}
      <div className="flex-1 min-h-0 relative z-20">
        <ChatInterface />
      </div>
    </div>
  );
}
