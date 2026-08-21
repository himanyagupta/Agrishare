import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/queries";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/profile");
  }

  const { data: profile, error } = await getProfile(supabase, user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="kl-section-eyebrow text-field-700">Account</span>
      <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">My Profile</h1>
      <p className="mt-2 text-field-600">
        This information is shown to other farmers when they view your listings.
      </p>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Couldn&apos;t load your profile: {error.message}
        </div>
      )}

      {profile && <ProfileForm profile={profile} email={user.email ?? ""} />}
    </div>
  );
}
