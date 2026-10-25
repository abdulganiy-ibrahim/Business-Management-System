"use client";

import { FiAlertTriangle, FiWifi, FiWifiOff } from "react-icons/fi";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { NETWORK_MESSAGES } from "@/lib/network/networkMessages";

// What each state looks like. TODO: swap the amber for your warning color token if you have one.
const banners = {
  offline: { message: NETWORK_MESSAGES.offline, icon: FiWifiOff, style: "bg-danger text-white" },
  slow: { message: NETWORK_MESSAGES.slow, icon: FiAlertTriangle, style: "bg-amber-600 text-white" },
  "back-online": { message: NETWORK_MESSAGES.backOnline, icon: FiWifi, style: "bg-primary text-white" },
};

/** A floating notice under the header. Shows nothing while the connection is fine. */
export default function NetworkBanner() {
  const status = useNetworkStatus();
  if (status === "online") return null;

  const { message, icon: Icon, style } = banners[status];

  return (
    // The wrapper ignores clicks so it never blocks the page behind it. top-18 = just under the header.
    <div className="pointer-events-none fixed inset-x-0 top-18 z-50 flex justify-center px-4">
      <p
        key={status} // a new status fades in again
        role="status"
        className={`pointer-events-auto flex max-w-md items-center gap-2.5 rounded-2xl px-4 py-2.5 text-sm font-medium shadow-lg transition duration-300 starting:-translate-y-2 starting:opacity-0 ${style}`}
      >
        <Icon className="size-4 shrink-0" />
        {message}
      </p>
    </div>
  );
}