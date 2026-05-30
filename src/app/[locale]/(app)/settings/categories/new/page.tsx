import { getTranslations } from "next-intl/server"
import { CategoryForm } from "@/components/categories/CategoryForm"

export default async function NewCategoryPage() {
  const t = await getTranslations("categories")
  return (
    <div className="space-y-6">
      <h1 className="text-xl">{t("add")}</h1>
      <CategoryForm />
    </div>
  )
}
