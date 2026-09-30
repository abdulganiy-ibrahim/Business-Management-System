type AvatarProps = {
  name: string;
  /** Pass the shape here, e.g. "rounded-full" or "rounded-lg" */
  className?: string;
};

// Shows up to two initials from a name, e.g. "Ada Lovelace" -> "AL"
export default function Avatar({ name, className = "" }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden
      className={`flex size-9 shrink-0 items-center justify-center bg-primary-tint text-sm font-semibold text-primary-deep ${className}`}
    >
      {initials}
    </span>
  );
}