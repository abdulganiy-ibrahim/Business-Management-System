import { FiAlertTriangle } from "react-icons/fi";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Try again",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger-tint text-danger">
        <FiAlertTriangle size={20} />
      </div>
      <h3 className="mt-4 text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}