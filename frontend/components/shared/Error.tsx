"use client";

import { useEffect } from "react";
import ErrorState from "./ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <ErrorState
        title="Something went wrong"
        message="We hit an unexpected error loading this page. You can try again, or come back later."
        onRetry={reset}
      />
    </div>
  );
}