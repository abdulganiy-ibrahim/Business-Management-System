import { focusRing } from "@/components/ui/uiStyles";
import type { ChatMessage } from "@/types/chatType";
import AssistantAvatar from "./AssistantAvatar";

// Every new message fades and slides in
const enterAnimation =
  "transition duration-300 starting:translate-y-2 starting:opacity-0";

type ChatMessageBubbleProps = {
  message: ChatMessage;
  /** Only pass this for an error message that can be retried */
  onRetry?: () => void;
};

export default function ChatMessageBubble({
  message,
  onRetry,
}: ChatMessageBubbleProps) {
  // The user's message: right side, brand color
  if (message.role === "user") {
    return (
      <div className={`flex justify-end ${enterAnimation}`}>
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm wrap-break-word whitespace-pre-wrap text-white sm:max-w-[75%]">
          {message.content}
        </p>
      </div>
    );
  }

  // The assistant's message: left side, with its icon
  return (
    <div className={`flex items-end gap-2.5 ${enterAnimation}`}>
      <AssistantAvatar />

      <div className="flex max-w-[85%] flex-col items-start gap-2 sm:max-w-[75%]">
        <p
          className={`rounded-2xl rounded-bl-md px-4 py-2.5 text-sm wrap-break-word whitespace-pre-wrap ${
            message.isError
              ? "bg-danger/10 text-danger"
              : "border border-border bg-foreground/5 text-foreground"
          }`}
        >
          {message.content}
        </p>

        {message.isError && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={`rounded-md text-sm font-medium text-primary hover:underline ${focusRing}`}
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}