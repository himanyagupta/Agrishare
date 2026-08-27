import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/profile", "/list-resource"];
const AUTH_PATHS = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If the env vars aren't available in this runtime for any reason, don't
  // crash the whole site over it — just let the request through unauthed.
  // Protected pages still check auth themselves (see app/dashboard/page.tsx
  // etc.), so this only means the redirect-before-render optimization is
  // skipped, not that protection is gone.
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Middleware: missing Supabase env vars, skipping auth check.");
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    });

    // Refreshes the session if the access token has expired.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isProtected = PROTECTED_PATHS.some((p) => path.startsWith(p));
    const isAuthPage = AUTH_PATHS.some((p) => path.startsWith(p));

    if (isProtected && !user) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("next", path);
      return NextResponse.redirect(redirectUrl);
    }

    if (isAuthPage && user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (err) {
    // Same reasoning as above: never let an unexpected Supabase/network
    // error in middleware take the whole site down.
    console.error("Middleware error, passing request through:", err);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets, so the session cookie stays
     * fresh app-wide, while keeping the middleware itself cheap.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
