import { createClient, type User } from "@supabase/supabase-js";
import { readSupabaseServiceRoleKey, readSupabaseUrl } from "@/lib/env";
import type { Database } from "@/lib/supabase-types";

let supabaseServiceClient: ReturnType<typeof createClient<Database>> | null = null;

function getSupabaseServiceConfig() {
  const url = readSupabaseUrl();
  const serviceRoleKey = readSupabaseServiceRoleKey();

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase server configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return { url, serviceRoleKey };
}

export function getSupabaseServiceClient() {
  if (supabaseServiceClient) {
    return supabaseServiceClient;
  }

  const { url, serviceRoleKey } = getSupabaseServiceConfig();
  supabaseServiceClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  return supabaseServiceClient;
}

export async function getAuthenticatedSupabaseUser(authorizationHeader: string | null): Promise<User> {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new Error("Missing bearer token.");
  }

  const accessToken = authorizationHeader.slice("Bearer ".length).trim();

  if (!accessToken) {
    throw new Error("Missing bearer token.");
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    throw new Error("Invalid or expired session token.");
  }

  return data.user;
}
