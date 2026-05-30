"use client"
import { useCategoryLabel, type Category } from "@/lib/queries/categories"

type Chip = Pick<Category, "id" | "name" | "i18n_key" | "color">

export function CategoryChips({
  categories,
  selectedId,
  onSelect,
}: {
  categories: Chip[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const label = useCategoryLabel()
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map((c) => {
        const active = c.id === selectedId
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(c.id)}
            className={`h-12 px-4 rounded-full border text-sm flex items-center gap-2
              ${active ? "border-fg bg-surface" : "border-border text-muted-foreground"}`}
          >
            <span
              className="size-2 rounded-full"
              style={{ background: c.color ?? "#999" }}
            />
            {label(c as Category)}
          </button>
        )
      })}
    </div>
  )
}
