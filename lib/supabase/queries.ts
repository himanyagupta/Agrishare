import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

type Client = SupabaseClient<Database>;

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export async function getResources(client: Client) {
  return client.from("resources").select("*").order("created_at", { ascending: false });
}

export async function getResourceById(client: Client, id: string) {
  return client.from("resources").select("*").eq("id", id).maybeSingle();
}

export async function getMyResources(client: Client, ownerId: string) {
  return client
    .from("resources")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
}

export async function createResource(
  client: Client,
  values: Database["public"]["Tables"]["resources"]["Insert"]
) {
  return client.from("resources").insert(values).select().single();
}

export async function updateResource(
  client: Client,
  id: string,
  values: Database["public"]["Tables"]["resources"]["Update"]
) {
  return client.from("resources").update(values).eq("id", id).select().single();
}

// ---------------------------------------------------------------------------
// Demand posts
// ---------------------------------------------------------------------------

export async function getDemandPosts(client: Client) {
  return client.from("demand_posts").select("*").order("created_at", { ascending: false });
}

export async function createDemandPost(
  client: Client,
  values: Database["public"]["Tables"]["demand_posts"]["Insert"]
) {
  return client.from("demand_posts").insert(values).select().single();
}

// ---------------------------------------------------------------------------
// Requests (personal — read-only in the UI for now)
// ---------------------------------------------------------------------------

export async function getMyRequests(client: Client, requesterId: string) {
  return client
    .from("requests")
    .select("*")
    .eq("requester_id", requesterId)
    .order("created_at", { ascending: false });
}

// ---------------------------------------------------------------------------
// Users / profile
// ---------------------------------------------------------------------------

export async function getProfile(client: Client, id: string) {
  return client.from("users").select("*").eq("id", id).maybeSingle();
}

export async function updateProfile(
  client: Client,
  id: string,
  values: Database["public"]["Tables"]["users"]["Update"]
) {
  return client.from("users").update(values).eq("id", id).select().single();
}
