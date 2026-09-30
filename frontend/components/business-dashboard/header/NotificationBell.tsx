import { FiBell } from "react-icons/fi";
import { iconButton } from "./headerStyles";

type NotificationBellProps = {
  /** Number of unread notifications. 0 hides the red dot. */
  count?: number;
  onClick?: () => void;
};

export default function NotificationBell({
  count = 0,
  onClick,
}: NotificationBellProps) {
  const hasUnread = count > 0;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={hasUnread ? `Notifications, ${count} unread` : "Notifications"}
      className={`relative ${iconButton}`}
    >
      <FiBell className="size-5" />
      {hasUnread && (
        <span className="absolute top-2 right-2.5 size-2 rounded-full bg-danger ring-2 ring-background" />
      )}
    </button>
  );
}