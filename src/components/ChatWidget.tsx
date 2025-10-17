import React, { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import QuizModal from "./QuizModal";
import { QuizSchema } from "@/lib/schema";
import { Streamdown } from "streamdown";
import { Quiz } from "@/lib/types";

const ChatWidget = () => {
  const [inputValue, setInputValue] = useState("");
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

  const chatUrl =
    process.env.NODE_ENV !== "test"
      ? "http://localhost:3000/api/chat"
      : "http://localhost:3000/api/chat/test";

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: chatUrl,
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

  const handleOpenQuiz = (quizData: Quiz) => {
    setCurrentQuiz(quizData);
    setIsQuizOpen(true);
  };

  const handleCloseQuiz = () => {
    setIsQuizOpen(false);
    setCurrentQuiz(null);
  };

  return (
    <>
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
                <div className="text-sm leading-relaxed">
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return <Streamdown key={index}>{part.text}</Streamdown>;
                    }

                    if (part.type === "tool-generateQuiz") {
                      switch (part.state) {
                        case "input-available":
                          return <div key={index}>Loading quiz...</div>;
                        case "output-available": {
                          const output = part.output as { object: unknown };
                          const parsedQuizResult = QuizSchema.safeParse(
                            output.object
                          );

                          if (parsedQuizResult.success) {
                            const quizObj = parsedQuizResult.data;
                            return (
                              <div key={index} className="space-y-2">
                                <p className="text-sm">
                                  {`I've created a quiz, ${quizObj.quiz.title}, with
                                  ${quizObj.quiz.questions.length} questions!`}
                                </p>
                                <Button
                                  onClick={() => handleOpenQuiz(quizObj)}
                                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-button"
                                >
                                  Start Quiz
                                </Button>
                              </div>
                            );
                          } else {
                            return (
                              <div
                                key={index}
                                className="text-destructive text-sm"
                              >
                                Failed to create quiz
                              </div>
                            );
                          }
                        }
                        case "output-error":
                          return <div key={index}>Error: {part.errorText}</div>;
                        default:
                          return null;
                      }
                    }
                    return null;
                  })}
                </div>
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
      {currentQuiz && (
        <QuizModal
          isOpen={isQuizOpen}
          onClose={handleCloseQuiz}
          quizData={currentQuiz}
        />
      )}
    </>
  );
};

export default ChatWidget;
