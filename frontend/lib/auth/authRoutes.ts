// where user navigated to if they are not signed in
export const SIGN_UP_PATH = "/sign-up";

// The name of the query parameter that carries the reason, e.g. /sign-up?message=session-expired
export const AUTH_MESSAGE_PARAM = "message";

// Pages that need a signed-in user. Every other page stays public.
const PROTECTED_PATH_PREFIXES = ["/dashboard"];

export function isProtectedPath(pathname: string) {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}