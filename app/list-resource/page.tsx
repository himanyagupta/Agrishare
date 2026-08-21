import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ResourceForm from "./ResourceForm";

export default async function ListResourcePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/list-resource");
  }

  return <ResourceForm mode="create" ownerId={user.id} />;
}
