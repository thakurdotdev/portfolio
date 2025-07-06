"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import InputMessage, { SheetInputMessage } from "./InputMessage";
import MessageList from "./MessageList";

interface Source {
  id: number;
  title: string;
  type: string;
  preview: string;
}

type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  isStreaming?: boolean;
  sources?: Source[];
  timestamp: Date;
}

interface StreamChunk {
  chunk?: string;
  done?: boolean;
  error?: string;
  relevantSources?: number;
  fullResponse?: string;
}

export default function SearchPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // Clean up old sessions first
    cleanupOldSessions();

    const existingSessionId = localStorage.getItem("sessionId");
    const newSessionId =
      existingSessionId ||
      `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    setSessionId(newSessionId);
    if (!existingSessionId) {
      localStorage.setItem("sessionId", newSessionId);
    }

    // Load persisted messages
    const savedMessages = localStorage.getItem(`messages_${newSessionId}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error parsing saved messages:", error);
      }
    }
  }, []);

  // Clean up old sessions (keep only last 5 sessions)
  const cleanupOldSessions = () => {
    const allKeys = Object.keys(localStorage);
    const messageKeys = allKeys
      .filter((key) => key.startsWith("messages_"))
      .sort()
      .reverse(); // Most recent first

    // Keep only the last 5 sessions
    if (messageKeys.length > 5) {
      const keysToRemove = messageKeys.slice(5);
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    }
  };

  // Persist messages whenever they change (debounced)
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`messages_${sessionId}`, JSON.stringify(messages));
      }, 500); // Debounce by 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [messages, sessionId]);

  const addUserMessage = (query: string) => {
    const userMessageId = `user-${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      role: "user" as MessageRole,
      content: query,
      timestamp: new Date(),
    };
    addMessageWithLimit(userMessage);
    return userMessageId;
  };

  const addAssistantMessage = () => {
    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage = {
      id: assistantMessageId,
      role: "assistant" as MessageRole,
      content: "",
      isStreaming: true,
      timestamp: new Date(),
    };
    addMessageWithLimit(assistantMessage);
    return assistantMessageId;
  };

  const updateAssistantMessage = (
    messageId: string,
    content: string,
    isStreaming = true,
    sources: Source[] = [],
  ) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content, isStreaming, sources } : msg,
      ),
    );
  };

  const handleStreamError = (messageId: string, errorMessage?: string) => {
    const defaultError =
      "Sorry, I encountered an error while processing your question. Please try again later.";
    updateAssistantMessage(messageId, errorMessage || defaultError, false, []);
    setIsAsking(false);
  };

  const processStreamChunk = (
    data: StreamChunk,
    messageId: string,
    fullAnswer: string,
  ) => {
    if (data.chunk) {
      const newAnswer = fullAnswer + data.chunk;
      updateAssistantMessage(messageId, newAnswer);
      return newAnswer;
    }

    if (data.done) {
      updateAssistantMessage(messageId, fullAnswer, false, []);
      setIsAsking(false);
      return fullAnswer;
    }

    if (data.error) {
      handleStreamError(messageId, data.error);
      return fullAnswer;
    }

    return fullAnswer;
  };

  const processStreamResponse = async (
    response: Response,
    assistantMessageId: string,
  ) => {
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let fullAnswer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n\n");

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data: ")) continue;

        try {
          const eventData = line.substring(6);
          const data = JSON.parse(eventData) as StreamChunk;
          fullAnswer = processStreamChunk(data, assistantMessageId, fullAnswer);

          if (data.done || data.error) return;
        } catch (parseError) {
          console.error("Error parsing SSE data:", parseError);
          handleStreamError(assistantMessageId);
          return;
        }
      }
    }
  };

  const handleAskQuestion = async (query: string) => {
    if (!query.trim() || isAsking || !sessionId) return;

    setIsSheetOpen(true);
    localStorage.setItem("sessionId", sessionId);

    addUserMessage(query);
    const assistantMessageId = addAssistantMessage();

    setIsAsking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, sessionId }),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`,
        );
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      await processStreamResponse(response, assistantMessageId);
    } catch (error) {
      handleStreamError(assistantMessageId);
    }
  };

  const clearChatHistory = () => {
    setMessages([]);
    if (sessionId) {
      localStorage.removeItem(`messages_${sessionId}`);
    }
  };

  const MAX_MESSAGES = 50; // Limit to prevent localStorage bloat

  const addMessageWithLimit = (newMessage: Message) => {
    setMessages((prev) => {
      const updated = [...prev, newMessage];
      // Keep only the last MAX_MESSAGES
      return updated.length > MAX_MESSAGES
        ? updated.slice(-MAX_MESSAGES)
        : updated;
    });
  };

  return (
    <>
      <div>
        <InputMessage
          handleAskQuestion={handleAskQuestion}
          isAsking={isAsking}
        />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          className="w-full lg:max-w-[700px] h-full flex flex-col"
          side="right"
        >
          <SheetHeader>
            <div className="flex items-center justify-between">
              <SheetTitle>Ask Anything</SheetTitle>
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChatHistory}
                  className="text-muted-foreground hover:text-destructive mr-3"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-hidden mt-4">
            <div className="h-full overflow-y-auto">
              <div className="py-4">
                <MessageList messages={messages} />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <SheetInputMessage
              handleAskQuestion={handleAskQuestion}
              isAsking={isAsking}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
