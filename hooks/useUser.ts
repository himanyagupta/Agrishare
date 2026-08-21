"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["users"]["Row"];

interface UseUserResult {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

/**
 * Client-side hook that tracks the current auth user and their public
 * profile row, updating live on sign-in/sign-out. Used by components like
 * the Navbar that need to render differently for logged-in visitors.
 */
export function useUser(): UseUserResult {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    async function loadProfile(userId: string) {
      const { data } = await supabase.from("users").select("*").eq("id", userId).maybeSingle();
      if (isMounted) setProfile(data);
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      setUser(data.user);
      if (data.user) loadProfile(data.user.id);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}
