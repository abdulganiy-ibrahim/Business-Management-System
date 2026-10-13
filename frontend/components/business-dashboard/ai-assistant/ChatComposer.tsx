"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { FiSend } from "react-icons/fi";
import { focusRing } from "@/components/ui/uiStyles";

const MAX_HEIGHT = 140; // about 5 lines, then the box scrolls

type ChatComposerProps = {
  onSend: (text: string) => void;
  isLoading: boolean; // while true, sending is blocked
};

/** The message box and send button. */
export default function ChatComposer({ onSend, isLoading }: ChatComposerProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Grow with the text, up to MAX_HEIGHT
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT)}px`;
  }, [text]);

  const canSend = text.trim() !== "" && !isLoading;

  const send = () => {
    if (!canSend) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }
    // On phones Enter starts a new line (use the send button), like other chat apps
    if (window.matchMedia("(pointer: coarse)").matches) return;

    event.preventDefault();
    send();
  };

  return (
    <div className="border-t border-border p-3 sm:p-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        className="flex items-end gap-2"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message"
          placeholder="Ask about your sales, products or stock..."
          className="min-h-11 w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary"
        />

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}
        >
          <FiSend className="size-5" />
        </button>
      </form>

      <p className="mt-2 hidden text-xs text-subtle sm:block">
        Press Enter to send, Shift + Enter for a new line.
      </p>
    </div>
  );
}