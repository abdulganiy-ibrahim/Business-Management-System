import { focusRing } from "@/components/ui/uiStyles";
import AssistantAvatar from "./AssistantAvatar";
import { chatSuggestions } from "./chatSuggestions";

type ChatEmptyStateProps = {
  onPick: (suggestion: string) => void;
};

/** Greeting and quick questions, shown until the first message is sent. */
export default function ChatEmptyState({ onPick }: ChatEmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 py-6 text-center">
      <AssistantAvatar className="size-14" />

      <div>
        <h2 className="text-lg font-semibold text-foreground">
          How can I help with your business today?
        </h2>
        <p className="mt-1 text-sm text-muted">
          Ask about your sales, products, stock or debts.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {chatSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onPick(suggestion)}
            className={`rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-foreground/5 ${focusRing}`}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}