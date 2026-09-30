"use client";

import Link from "next/link";
import { FiChevronDown, FiLogOut, FiSettings, FiUser } from "react-icons/fi";
import { useDropdown } from "@/hooks/useDropdown";
import Avatar from "./Avatar";
import { dropdownItem, dropdownPanel, focusRing } from "./headerStyles";

export type HeaderUser = {
  name: string;
  email: string;
};

// TODO: change these to your real routes
const MENU_LINKS = [
  { label: "Profile", href: "/profile", icon: FiUser },
  { label: "Settings", href: "/settings", icon: FiSettings },
];

type UserMenuProps = {
  user: HeaderUser;
  onSignOut: () => void;
};

export default function UserMenu({ user, onSignOut }: UserMenuProps) {
  const { ref, isOpen, toggle, close } = useDropdown();

  return (
    <div ref={ref} className="relative">
      {/* Trigger: avatar only on mobile, avatar + name from lg up */}
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open user menu"
        className={`flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-sunken lg:rounded-xl lg:pr-2.5 ${focusRing}`}
      >
        <Avatar name={user.name} className="rounded-full" />
        <span className="hidden max-w-32 truncate text-sm font-medium text-foreground lg:block">
          {user.name}
        </span>
        <FiChevronDown
          className={`hidden size-4 shrink-0 text-muted transition-transform lg:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className={`${dropdownPanel} right-0 w-64 max-w-[calc(100vw-2rem)]`}
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>

          <div className="p-2">
            {MENU_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                onClick={close}
                className={`${dropdownItem} text-foreground`}
              >
                <Icon className="size-4 shrink-0 text-muted" />
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t border-border p-2">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close();
                onSignOut();
              }}
              className={`${dropdownItem} text-danger`}
            >
              <FiLogOut className="size-4 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}