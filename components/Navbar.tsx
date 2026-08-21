"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/find-resources", label: "Find Resources" },
  { href: "/list-resource", label: "List a Resource" },
  { href: "/smart-match", label: "Smart Match" },
  { href: "/community-demand", label: "Community Demand" },
];

function AuthArea({ onNavigate }: { onNavigate?: () => void }) {
  const { user, profile, loading } = useUser();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onNavigate?.();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-field-100" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login" onClick={onNavigate} className="kl-btn-secondary">
          Log In
        </Link>
        <Link href="/signup" onClick={onNavigate} className="kl-btn-accent">
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/profile"
        onClick={onNavigate}
        className="flex items-center gap-2 rounded-full border border-field-200 py-1 pl-1 pr-3 text-sm font-medium text-field-800 hover:bg-field-50"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-field-100 text-xs font-semibold text-field-700">
          {(profile?.name ?? user.email ?? "?").charAt(0).toUpperCase()}
        </span>
        {profile?.name ?? "My Profile"}
      </Link>
      <button type="button" onClick={handleLogout} className="kl-btn-secondary">
        Log Out
      </button>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-field-100 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-field-800">
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-full bg-field-700 text-sm text-white"
          >
            AS
          </span>
          AgriShare
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-field-700 text-white"
                    : "text-field-700 hover:bg-field-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/list-resource" className="kl-btn-accent">
            + List a Resource
          </Link>
          <AuthArea />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-field-200 text-field-700 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {open && (
        <div className="border-t border-field-100 bg-paper px-4 pb-4 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3.5 py-2.5 text-sm font-medium",
                    active ? "bg-field-700 text-white" : "text-field-700 hover:bg-field-100"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/list-resource"
              onClick={() => setOpen(false)}
              className="kl-btn-accent mt-2"
            >
              + List a Resource
            </Link>
            <div className="mt-2">
              <AuthArea onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
