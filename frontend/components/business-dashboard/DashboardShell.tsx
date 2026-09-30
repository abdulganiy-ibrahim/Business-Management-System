"use client";

import type { ReactNode } from "react";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import type { Business } from "@/types/BusinessType";
import type { User } from "@/types/UserType";

type DashboardShellProps = {
  businesses: Business[];
  activeBusiness: Business;
  user: User;
  notificationCount?: number;
  children: ReactNode;
};

/**
 * Page frame: sidebar + header + content.
 * Owns the sidebar state so the header's menu button can open the drawer.
 */
export default function DashboardShell({
  businesses,
  activeBusiness,
  user,
  notificationCount = 0,
  children,
}: DashboardShellProps) {
  const sidebar = useSidebar();

  // TODO: connect your auth sign-out here
  const handleSignOut = () => {
    console.log("Sign out");
  };

  return (
    <>
      <Sidebar
        businessSlug={activeBusiness.slug}
        isCollapsed={sidebar.isCollapsed}
        isMobileOpen={sidebar.isMobileOpen}
        enableTransitions={sidebar.hasLoaded}
        onToggleCollapsed={sidebar.toggleCollapsed}
        onCloseMobile={sidebar.closeMobile}
      />

      {/* Left padding matches the sidebar width on desktop (w-18 rail / w-64 open) */}
      <div
        className={`flex min-h-dvh flex-col ${
          sidebar.isCollapsed ? "lg:pl-18" : "lg:pl-64"
        } ${sidebar.hasLoaded ? "transition-[padding] duration-300 ease-out" : ""}`}
      >
        <Header
          businesses={businesses}
          activeBusiness={activeBusiness}
          user={user}
          notificationCount={notificationCount}
          onMenuClick={sidebar.openMobile}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </>
  );
}