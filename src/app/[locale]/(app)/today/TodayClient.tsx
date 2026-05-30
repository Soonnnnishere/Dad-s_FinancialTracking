"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { useRouter } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"
import { FAB } from "@/components/transactions/FAB"
import { QuickAddSheet } from "@/components/transactions/QuickAddSheet"
import { TransactionList } from "@/components/transactions/TransactionList"
import type { RowTx } from "@/components/transactions/TransactionRow"
import {
  createTransaction,
  updateTransaction,
  type Transaction,
} from "@/lib/queries/transactions"
import type { Category } from "@/lib/queries/categories"

export function TodayClient({
  categories,
  preselectId,
  lastTx,
  todayRows,
  locale,
  currency,
}: {
  categories: Category[]
  preselectId: string | null
  lastTx: Transaction | null
  todayRows: RowTx[]
  locale: Locale
  currency: string
}) {
  const t = useTranslations("toast")
  const tToday = useTranslations("today")
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [initial, setInitial] = useState<
    React.ComponentProps<typeof QuickAddSheet>["initial"] | undefined
  >()

  async function handleSave(
    input: Parameters<React.ComponentProps<typeof QuickAddSheet>["onSave"]>[0],
  ) {
    try {
      if (editing) await updateTransaction(editing.id, input)
      else await createTransaction(input)
      toast.success(t("saved"))
      router.refresh()
    } catch {
      toast.error(t("failed"))
    } finally {
      setEditing(null)
    }
  }

  function openEdit(tx: Transaction) {
    setEditing(tx)
    setInitial({
      amount: Number(tx.amount),
      category_id: tx.category_id,
      kind: tx.kind,
      occurred_on: tx.occurred_on,
      note: tx.note ?? "",
    })
    setOpen(true)
  }

  function openRepeat() {
    if (!lastTx) return
    setEditing(null)
    setInitial({
      amount: Number(lastTx.amount),
      category_id: lastTx.category_id,
      kind: lastTx.kind,
      note: lastTx.note ?? "",
    })
    setOpen(true)
  }

  function openNew() {
    setEditing(null)
    setInitial(undefined)
    setOpen(true)
  }

  return (
    <>
      <TransactionList
        txs={todayRows}
        locale={locale}
        currency={currency}
        onEdit={openEdit}
      />
      {lastTx && (
        <button
          onClick={openRepeat}
          className="text-sm text-muted-foreground hover:text-fg underline underline-offset-2"
        >
          {tToday("repeatLast")}
        </button>
      )}
      <FAB onClick={openNew} />
      <QuickAddSheet
        open={open}
        categories={categories}
        preselectId={preselectId}
        initial={initial}
        onSave={handleSave}
        onClose={() => {
          setOpen(false)
          setEditing(null)
        }}
      />
    </>
  )
}
