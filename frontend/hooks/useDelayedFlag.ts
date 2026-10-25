"use client";

import { useEffect, useState } from "react";

/**
 * Becomes true when `isActive` has been true for `delayMs`, and goes back to false
 * as soon as `isActive` is false. Used to say "this is taking longer than usual".
 */
export function useDelayedFlag(isActive: boolean, delayMs: number) {
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => setIsDelayed(true), delayMs);

    return () => {
      clearTimeout(timer);
      setIsDelayed(false);
    };
  }, [isActive, delayMs]);

  return isDelayed;
}