import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";

/**
 * Client-side Supabase client, safe to use in "use client" components.
 * Reads the public URL/anon key from env vars — see .env.local.example.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
