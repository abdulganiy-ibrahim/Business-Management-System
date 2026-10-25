"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// What counts as a slow connection. Add "3g" here if you want to be stricter.
const SLOW_CONNECTION_TYPES = ["slow-2g", "2g"];
const BACK_ONLINE_MESSAGE_MS = 3000;

// The Network Information API: only available in Chrome and Edge (including Chrome on Android)
type NetworkInformation = EventTarget & { effectiveType?: string };
const getConnection = () =>
  (navigator as Navigator & { connection?: NetworkInformation }).connection;

// ---------- online / offline ----------
function subscribeToOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}
const getOnlineSnapshot = () => navigator.onLine;
const getOnlineServerSnapshot = () => true; // the server can't know, so assume online (no flash)

// ---------- slow ----------
function subscribeToConnection(callback: () => void) {
  const connection = getConnection();
  connection?.addEventListener("change", callback);

  return () => connection?.removeEventListener("change", callback);
}
const getSlowSnapshot = () =>
  SLOW_CONNECTION_TYPES.includes(getConnection()?.effectiveType ?? "");
const getSlowServerSnapshot = () => false;

export type NetworkStatus = "online" | "offline" | "back-online" | "slow";

/** Tells you what to show: "offline" wins over "back-online", which wins over "slow". */
export function useNetworkStatus(): NetworkStatus {
  const isOnline = useSyncExternalStore(
    subscribeToOnline,
    getOnlineSnapshot,
    getOnlineServerSnapshot,
  );
  const isSlow = useSyncExternalStore(
    subscribeToConnection,
    getSlowSnapshot,
    getSlowServerSnapshot,
  );

  // After coming back online, say so for a few seconds
  const [showBackOnline, setShowBackOnline] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
      return;
    }
    if (!wasOffline.current) return;

    wasOffline.current = false;
    setShowBackOnline(true);

    const timer = setTimeout(
      () => setShowBackOnline(false),
      BACK_ONLINE_MESSAGE_MS,
    );
    return () => clearTimeout(timer);
  }, [isOnline]);

  if (!isOnline) return "offline";
  if (showBackOnline) return "back-online";
  if (isSlow) return "slow";
  return "online";
}