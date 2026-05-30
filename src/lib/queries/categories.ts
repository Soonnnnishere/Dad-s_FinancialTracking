import { useTranslations } from "next-intl"
import { createClient as createServer } from "@/lib/supabase/server"
import { createClient as createBrowser } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type NewCategory = Database["public"]["Tables"]["categories"]["Insert"]

export async function listCategoriesServer(opts: { includeArchived?: boolean } = {}) {
  const supabase = await createServer()
  const q = supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true })
  if (!opts.includeArchived) q.eq("is_archived", false)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function listCategoriesClient(opts: { includeArchived?: boolean } = {}) {
  const supabase = createBrowser()
  const q = supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true })
  if (!opts.includeArchived) q.eq("is_archived", false)
  const { data, error } = await q
  if (error) throw error
  return data
}

export async function createCategory(input: Omit<NewCategory, "user_id">) {
  const supabase = createBrowser()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("not signed in")
  const { data, error } = await supabase
    .from("categories")
    .insert({ ...input, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateCategory(id: string, patch: Partial<NewCategory>) {
  const supabase = createBrowser()
  const { data, error } = await supabase
    .from("categories")
    .update(patch)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function archiveCategory(id: string, archived: boolean) {
  return updateCategory(id, { is_archived: archived })
}

/**
 * Resolves a category's display label: preset categories use their i18n_key
 * (translated via the `category` namespace); custom ones use their literal name.
 */
export function useCategoryLabel() {
  const t = useTranslations("category")
  return (c: Pick<Category, "name" | "i18n_key">) =>
    c.i18n_key ? t(c.i18n_key as never) : c.name
}
