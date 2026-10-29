"use client";

import { useEffect, useRef } from "react";
import AssistantAvatar from "./AssistantAvatar";
import ChatComposer from "./ChatComposer";
import ChatEmptyState from "./ChatEmptyState";
import ChatMessageBubble from "./ChatMessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useChat } from "@/hooks/useChat";

// Fills the screen under the header: 100dvh minus the header (4rem) and the page padding
// (2rem / 3rem / 4rem). If you change the header height or the main padding, change this too.
const chatHeight =
  "h-[calc(100dvh-6rem)] sm:h-[calc(100dvh-7rem)] lg:h-[calc(100dvh-8rem)] min-h-96";

export default function AssistantView({ businessId }: { businessId: string }) {
  const { messages, isLoading, sendMessage, retry } = useChat(businessId);
  const listRef = useRef<HTMLDivElement>(null);

  // Smoothly scroll to the newest message (or the typing dots) whenever something is added
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  const lastMessage = messages[messages.length - 1];

  return (
    <section
      aria-label="AI Assistant"
      className={`flex flex-col overflow-hidden rounded-2xl border border-border bg-background ${chatHeight}`}
    >
      {/* Heading */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
        <AssistantAvatar className="size-9" />
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-foreground">
            AI Assistant
          </h1>
          <p className="truncate text-xs text-muted">
            Ask how your business is doing
          </p>
        </div>
      </div>

      {/* Messages. role="log" lets screen readers announce new messages. */}
      <div
        ref={listRef}
        role="log"
        className="flex-1 overflow-y-auto px-4 py-5 sm:px-6"
      >
        {messages.length === 0 ? (
          <ChatEmptyState onPick={sendMessage} />
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <ChatMessageBubble
                key={message.id}
                message={message}
                // Retry is offered only on the very last message, and not while loading
                onRetry={
                  message === lastMessage && !isLoading ? retry : undefined
                }
              />
            ))}

            {isLoading && <TypingIndicator />}
          </div>
        )}
      </div>

      <ChatComposer onSend={sendMessage} isLoading={isLoading} />
    </section>
  );
}