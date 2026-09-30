"use client";

import { FiMenu } from "react-icons/fi";
import type { Business } from "@/types/BusinessType";
import BusinessSwitcher from "./BusinessSwitcher";
import NotificationBell from "./NotificationBell";
import UserMenu, { type HeaderUser } from "./UserMenu";
import { iconButton } from "./headerStyles";

type HeaderProps = {
  businesses: Business[];
  activeBusiness: Business;
  user?: HeaderUser;
  notificationCount?: number;
  onMenuClick?: () => void;
  onSignOut?: () => void;
};

export default function Header({
  businesses,
  activeBusiness,
  user,
  notificationCount = 0,
  onMenuClick,
  onSignOut,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className={`${iconButton} lg:hidden`}
          >
            <FiMenu className="size-5" />
          </button>

          <BusinessSwitcher
            businesses={businesses}
            activeBusiness={activeBusiness}
          />
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NotificationBell count={notificationCount} />
          {/* <UserMenu user={user} onSignOut={onSignOut} /> */}
        </div>
      </div>
    </header>
  );
}