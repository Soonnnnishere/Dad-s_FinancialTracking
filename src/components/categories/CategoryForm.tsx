"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/navigation"
import { createCategory, updateCategory, type Category } from "@/lib/queries/categories"

const COLORS = [
  "#F97316", "#3B82F6", "#A855F7", "#EC4899",
  "#EF4444", "#16A34A", "#22C55E", "#10B981",
]

export function CategoryForm({ existing }: { existing?: Category }) {
  const t = useTranslations("categories.form")
  const tQuick = useTranslations("quickAdd")
  const tToast = useTranslations("toast")
  const router = useRouter()

  const [name, setName] = useState(existing?.name ?? "")
  const [kind, setKind] = useState<"expense" | "income">(
    (existing?.kind as "expense" | "income") ?? "expense",
  )
  const [color, setColor] = useState(existing?.color ?? COLORS[0])
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function save() {
    if (!name.trim()) {
      setErr(t("errors.name"))
      return
    }
    setErr(null)
    setSaving(true)
    try {
      if (existing) {
        await updateCategory(existing.id, { name, kind, color })
      } else {
        await createCategory({ name, kind, color, i18n_key: null })
      }
      toast.success(tToast("saved"))
      router.push("/settings/categories")
      router.refresh()
    } catch {
      toast.error(tToast("failed"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!err}
          className="h-12"
        />
        {err && <p className="text-sm text-expense">{err}</p>}
      </div>

      <div className="space-y-2">
        <Label>{t("kind")}</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={kind === "expense" ? "default" : "outline"}
            onClick={() => setKind("expense")}
            className="flex-1 h-12"
          >
            {tQuick("kindExpense")}
          </Button>
          <Button
            type="button"
            variant={kind === "income" ? "default" : "outline"}
            onClick={() => setKind("income")}
            className="flex-1 h-12"
          >
            {tQuick("kindIncome")}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("color")}</Label>
        <div className="flex gap-2 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`size-10 rounded-full border-2 ${
                color === c ? "border-fg" : "border-transparent"
              }`}
              style={{ background: c }}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex-1 h-12"
        >
          {t("cancel")}
        </Button>
        <Button onClick={save} disabled={saving} className="flex-1 h-12">
          {t("save")}
        </Button>
      </div>
    </div>
  )
}
