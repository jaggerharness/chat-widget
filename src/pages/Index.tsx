import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-lg shadow-chat overflow-hidden border border-border">
        <ChatWidget />
      </div>
    </div>
  );
};

export default Index;
