import { getTranslations } from "next-intl/server"
import { Plus, ChevronLeft } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { listCategoriesServer } from "@/lib/queries/categories-server"
import { CategoryListItem } from "@/components/categories/CategoryListItem"

export default async function CategoriesPage() {
  const t = await getTranslations("categories")
  const all = await listCategoriesServer({ includeArchived: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/settings" className="flex items-center gap-1 text-muted-foreground hover:text-fg">
          <ChevronLeft className="size-4" />
        </Link>
        <h1 className="text-xl">{t("title")}</h1>
        <Link
          href="/settings/categories/new"
          className="flex items-center gap-1 text-income hover:opacity-80"
        >
          <Plus className="size-4" /> {t("add")}
        </Link>
      </div>
      {all.length === 0 ? (
        <p className="text-muted-foreground">{t("empty")}</p>
      ) : (
        <ul className="border border-border rounded-md divide-y divide-border">
          {all.map((c) => <CategoryListItem key={c.id} category={c} />)}
        </ul>
      )}
    </div>
  )
}
