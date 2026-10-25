import type { NextRequest, NextResponse } from "next/server";

// Supabase stores the session in cookies named like "sb-<project>-auth-token".
// Big sessions are split into chunks: "sb-<project>-auth-token.0", ".1", ...
// The "...-code-verifier" cookie is only used while logging in, so it doesn't count as a session.
function isSessionCookie(name: string) {
  return (
    name.startsWith("sb-") &&
    name.includes("-auth-token") &&
    !name.endsWith("code-verifier")
  );
}

// Did the browser send a session cookie with this request?
export function hasSupabaseAuthCookie(request: NextRequest) {
  return request.cookies.getAll().some(({ name }) => isSessionCookie(name));
}

// Logs the user out: tells the browser to delete the session cookies
export function clearSupabaseAuthCookies(
  request: NextRequest,
  response: NextResponse,
) {
  request.cookies
    .getAll()
    .filter(({ name }) => isSessionCookie(name))
    .forEach(({ name }) => {
      response.cookies.set(name, "", { maxAge: 0, path: "/" });
    });
}