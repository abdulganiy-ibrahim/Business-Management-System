"use client";

import { NETWORK_MESSAGES } from "@/lib/network/networkMessages";
import { useEffect, useState } from "react";
import AssistantAvatar from "./AssistantAvatar";

const statusPhrases = [
  "Thinking...",
  "Checking your business data...",
  "Putting the answer together...",
  NETWORK_MESSAGES.slowRequest, // after about 9 seconds
];

/** Shown while the AI is working: bouncing dots and a status line that changes. */
export default function TypingIndicator() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Move to the next phrase every few seconds and stay on the last one
  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((index) => Math.min(index + 1, statusPhrases.length - 1));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    // role="status" lets screen readers announce the text as it changes
    <div
      role="status"
      className="flex items-end gap-2.5 transition duration-300 starting:translate-y-2 starting:opacity-0"
    >
      <AssistantAvatar />

      <div className="flex items-center gap-3 rounded-2xl rounded-bl-md border border-border bg-foreground/5 px-4 py-3">
        <span aria-hidden className="flex items-center gap-1">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              style={{ animationDelay: `${dot * 150}ms` }}
              className="size-2 rounded-full bg-muted motion-safe:animate-bounce"
            />
          ))}
        </span>
        <span className="text-xs text-muted">{statusPhrases[phraseIndex]}</span>
      </div>
    </div>
  );
}