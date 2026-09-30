// lib/api/browserApi.ts
import { supabaseBrowserClient } from '../supabase/supabaseClient';
import { createApi } from './createApi';

export const browserApi = createApi(async () => {
  const supabase = await supabaseBrowserClient();

  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
});

