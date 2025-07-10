"use client";

import { MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ContinueChatProps {
  onContinueChat: () => void;
}

const ContinueChat = ({ onContinueChat }: ContinueChatProps) => {
  const [hasPreviousChat, setHasPreviousChat] = useState(false);
  const [lastMessage, setLastMessage] = useState("");

  useEffect(() => {
    // Check if there's a previous chat session
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      const savedMessages = localStorage.getItem(`messages_${sessionId}`);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          if (parsedMessages.length > 0) {
            setHasPreviousChat(true);
            // Get the last user message
            const lastUserMessage = parsedMessages
              .filter((msg: any) => msg.role === "user")
              .pop();
            if (lastUserMessage) {
              setLastMessage(lastUserMessage.content);
            }
          }
        } catch (error) {
          console.error("Error parsing saved messages:", error);
        }
      }
    }
  }, []);

  if (!hasPreviousChat) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.5 }}
      className="mb-3 text-center"
    >
      <div
        onClick={onContinueChat}
        className="group inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 cursor-pointer transition-colors duration-200 px-3 py-1.5 rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onContinueChat();
          }
        }}
        aria-label="Continue previous conversation"
      >
        <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="max-w-[200px] truncate">
          Continue:{" "}
          {lastMessage.length > 25
            ? `"${lastMessage.substring(0, 25)}..."`
            : `"${lastMessage}"`}
        </span>
        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" />
      </div>
    </motion.div>
  );
};

export default ContinueChat;
