import { NextResponse, type NextRequest } from "next/server";
import type { AuthMessageCode } from "./authMessages";
import { AUTH_MESSAGE_PARAM, SIGN_UP_PATH } from "./authRoutes";

export function redirectToSignUp(
  request: NextRequest,
  currentResponse: NextResponse,
  reason: AuthMessageCode,
) {
  const url = request.nextUrl.clone();
  url.pathname = SIGN_UP_PATH;
  url.search = "";
  url.searchParams.set(AUTH_MESSAGE_PARAM, reason);

  // 303 turns a POST (a form or server action) into a GET of the sign-up page
  const redirect = NextResponse.redirect(
    url,
    request.method === "GET" ? 307 : 303,
  );

  // IMPORTANT: a new response starts with no cookies.
  // Copy over any cookies Supabase set on the old one, or they would be lost.
  currentResponse.cookies
    .getAll()
    .forEach((cookie) => redirect.cookies.set(cookie));

  return redirect;
}