import React, { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import QuizModal from "./QuizModal";
import { Quiz } from "@/lib/types";
import { QuizSchema } from "@/lib/schema";

const ChatWidget = () => {
  const [inputValue, setInputValue] = useState("");
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizData, setQuizData] = useState<Quiz | null>(null);

  const chatUrl =
    process.env.NODE_ENV !== "test"
      ? "http://localhost:3000/api/chat"
      : "http://localhost:3000/api/chat/test";

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: chatUrl,
      prepareSendMessagesRequest(req) {
        return {
          body: {
            id: req.id,
            message: req.messages[req.messages.length - 1],
          },
        };
      },
    }),
    messages: [
      {
        id: "greeting",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hello! I'm your AI assistant. How can I help you today?",
          },
        ],
      },
    ],
    onData: (data) => {
      if (data.type === "data-quiz") {
        const quizDataResult = QuizSchema.safeParse(data.data);

        if (quizDataResult.success) {
          setQuizData(quizDataResult.data);
          setIsQuizOpen(true);
        }
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
    },
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    sendMessage({ text: inputValue });
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {!isQuizOpen && (
          <Button
            onClick={() => setIsQuizOpen(true)}
            className="h-14 w-14 rounded-full bg-primary shadow-button hover:shadow-lg transition-all duration-300 hover:scale-110"
            size="icon"
          >
            Button
          </Button>
        )}
      </div>
      <div className="flex flex-col h-[calc(100dvh-32px)] max-w-md mx-auto bg-chat-background">
        {/* Header */}
        <div
          role="header"
          className="flex items-center gap-3 p-4 border-b border-border bg-card"
        >
          <div className="p-2 rounded-full bg-primary">
            <MessageCircle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>

        {/* Messages */}
        <div role="messages" className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-slide-up`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-chat-user text-chat-user-foreground rounded-br-sm"
                    : "bg-chat-assistant text-chat-assistant-foreground rounded-bl-sm"
                } shadow-subtle`}
              >
                <p className="text-sm leading-relaxed">
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <span key={index}>{part.text}</span>
                    ) : null
                  )}
                </p>
              </div>
            </div>
          ))}

          {status === "submitted" && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-chat-assistant text-chat-assistant-foreground px-4 py-3 rounded-2xl rounded-bl-sm shadow-subtle">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-current rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2 items-end">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 min-h-[44px] resize-none border-border focus:ring-ring"
              disabled={status !== "ready"}
              role="textbox"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || status !== "ready"}
              className="h-[44px] w-[44px] p-0 bg-accent hover:bg-accent/90 text-accent-foreground shadow-subtle"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      {quizData && (
        <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} quizData={quizData} />
      )}
    </>
  );
};

export default ChatWidget;
