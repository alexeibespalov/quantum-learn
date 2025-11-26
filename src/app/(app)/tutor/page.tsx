"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChatBubble } from "@/components/tutor/ChatBubble";
import { useAuth } from "@/context/AuthContext";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase/config";
import { TutorConfig } from "@/types/course";

// Mock Lesson Data (In real app, fetch based on URL param)
import mathCourse from "../../../../courses/mathematics.json";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function TutorPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load the first lesson of the first module of Math
  // math-num-1-1: The Logic of BODMAS
  const currentLesson = mathCourse.modules[0].lessons[0];
  const tutorConfig = currentLesson.content.tutorConfig as unknown as TutorConfig;
  const openingMessage = (currentLesson.content as any).openingMessage;

  useEffect(() => {
    // Initialize with opening message if empty
    if (messages.length === 0 && openingMessage) {
      setMessages([
        {
          role: "assistant",
          content: openingMessage,
        },
      ]);
    }
  }, [messages.length, openingMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      if (!functions) throw new Error("Firebase Functions not initialized");
      const tutorFn = httpsCallable(functions, "tutor");

      const response = await tutorFn({
        history: messages.concat(userMsg), // Send full history
        tutorConfig: tutorConfig,
        studentProfile: {
          displayName: user?.displayName || "Student",
          year: "9",
        },
        userMessage: input,
      });

      const assistantMsg: Message = {
        role: "assistant",
        content: response.data as string,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Error calling tutor:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Error: Could not connect to AI Tutor. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-lg">
              {currentLesson.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>AI Tutor Active • {tutorConfig.persona}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <ChatBubble
            key={idx}
            role={msg.role}
            content={msg.content}
            tutorConfig={tutorConfig}
          />
        ))}

        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-card border border-border rounded-2xl px-5 py-4 rounded-bl-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your answer or ask a question..."
            className="w-full pl-5 pr-14 py-4 bg-input/10 border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-card transition-all resize-none shadow-inner text-foreground placeholder-muted-foreground"
            rows={1}
            style={{ minHeight: "60px" }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 rounded-xl w-12 h-auto p-0 flex items-center justify-center bg-primary hover:bg-primary/90 transition-colors shadow-md"
          >
            <Send className="w-5 h-5 text-primary-foreground" />
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-3">
          AI can make mistakes. Please double check important information.
        </p>
      </div>
    </div>
  );
}