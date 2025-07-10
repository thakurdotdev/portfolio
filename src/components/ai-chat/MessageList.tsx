"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";
import ContentRenderer from "./ContentRenderer";

const MessageList = ({
  messages,
}: {
  messages: {
    id: string;
    role: "user" | "assistant";
    content: string;
    isStreaming?: boolean;
  }[];
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <div className="space-y-8">
      {messages.map((message, index) => (
        <div key={message.id}>
          <div className="group mb-8">
            <div className="flex gap-4 w-full mx-auto">
              <div
                className={cn(
                  "flex-1",
                  message.role === "user" &&
                    "max-w-[75%] ml-auto flex flex-col items-end",
                )}
              >
                <div className="relative group/message">
                  <div
                    className={cn(
                      "rounded-2xl px-4 shadow-sm border transition-all duration-200",
                      message.role === "user"
                        ? "py-3 bg-slate-200 dark:bg-slate-900 border-none"
                        : "bg-transparent border-0 rounded-none px-0 py-0 shadow-none",
                    )}
                  >
                    {message.role === "user" ? (
                      <p className="leading-relaxed text-foreground">
                        {message.content}
                      </p>
                    ) : (
                      <div className="w-full">
                        <ContentRenderer
                          content={message.content}
                          isStreaming={message.isStreaming}
                        />
                      </div>
                    )}
                  </div>

                  {message.content && !message.isStreaming && (
                    <div
                      className={cn(
                        "flex justify-end gap-1 pt-2",
                        message.role === "assistant" && "justify-start",
                      )}
                    >
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipContent side="bottom">
                            {message.role === "user"
                              ? "Copy Question"
                              : "Copy Answer"}
                          </TooltipContent>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() =>
                                handleCopyMessage(message.content, message.id)
                              }
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 transition-all duration-200 hover:bg-muted/60 rounded-lg"
                            >
                              {copiedMessageId === message.id ? (
                                <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                              ) : (
                                <CopyIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default memo(MessageList);
