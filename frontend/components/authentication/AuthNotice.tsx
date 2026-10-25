import { getAuthMessage } from "@/lib/auth/authMessages";

export default function AuthNotice({ code }: { code?: string }) {
  const message = getAuthMessage(code);
  if (!message) return null;

  return (
    <p
      role="status"
      className="rounded-xl border border-border bg-foreground/5 px-3.5 py-3 text-sm text-foreground"
    >
      {message}
    </p>
  );
}