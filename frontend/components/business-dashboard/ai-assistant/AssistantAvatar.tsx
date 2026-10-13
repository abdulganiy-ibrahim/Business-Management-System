import { FiCpu } from "react-icons/fi";

// The assistant's round icon. Pass the size, e.g. "size-8" or "size-14".
export default function AssistantAvatar({
  className = "size-8",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-agent-tint text-agent-deep ${className}`}
    >
      <FiCpu className="size-1/2" />
    </span>
  );
}