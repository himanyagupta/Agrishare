import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase sends users here after they click the confirmation link in their
// signup email. It exchanges the one-time code for a real session, then
// sends them on to the dashboard.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
