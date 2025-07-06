"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
    const existingSessionId = localStorage.getItem("sessionId");
    const newSessionId =
      existingSessionId ||
      `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    setSessionId(newSessionId);
    if (!existingSessionId) {
      localStorage.setItem("sessionId", newSessionId);
    }
  }, []);

  const addUserMessage = (query: string) => {
    const userMessageId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        role: "user",
        content: query,
        timestamp: new Date(),
      },
    ]);
    return userMessageId;
  };

  const addAssistantMessage = () => {
    const assistantMessageId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        isStreaming: true,
        timestamp: new Date(),
      },
    ]);
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
            <SheetTitle>Ask Anything</SheetTitle>
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
