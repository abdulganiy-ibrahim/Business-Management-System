import 'server-only';

import { supabaseServerClient } from '../supabase/supabaseServer';
import { createApi } from './createApi';

export async function getServerApi() {
  const supabase = await supabaseServerClient();

  return createApi(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  });
}