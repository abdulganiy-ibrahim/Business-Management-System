import Link from "next/link";
import type { IconType } from "react-icons";
import { focusRing } from "./sidebarStyles";

type SidebarLinkProps = {
  href: string;
  label: string;
  icon: IconType;
  isActive: boolean;
  isExpanded: boolean;
  onClick?: () => void;
};

export default function SidebarLink({
  href,
  label,
  icon: Icon,
  isActive,
  isExpanded,
  onClick,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      // px-3.5 keeps the icon centered in the 72px collapsed rail
      className={`flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition-colors ${focusRing} ${
        isActive
          ? "bg-white/15 text-white"
          : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon className="size-5 shrink-0" />
      <span
        className={`whitespace-nowrap transition-opacity duration-200 ${
          isExpanded ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}