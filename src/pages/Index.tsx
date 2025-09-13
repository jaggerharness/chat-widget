import ChatWidget from '@/components/ChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg shadow-chat overflow-hidden border border-border">
          <ChatWidget />
        </div>
      </div>
    </div>
  );
};

export default Index;
