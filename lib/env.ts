export function readEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function readSupabaseUrl() {
  return readEnv("SUPABASE_URL") ?? readEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function readSupabaseAnonKey() {
  return (
    readEnv("SUPABASE_ANON_KEY") ??
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ??
    readEnv("ANON_PUBLIC_KEY") ??
    readEnv("SB_PUBLIC_KEY")
  );
}

export function readSupabaseServiceRoleKey() {
  return readEnv("SUPABASE_SERVICE_ROLE_KEY") ?? readEnv("SERVICE_ROLE_KEY") ?? readEnv("SB_SECRET_KEY");
}

export function readResendApiKey() {
  return readEnv("RESEND_API_KEY");
}

export function isSupabaseServerConfigured() {
  return Boolean(readSupabaseUrl() && readSupabaseServiceRoleKey());
}

export function isResendConfigured() {
  return Boolean(readResendApiKey());
}
