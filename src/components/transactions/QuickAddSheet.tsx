"use client"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CategoryChips } from "@/components/categories/CategoryChips"
import type { Category } from "@/lib/queries/categories"
import type { NewTransaction } from "@/lib/queries/transactions"

type SaveInput = Pick<
  NewTransaction,
  "amount" | "category_id" | "kind" | "occurred_on" | "note"
>

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function QuickAddSheet({
  open,
  categories,
  preselectId,
  initial,
  onSave,
  onClose,
}: {
  open: boolean
  categories: Category[]
  preselectId: string | null
  initial?: Partial<SaveInput>
  onSave: (t: SaveInput) => Promise<void>
  onClose: () => void
}) {
  const t = useTranslations("quickAdd")

  const [amount, setAmount] = useState(initial?.amount?.toString() ?? "")
  const [kind, setKind] = useState<"expense" | "income">(
    (initial?.kind as "expense" | "income") ?? "expense",
  )
  const [categoryId, setCategoryId] = useState<string | null>(
    initial?.category_id ?? preselectId,
  )
  const [occurredOn, setOccurredOn] = useState(initial?.occurred_on ?? todayISO())
  const [note, setNote] = useState(initial?.note ?? "")
  const [err, setErr] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setAmount(initial?.amount?.toString() ?? "")
      setKind((initial?.kind as "expense" | "income") ?? "expense")
      setCategoryId(initial?.category_id ?? preselectId)
      setOccurredOn(initial?.occurred_on ?? todayISO())
      setNote(initial?.note ?? "")
      setErr(null)
    }
  }, [open, preselectId, initial])

  const filtered = categories.filter((c) => c.kind === kind && !c.is_archived)

  // When kind toggles, snap categoryId to a matching category so the submitted
  // row's kind and category never disagree.
  useEffect(() => {
    if (categoryId && filtered.some((c) => c.id === categoryId)) return
    setCategoryId(filtered[0]?.id ?? null)
  }, [kind, filtered, categoryId])

  async function submit() {
    const n = Number(amount)
    if (!n || n <= 0) {
      setErr(t("errors.amount"))
      return
    }
    if (!categoryId) {
      setErr(t("errors.category"))
      return
    }
    setErr(null)
    setSaving(true)
    try {
      await onSave({
        amount: n,
        category_id: categoryId,
        kind,
        occurred_on: occurredOn,
        note: note || null,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>
        <div className="space-y-5 pt-4 pb-6 px-4">
          <div className="space-y-2">
            <Label htmlFor="amount">{t("amount")}</Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-14 text-2xl font-mono"
            />
            {err && (
              <p className="text-sm text-expense" role="alert">
                {err}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={kind === "expense" ? "default" : "outline"}
              onClick={() => setKind("expense")}
              className="flex-1 h-12"
            >
              {t("kindExpense")}
            </Button>
            <Button
              type="button"
              variant={kind === "income" ? "default" : "outline"}
              onClick={() => setKind("income")}
              className="flex-1 h-12"
            >
              {t("kindIncome")}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>{t("category")}</Label>
            <CategoryChips
              categories={filtered}
              selectedId={categoryId}
              onSelect={setCategoryId}
            />
          </div>

          <details>
            <summary className="text-sm text-muted-foreground cursor-pointer">
              {t("date")} · {t("note")}
            </summary>
            <div className="pt-3 space-y-3">
              <Input
                type="date"
                value={occurredOn}
                onChange={(e) => setOccurredOn(e.target.value)}
                className="h-12"
              />
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("note")}
                className="h-12"
              />
            </div>
          </details>

          <Button
            onClick={submit}
            disabled={saving}
            className="w-full h-14 text-base"
          >
            {t("save")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
