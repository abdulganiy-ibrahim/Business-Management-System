"use client";

import { useDelayedFlag } from "@/hooks/useDelayedFlag";
import { NETWORK_MESSAGES } from "@/lib/network/networkMessages";

type SlowRequestNoticeProps = {
  isPending: boolean; // e.g. isSubmitting
  delayMs?: number;
};

// Shows nothing at first. If the request is still running after delayMs, explains why it is slow.
export default function SlowRequestNotice({
  isPending,
  delayMs = 8000,
}: SlowRequestNoticeProps) {
  const isSlow = useDelayedFlag(isPending, delayMs);
  if (!isSlow) return null;

  return (
    <p role="status" className="text-xs text-muted">
      {NETWORK_MESSAGES.slowRequest}
    </p>
  );
}