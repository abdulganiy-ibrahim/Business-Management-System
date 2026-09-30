"use client";

import { useState } from "react";
import { FiChevronsLeft, FiChevronsRight, FiX } from "react-icons/fi";
import SidebarContent from "./SidebarContent";
import { sidebarIconButton } from "./sidebarStyles";

type SidebarProps = {
  businessSlug: string;
  isCollapsed: boolean;
  isMobileOpen: boolean;
  /** false on first load so the sidebar snaps to its saved state */
  enableTransitions: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
};

export default function Sidebar({
  businessSlug,
  isCollapsed,
  isMobileOpen,
  enableTransitions,
  onToggleCollapsed,
  onCloseMobile,
}: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = !isCollapsed || isHovered;
  const isFloating = isCollapsed && isHovered; // expanded on top of the content

  return (
    <>
      {/* ---------- Desktop ---------- */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // Keyboard users: expand when a link gets focus via Tab
        onFocus={(event) => {
          if (event.target.matches(":focus-visible")) setIsHovered(true);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsHovered(false);
          }
        }}
        className={`fixed inset-y-0 left-0 z-40 hidden overflow-hidden bg-primary lg:block ${
          isExpanded ? "w-64" : "w-18"
        } ${isFloating ? "shadow-xl" : ""} ${
          enableTransitions ? "transition-[width] duration-300 ease-out" : ""
        }`}
      >
        <SidebarContent
          businessSlug={businessSlug}
          isExpanded={isExpanded}
          topAction={
            <button
              type="button"
              onClick={onToggleCollapsed}
              aria-label={isCollapsed ? "Keep sidebar open" : "Collapse sidebar"}
              className={sidebarIconButton}
            >
              {isCollapsed ? (
                <FiChevronsRight className="size-5" />
              ) : (
                <FiChevronsLeft className="size-5" />
              )}
            </button>
          }
        />
      </aside>

      {/* ---------- Mobile drawer ---------- */}
      <div className="lg:hidden">
        <div
          aria-hidden
          onClick={onCloseMobile}
          className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
            isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        <aside
          aria-label="Navigation menu"
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-primary shadow-xl transition-[transform,visibility] duration-300 ease-out ${
            isMobileOpen ? "translate-x-0" : "invisible -translate-x-full"
          }`}
        >
          <SidebarContent
            businessSlug={businessSlug}
            isExpanded
            onNavigate={onCloseMobile}
            topAction={
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Close navigation menu"
                className={sidebarIconButton}
              >
                <FiX className="size-5" />
              </button>
            }
          />
        </aside>
      </div>
    </>
  );
}