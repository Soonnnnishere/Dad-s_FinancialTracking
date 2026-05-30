import "server-only"
import { createClient } from "@/lib/supabase/server"

export async function listCategoriesServer(opts: { includeArchived?: boolean } = {}) {
  const supabase = await createClient()
  const q = supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true })
  if (!opts.includeArchived) q.eq("is_archived", false)
  const { data, error } = await q
  if (error) throw error
  return data
}
