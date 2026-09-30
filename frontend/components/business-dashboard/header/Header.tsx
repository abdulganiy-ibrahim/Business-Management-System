"use client";

import { useRouter } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import type { Business } from "@/types/BusinessType";
import BusinessSwitcher from "./BusinessSwitcher";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";
import { User } from "@/types/UserType";
import { iconButton } from "./headerStyles";
import { useLogout } from "@/hooks/useLogout";
import { toast } from "sonner";

type HeaderProps = {
  businesses: Business[];
  activeBusiness: Business;
  user: User;
  notificationCount?: number;
  onMenuClick?: () => void;
};

export default function Header({
  businesses,
  activeBusiness,
  user,
  notificationCount = 0,
  onMenuClick,
}: HeaderProps) {
  const router = useRouter();
  const { logout, loading } = useLogout();

  const handleSignOut = async () => {
    const { error } = await logout();

  if (error) {
    toast.error("Failed to logout");
    return;
  }

  router.push("/sign-up");
  }

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
          <UserMenu user={user} onSignOut={handleSignOut} loading={loading} />
        </div>
      </div>
    </header>
  );
}