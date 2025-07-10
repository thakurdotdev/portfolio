"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
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

interface SearchPageProps {
  isSheetOpen?: boolean;
  onSheetOpenChange?: (open: boolean) => void;
}

export default function SearchPage({
  isSheetOpen: externalIsSheetOpen,
  onSheetOpenChange: externalOnSheetOpenChange,
}: SearchPageProps = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [internalIsSheetOpen, setInternalIsSheetOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");

  // Use external control if provided, otherwise use internal state
  const isSheetOpen =
    externalIsSheetOpen !== undefined
      ? externalIsSheetOpen
      : internalIsSheetOpen;
  const setIsSheetOpen = externalOnSheetOpenChange || setInternalIsSheetOpen;

  useEffect(() => {
    cleanupOldSessions();

    const existingSessionId = localStorage.getItem("sessionId");
    const newSessionId =
      existingSessionId ||
      `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    setSessionId(newSessionId);
    if (!existingSessionId) {
      localStorage.setItem("sessionId", newSessionId);
    }

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

  const cleanupOldSessions = () => {
    const allKeys = Object.keys(localStorage);
    const messageKeys = allKeys
      .filter((key) => key.startsWith("messages_"))
      .sort()
      .reverse();

    if (messageKeys.length > 5) {
      const keysToRemove = messageKeys.slice(5);
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    }
  };

  useEffect(() => {
    if (sessionId && messages.length > 0) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(`messages_${sessionId}`, JSON.stringify(messages));
      }, 500);

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

  const MAX_MESSAGES = 50;

  const addMessageWithLimit = (newMessage: Message) => {
    setMessages((prev) => {
      const updated = [...prev, newMessage];
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
          className="w-full lg:max-w-[800px] h-full flex flex-col p-0 bg-gradient-to-br from-white via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800"
          side="right"
        >
          {/* Header */}
          <SheetHeader className="p-3 border-b border-neutral-200 dark:border-neutral-700 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-md font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
                Ask me anything
              </SheetTitle>

              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChatHistory}
                    className="text-neutral-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSheetOpen(false)}
                  className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>

          {/* Messages */}
          <div className="flex-1 overflow-hidden scroll-indicator">
            <div className="h-full overflow-y-auto custom-scrollbar smooth-scroll">
              <div className="p-6">
                <MessageList messages={messages} />
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
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
