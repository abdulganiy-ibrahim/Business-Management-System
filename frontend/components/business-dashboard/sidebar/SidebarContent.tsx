"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SidebarLink from "./SidebarLinks";
import { sidebarItems } from "./sidebarItems";

type SidebarContentProps = {
  businessSlug: string;
  /** false = icon-only rail (logo text and top action are hidden) */
  isExpanded: boolean;
  /** Button shown on the right of the logo row (collapse toggle or mobile close) */
  topAction: ReactNode;
  /** Called when a link is clicked (used to close the mobile drawer) */
  onNavigate?: () => void;
};

export default function SidebarContent({
  businessSlug,
  isExpanded,
  topAction,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/${businessSlug}`;

  return (
    <div className="flex h-full flex-col">
      {/* Logo row: same h-16 as the header so they line up */}
      <div className="flex h-16 shrink-0 items-center justify-between px-4.5">
        <div className="flex items-center gap-3">
          {/* TODO: replace with your real logo */}
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white text-base font-bold text-primary">
            B
          </span>
          {isExpanded && (
            <span className="text-lg font-semibold text-white">BizView</span>
          )}
        </div>
        {isExpanded && topAction}
      </div>

      <nav aria-label="Main navigation" className="flex flex-col gap-1 px-3 py-4">
        {sidebarItems.map(({ label, path, icon }) => {
          const href = `${basePath}${path}`;
          // Dashboard (path "") must match exactly, or it would be active on every page
          const isActive =
            pathname === href || (path !== "" && pathname.startsWith(`${href}/`));

          return (
            <SidebarLink
              key={href}
              href={href}
              label={label}
              icon={icon}
              isActive={isActive}
              isExpanded={isExpanded}
              onClick={onNavigate}
            />
          );
        })}
      </nav>
    </div>
  );
}