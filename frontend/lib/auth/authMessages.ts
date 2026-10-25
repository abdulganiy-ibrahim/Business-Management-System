// The proxy sends a short code in the URL, never the text itself.
// The text lives here, so the wording is easy to change and can't be faked through the URL.
export const AUTH_MESSAGES = {
  "session-expired": "Your session has expired. Please sign in again to continue.",
  "login-required": "Please sign in to continue.",
} as const;

export type AuthMessageCode = keyof typeof AUTH_MESSAGES;

// Turns the code from the URL into text. Unknown or missing codes give null.
export function getAuthMessage(code: string | undefined) {
  if (!code || !Object.hasOwn(AUTH_MESSAGES, code)) return null;

  return AUTH_MESSAGES[code as AuthMessageCode];
}