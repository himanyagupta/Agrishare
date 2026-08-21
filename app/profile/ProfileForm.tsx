"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["users"]["Row"];

export default function ProfileForm({ profile, email }: { profile: Profile; email: string }) {
  const [name, setName] = useState(profile.name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("users")
      .update({ name, phone, location })
      .eq("id", profile.id);

    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="kl-card mt-8 space-y-5 p-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {saved && (
        <div className="rounded-lg border border-field-200 bg-field-50 p-3 text-sm text-field-700">
          Profile updated.
        </div>
      )}

      <div>
        <label htmlFor="email" className="kl-label">
          Email
        </label>
        <input id="email" type="email" value={email} disabled className="kl-input opacity-60" />
        <p className="mt-1 text-xs text-field-500">Email can&apos;t be changed here.</p>
      </div>

      <div>
        <label htmlFor="role" className="kl-label">
          Role
        </label>
        <input
          id="role"
          value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          disabled
          className="kl-input opacity-60"
        />
      </div>

      <div>
        <label htmlFor="name" className="kl-label">
          Full name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="kl-input"
        />
      </div>

      <div>
        <label htmlFor="phone" className="kl-label">
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          className="kl-input"
        />
      </div>

      <div>
        <label htmlFor="location" className="kl-label">
          Village / District, State
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="kl-input"
        />
      </div>

      <button type="submit" disabled={saving} className="kl-btn-primary">
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
