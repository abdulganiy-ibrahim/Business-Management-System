import { supabaseBrowserClient } from "@/lib/supabase/supabaseClient";

// Sends the password reset email.
export async function requestPasswordReset(email: string): Promise<void> {
  const supabase = await supabaseBrowserClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/update-password`,
  });

  if (error) { throw error; }
}