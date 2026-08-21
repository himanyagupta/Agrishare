import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client for use in Server Components, Route Handlers
 * and Server Actions. Reads/writes the auth session via Next's cookies().
 *
 * NOTE: Server Components can't set cookies, so the set/remove calls below
 * are wrapped in try/catch — Supabase still works for reads, and the
 * middleware (middleware.ts) is what actually keeps the session refreshed.
 *
 * Also intentionally not passing a <Database> generic here — see the note
 * in lib/supabase/client.ts for why.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Called from a Server Component — safe to ignore, middleware handles refresh.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // Called from a Server Component — safe to ignore, middleware handles refresh.
          }
        },
      },
    }
  );
}