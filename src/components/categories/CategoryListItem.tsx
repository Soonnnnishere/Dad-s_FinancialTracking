"use client"
import { useTransition } from "react"
import { useTranslations } from "next-intl"
import { Archive, ArchiveRestore } from "lucide-react"
import { Link, useRouter } from "@/i18n/navigation"
import { useCategoryLabel, archiveCategory, type Category } from "@/lib/queries/categories"

export function CategoryListItem({ category }: { category: Category }) {
  const t = useTranslations("categories")
  const label = useCategoryLabel()
  const router = useRouter()
  const [pending, start] = useTransition()

  return (
    <li className="flex items-center justify-between px-4 h-14">
      <div className="flex items-center gap-3">
        <span
          className="size-3 rounded-full"
          style={{ background: category.color ?? "#999" }}
          aria-hidden
        />
        <Link
          href={`/settings/categories/${category.id}`}
          className={category.is_archived ? "text-muted-foreground line-through" : "hover:underline"}
        >
          {label(category)}
        </Link>
        <span className="text-xs text-muted-foreground">
          {category.kind === "income" ? "+" : "−"}
        </span>
      </div>
      <button
        disabled={pending}
        onClick={() =>
          start(async () => {
            await archiveCategory(category.id, !category.is_archived)
            router.refresh()
          })
        }
        className="text-muted-foreground hover:text-fg p-2 -mr-2"
        aria-label={category.is_archived ? t("unarchive") : t("archive")}
      >
        {category.is_archived ? <ArchiveRestore className="size-4" /> : <Archive className="size-4" />}
      </button>
    </li>
  )
}
