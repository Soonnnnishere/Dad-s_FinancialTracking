import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CategoryForm } from "@/components/categories/CategoryForm"

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single()
  if (error || !data) notFound()
  return (
    <div className="space-y-6">
      <h1 className="text-xl">{data.name}</h1>
      <CategoryForm existing={data} />
    </div>
  )
}
