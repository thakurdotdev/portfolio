"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, Loader2 } from "lucide-react";
import React, { memo, useRef, useState } from "react";
import { Input } from "../ui/input";

interface InputMessageProps {
  handleAskQuestion: (query: string) => void;
  isAsking: boolean;
}

const InputMessage = ({ handleAskQuestion, isAsking }: InputMessageProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim()) {
      handleAskQuestion(query);
      setQuery("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="z-10 bg-transparent">
      <div className="w-full mx-auto">
        <div className="relative group">
          <div className="relative rounded-lg p-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 border-beam-container">
            <div className="relative rounded-lg bg-black/90 backdrop-blur-sm">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask anything about me..."
                className="relative backdrop-blur-sm border-0 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 text-white placeholder-white/60 pr-12 rounded-lg"
                disabled={isAsking}
              />

              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isAsking ? (
                  <div className="h-6 w-6 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  </div>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!query.trim()}
                    size="sm"
                    className={cn(
                      "h-6 w-6 p-0 rounded-xl transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 relative overflow-hidden",
                      query.trim()
                        ? "shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95"
                        : "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <ArrowRightIcon className="h-3 w-3 text-white relative z-10" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SheetInputMessage = memo(
  ({
    handleAskQuestion,
    isAsking,
  }: {
    handleAskQuestion: (query: string) => void;
    isAsking: boolean;
  }) => {
    const [query, setQuery] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = () => {
      if (query.trim()) {
        handleAskQuestion(query);
        setQuery("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    };

    return (
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Continue the conversation..."
          className="w-full min-h-[60px] max-h-[120px] resize-none pr-12 py-3 px-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
          disabled={isAsking}
          rows={2}
        />

        <div className="absolute right-2 bottom-3">
          {isAsking ? (
            <div className="h-8 w-8 flex items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!query.trim()}
              className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  },
);

export default memo(InputMessage);
