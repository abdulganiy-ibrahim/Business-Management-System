"use client";

import { useState } from "react";
import { supabaseBrowserClient } from "@/lib/supabase/supabaseClient";

export function useLogout() {
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    const supabase = await supabaseBrowserClient();
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    setLoading(false);

    return { error };
  };

  return {
    logout,
    loading,
  };
}