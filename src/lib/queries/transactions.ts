import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

export type Transaction = Database["public"]["Tables"]["transactions"]["Row"]
export type NewTransaction = Database["public"]["Tables"]["transactions"]["Insert"]

export async function createTransaction(input: Omit<NewTransaction, "user_id">) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("not signed in")
  const { data, error } = await supabase
    .from("transactions")
    .insert({ ...input, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTransaction(id: string, patch: Partial<NewTransaction>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("transactions")
    .update(patch)
    .eq("id", id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTransaction(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("transactions").delete().eq("id", id)
  if (error) throw error
}
