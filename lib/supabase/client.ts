import { createBrowserClient } from "@supabase/ssr";

/**
 * Client-side Supabase client, safe to use in "use client" components.
 * Reads the public URL/anon key from env vars — see .env.local.example.
 *
 * NOTE: intentionally not passing a <Database> generic here. Hand-written
 * generated-style types are fragile against the exact internal shape a given
 * @supabase/supabase-js version expects, and a mismatch silently breaks
 * .insert()/.update() type inference (they resolve to `never`) instead of
 * failing loudly. Row/Insert/Update shapes from lib/supabase/types.ts are
 * still used directly wherever precision actually matters — see
 * lib/supabase/adapters.ts and lib/supabase/queries.ts.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}