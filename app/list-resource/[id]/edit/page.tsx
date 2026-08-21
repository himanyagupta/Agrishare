import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getResourceById } from "@/lib/supabase/queries";
import ResourceForm from "../../ResourceForm";

export default async function EditResourcePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/list-resource/${params.id}/edit`);
  }

  const { data: resource, error } = await getResourceById(supabase, params.id);
  if (error || !resource) notFound();

  if (resource.owner_id !== user.id) {
    redirect(`/resource/${params.id}`);
  }

  return <ResourceForm mode="edit" ownerId={user.id} existing={resource} />;
}
