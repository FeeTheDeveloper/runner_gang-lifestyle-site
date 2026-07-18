"use client";

import { createClient } from "@supabase/supabase-js";
import { readSupabaseAnonKey, readSupabaseUrl } from "@/lib/env";
import type { Database } from "@/lib/supabase-types";

let supabaseBrowserClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (supabaseBrowserClient) {
    return supabaseBrowserClient;
  }

  const url = readSupabaseUrl();
  const anonKey = readSupabaseAnonKey();

  if (!url || !anonKey) {
    throw new Error(
      "Supabase browser configuration is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  supabaseBrowserClient = createClient<Database>(url, anonKey);
  return supabaseBrowserClient;
}
