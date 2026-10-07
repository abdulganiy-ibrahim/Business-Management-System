import { isAxiosError } from "axios";

// What every server action returns, so the UI always knows if it worked
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; message: string };

// Pulls a readable message out of a failed backend call
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    // TODO: match this to the error shape your backend returns
    const message = error.response?.data?.message;
    if (typeof message === "string" && message) return message;
  }

  return "Something went wrong. Please try again.";
}