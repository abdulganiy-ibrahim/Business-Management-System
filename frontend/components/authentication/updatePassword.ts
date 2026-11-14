import { supabaseBrowserClient } from '@/lib//supabase/supabaseClient';

// Throw an Error to show its message in the form. The form needs no other change.
export async function updatePassword(password: string): Promise<void> {
  const supabase = await supabaseBrowserClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) { throw error; }
}