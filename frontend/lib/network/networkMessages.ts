export const NETWORK_MESSAGES = {
  offline: "No internet connection. Changes can't be saved until you're back online.",
  slow: "Your internet connection is slow. Things may take longer than usual.",
  backOnline: "You're back online.",
  slowRequest: "This is taking longer than usual. Your internet may be slow.",
  requestFailed: "We couldn't reach the server. Check your internet connection and try again.",
};

// Returns a connection-related message, or null when the error is not about the network.
// Use it in a catch block: getNetworkErrorMessage(error) ?? "Something went wrong."
export function getNetworkErrorMessage(error?: unknown): string | null {
  // The browser knows it has no connection
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return NETWORK_MESSAGES.offline;
  }

  // The connection dropped during the request. fetch fails with a TypeError
  // ("Failed to fetch", "NetworkError...", "Load failed", depending on the browser).
  if (error instanceof TypeError && /fetch|network|load failed/i.test(error.message)) {
    return NETWORK_MESSAGES.requestFailed;
  }

  return null;
}