import "server-only"
import { createClient } from "@/lib/supabase/server"

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function firstOfMonthISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`
}

export async function listTodayServer() {
  const supabase = await createClient()
  const today = todayISO()
  const { data, error } = await supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .eq("occurred_on", today)
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function getMonthTotalsServer() {
  const supabase = await createClient()
  const from = firstOfMonthISO()
  const { data, error } = await supabase
    .from("transactions")
    .select("kind,amount")
    .gte("occurred_on", from)
  if (error) throw error
  let income = 0
  let expense = 0
  for (const r of data ?? []) {
    if (r.kind === "income") income += Number(r.amount)
    else expense += Number(r.amount)
  }
  return { income, expense, net: income - expense }
}

export async function getTodayTotalsServer() {
  const supabase = await createClient()
  const today = todayISO()
  const { data, error } = await supabase
    .from("transactions")
    .select("kind,amount")
    .eq("occurred_on", today)
  if (error) throw error
  let income = 0
  let expense = 0
  for (const r of data ?? []) {
    if (r.kind === "income") income += Number(r.amount)
    else expense += Number(r.amount)
  }
  return { income, expense }
}

export async function getLastTransactionServer() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  return data ?? null
}

/** Top N most-used categories overall (used to pre-populate quick-add chips). */
export async function topCategoriesServer(limit = 4) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .select("category_id")
    .order("created_at", { ascending: false })
    .limit(200)
  if (error) throw error
  const counts = new Map<string, number>()
  for (const r of data ?? []) {
    counts.set(r.category_id, (counts.get(r.category_id) ?? 0) + 1)
  }
  const ranked = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id)
  if (ranked.length === 0) return []
  const { data: cats } = await supabase
    .from("categories")
    .select("*")
    .in("id", ranked)
    .eq("is_archived", false)
  return ranked
    .map((id) => (cats ?? []).find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
}
