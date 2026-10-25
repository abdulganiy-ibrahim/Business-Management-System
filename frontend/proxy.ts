import { isAuthRetryableFetchError } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { isProtectedPath } from "@/lib/auth/authRoutes";
import { redirectToSignUp } from "@/lib/auth/redirectToSignUp";
import {
  clearSupabaseAuthCookies,
  hasSupabaseAuthCookie,
} from "@/lib/auth/sessionCookies";
import { createProxySupabaseClient } from "@/lib/supabase/supabaseProxyClient";

// Runs before every page request. It does three things, in this order:
//   1. Refresh the session cookies if they are about to expire
//   2. Find out if the user is still signed in
//   3. If not, and the page is private: log them out and send them to sign up, with a message
export async function proxy(request: NextRequest) {
  const { supabase, getResponse } = createProxySupabaseClient(request);

  // Check if the browser arrived with session cookie.
  const hadSessionCookie = hasSupabaseAuthCookie(request);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Signed in (cookies may have just been refreshed), or a public page: carry on
  if (user || !isProtectedPath(request.nextUrl.pathname)) {
    return getResponse();
  }

  // If supabase itself could not be reach, user should stay logged in
  if (error && isAuthRetryableFetchError(error)) {
    return getResponse();
  }

  // Not signed in, on a private page.
  const redirect = redirectToSignUp(
    request,
    getResponse(),
    hadSessionCookie ? "session-expired" : "login-required",
  );

  // Log the user out: delete the dead session cookies
  if (hadSessionCookie) clearSupabaseAuthCookies(request, redirect);

  return redirect;
}

// Skip the proxy for static files and images
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};