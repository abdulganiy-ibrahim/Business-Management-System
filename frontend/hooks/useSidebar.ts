"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "bizview-sidebar-collapsed";

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Read the saved value once, after the first render
  useEffect(() => {
    try {
      setIsCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      // Storage unavailable (private mode etc.): keep the default
    }
    setHasLoaded(true);
  }, []);

  // Close the mobile drawer with Escape
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen]);

  const toggleCollapsed = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Ignore: the toggle still works, it just won't be remembered
    }
  };

  return {
    isCollapsed,
    isMobileOpen,
    hasLoaded,
    toggleCollapsed,
    openMobile: () => setIsMobileOpen(true),
    closeMobile: () => setIsMobileOpen(false),
  };
}